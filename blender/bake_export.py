# Headless bake + export pipeline for The Geiling Library.
# Usage:
#   /Applications/Blender.app/Contents/MacOS/Blender -b blender/library.blend -P blender/bake_export.py
# Reads the saved library.blend, bakes albedo + lightmap atlases for two
# groups (architecture / contents), rebuilds simple baked materials, and
# exports assets/library.glb plus assets/textures/lm_*.png lightmaps.
# The live Blender session is untouched; this works on its own copy.

import bpy, os, sys, math, time

T0 = time.time()
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(bpy.data.filepath)))
ASSETS = os.path.join(ROOT, 'assets')
TEXDIR = os.path.join(ASSETS, 'textures')
os.makedirs(TEXDIR, exist_ok=True)

ATLAS = 'Atlas'
SIZE_ALB = 4096
SIZE_LM = 2048
SAMPLES_LM = 64

ARCH_MATS = {'Lib_Plaster', 'Lib_Floor', 'Lib_Rug'}
SKIP_MATS = {'Lib_Glass', 'Lib_Water', 'Lib_Lead'}   # stay as flat materials

def log(*a):
    print('[bake %6.1fs]' % (time.time() - T0), *a, flush=True)

# ---------- engine / GPU ----------
sc = bpy.context.scene
sc.render.engine = 'CYCLES'
# Metal GPU baking segfaults on this machine while the interactive Blender
# session also holds the GPU; the whole pipeline runs on CPU.
sc.cycles.device = 'CPU'
sc.cycles.use_denoising = False   # denoising not applied to bakes anyway
log('bake device: CPU')

# ---------- group objects ----------
def mats_of(ob):
    return {s.material.name for s in ob.material_slots if s.material}

groups = {'arch': [], 'cont': []}
for ob in bpy.data.objects:
    if ob.type != 'MESH':
        continue
    ms = mats_of(ob)
    if not ms or ms & SKIP_MATS:
        continue
    if ms <= ARCH_MATS:
        groups['arch'].append(ob)
    else:
        groups['cont'].append(ob)
log('groups: arch=%d cont=%d' % (len(groups['arch']), len(groups['cont'])))

# ---------- UV atlas per group ----------
def make_atlas_uvs(objs):
    for ob in objs:
        uvs = ob.data.uv_layers
        while uvs:
            uvs.remove(uvs[0])
        uvs.new(name=ATLAS)
    bpy.ops.object.select_all(action='DESELECT')
    for ob in objs:
        ob.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.002)
    bpy.ops.object.mode_set(mode='OBJECT')

# ---------- bake helpers ----------
def bind_image(mat_names, img):
    """Give every material an image node pointing at img, selected+active for baking."""
    for name in mat_names:
        mat = bpy.data.materials[name]
        nt = mat.node_tree
        node = nt.nodes.get('BAKE_TARGET')
        if not node:
            node = nt.nodes.new('ShaderNodeTexImage')
            node.name = 'BAKE_TARGET'
        node.image = img
        for n in nt.nodes:
            n.select = False
        node.select = True
        nt.nodes.active = node

def bake(objs, img, kind):
    bpy.ops.object.select_all(action='DESELECT')
    for ob in objs:
        ob.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    b = sc.render.bake
    b.margin = 8
    b.use_clear = True
    if kind == 'albedo':
        sc.cycles.samples = 8
        b.use_pass_direct = False
        b.use_pass_indirect = False
        b.use_pass_color = True
        bpy.ops.object.bake(type='DIFFUSE', pass_filter={'COLOR'})
    else:
        sc.cycles.samples = SAMPLES_LM
        b.use_pass_direct = True
        b.use_pass_indirect = True
        b.use_pass_color = False
        bpy.ops.object.bake(type='DIFFUSE', pass_filter={'DIRECT', 'INDIRECT'})

def save_img(img, path):
    img.filepath_raw = path
    img.file_format = 'PNG'
    img.save()
    log('saved', os.path.basename(path))

# ---------- run ----------
baked = {}
for gname, objs in groups.items():
    log('>>> group', gname, 'UV unwrap...')
    make_atlas_uvs(objs)
    mat_names = set()
    for ob in objs:
        mat_names |= mats_of(ob)

    alb = bpy.data.images.new('alb_' + gname, SIZE_ALB, SIZE_ALB, alpha=False)
    bind_image(mat_names, alb)
    log('bake albedo', gname)
    bake(objs, alb, 'albedo')
    save_img(alb, os.path.join(TEXDIR, 'alb_%s.png' % gname))

    lm = bpy.data.images.new('lm_' + gname, SIZE_LM, SIZE_LM, alpha=False, float_buffer=True)
    bind_image(mat_names, lm)
    log('bake lightmap', gname)
    bake(objs, lm, 'light')
    save_img(lm, os.path.join(TEXDIR, 'lm_%s.png' % gname))
    baked[gname] = (alb, lm)

# ---------- rebuild simple baked materials ----------
for gname, objs in groups.items():
    alb, _ = baked[gname]
    mat = bpy.data.materials.new('Baked_' + gname)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    bsdf = nt.nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Roughness'].default_value = 0.75 if gname == 'arch' else 0.6
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = alb
    uv = nt.nodes.new('ShaderNodeUVMap')
    uv.uv_map = ATLAS
    nt.links.new(uv.outputs['UV'], tex.inputs['Vector'])
    nt.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
    nt.links.new(bsdf.outputs[0], out.inputs['Surface'])
    for ob in objs:
        ob.data.materials.clear()
        ob.data.materials.append(mat)

# flat materials for glass/water/lead survive as-is (exporter approximates them)

# ---------- export ----------
bpy.ops.object.select_all(action='SELECT')
for ob in bpy.data.objects:
    if ob.type in ('CAMERA', 'LIGHT'):
        ob.select_set(False)
out_path = os.path.join(ASSETS, 'library.glb')
bpy.ops.export_scene.gltf(
    filepath=out_path,
    use_selection=True,
    export_format='GLB',
    export_extras=True,          # carries the 'act' custom properties
    export_yup=True,
    export_apply=True,
    export_cameras=False,
    export_lights=False,
)
log('exported', out_path, '%.1f MB' % (os.path.getsize(out_path) / 1e6))
log('DONE')
