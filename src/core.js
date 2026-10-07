// Helpers, SRS scheduler, and the hall layout tables (CSS units, 100 = 1 m).
// Extracted verbatim from legacy/index.html (v25).
import { WORKS, FUTURE_EXHIBITS } from './data.js';

var DAY = 86400e3;
var TYPE_LABEL = { book:'Book', essay:'Essay', article:'Article', podcast:'Podcast' };
var SECTION_OF = { book:'BOOKS \u00b7 west stacks', essay:'ESSAYS \u00b7 west stacks', article:'ARTICLES \u00b7 east stacks', podcast:'PODCASTS \u00b7 east stacks' };
var MAT_OF = { book:'cloth', essay:'folio', article:'jacket', podcast:'slip' };
var MAT_OVERRIDE = { med:'leather', emer:'leather', tfs:'jacket', det:'jacket', mis:'leather' };
var NOW0 = Date.now();
var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function $(s){ return document.querySelector(s); }
function byId(id){ for (var i=0;i<WORKS.length;i++) if (WORKS[i].id===id) return WORKS[i]; return null; }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function clamp(v,lo,hi){ return v<lo?lo:v>hi?hi:v; }
function shortAngle(a){ a=(a+Math.PI)%(2*Math.PI); if(a<0)a+=2*Math.PI; return a-Math.PI; }
function fmtDate(iso){ var d=new Date(iso+'T12:00:00'); return MON[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear(); }
function fmtMonth(iso){ var d=new Date(iso+'T12:00:00'); return MON[d.getMonth()]+' '+d.getFullYear(); }
function todayISO(){ var d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function sharedTags(a,b){ return a.tags.filter(function(t){ return b.tags.indexOf(t)>=0; }); }
var _seed = 7;
function rnd(){ _seed=(_seed*9301+49297)%233280; return _seed/233280; }

/* ——————————————————————— SRS (SM-2 style) ——————————————————————— */
var allCards = [];
(function(){
  var k=0;
  WORKS.forEach(function(w){
    w.cards.forEach(function(c,i){
      c.id='c'+(k++); c.work=w;
      c.ease=2.5-(i%3)*0.07;
      if (c.seed){ c.reps=2; c.interval=[1,2,4][k%3]; c.due=NOW0-(2+(k%5))*6*3600e3; }
      else { c.reps=1; c.interval=3+(k%7); c.due=NOW0+(1+(k%10))*DAY; }
      allCards.push(c);
    });
  });
})();
function nextState(c,g){
  var now=Date.now();
  if (g===0) return { ease:Math.max(1.3,c.ease-0.2), interval:0, reps:0, due:now+5*60000 };
  var ease=Math.min(2.8,Math.max(1.3,c.ease+(g===1?-0.15:g===3?0.15:0)));
  var interval = (c.reps===0) ? (g===1?1:g===2?2:5)
    : Math.max(1,Math.round(c.interval*(g===1?1.2:g===2?ease:ease*1.4)));
  return { ease:ease, interval:interval, reps:c.reps+1, due:now+interval*DAY };
}
function previewLabel(c,g){ var s=nextState(c,g); return s.interval===0?'5 min':s.interval+(s.interval===1?' day':' days'); }
function gradeCard(c,g){ var s=nextState(c,g); c.ease=s.ease; c.interval=s.interval; c.reps=s.reps; c.due=s.due; updateBadge(); }
function dueCards(){ return allCards.filter(function(c){ return c.due<=Date.now(); }).sort(function(a,b){ return a.due-b.due; }); }
function dueFor(w){ return w.cards.filter(function(c){ return c.due<=Date.now(); }).length; }
function dueStr(c){
  var diff=c.due-Date.now();
  if (diff<=0) return 'due now';
  if (diff<DAY) return 'in '+Math.max(1,Math.round(diff/3600e3))+' h';
  return 'in '+Math.round(diff/DAY)+' d';
}
function updateBadge(){ $('#badge-n').textContent = dueCards().length+' due'; }

/* ---- hall layout (CSS units; the Blender scene uses the same values / 100) ---- */
var HW=1700, HD=3400, EYE=186;
var FTN = { x:0, z:400, r:165 };
var ART_PLACES = [
  { x:-1070, z:-HD+5, ry:0 },
  { x: 1070, z:-HD+5, ry:0 },
  { x:-HW+5, z: 520,  ry:90 },
  { x: 0,    z: HD-5, ry:180 },
  { x: HW-5, z: 2000, ry:-90 },
  { x:-1100, z: HD-5, ry:180 }
];
var STATUES = [
  { x:-1360, z:-2880, ry:25,   name:'The Reader' },
  { x: 1360, z:-2880, ry:-25,  name:'The Scholar' },
  { x:-1360, z: 2880, ry:155,  name:'The Stoic' },
  { x: 1360, z: 2880, ry:-155, name:'The Economist' }
];
var PLINTHS = [
  { x:-620, z:-1600 },
  { x: 620, z:-1600 },
  { x:-620, z: 1800 },
  { x: 620, z: 1800 }
];
  /* WINPOS drives both the 3D windows and the floor-plan ticks */
  var WINPOS = [
    /* north wall — morning sun, full beams */
    { x:-1380, z:-HD+6, ry:0,   beam:true,  sun:false },
    { x: -760, z:-HD+6, ry:0,   beam:true,  sun:true  },
    { x:  760, z:-HD+6, ry:0,   beam:true,  sun:false },
    { x: 1380, z:-HD+6, ry:0,   beam:true,  sun:false },
    /* west wall — three bays between the shelf runs, beams thrown east */
    { x:-HW+6, z:-3060, ry:90,  beam:true,  sun:false },
    { x:-HW+6, z:  180, ry:90,  beam:true,  sun:true  },
    { x:-HW+6, z: 3020, ry:90,  beam:true,  sun:false },
    /* east wall — softer light, pools only */
    { x: HW-6, z:-3060, ry:-90, beam:false, sun:false },
    { x: HW-6, z: -450, ry:-90, beam:false, sun:false },
    { x: HW-6, z: 2950, ry:-90, beam:false, sun:false },
    /* south wall */
    { x:-1420, z: HD-6, ry:180, beam:false, sun:false },
    { x: 1420, z: HD-6, ry:180, beam:false, sun:false }
  ];
var SECTIONS = [
  { id:'sec-books',    label:'BOOKS',    sub:'Section I · Long-form · three bays',  type:'book',    x:-HW+5, z:-1490, ry:90,  w:2640 },
  { id:'sec-essays',   label:'ESSAYS',   sub:'Section II · Arguments · three bays', type:'essay',   x:-HW+5, z: 1690, ry:90,  w:1980 },
  { id:'sec-articles', label:'ARTICLES', sub:'Section III · The Web · three bays',  type:'article', x: HW-5, z:-1790, ry:-90, w:1980 },
  { id:'sec-podcasts', label:'PODCASTS', sub:'Section IV · The Ear · three bays',   type:'podcast', x: HW-5, z:  850, ry:-90, w:1980 }
];
var BAYS=3;
function sectionWorks(sec){ return WORKS.filter(function(w){ return w.type===sec.type; }); }
function sectionBays(works){
  var out=[], base=Math.floor(works.length/BAYS), rem=works.length%BAYS, k=0;
  for (var i=0;i<BAYS;i++){ var n=base+(i<rem?1:0); out.push(works.slice(k,k+n)); k+=n; }
  return out;
}
var BUST_SVG =
  '<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
   '<defs><linearGradient id="stg" x1="0" y1="0" x2="1" y2="1">'+
   '<stop offset="0%" stop-color="#e6ddc8"/><stop offset="55%" stop-color="#c2b698"/><stop offset="100%" stop-color="#8e8166"/>'+
   '</linearGradient></defs>'+
   '<path d="M60 10 C74 10 83 21 83 34 C83 43 79 50 73 54 C73 61 76 66 82 69 C97 76 106 86 108 104 L108 126 L12 126 L12 104 C14 86 23 76 38 69 C44 66 47 61 47 54 C41 50 37 43 37 34 C37 21 46 10 60 10 Z" fill="url(#stg)"/>'+
   '<ellipse cx="60" cy="34" rx="20" ry="23" fill="#d6cbb0" opacity=".5"/>'+
   '<rect x="6" y="126" width="108" height="14" rx="2" fill="url(#stg)"/>'+
  '</svg>';
/* Mock statuary: layered marble silhouettes, pure inline SVG.
   `flip` mirrors the carving so its warm highlight faces the windows. */
function statueSVG(kind,idx,flip){
  var g='mst'+idx, w='mwm'+idx, v='mvn'+idx;
  var defs='<defs>'+
    '<linearGradient id="'+g+'" x1="0" y1="0" x2="1" y2="1">'+
      '<stop offset="0%" stop-color="#eee6d2"/><stop offset="45%" stop-color="#cfc3a4"/>'+
      '<stop offset="100%" stop-color="#90835f"/></linearGradient>'+
    '<linearGradient id="'+w+'" x1="0" y1="0" x2="1" y2="0">'+
      '<stop offset="0%" stop-color="#ffe9b8" stop-opacity=".42"/>'+
      '<stop offset="38%" stop-color="#ffe9b8" stop-opacity="0"/></linearGradient>'+
    '<linearGradient id="'+v+'" x1="0" y1="0" x2="1" y2="0">'+
      '<stop offset="0%" stop-color="#7a6c4e" stop-opacity="0"/>'+
      '<stop offset="55%" stop-color="#7a6c4e" stop-opacity=".35"/>'+
      '<stop offset="100%" stop-color="#5d5138" stop-opacity=".5"/></linearGradient>'+
  '</defs>';
  var body='';
  if (kind==='thinker'){
    body='<path d="M100 36 C118 36 129 50 129 66 C129 76 125 84 118 89 C119 97 123 102 130 106 '+
      'C150 115 160 128 163 150 L166 196 C167 214 160 226 146 232 L146 262 L54 262 L54 226 '+
      'C44 216 40 202 42 184 C45 158 56 140 74 130 C66 122 62 112 62 100 L62 96 '+
      'C56 94 53 88 55 82 C57 77 62 75 67 76 C72 52 84 36 100 36 Z" fill="url(#'+g+')"/>'+
      '<path d="M118 89 C112 118 98 128 84 134 L74 130 C84 120 92 108 95 92 Z" fill="url(#'+v+')" opacity=".55"/>'+
      '<circle cx="76" cy="112" r="15" fill="url(#'+g+')" stroke="#857757" stroke-width="1.2"/>'+
      '<path d="M76 127 C70 150 66 174 66 200 L54 200 C52 170 58 142 68 122 Z" fill="url(#'+g+')" stroke="#857757" stroke-width="1"/>'+
      '<ellipse cx="97" cy="64" rx="19" ry="24" fill="#e7ddc2" opacity=".45"/>';
  } else if (kind==='orator'){
    body='<circle cx="100" cy="44" r="21" fill="url(#'+g+')"/>'+
      '<path d="M100 63 C86 63 78 70 74 82 L52 238 C50 252 56 262 70 262 L130 262 '+
      'C144 262 150 252 148 238 L126 82 C122 70 114 63 100 63 Z" fill="url(#'+g+')"/>'+
      '<path d="M86 84 C80 140 76 196 76 250 L84 250 C82 196 86 140 92 86 Z" fill="url(#'+v+')" opacity=".6"/>'+
      '<path d="M112 86 C118 142 122 198 122 250 L112 250 C114 198 110 144 104 88 Z" fill="url(#'+v+')" opacity=".45"/>'+
      '<path d="M74 92 C56 104 48 118 46 136 C60 134 72 124 80 108 Z" fill="url(#'+g+')" stroke="#857757" stroke-width="1"/>'+
      '<path d="M126 92 C142 100 150 112 152 128 L140 150 C134 132 128 112 122 98 Z" fill="url(#'+g+')" opacity=".9"/>'+
      '<ellipse cx="95" cy="40" rx="13" ry="16" fill="#e7ddc2" opacity=".5"/>';
  } else if (kind==='discobolus'){
    body='<circle cx="146" cy="78" r="17" fill="url(#'+g+')"/>'+
      '<circle cx="46" cy="58" r="21" fill="#d9cfae" stroke="#857757" stroke-width="2.5"/>'+
      '<path d="M46 58 L84 92 C104 78 124 72 140 80 L150 94 C146 118 128 132 104 140 '+
      'C92 160 84 184 92 210 L120 250 L102 262 L72 216 C62 196 62 172 72 150 '+
      'C58 158 48 172 44 190 L30 258 L12 254 L26 182 C32 152 52 128 82 116 L36 72 Z" fill="url(#'+g+')"/>'+
      '<path d="M104 140 C96 162 90 186 94 208 L86 206 C82 184 88 158 96 140 Z" fill="url(#'+v+')" opacity=".55"/>'+
      '<ellipse cx="142" cy="74" rx="11" ry="13" fill="#e7ddc2" opacity=".45"/>';
  } else { /* owl */
    body='<path d="M100 260 L100 232" stroke="#857757" stroke-width="2"/>'+
      '<path d="M66 262 C62 240 64 222 72 208 L66 196 C62 150 70 112 92 88 '+
      'C86 80 84 70 88 60 L100 74 L112 60 C116 70 114 80 108 88 C130 112 138 150 134 196 '+
      'L128 208 C136 222 138 240 134 262 Z" fill="url(#'+g+')"/>'+
      '<circle cx="88" cy="106" r="11" fill="#efe6cf"/><circle cx="112" cy="106" r="11" fill="#efe6cf"/>'+
      '<circle cx="88" cy="106" r="4.5" fill="#6b5e42"/><circle cx="112" cy="106" r="4.5" fill="#6b5e42"/>'+
      '<path d="M100 112 L94 126 L106 126 Z" fill="#a89a74"/>'+
      '<path d="M74 140 C70 170 70 200 74 232 M82 136 C78 168 78 200 82 236" stroke="url(#'+v+')" stroke-width="5" fill="none" opacity=".6"/>'+
      '<path d="M126 140 C130 170 130 200 126 232 M118 136 C122 168 122 200 118 236" stroke="url(#'+v+')" stroke-width="5" fill="none" opacity=".45"/>'+
      '<ellipse cx="93" cy="92" rx="14" ry="10" fill="#e7ddc2" opacity=".4"/>';
  }
  var veins='<path d="M62 150 C84 168 78 206 98 224" stroke="#fffbe9" stroke-width="1.1" fill="none" opacity=".30"/>'+
    '<path d="M118 110 C108 150 128 182 118 226" stroke="#8d7f5d" stroke-width="1" fill="none" opacity=".26"/>'+
    '<path d="M84 70 C96 92 86 112 96 130" stroke="#fffbe9" stroke-width=".9" fill="none" opacity=".22"/>';
  return '<svg viewBox="0 0 200 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+defs+
    '<g'+(flip?' transform="translate(200,0) scale(-1,1)"':'')+'>'+body+veins+
    '<rect x="34" y="262" width="132" height="16" rx="3" fill="url(#'+g+')" stroke="#857757" stroke-width="1"/>'+
    '<rect x="26" y="278" width="148" height="18" rx="3" fill="url(#'+g+')" stroke="#6f6244" stroke-width="1.2"/>'+
    '<rect x="34" y="262" width="132" height="34" fill="url(#'+w+')"/>'+
    '<ellipse cx="100" cy="302" rx="84" ry="12" fill="#2c2316" opacity=".28"/>'+
    '<rect x="0" y="0" width="200" height="320" fill="url(#'+w+')" opacity=".5"/>'+
  '</svg>';
}

export { DAY, NOW0, MON, TYPE_LABEL, SECTION_OF, MAT_OF, MAT_OVERRIDE, WINPOS, RM, $, byId, esc, clamp, shortAngle, fmtDate, fmtMonth,
  todayISO, sharedTags, rnd, allCards, nextState, previewLabel, gradeCard,
  dueCards, dueFor, dueStr, updateBadge,
  HW, HD, EYE, FTN, ART_PLACES, STATUES, PLINTHS, SECTIONS, BAYS,
  sectionWorks, sectionBays, BUST_SVG, statueSVG };
