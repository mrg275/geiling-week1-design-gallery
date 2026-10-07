# Headless bake + export pipeline for The Geiling Library (v3).
# Usage:
#   /Applications/Blender.app/Contents/MacOS/Blender -b blender/library.blend -P blender/bake_export.py
#
# Groups:
#   floor (Lib_Floor/Lib_Rug)         tile albedo + lm_floor 4096  (pools/beam gashes live here)
#   shell (Lib_Plaster/Lib_Oak)       tile albedo + lm_shell 2048
#   deco  (flat Lib_* decor mats)     original materials + lm_deco 2048
#   cont  (everything else bakeable)  atlas albedo 4096 + lm_cont 2048
#   skip  (glass/water/lead/flames/lamp glass, Vista_/Fx_/Fresco_/Spine_)  export as authored
# All lightmaps on UV layer "Atlas" (TEXCOORD_1); tiled albedo on "Tile" (TEXCOORD_0).
# CPU only (Metal bakes segfault alongside the live session).

import bpy, bmesh, os, sys, math, time

RESUME = '--resume' in sys.argv   # reuse existing baked PNGs, just rebuild materials + export

T0 = time.time()
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(bpy.data.filepath)))
ASSETS = os.path.join(ROOT, 'assets')
TEXDIR = os.path.join(ASSETS, 'textures')
os.makedirs(TEXDIR, exist_ok=True)

SIZE_ALB = 4096
SIZE_TILE = 1024
SAMPLES_LM = 256

TILE_MATS = {
    'Lib_Floor':   ('tile_floor',   2.4),
    'Lib_Plaster': ('tile_plaster', 3.0),
    'Lib_Rug':     ('tile_rug',     1.8),
    'Lib_Oak':     ('tile_oak',     2.2),
}
FLOOR_SET = {'Lib_Floor', 'Lib_Rug'}
SHELL_SET = {'Lib_Plaster', 'Lib_Oak'}
DECO_SET = {'Lib_Brass', 'Lib_Stone', 'Lib_OakDark', 'Lib_Leather', 'Lib_Cream', 'Lib_ShadeGreen'}
SKIP_MATS = {'Lib_Glass', 'Lib_Water', 'Lib_Lead', 'Lib_Flame', 'Lib_LampGlass'}
SKIP_PREFIX = ('Vista_', 'Sky_', 'Fx_', 'Fresco_', 'Spine_')

def log(*a):
    print('[bake %6.1fs]' % (time.time() - T0), *a, flush=True)

sc = bpy.context.scene
sc.render.engine = 'CYCLES'
sc.cycles.device = 'CPU'
sc.cycles.use_denoising = False
sc.cycles.use_adaptive_sampling = True
sc.cycles.adaptive_threshold = 0.02
sc.cycles.diffuse_bounces = 4
sc.cycles.max_bounces = 8
sc.cycles.transparent_max_bounces = 16
sc.cycles.sample_clamp_indirect = 10.0
sc.view_settings.view_transform = 'Standard'
sc.view_settings.look = 'None'
log('cycles configured (CPU, %d samples adaptive)' % SAMPLES_LM)

def mats_of(ob):
    return {s.material.name for s in ob.material_slots if s.material}

def skip_obj(ob):
    if ob.type != 'MESH':
        return True
    ms = mats_of(ob)
    if not ms:
        return True
    if any(ob.name.startswith(p) for p in SKIP_PREFIX):
        return True
    if any(m.startswith(SKIP_PREFIX) for m in ms):
        return True
    if ms & SKIP_MATS:
        return True
    return False

bakeable = [ob for ob in bpy.data.objects if not skip_obj(ob)]
g_floor = [ob for ob in bakeable if mats_of(ob) <= FLOOR_SET]
g_shell = [ob for ob in bakeable if mats_of(ob) <= SHELL_SET and ob not in g_floor]
g_deco  = [ob for ob in bakeable if mats_of(ob) <= DECO_SET]
g_cont  = [ob for ob in bakeable if ob not in g_floor and ob not in g_shell and ob not in g_deco]
log('groups: floor=%d shell=%d deco=%d cont=%d' % (len(g_floor), len(g_shell), len(g_deco), len(g_cont)))

# ---------------- tile textures ----------------
def bake_tile(mat_name, stem):
    path = os.path.join(TEXDIR, stem + '.png')
    if RESUME and os.path.exists(path):
        img = bpy.data.images.load(path)
        img.name = 'tile_' + mat_name
        log('tile (resume)', stem)
        return img
    me = bpy.data.meshes.new('tq')
    bm = bmesh.new()
    vs = [bm.verts.new(p) for p in ((0, 0, 0), (1, 0, 0), (1, 1, 0), (0, 1, 0))]
    bm.faces.new(vs)
    bm.to_mesh(me); bm.free()
    uvl = me.uv_layers.new(name='UVMap')
    for i, uv in enumerate(((0, 0), (1, 0), (1, 1), (0, 1))):
        uvl.data[i].uv = uv
    ob = bpy.data.objects.new('tq', me)
    ob.location = (0, 0, 900)
    bpy.context.collection.objects.link(ob)
    me.materials.append(bpy.data.materials[mat_name])
    img = bpy.data.images.new('tile_' + mat_name, SIZE_TILE, SIZE_TILE, alpha=False)
    nt = bpy.data.materials[mat_name].node_tree
    node = nt.nodes.new('ShaderNodeTexImage'); node.name = 'BAKE_TARGET'; node.image = img
    for n in nt.nodes: n.select = False
    node.select = True; nt.nodes.active = node
    bpy.ops.object.select_all(action='DESELECT')
    ob.select_set(True); bpy.context.view_layer.objects.active = ob
    sc.cycles.samples = 8
    b = sc.render.bake
    b.margin = 4; b.use_clear = True
    b.use_pass_direct = False; b.use_pass_indirect = False; b.use_pass_color = True
    bpy.ops.object.bake(type='DIFFUSE', pass_filter={'COLOR'})
    img.filepath_raw = path; img.file_format = 'PNG'; img.save()
    nt.nodes.remove(node)
    bpy.data.objects.remove(ob, do_unlink=True)
    log('tile', stem)
    return img

tile_imgs = {m: bake_tile(m, stem) for m, (stem, _s) in TILE_MATS.items()}

# ---------------- UV layers ----------------
from mathutils import Vector

def ensure_layers(ob):
    uvs = ob.data.uv_layers
    names = [u.name for u in uvs]
    if names == ['Tile', 'Atlas']:
        return
    while uvs:
        uvs.remove(uvs[0])
    uvs.new(name='Tile')
    uvs.new(name='Atlas')

def triplanar_uvs(ob, scale):
    me = ob.data
    mw = ob.matrix_world
    uvl = me.uv_layers['Tile']
    rot = mw.to_3x3()
    for poly in me.polygons:
        n = rot @ poly.normal
        ax = max(range(3), key=lambda i: abs(n[i]))
        for li in poly.loop_indices:
            co = mw @ me.vertices[me.loops[li].vertex_index].co
            if ax == 2:   u, v = co.x, co.y
            elif ax == 0: u, v = co.y, co.z
            else:         u, v = co.x, co.z
            uvl.data[li].uv = (u / scale, v / scale)

bpy.context.view_layer.update()
for ob in bakeable:
    ensure_layers(ob)
    tms = mats_of(ob) & set(TILE_MATS)
    if tms:
        triplanar_uvs(ob, TILE_MATS[next(iter(tms))][1])
log('UV layers ready')

def atlas_unwrap(objs, margin=0.002):
    bpy.ops.object.select_all(action='DESELECT')
    for ob in objs:
        ob.select_set(True)
        ob.data.uv_layers.active = ob.data.uv_layers['Atlas']
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=margin)
    bpy.ops.object.mode_set(mode='OBJECT')

atlas_unwrap(g_floor, 0.004); log('floor unwrapped')
atlas_unwrap(g_shell); log('shell unwrapped')
atlas_unwrap(g_deco);  log('deco unwrapped')
atlas_unwrap(g_cont);  log('cont unwrapped')

# ---------------- bake helpers ----------------
def bind_image(objs, img):
    for name in set().union(*[mats_of(o) for o in objs]):
        mat = bpy.data.materials[name]
        if not mat.use_nodes:
            mat.use_nodes = True
        nt = mat.node_tree
        node = nt.nodes.get('BAKE_TARGET')
        if not node:
            node = nt.nodes.new('ShaderNodeTexImage'); node.name = 'BAKE_TARGET'
        node.image = img
        for n in nt.nodes: n.select = False
        node.select = True; nt.nodes.active = node

def bake(objs, kind):
    bpy.ops.object.select_all(action='DESELECT')
    for ob in objs:
        ob.select_set(True)
        ob.data.uv_layers.active = ob.data.uv_layers['Atlas']
    bpy.context.view_layer.objects.active = objs[0]
    b = sc.render.bake
    b.margin = 16; b.use_clear = True
    if kind == 'albedo':
        sc.cycles.samples = 8
        b.use_pass_direct = False; b.use_pass_indirect = False; b.use_pass_color = True
        bpy.ops.object.bake(type='DIFFUSE', pass_filter={'COLOR'})
    else:
        sc.cycles.samples = SAMPLES_LM
        b.use_pass_direct = True; b.use_pass_indirect = True; b.use_pass_color = False
        bpy.ops.object.bake(type='DIFFUSE', pass_filter={'DIRECT', 'INDIRECT'})

def denoise_and_save(img, path):
    # Blender 5.x: compositing lives in a node GROUP on the scene
    # (scene.node_tree is gone). Any failure falls back to a plain save —
    # a 20-minute bake must never be lost to a compositor API change.
    try:
        csc = bpy.data.scenes.new('dn')
        csc.view_settings.view_transform = 'Standard'
        csc.view_settings.look = 'None'
        ng = bpy.data.node_groups.new('dn_ng', 'CompositorNodeTree')
        csc.compositing_node_group = ng
        gout = ng.nodes.new('NodeGroupOutput')
        ng.interface.new_socket('Image', in_out='OUTPUT', socket_type='NodeSocketColor')
        src = ng.nodes.new('CompositorNodeImage'); src.image = img
        dn = ng.nodes.new('CompositorNodeDenoise')
        ng.links.new(src.outputs['Image'], dn.inputs['Image'])
        ng.links.new(dn.outputs['Image'], gout.inputs['Image'])
        csc.render.resolution_x = img.size[0]
        csc.render.resolution_y = img.size[1]
        csc.render.resolution_percentage = 100
        csc.render.image_settings.file_format = 'PNG'
        csc.render.dither_intensity = 1.0
        csc.render.filepath = path
        bpy.ops.render.render(write_still=True, scene=csc.name)
        bpy.data.scenes.remove(csc)
        bpy.data.node_groups.remove(ng)
        log('denoised', os.path.basename(path))
    except Exception as e:
        log('DENOISE FAILED (%s) - plain save' % e)
        save_plain(img, path)

def save_plain(img, path):
    img.filepath_raw = path; img.file_format = 'PNG'; img.save()
    log('saved', os.path.basename(path))

# ---------------- run bakes ----------------
alb_path = os.path.join(TEXDIR, 'alb_cont.png')
if RESUME and os.path.exists(alb_path):
    alb_cont = bpy.data.images.load(alb_path); alb_cont.name = 'alb_cont'
    log('albedo cont (resume)')
else:
    alb_cont = bpy.data.images.new('alb_cont', SIZE_ALB, SIZE_ALB, alpha=False)
    bind_image(g_cont, alb_cont)
    log('bake albedo cont...')
    bake(g_cont, 'albedo')
    save_plain(alb_cont, alb_path)

LM_JOBS = [('lm_floor', g_floor, 4096), ('lm_shell', g_shell, 2048),
           ('lm_deco', g_deco, 2048), ('lm_cont', g_cont, 2048)]
for name, objs, size in LM_JOBS:
    lm_path = os.path.join(TEXDIR, name + '.png')
    if RESUME and os.path.exists(lm_path):
        log('%s (resume)' % name)
        continue
    img = bpy.data.images.new(name, size, size, alpha=False, float_buffer=True)
    bind_image(objs, img)
    log('bake %s (%d, %d samples)...' % (name, size, SAMPLES_LM))
    bake(objs, 'light')
    denoise_and_save(img, lm_path)

# ---------------- rebuild export materials ----------------
def export_mat(name, image, uv_layer, roughness):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    bsdf = nt.nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Roughness'].default_value = roughness
    tex = nt.nodes.new('ShaderNodeTexImage'); tex.image = image
    uv = nt.nodes.new('ShaderNodeUVMap'); uv.uv_map = uv_layer
    nt.links.new(uv.outputs['UV'], tex.inputs['Vector'])
    nt.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
    nt.links.new(bsdf.outputs[0], out.inputs['Surface'])
    return mat

ROUGH = {'Lib_Floor': 0.45, 'Lib_Plaster': 0.92, 'Lib_Rug': 1.0, 'Lib_Oak': 0.5}
tile_export = {m: export_mat('Tiled_' + m, tile_imgs[m], 'Tile', ROUGH.get(m, 0.7))
               for m in TILE_MATS}
atlas_export = export_mat('Baked_cont', alb_cont, 'Atlas', 0.6)

for ob in g_floor + g_shell + g_cont:
    repl = []
    for slot in ob.material_slots:
        n = slot.material.name if slot.material else ''
        repl.append(tile_export.get(n, atlas_export))
    if repl and all(r is repl[0] for r in repl):
        ob.data.materials.clear()
        ob.data.materials.append(repl[0])
    else:
        for i, slot in enumerate(ob.material_slots):
            slot.material = repl[i]
# deco keeps its authored flat materials (exporter handles them natively)

# strip BAKE_TARGET nodes so no stray textures export
for mat in bpy.data.materials:
    if mat.use_nodes:
        n = mat.node_tree.nodes.get('BAKE_TARGET')
        if n: mat.node_tree.nodes.remove(n)

# ---------------- export ----------------
bpy.ops.object.select_all(action='SELECT')
for ob in bpy.data.objects:
    if ob.type in ('CAMERA', 'LIGHT'):
        ob.select_set(False)
out_path = os.path.join(ASSETS, 'library.glb')
bpy.ops.export_scene.gltf(
    filepath=out_path,
    use_selection=True,
    export_format='GLB',
    export_extras=True,
    export_vertex_color='ACTIVE',   # vista/fx colors live in attributes the
                                    # exporter's material scan does not detect
    export_yup=True,
    export_apply=True,
    export_cameras=False,
    export_lights=False,
)
log('exported', out_path, '%.1f MB' % (os.path.getsize(out_path) / 1e6))
log('DONE')
