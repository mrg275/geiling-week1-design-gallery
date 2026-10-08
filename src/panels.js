// Overlay panels, knowledge graph, floor plan, menu and serendipity toast —
// extracted verbatim from legacy/index.html (v25).
import { WORKS, REFLECTIONS, TRANSCRIPT, WRITINGS, TROPHIES, ARTDECOR, FUTURE_EXHIBITS, ALL_TAGS } from './data.js';
import { $, byId, esc, clamp, fmtDate, fmtMonth, todayISO, sharedTags, rnd, allCards, nextState, previewLabel, gradeCard, dueCards, dueFor, dueStr, updateBadge, HW, HD, FTN, ART_PLACES, STATUES, PLINTHS, SECTIONS, BUST_SVG, statueSVG } from './core.js';
import { TYPE_LABEL, SECTION_OF, MAT_OF, MAT_OVERRIDE, WINPOS } from './core.js';
import { cam, cancelGlide, clearKeys } from './nav.js';

/* ——————————————————————— OVERLAY SYSTEM ——————————————————————— */
var ovEl=$('#overlay');
function openPanel(title,sub,html){
  closeMenu();
  cancelGlide();               /* a newly opened panel supersedes any pending glide-open */
  $('#ov-title').textContent=title;
  $('#ov-sub').textContent=sub||'';
  $('#ov-body').innerHTML=html;
  ovEl.hidden=false; clearKeys();
  ovEl.querySelector('.panel').scrollTop=0;
}
function closePanel(){ ovEl.hidden=true; }
$('#ov-close').addEventListener('click', closePanel);
ovEl.addEventListener('click', function(e){ if (e.target===ovEl) closePanel(); });

/* ——————————————————————— WORK DETAIL ——————————————————————— */
var detailEd={ id:null, editing:-1 };
function showDetail(id){
  detailEd={ id:id, editing:-1 };
  renderDetail();
}
function renderDetail(){
  var w=byId(detailEd.id);
  openPanel(w.title, TYPE_LABEL[w.type]+' · library placard', detailHTML(w));
  bindDetail(w);
}
function detailHTML(w){
  var fg=w.dark?'#332612':'#f6ecd2';
  var h='<div class="dhead">'+
    '<div class="cover cm-'+(MAT_OVERRIDE[w.id]||MAT_OF[w.type]||'cloth')+'" style="background:'+w.cover+';color:'+fg+'">'+
      '<span class="cv-type">'+TYPE_LABEL[w.type].toUpperCase()+'</span>'+
      '<span class="cv-mono">'+esc(w.mono)+'</span><span class="cv-rule"></span>'+
      '<span class="cv-t">'+esc(w.title)+'</span><span class="cv-a">'+esc(w.author)+'</span>'+
    '</div>'+
    '<div class="dmeta"><dl class="meta-grid">'+
      '<div><dt>Author</dt><dd>'+esc(w.author)+'</dd></div>'+
      '<div><dt>Published</dt><dd>'+esc(w.pub)+'</dd></div>'+
      '<div><dt>Read / heard</dt><dd>'+fmtDate(w.consumed)+'</dd></div>'+
      '<div><dt>Shelved in</dt><dd>'+SECTION_OF[w.type]+'</dd></div>'+
    '</dl>'+
    '<div class="tags">'+w.tags.map(function(t){
      return '<button class="tag" data-tag="'+t+'" title="Recall the &ldquo;'+t+'&rdquo; thread">'+t+'</button>';
    }).join('')+'</div>'+
    '<div class="row" style="margin-top:12px">'+
      '<button class="btn ghost" id="d-recall">Recall this work</button>'+
      '<button class="btn ghost" id="d-graph">See on map</button>'+
    '</div></div></div>';

  h+='<div class="sect"><h3>Quotes</h3>'+
    w.quotes.map(function(q){ return '<blockquote>&ldquo;'+esc(q)+'&rdquo;</blockquote>'; }).join('')+'</div>';

  h+='<div class="sect"><h3>Personal notes ('+w.notes.length+')</h3>';
  w.notes.forEach(function(n,i){
    if (detailEd.editing===i){
      h+='<div class="note"><div class="note-meta"><span>'+fmtDate(n.d)+' · editing</span></div>'+
        '<textarea id="note-edit">'+esc(n.t)+'</textarea>'+
        '<div class="row" style="margin-top:8px"><button class="btn" data-save="'+i+'">Save</button>'+
        '<button class="btn ghost" data-cancel="1">Cancel</button></div></div>';
    } else {
      h+='<div class="note"><div class="note-meta"><span>'+fmtDate(n.d)+'</span>'+
        '<button class="mini" data-edit="'+i+'">Edit</button></div>'+
        '<div class="note-text">'+esc(n.t)+'</div></div>';
    }
  });
  h+='<div class="note" style="background:transparent">'+
    '<div class="note-meta"><span>Add a note</span></div>'+
    '<textarea id="note-new" placeholder="What do you want your future self to remember about this?"></textarea>'+
    '<div class="row" style="margin-top:8px"><button class="btn" id="note-add">Add note</button>'+
    '<span class="muted">kept in memory only — this is a design study</span></div></div></div>';

  h+='<div class="sect"><h3>Flashcards from this work ('+w.cards.length+')</h3>'+
    w.cards.map(function(c){
      return '<div class="note"><div class="note-text"><b style="font-weight:normal;font-style:italic">'+esc(c.q)+'</b></div></div>';
    }).join('')+
    '<div class="row" style="margin-top:4px"><button class="btn ghost" id="d-flash">Study these in Flashcards</button></div></div>';
  return h;
}
function bindDetail(w){
  var body=$('#ov-body');
  body.querySelectorAll('[data-edit]').forEach(function(b){
    b.addEventListener('click', function(){ detailEd.editing=+b.dataset.edit; renderDetail(); });
  });
  body.querySelectorAll('[data-save]').forEach(function(b){
    b.addEventListener('click', function(){
      var v=$('#note-edit').value.trim();
      if (v) w.notes[+b.dataset.save].t=v;
      detailEd.editing=-1; renderDetail();
    });
  });
  body.querySelectorAll('[data-cancel]').forEach(function(b){
    b.addEventListener('click', function(){ detailEd.editing=-1; renderDetail(); });
  });
  var add=$('#note-add');
  if (add) add.addEventListener('click', function(){
    var v=$('#note-new').value.trim();
    if (!v) return;
    w.notes.push({ d:todayISO(), t:v });
    detailEd.editing=-1; renderDetail();
  });
  body.querySelectorAll('.tag').forEach(function(t){
    t.addEventListener('click', function(){ showRecall({ tag:t.dataset.tag }); });
  });
  var r=$('#d-recall'); if(r) r.addEventListener('click', function(){ showRecall({ work:w.id }); });
  var g=$('#d-graph'); if(g) g.addEventListener('click', function(){ showGraph(w.id); });
  var f=$('#d-flash'); if(f) f.addEventListener('click', function(){ showFlash(w.id); });
}

/* ——————————————————————— KNOWLEDGE GRAPH ——————————————————————— */
function graphLayout(W,H,R){
  var pos={};
  WORKS.forEach(function(w,i){
    var a=i*2*Math.PI/WORKS.length-Math.PI/2;
    pos[w.id]=[ W/2+Math.cos(a)*R, H/2+Math.sin(a)*R*0.86 ];
  });
  return pos;
}
function graphSVG(interactive,focusId){
  var W=interactive?760:300, H=interactive?620:190, R=interactive?252:78;
  var pos=graphLayout(W,H,R);
  var s='<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Knowledge graph">';
  for (var i=0;i<WORKS.length;i++) for (var j=i+1;j<WORKS.length;j++){
    var st=sharedTags(WORKS[i],WORKS[j]);
    if (!st.length) continue;
    var a=pos[WORKS[i].id], b=pos[WORKS[j].id];
    s+='<line class="ge" data-e="'+WORKS[i].id+','+WORKS[j].id+'" x1="'+a[0].toFixed(1)+'" y1="'+a[1].toFixed(1)+
       '" x2="'+b[0].toFixed(1)+'" y2="'+b[1].toFixed(1)+'" stroke-width="'+(interactive?st.length*1.1:st.length*0.7)+
       '" opacity="'+(0.16+st.length*0.14)+'">'+(interactive?'<title>'+st.join(' · ')+'</title>':'')+'</line>';
  }
  WORKS.forEach(function(w){
    var p=pos[w.id];
    if (interactive){
      var anchor = p[0]<W/2-20?'end':(p[0]>W/2+20?'start':'middle');
      var ty = p[1]<H/2 ? -14 : 24;
      s+='<g class="gn" data-act="work:'+w.id+'" data-node="'+w.id+'">'+
         '<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="'+(8+w.tags.length*1.4)+'"/>'+
         '<text x="'+p[0].toFixed(1)+'" y="'+(p[1]+ty).toFixed(1)+'" text-anchor="'+anchor+'">'+esc(w.short)+'</text>'+
         '<title>'+esc(w.title)+' — '+w.tags.join(', ')+'</title></g>';
    } else {
      s+='<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="4.6" fill="#ddbc78" stroke="#2a3a2c"/>';
    }
  });
  s+='</svg>';
  return s;
}
function showGraph(focusId){
  var h='<p class="muted" style="margin-bottom:8px">Lines are shared tags — thicker means more in common. Hover a work to light its connections; click to open its placard.</p>'+
    '<div class="gwrap" id="gwrap">'+graphSVG(true)+'</div>'+
    '<div class="glegend">'+ALL_TAGS.map(function(t){ return '<span class="tag" data-tag="'+t+'">'+t+'</span>'; }).join('')+'</div>';
  openPanel('The Collection Map','knowledge graph · 13 works', h);
  var wrap=$('#gwrap'), svg=wrap.querySelector('svg');
  function setFocus(id){
    if (!id){ wrap.classList.remove('focus');
      svg.querySelectorAll('.on').forEach(function(el){ el.classList.remove('on'); });
      return;
    }
    wrap.classList.add('focus');
    svg.querySelectorAll('.on').forEach(function(el){ el.classList.remove('on'); });
    svg.querySelectorAll('.ge').forEach(function(e){
      var ab=e.dataset.e.split(',');
      if (ab[0]===id||ab[1]===id){
        e.classList.add('on');
        var other=ab[0]===id?ab[1]:ab[0];
        var n=svg.querySelector('[data-node="'+other+'"]'); if(n) n.classList.add('on');
      }
    });
    var me=svg.querySelector('[data-node="'+id+'"]'); if(me) me.classList.add('on');
  }
  svg.querySelectorAll('.gn').forEach(function(n){
    n.addEventListener('mouseenter', function(){ setFocus(n.dataset.node); });
    n.addEventListener('mouseleave', function(){ setFocus(focusId||null); });
  });
  wrap.querySelectorAll('.glegend .tag, .tag').forEach(function(t){});
  $('#ov-body').querySelectorAll('.glegend .tag').forEach(function(t){
    t.addEventListener('click', function(){ showRecall({ tag:t.dataset.tag }); });
  });
  if (focusId) setFocus(focusId);
}

/* ——————————————————————— QUOTE FOUNTAIN ——————————————————————— */
var QUOTE_POOL=[];
WORKS.forEach(function(w){ w.quotes.forEach(function(q){ QUOTE_POOL.push({ q:q, w:w }); }); });
var lastQuote=-1;
function drawQuote(){
  var i;
  do { i=Math.floor(Math.random()*QUOTE_POOL.length); } while (QUOTE_POOL.length>1 && i===lastQuote);
  lastQuote=i; return QUOTE_POOL[i];
}
function showFountain(){
  var it=drawQuote();
  var h='<p class="muted" style="margin-bottom:6px">The fountain surfaces one line from the collection at a time. Draw until something snags.</p>'+
    '<div class="fq"><div class="qmark">&rdquo;</div><p id="fq-q">'+esc(it.q)+'</p>'+
    '<cite id="fq-c">'+esc(it.w.author)+' · '+esc(it.w.title)+'</cite></div>'+
    '<div class="row" style="justify-content:center">'+
    '<button class="btn" id="fq-again">Draw another</button>'+
    '<button class="btn ghost" id="fq-reflect">Reflect on this</button>'+
    '<button class="btn ghost" id="fq-open">Open the work</button></div>';
  openPanel('The Quote Fountain','draw a line · let it work on you',h);
  var cur=it;
  $('#fq-again').addEventListener('click', function(){
    cur=drawQuote();
    $('#fq-q').textContent='“'+cur.q+'”';
    $('#fq-c').textContent=cur.w.author+' · '+cur.w.title;
  });
  $('#fq-reflect').addEventListener('click', function(){ showReflect({ quote:cur.q, source:cur.w.title }); });
  $('#fq-open').addEventListener('click', function(){ showDetail(cur.w.id); });
}

/* ——————————————————————— TRANSCRIPT ——————————————————————— */
function showTranscript(){
  var rows=TRANSCRIPT.map(function(r){
    return '<tr><td style="white-space:nowrap">'+esc(r.code)+'</td><td>'+esc(r.name)+
      '<div class="muted" style="font-size:11px">'+esc(r.term)+'</div></td><td class="gr">'+esc(r.grade)+'</td></tr>';
  }).join('');
  var h='<p class="muted" style="margin-bottom:10px">Unofficial, registrar-style. Grades read &ldquo;&mdash;&rdquo; until entered — edit the <b style="font-weight:normal">TRANSCRIPT</b> array at the top of this file (marked <b style="font-weight:normal">&starf; FILL IN</b>).</p>'+
    '<table class="ledger"><thead><tr><th>Course</th><th>Title · term</th><th style="text-align:center">Grade</th></tr></thead>'+
    '<tbody>'+rows+'</tbody>'+
    '<tbody><tr><td></td><td style="text-align:right;font-style:italic;color:#8a7850">Cumulative GPA</td><td class="gr">&mdash;</td></tr></tbody></table>';
  openPanel('Academic Transcript','The University of Chicago · placeholder',h);
}

/* ——————————————————————— WRITING COLLECTION ——————————————————————— */
function showWriting(idx){
  if (typeof idx==='number'){
    var p=WRITINGS[idx];
    var h='<button class="mini" id="wr-back">&larr; All writing</button>'+
      '<h3 style="font-weight:normal;font-style:italic;font-size:21px;margin:14px 0 2px">'+esc(p.title)+'</h3>'+
      '<div class="muted" style="margin-bottom:14px">'+esc(p.type)+' · '+esc(p.date)+'</div>'+
      '<div class="note-text" style="font-size:14.5px;line-height:1.65">'+esc(p.body)+'</div>';
    openPanel('The Geiling Papers','reader',h);
    $('#wr-back').addEventListener('click', function(){ showWriting(); });
    return;
  }
  var h='<p class="muted" style="margin-bottom:8px">Matthew&rsquo;s own research, essays, and stories. All six entries are scaffolding — fill in the <b style="font-weight:normal">WRITINGS</b> array (marked <b style="font-weight:normal">&starf; FILL IN</b>).</p>'+
    WRITINGS.map(function(p,i){
      return '<div class="wrow" data-wr="'+i+'"><b>'+esc(p.title)+'</b>'+
        '<span class="wt">'+esc(p.type)+'</span><span class="wd">'+esc(p.date)+'</span>'+
        '<p>'+esc(p.summary)+'</p></div>';
    }).join('');
  openPanel('The Geiling Papers','writing collection · '+WRITINGS.length+' pieces',h);
  $('#ov-body').querySelectorAll('[data-wr]').forEach(function(r){
    r.addEventListener('click', function(){ showWriting(+r.dataset.wr); });
  });
}

/* ——————————————————————— TROPHY CASE ——————————————————————— */
function trophySVG(kind){
  if (kind==='medal') return '<svg viewBox="0 0 40 48"><rect x="14" y="2" width="12" height="16" fill="#96433a"/><circle cx="20" cy="30" r="13" fill="#dcb86a" stroke="#8a6527" stroke-width="1.8"/><circle cx="20" cy="30" r="6.5" fill="none" stroke="#8a6527" stroke-width="1.3"/></svg>';
  if (kind==='plaque') return '<svg viewBox="0 0 40 48"><rect x="5" y="7" width="30" height="36" rx="2" fill="#6d4f28" stroke="#caa75e" stroke-width="2"/><rect x="11" y="16" width="18" height="4.5" fill="#eed9a8"/><rect x="11" y="25" width="18" height="3" fill="#caa75e"/><rect x="11" y="31" width="12" height="3" fill="#caa75e"/></svg>';
  return '<svg viewBox="0 0 40 48"><path d="M9 5 h22 v10 a11 11 0 0 1 -22 0 Z" fill="#dcb86a" stroke="#8a6527" stroke-width="1.5"/><path d="M9 7 C3 7 3 17 10 18 M31 7 C37 7 37 17 30 18" fill="none" stroke="#8a6527" stroke-width="1.5"/><rect x="16" y="25" width="8" height="8" fill="#b8924e"/><rect x="9" y="33" width="22" height="6" rx="1" fill="#8a6527"/></svg>';
}
function showTrophies(){
  var h='<p class="muted" style="margin-bottom:10px">Six shelf positions, waiting to be engraved. Fill in the <b style="font-weight:normal">TROPHIES</b> array (marked <b style="font-weight:normal">&starf; FILL IN</b>).</p>'+
    '<div class="tgrid">'+TROPHIES.map(function(t){
      return '<div class="tslot">'+trophySVG(t.kind)+'<b>'+esc(t.name)+'</b><span>'+esc(t.year)+'</span>'+
        '<span style="font-style:italic">'+esc(t.note)+'</span></div>';
    }).join('')+'</div>';
  openPanel('Honours & Laurels','trophy case · placeholder',h);
}

/* ——————————————————————— ART & STATUES ——————————————————————— */
function showArt(i){
  var a=ARTDECOR[i];
  var h='<div class="fq"><div class="qmark">&#10045;</div>'+
    '<p style="font-style:normal">This frame is <b style="font-weight:normal;font-style:italic">reserved for something meaningful</b>.</p>'+
    '<cite>'+esc(a.caption)+' · '+esc(a.hint)+'</cite></div>'+
    '<p class="muted">When the right image exists — a photo, a print, a diagram worth walking past daily — set it in the <b style="font-weight:normal">ARTDECOR</b> array (marked &starf; FILL IN).</p>';
  openPanel('Untitled — Reserved','framed · awaiting meaning',h);
}
function showPlinth(i){
  var p=FUTURE_EXHIBITS[i];
  var h='<div class="fq"><div class="qmark">&#10045;</div>'+
    '<p style="font-style:normal">A mock marble, <b style="font-weight:normal;font-style:italic">&ldquo;'+esc(p.title)+'&rdquo;</b>, holding a place for the library&rsquo;s next exhibit.</p>'+
    '<cite>'+esc(p.caption)+' · plinth '+(i+1)+' of '+FUTURE_EXHIBITS.length+' · '+esc(p.hint)+'</cite></div>'+
    '<blockquote>'+esc(p.idea)+'</blockquote>'+
    '<p class="muted">When something earns floor space in the hall — a project, an artifact, a collection — claim it in the <b style="font-weight:normal">FUTURE_EXHIBITS</b> array (marked &starf; FILL IN).</p>';
  openPanel(p.title,'mock statue · awaiting its exhibit',h);
}
function showStatue(i){
  var s=STATUES[i];
  var h='<div class="fq"><div class="qmark">&#10045;</div>'+
    '<p style="font-style:normal">A classical bust, standing in for a hero not yet chosen.</p>'+
    '<cite>&ldquo;'+esc(s.name)+'&rdquo; · pedestal '+(i+1)+' of 4</cite></div>'+
    '<p class="muted">Reserved for someone whose thinking earns a permanent spot in the room.</p>';
  openPanel(s.name,'statuary · reserved',h);
}

/* ——————————————————————— FLASHCARDS ——————————————————————— */
var fcState=null;
function showFlash(workId){
  var queue;
  if (workId){ var w=byId(workId); queue=w.cards.slice(); }
  else { queue=allCards.slice().sort(function(){ return Math.random()-0.5; }).slice(0,12); }
  fcState={ queue:queue, i:0, flipped:false, done:0, scope:workId?byId(workId).short:'whole library' };
  renderFlash();
}
function renderFlash(){
  var st=fcState;
  if (st.i>=st.queue.length){
    openPanel('Flashcards','session complete',
      '<div class="fq"><div class="qmark">&#10003;</div><p style="font-style:normal">'+st.done+' card'+(st.done===1?'':'s')+' reviewed.</p><cite>'+esc(st.scope)+'</cite></div>'+
      '<div class="row" style="justify-content:center"><button class="btn" id="fc-more">Study more</button></div>');
    $('#fc-more').addEventListener('click', function(){ showFlash(); });
    return;
  }
  var c=st.queue[st.i];
  var h='<div class="muted" style="text-align:center">'+(st.i+1)+' of '+st.queue.length+' · '+esc(st.scope)+'</div>'+
    '<div class="fc'+(st.flipped?' flip':'')+'" id="fc"><div class="fc-inner">'+
      '<div class="fc-face"><span class="fc-k">'+esc(c.work.short)+' · question</span>'+
        '<div class="fc-q">'+esc(c.q)+'</div><span class="muted">click to flip</span></div>'+
      '<div class="fc-face fc-back"><span class="fc-k">answer</span>'+
        '<div class="fc-a">'+esc(c.a)+'</div></div>'+
    '</div></div>';
  if (st.flipped){
    h+='<div class="grade-row">'+[0,1,2,3].map(function(g){
      var names=['Again','Hard','Good','Easy'];
      return '<button class="grade g'+g+'" data-g="'+g+'">'+names[g]+'</button>';
    }).join('')+'</div>';
  } else {
    h+='<div class="row" style="justify-content:center"><button class="btn" id="fc-flip">Show answer</button></div>';
  }
  openPanel('Flashcards','retrieval practice · graded into the scheduler',h);
  $('#fc').addEventListener('click', function(){ st.flipped=!st.flipped; renderFlash(); });
  var fb=$('#fc-flip');
  if (fb) fb.addEventListener('click', function(e){ e.stopPropagation(); st.flipped=true; renderFlash(); });
  $('#ov-body').querySelectorAll('.grade').forEach(function(b){
    b.addEventListener('click', function(e){
      e.stopPropagation();
      gradeCard(c,+b.dataset.g);
      st.done++; st.i++; st.flipped=false;
      renderFlash();
    });
  });
}

/* ——————————————————————— ACTIVE RECALL ——————————————————————— */
var rcState=null;
function showRecall(pre){
  pre=pre||{};
  var opts='<optgroup label="Works">'+WORKS.map(function(w){
      return '<option value="w:'+w.id+'"'+(pre.work===w.id?' selected':'')+'>'+esc(w.title)+'</option>';
    }).join('')+'</optgroup>'+
    '<optgroup label="Tags">'+ALL_TAGS.map(function(t){
      return '<option value="t:'+t+'"'+(pre.tag===t?' selected':'')+'>#'+t+'</option>';
    }).join('')+'</optgroup>';
  var h='<p class="muted" style="margin-bottom:10px">Pick a work or a thread, answer from memory in your own words, then reveal and judge yourself. Grades feed the same scheduler as flashcards.</p>'+
    '<div class="row"><div style="flex:1;min-width:220px"><select id="rc-scope">'+opts+'</select></div>'+
    '<button class="btn" id="rc-begin">Begin recall</button></div><div id="rc-area"></div>';
  openPanel('Active Recall','the examination desk',h);
  $('#rc-begin').addEventListener('click', beginRecall);
  if (pre.work||pre.tag) beginRecall();
}
function beginRecall(){
  var v=$('#rc-scope').value, cards, label;
  if (v.charAt(0)==='w'){ var w=byId(v.slice(2)); cards=w.cards.slice(); label=w.title; }
  else { var tag=v.slice(2); cards=allCards.filter(function(c){ return c.work.tags.indexOf(tag)>=0; }); label='#'+tag; }
  cards.sort(function(a,b){ return a.due-b.due; });
  rcState={ cards:cards, i:0, label:label, revealed:false, done:0 };
  renderRecall();
}
function renderRecall(){
  var st=rcState, area=$('#rc-area');
  if (!area) return;
  if (st.i>=st.cards.length){
    area.innerHTML='<div class="fq" style="margin-top:16px"><div class="qmark">&#10003;</div>'+
      '<p style="font-style:normal">'+st.done+' prompt'+(st.done===1?'':'s')+' recalled on '+esc(st.label)+'.</p>'+
      '<cite>the scheduler has been told</cite></div>';
    return;
  }
  var c=st.cards[st.i];
  var h='<div class="sect"><h3>Prompt '+(st.i+1)+' of '+st.cards.length+' · '+esc(st.label)+'</h3>'+
    '<blockquote style="font-style:normal">'+esc(c.q)+'</blockquote>'+
    '<textarea id="rc-ans" placeholder="Answer from memory — writing it out is the point&hellip;"'+(st.revealed?' readonly':'')+'>'+esc(st.ans||'')+'</textarea>';
  if (!st.revealed){
    h+='<div class="row" style="margin-top:10px"><button class="btn" id="rc-reveal">Reveal answer</button>'+
      '<button class="btn ghost" id="rc-skip">Skip</button></div>';
  } else {
    h+='<div class="note" style="margin-top:12px;background:#f3efdf"><div class="note-meta"><span>Model answer · '+esc(c.work.short)+'</span></div>'+
      '<div class="note-text">'+esc(c.a)+'</div></div>'+
      '<div class="muted" style="text-align:center;margin-top:6px">How close were you?</div>'+
      '<div class="grade-row">'+[0,1,2,3].map(function(g){
        var names=['Missed it','Rough','Close','Nailed it'];
        return '<button class="grade g'+g+'" data-g="'+g+'">'+names[g]+'</button>';
      }).join('')+'</div>';
  }
  h+='</div>';
  area.innerHTML=h;
  var rv=$('#rc-reveal');
  if (rv) rv.addEventListener('click', function(){ st.ans=$('#rc-ans').value; st.revealed=true; renderRecall(); });
  var sk=$('#rc-skip');
  if (sk) sk.addEventListener('click', function(){ st.i++; st.ans=''; st.revealed=false; renderRecall(); });
  area.querySelectorAll('.grade').forEach(function(b){
    b.addEventListener('click', function(){
      gradeCard(c,+b.dataset.g);
      st.done++; st.i++; st.ans=''; st.revealed=false;
      renderRecall();
    });
  });
}

/* ——————————————————————— REFLECTION ENGINE ——————————————————————— */
function showReflect(pre){
  var it = pre && pre.quote ? { q:pre.quote, src:pre.source } : (function(){ var d=drawQuote(); return { q:d.q, src:d.w.title }; })();
  var h='<p class="muted" style="margin-bottom:8px">A line is surfaced; you write until it becomes yours. Saved reflections join the ledger below.</p>'+
    '<div class="fq"><div class="qmark">&rdquo;</div><p id="rf-q">'+esc(it.q)+'</p><cite id="rf-c">'+esc(it.src)+'</cite></div>'+
    '<div class="row" style="justify-content:center;margin-bottom:14px"><button class="mini" id="rf-another">surface a different line</button></div>'+
    '<textarea id="rf-text" placeholder="What does this collide with? What would you tell the person who wrote it?" style="min-height:120px"></textarea>'+
    '<div class="row" style="margin-top:10px"><button class="btn" id="rf-save">Save reflection</button>'+
    '<span class="muted" id="rf-msg"></span></div>'+
    '<div class="sect"><h3>Past reflections (<span id="rf-n">'+REFLECTIONS.length+'</span>)</h3><div id="rf-list"></div></div>';
  openPanel('The Reflection Engine','synthesis desk',h);
  var cur=it;
  function renderList(){
    $('#rf-n').textContent=REFLECTIONS.length;
    $('#rf-list').innerHTML=REFLECTIONS.map(function(r){
      return '<div class="note"><div class="note-meta"><span>'+fmtDate(r.date)+' · on '+esc(r.source)+'</span></div>'+
        '<blockquote style="margin:4px 0 8px;font-size:12.5px">&ldquo;'+esc(r.quote)+'&rdquo;</blockquote>'+
        '<div class="note-text">'+esc(r.text)+'</div></div>';
    }).join('');
  }
  renderList();
  $('#rf-another').addEventListener('click', function(){
    var d=drawQuote(); cur={ q:d.q, src:d.w.title };
    $('#rf-q').textContent='“'+d.q+'”'; $('#rf-c').textContent=d.w.title;
  });
  $('#rf-save').addEventListener('click', function(){
    var v=$('#rf-text').value.trim();
    if (!v){ $('#rf-msg').textContent='write something first — even one honest sentence.'; return; }
    REFLECTIONS.unshift({ date:todayISO(), source:cur.src, quote:cur.q, text:v });
    $('#rf-text').value=''; $('#rf-msg').textContent='saved to the ledger (in memory).';
    renderList();
  });
}

/* ——————————————————————— SRS STATUS ——————————————————————— */
function showSRS(){
  var totalDue=dueCards().length;
  var next=allCards.slice().sort(function(a,b){ return a.due-b.due; })[0];
  var rows=WORKS.map(function(w){
    var d=dueFor(w);
    var soonest=w.cards.slice().sort(function(a,b){ return a.due-b.due; })[0];
    return '<tr><td><i style="font-style:italic">'+esc(w.short)+'</i><div class="muted" style="font-size:11px">'+TYPE_LABEL[w.type]+'</div></td>'+
      '<td style="text-align:center">'+w.cards.length+'</td>'+
      '<td style="text-align:center" class="'+(d?'due1':'')+'">'+(d||'·')+'</td>'+
      '<td>'+(soonest?dueStr(soonest):'—')+'</td></tr>';
  }).join('');
  var h='<div class="srs-sum">'+
    '<div class="ssb"><b>'+allCards.length+'</b><span>cards</span></div>'+
    '<div class="ssb"><b>'+totalDue+'</b><span>due now</span></div>'+
    '<div class="ssb"><b>'+(next?dueStr(next):'—')+'</b><span>next review</span></div></div>'+
    '<table class="srs-t"><thead><tr><th>Work</th><th style="text-align:center">Cards</th><th style="text-align:center">Due</th><th>Soonest</th></tr></thead><tbody>'+rows+'</tbody></table>'+
    '<div class="row" style="margin-top:16px"><button class="btn" id="srs-go">Review what&rsquo;s due</button>'+
    '<span class="muted">SM-2-style: Again resets, Easy stretches the interval and raises ease.</span></div>';
  openPanel('Spaced Repetition','the forgetting-curve ledger',h);
  $('#srs-go').addEventListener('click', function(){ showFlash(); });
}

/* ——————————————————————— FLOOR PLAN ——————————————————————— */
function fpPt(x,z,W,H){ return [ (x+HW)/(2*HW)*(W-24)+12, (z+HD)/(2*HD)*(H-24)+12 ]; }
function showPlan(){
  var W=330,H=620;
  var s='<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">';
  s+='<rect x="12" y="12" width="'+(W-24)+'" height="'+(H-24)+'" rx="3" class="fpr"/>';
  function rect(x,z,w,d,act,label,lx,ly){
    var p=fpPt(x,z,W,H);
    var ww=w/(2*HW)*(W-24), dd=d/(2*HD)*(H-24);
    s+='<rect x="'+(p[0]-ww/2).toFixed(1)+'" y="'+(p[1]-dd/2).toFixed(1)+'" width="'+ww.toFixed(1)+'" height="'+dd.toFixed(1)+'" class="fpo" data-act="'+act+'"><title>'+label+'</title></rect>';
    if (label) s+='<text x="'+(p[0]+(lx||0)).toFixed(1)+'" y="'+(p[1]+(ly||4)).toFixed(1)+'" text-anchor="middle">'+label+'</text>';
  }
  /* window ticks (not clickable) */
  WINPOS.forEach(function(wn){
    var p=fpPt(wn.x,wn.z,W,H), horiz=(wn.ry===0||wn.ry===180);
    var ww=horiz?320/(2*HW)*(W-24):5, dd=horiz?5:320/(2*HD)*(H-24);
    s+='<rect x="'+(p[0]-ww/2).toFixed(1)+'" y="'+(p[1]-dd/2).toFixed(1)+'" width="'+ww.toFixed(1)+'" height="'+dd.toFixed(1)+'" fill="#cfe4f1" stroke="#8a6a34" stroke-width="1"/>';
  });
  rect(-HW+60,-1490,90,2640,'go:sec-books','BOOKS',46,4);
  rect(-HW+60, 1690,90,1980,'go:sec-essays','ESSAYS',50,4);
  rect( HW-60,-1790,90,1980,'go:sec-articles','ARTICLES',-56,4);
  rect( HW-60,  850,90,1980,'go:sec-podcasts','PODCASTS',-60,4);
  rect(0,-HD+70,560,90,'go:graph','MAP',0,26);
  rect(HW-60,2350,90,350,'go:transcript','TRANSCRIPT',-62,4);
  rect(-800,3230,330,150,'go:writing','PAPERS',0,-14);
  rect(800,3310,460,90,'go:trophies','TROPHIES',0,-12);
  PLINTHS.forEach(function(p,i){
    var q=fpPt(p.x,p.z,W,H);
    s+='<rect x="'+(q[0]-6).toFixed(1)+'" y="'+(q[1]-6).toFixed(1)+'" width="12" height="12" class="fpo" data-act="plinth:'+i+'"><title>'+esc(FUTURE_EXHIBITS[i].title)+' (mock)</title></rect>';
  });
  var fp=fpPt(FTN.x,FTN.z,W,H);
  s+='<circle cx="'+fp[0]+'" cy="'+fp[1]+'" r="17" class="fpo" data-act="go:fountain"><title>Quote Fountain</title></circle>'+
     '<text x="'+fp[0]+'" y="'+(fp[1]+32)+'" text-anchor="middle">FOUNTAIN</text>';
  STATUES.forEach(function(st,i){
    var p=fpPt(st.x,st.z,W,H);
    s+='<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="6" class="fpo" data-act="statue:'+i+'"><title>'+st.name+'</title></circle>';
  });
  ART_PLACES.forEach(function(p,i){
    var q=fpPt(p.x,p.z,W,H);
    s+='<rect x="'+(q[0]-5).toFixed(1)+'" y="'+(q[1]-5).toFixed(1)+'" width="10" height="10" class="fpo" data-act="art:'+i+'"><title>Reserved frame</title></rect>';
  });
  var cp=fpPt(cam.x,cam.z,W,H);
  s+='<polygon points="0,-9 6,6 0,3 -6,6" transform="translate('+cp[0].toFixed(1)+','+cp[1].toFixed(1)+') rotate('+(-cam.yaw*180/Math.PI+180).toFixed(1)+')" fill="#6d3328" stroke="#f8f2e3"/>';
  s+='</svg>';

  var items=[
    ['go:sec-books','Books shelf','Section I'],['go:sec-essays','Essays shelf','Section II'],
    ['go:sec-articles','Articles shelf','Section III'],['go:sec-podcasts','Podcasts shelf','Section IV'],
    ['go:graph','Knowledge Graph','exhibit'],['go:fountain','Quote Fountain','exhibit'],
    ['go:transcript','UChicago Transcript','exhibit'],['go:writing','Writing Collection','exhibit'],
    ['go:trophies','Trophy Case','exhibit'],
    ['plinth:0',FUTURE_EXHIBITS[0].title,'mock statue'],['plinth:1',FUTURE_EXHIBITS[1].title,'mock statue'],
    ['plinth:2',FUTURE_EXHIBITS[2].title,'mock statue'],['plinth:3',FUTURE_EXHIBITS[3].title,'mock statue'],
    ['open:flash','Flashcards','study'],['open:recall','Active Recall','study'],
    ['open:reflect','Reflection Engine','study'],
    ['open:seren','Serendipity','study']
  ];
  var h='<p class="muted" style="margin-bottom:10px">Everything in the room, without the walk. Click the plan or the index — the camera glides there and the placard opens.</p>'+
    '<div class="fp-svg">'+s+'</div>'+
    '<div class="fp-list">'+items.map(function(it){
      return '<button data-act="'+it[0]+'">'+it[1]+'<em>'+it[2]+'</em></button>';
    }).join('')+'</div>';
  openPanel('Floor Plan','the library at a glance',h);
}

/* ——————————————————————— MENU ——————————————————————— */
var OPENERS={
  flash:function(){ showFlash(); },
  recall:function(){ showRecall(); },
  reflect:function(){ showReflect(); },
  srs:function(){ showSRS(); },
  seren:function(){ showToast(randomMemory()); },
  plan:function(){ showPlan(); }
};
var NUMWORD=['no','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
function stackSub(type, noun, where){
  var n=WORKS.filter(function(w){ return w.type===type; }).length;
  var num=n<NUMWORD.length?NUMWORD[n]:String(n);
  return num+' '+noun+(n===1?'':'s')+' · '+where;
}
function buildMenu(){
  var cols=[
    { h:'The Stacks', items:[
      ['go:sec-books','Books',stackSub('book','volume','west wall')],
      ['go:sec-essays','Essays',stackSub('essay','essay','west wall')],
      ['go:sec-articles','Articles',stackSub('article','article','east wall')],
      ['go:sec-podcasts','Podcasts',stackSub('podcast','episode','east wall')]]},
    { h:'Exhibits', items:[
      ['go:graph','Knowledge Graph','the collection map · north wall'],
      ['go:fountain','Quote Fountain','heart of the hall'],
      ['go:transcript','UChicago Transcript','east wall · fill in'],
      ['go:writing','The Geiling Papers','south desk · fill in'],
      ['go:trophies','Trophy Case','south wall · fill in'],
      ['plinth:0',FUTURE_EXHIBITS[0].title,'mock statue · north-west plinth'],
      ['plinth:1',FUTURE_EXHIBITS[1].title,'mock statue · north-east plinth'],
      ['plinth:2',FUTURE_EXHIBITS[2].title,'mock statue · south-west plinth'],
      ['plinth:3',FUTURE_EXHIBITS[3].title,'mock statue · south-east plinth']]},
    { h:'The Study', items:[
      ['open:flash','Flashcards','flip &amp; grade'],
      ['open:recall','Active Recall','typed answers, self-judged'],
      ['open:reflect','Reflection Engine','a line, a blank page'],
      ['open:seren','Serendipity','resurface something forgotten'],
      ['open:plan','Floor Plan','2D index of the room']]}
  ];
  $('#menu-cols').innerHTML=cols.map(function(c){
    return '<div class="mcol"><h3>'+c.h+'</h3>'+c.items.map(function(it){
      return '<button class="mitem" data-act="'+it[0]+'"><b>'+it[1]+'</b><em>'+it[2]+'</em></button>';
    }).join('')+'</div>';
  }).join('');
}
buildMenu();
function toggleMenu(){ var m=$('#menu'); if (m.hidden){ closePanel(); m.hidden=false; clearKeys(); } else m.hidden=true; }
function closeMenu(){ $('#menu').hidden=true; }
$('#menu-close').addEventListener('click', closeMenu);
$('#menu').addEventListener('click', function(e){ if (e.target===$('#menu')) closeMenu(); });

/* ——————————————————————— SERENDIPITY ——————————————————————— */
function memoryPool(){
  var pool=[];
  WORKS.forEach(function(w){ w.notes.forEach(function(n){ pool.push({ kind:'note', text:n.t, src:w.title, date:n.d, workId:w.id }); }); });
  REFLECTIONS.forEach(function(r){ pool.push({ kind:'reflection', text:r.text, src:r.source, date:r.date }); });
  return pool;
}
var lastMem=-1;
function randomMemory(){
  var pool=memoryPool(); var i;
  do { i=Math.floor(Math.random()*pool.length); } while (pool.length>1 && i===lastMem);
  lastMem=i; return pool[i];
}
var toastItem=null, toastTimer=null;
function showToast(item){
  toastItem=item;
  var t=item.text.length>220 ? item.text.slice(0,217)+'…' : item.text;
  $('#toast-tx').textContent=t;
  $('#toast-ts').textContent=(item.kind==='note'?'Your note on ':'Your reflection on ')+item.src+' · '+fmtMonth(item.date);
  $('#toast').hidden=false;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer=setTimeout(hideToast, 14000);   // auto-fade; any interaction below re-arms or clears
}
function hideToast(){
  $('#toast').hidden=true;
  if (toastTimer){ clearTimeout(toastTimer); toastTimer=null; }
}
$('#toast').addEventListener('pointerenter', function(){ if (toastTimer){ clearTimeout(toastTimer); toastTimer=null; } });
$('#toast-x').addEventListener('click', hideToast);
$('#toast-again').addEventListener('click', function(){ showToast(randomMemory()); });
$('#toast-open').addEventListener('click', function(){
  var it=toastItem; hideToast();
  if (it && it.workId) showDetail(it.workId); else showReflect();
});
if (window.self===window.top){
  setTimeout(function(){
    if ($('#overlay').hidden && $('#menu').hidden) showToast(randomMemory());
  }, 6500);
}

export { openPanel, closePanel, showDetail, showArt, showGraph, showFountain,
  showTranscript, showWriting, showTrophies, showPlinth, showStatue, showFlash,
  showRecall, showReflect, showSRS, showPlan, OPENERS, buildMenu, toggleMenu,
  closeMenu, showToast, hideToast, randomMemory };
