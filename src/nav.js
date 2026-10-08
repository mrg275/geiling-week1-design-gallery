// Camera, walking, glide-to-approach and the data-act click router —
// extracted verbatim from legacy/index.html (v25). The camera state stays in
// CSS units; scene3d.js registers window.__apply3d to drive the WebGL camera.
import { $, byId, clamp, shortAngle, RM, HW, HD, FTN, ART_PLACES, STATUES, PLINTHS, SECTIONS, BAYS, sectionWorks, sectionBays } from './core.js';
import { showDetail, showArt, showStatue, showPlinth, showGraph, showFountain, showTranscript, showWriting, showTrophies, showFlash, showPlan, OPENERS, toggleMenu, closeMenu, closePanel, hideToast } from './panels.js';

var cam = { x:0, z:2780, yaw:0, pitch:0.02 };
var tgt = { x:0, z:2780, yaw:0, pitch:0.02 };
var keys = {};
var glideOpen = null, gliding = false, glideTimer = null;
var lastTs = 0;
var lookingUp = false;

/* solid furniture: plinth statues, corner busts, writing desk (css units, half-extents incl. margin) */
var SOLIDS = [
  { x:-620, z:-1600, hx:110, hz:110 }, { x:620, z:-1600, hx:110, hz:110 },
  { x:-620, z: 1800, hx:110, hz:110 }, { x:620, z: 1800, hx:110, hz:110 },
  { x:-1360, z:-2880, hx:95, hz:95 },  { x:1360, z:-2880, hx:95, hz:95 },
  { x:-1360, z: 2880, hx:95, hz:95 },  { x:1360, z: 2880, hx:95, hz:95 },
  { x:-800, z: 3180, hx:195, hz:105 },
  { x:-860, z: 100, hx:105, hz:390 }, { x:860, z: 100, hx:105, hz:390 },
  { x:-860, z:-2300, hx:105, hz:390 }, { x:860, z:-2300, hx:105, hz:390 },
];
function clampPos(p){
  p.x=clamp(p.x,-(HW-235),HW-235);
  p.z=clamp(p.z,-(HD-225),HD-225);
  var dx=p.x-FTN.x, dz=p.z-FTN.z, d=Math.hypot(dx,dz), keep=FTN.r+140;
  if (d<keep){ if(d<1){dx=0;dz=1;d=1;} p.x=FTN.x+dx/d*keep; p.z=FTN.z+dz/d*keep; }
  for (var i=0;i<SOLIDS.length;i++){
    var s=SOLIDS[i], ox=p.x-s.x, oz=p.z-s.z;
    if (Math.abs(ox)<s.hx && Math.abs(oz)<s.hz){
      if (s.hx-Math.abs(ox) < s.hz-Math.abs(oz)) p.x = s.x + (ox<0?-s.hx:s.hx);
      else                                        p.z = s.z + (oz<0?-s.hz:s.hz);
    }
  }
}
function glideTo(stand,open){
  gliding=true; glideOpen=open||null;
  tgt.x=stand.x; tgt.z=stand.z; clampPos(tgt);
  tgt.yaw=cam.yaw+shortAngle(stand.yaw-cam.yaw);
  tgt.pitch=0.02; lookingUp=false; syncLookBtn();
  clearTimeout(glideTimer);
  glideTimer=setTimeout(finishGlide, 2200);   /* guaranteed arrival even on slow frames */
}
function finishGlide(){
  if (!gliding) return;
  cam.x=tgt.x; cam.z=tgt.z; cam.yaw=tgt.yaw;
  var open=glideOpen; cancelGlide(); if (open) open();
}
function cancelGlide(){ gliding=false; glideOpen=null; clearTimeout(glideTimer); }
function standFor(x,z,ry,d){
  if (ry===90)  return { x:x+d, z:z, yaw: Math.PI/2 };
  if (ry===-90) return { x:x-d, z:z, yaw:-Math.PI/2 };
  if (ry===0)   return { x:x, z:z+d, yaw:0 };
  return { x:x, z:z-d, yaw:Math.PI };
}

var GO = {};
SECTIONS.forEach(function(s){
  GO[s.id] = { stand:standFor(s.x,s.z,s.ry,470), open:null, label:s.label+' shelf', kind:'Section' };
});
GO['graph']      = { stand:{x:0,z:-2790,yaw:0},            open:function(){ showGraph(); },      label:'Knowledge Graph', kind:'Exhibit' };
GO['fountain']   = { stand:{x:0,z:920,yaw:0},              open:function(){ showFountain(); },   label:'Quote Fountain',  kind:'Exhibit' };
GO['transcript'] = { stand:{x:1155,z:2350,yaw:-Math.PI/2}, open:function(){ showTranscript(); }, label:'UChicago Transcript', kind:'Exhibit' };
GO['writing']    = { stand:{x:-800,z:2810,yaw:Math.PI},    open:function(){ showWriting(); },    label:'Writing Collection',  kind:'Exhibit' };
GO['trophies']   = { stand:{x:800,z:2790,yaw:Math.PI},     open:function(){ showTrophies(); },   label:'Trophy Case',     kind:'Exhibit' };

function workStand(w){
  for (var i=0;i<SECTIONS.length;i++){
    var sec=SECTIONS[i];
    if (sec.type!==w.type) continue;
    /* stand in front of the specific bay this work is shelved in */
    var bays=sectionBays(sectionWorks(sec)), bay=0;
    for (var b=0;b<bays.length;b++) if (bays[b].indexOf(w)>=0) bay=b;
    var off=(bay-1)*(sec.w/BAYS);
    var base=GO[sec.id].stand;
    if (sec.ry===90||sec.ry===-90) return { x:base.x, z:sec.z+off, yaw:base.yaw };
    return { x:sec.x+off, z:base.z, yaw:base.yaw };
  }
  return { x:0,z:1200,yaw:0 };
}
function approach(kind,id){
  closePanel(); closeMenu();
  var stand=null, open=null;
  if (kind==='work'){
    var w=byId(id); if(!w) return;
    stand=workStand(w); open=function(){ showDetail(id); };
  } else if (kind==='go'){
    var g=GO[id]; if(!g) return;
    stand=g.stand; open=g.open;
  } else if (kind==='art'){
    var p=ART_PLACES[+id]; stand=standFor(p.x,p.z,p.ry,450);
    open=function(){ showArt(+id); };
  } else if (kind==='statue'){
    var st=STATUES[+id];
    var dx=cam.x-st.x, dz=cam.z-st.z, dd=Math.hypot(dx,dz)||1;
    stand={ x:st.x+dx/dd*260, z:st.z+dz/dd*260, yaw:Math.atan2(-dx,-dz)+Math.PI };
    stand.yaw=Math.atan2(dx,dz)+Math.PI;      /* face the statue */
    open=function(){ showStatue(+id); };
  } else if (kind==='plinth'){
    var pp=PLINTHS[+id];
    var pdx=cam.x-pp.x, pdz=cam.z-pp.z, pdd=Math.hypot(pdx,pdz)||1;
    stand={ x:pp.x+pdx/pdd*280, z:pp.z+pdz/pdd*280, yaw:Math.atan2(pdx,pdz)+Math.PI };
    open=function(){ showPlinth(+id); };
  } else if (kind==='open'){
    var f=OPENERS[id]; if(f) f();
    return;
  }
  if (!stand) return;
  var near = Math.hypot(cam.x-stand.x,cam.z-stand.z)<160 && Math.abs(shortAngle(stand.yaw-cam.yaw))<1.1;
  if (near && open){ open(); }
  else glideTo(stand,open);
}

/* input */
window.addEventListener('keydown', function(e){
  var typing = e.target && e.target.closest && e.target.closest('input,textarea,select,[contenteditable]');
  if (e.key==='Escape'){
    if (!$('#overlay').hidden){ closePanel(); e.preventDefault(); return; }
    if (!$('#menu').hidden){ closeMenu(); e.preventDefault(); return; }
    if (!$('#toast').hidden){ hideToast(); e.preventDefault(); return; }
    return;
  }
  if (typing) return;
  if ((e.key==='m'||e.key==='M') && $('#overlay').hidden){ toggleMenu(); e.preventDefault(); return; }
  if (!$('#overlay').hidden || !$('#menu').hidden) return;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'].indexOf(e.code)>=0){
    keys[e.code]=true; cancelGlide(); e.preventDefault();
  }
});
window.addEventListener('keyup', function(e){ keys[e.code]=false; });
window.addEventListener('blur', function(){ keys={}; });

/* drag to look (yaw + pitch) */
var vp=$('#viewport');
var drag=null, dragMoved=false;
vp.addEventListener('pointerdown', function(e){
  if (!$('#overlay').hidden || !$('#menu').hidden) return;
  drag={ id:e.pointerId, lx:e.clientX, ly:e.clientY, tot:0 };
  dragMoved=false;
  try{ vp.setPointerCapture(e.pointerId); }catch(err){}
});
vp.addEventListener('pointermove', function(e){
  if (!drag || e.pointerId!==drag.id) return;
  var dx=e.clientX-drag.lx, dy=e.clientY-drag.ly;
  drag.lx=e.clientX; drag.ly=e.clientY;
  drag.tot+=Math.abs(dx)+Math.abs(dy);
  if (drag.tot>6){
    dragMoved=true; vp.classList.add('dragging'); cancelGlide();
    tgt.yaw-=dx*0.0042;
    tgt.pitch=clamp(tgt.pitch+dy*0.0035,-0.3,1.15);
    lookingUp=tgt.pitch>0.5; syncLookBtn();
  }
});
function endDrag(e){
  if (drag && e.pointerId===drag.id){
    drag=null; vp.classList.remove('dragging');
    if (dragMoved) setTimeout(function(){ dragMoved=false; },0);
  }
}
vp.addEventListener('pointerup', endDrag);
vp.addEventListener('pointercancel', endDrag);

document.addEventListener('click', function(e){
  var t=e.target.closest ? e.target.closest('[data-act]') : null;
  if (!t) return;
  if (dragMoved) return;
  var i=t.dataset.act.indexOf(':');
  approach(t.dataset.act.slice(0,i), t.dataset.act.slice(i+1));
});

$('#fp-open').addEventListener('click', function(){ showPlan(); });
$('#menu-btn').addEventListener('click', function(){ toggleMenu(); });
function syncLookBtn(){}
/* main loop */
function step(dt,ts){
  var uiUp = !$('#overlay').hidden || !$('#menu').hidden;

  if (!uiUp){
    var f=((keys.KeyW||keys.ArrowUp)?1:0)-((keys.KeyS||keys.ArrowDown)?1:0);
    var r=((keys.KeyD||keys.ArrowRight)?1:0)-((keys.KeyA||keys.ArrowLeft)?1:0);
    if (f||r){
      cancelGlide();
      tgt.yaw-=r*1.8*dt;
      if (f){
        tgt.x+=-Math.sin(tgt.yaw)*f*720*dt;   /* brisker walk for the longer hall */
        tgt.z+=-Math.cos(tgt.yaw)*f*720*dt;
      }
      clampPos(tgt);
    }
  }

  var k=1-Math.exp(-dt*(RM?13:5.4));
  cam.x+=(tgt.x-cam.x)*k;
  cam.z+=(tgt.z-cam.z)*k;
  cam.yaw+=(tgt.yaw-cam.yaw)*k;
  cam.pitch+=(tgt.pitch-cam.pitch)*(RM?k:1-Math.exp(-dt*3.6));

  if (gliding && Math.hypot(cam.x-tgt.x,cam.z-tgt.z)<14 && Math.abs(tgt.yaw-cam.yaw)<0.06){
    finishGlide();
  }

  var yawOff=0,yOff=0;
  if (!RM && !uiUp){
    yawOff=Math.sin(ts*0.00042)*0.0042;
    yOff=Math.sin(ts*0.00085)*2.0;
  }
  if (window.__apply3d) window.__apply3d(cam, ts, !uiUp);
}
function tick(ts){
  var dt = lastTs ? Math.min(0.05,(ts-lastTs)/1000) : 0.016;
  lastTs=ts;
  step(dt,ts);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* debug/test hook (harmless; used by the build's scripted checks) */
window.__lib = { cam:cam, tgt:tgt, step:step, tp:function(x,z,yaw,pitch){
  tgt.x=cam.x=x; tgt.z=cam.z=z; tgt.yaw=cam.yaw=yaw||0; tgt.pitch=cam.pitch=pitch||0.02;
}};

function clearKeys(){ for (var k in keys) delete keys[k]; }
function wasDrag(){ return dragMoved; }

export { cam, tgt, keys, clearKeys, wasDrag, clampPos, glideTo, cancelGlide, standFor, GO, workStand, approach };
