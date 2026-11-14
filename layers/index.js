import {datasets,itemById} from '../data.js';
const KEY='knowledge-lab-layers-v01';
const defaults={theme:'materials',colors:{bg:'#f0efe9',text:'#25272a',muted:'#555b60',a:'#187f97',b:'#c04a32',c:'#7750a4'},radius:28,opacity:73,blend:'multiply',overlap:42,shadow:22,space:18,scale:1,liked:[],comparison:{materials:[],inventions:[]}};
let stored={};try{stored=JSON.parse(localStorage.getItem(KEY))||{}}catch{}
if(!stored.paletteV05){for(const [key,oldValue,newValue] of [['a','#65c1cd','#187f97'],['b','#ef9b82','#c04a32'],['c','#b5a0d3','#7750a4']])if(!stored.colors?.[key]||stored.colors[key]===oldValue)(stored.colors??={})[key]=newValue;stored.paletteV05=true;}
const state={...defaults,...stored,colors:{...defaults.colors,...stored.colors},comparison:{materials:[],inventions:[],...stored.comparison},screen:'home',detail:null,previous:'home',query:'',category:'すべて',chooser:false};
const app=document.querySelector('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const items=()=>datasets[state.theme].items;
const save=()=>{const {screen,detail,previous,query,category,chooser,...persist}=state;try{localStorage.setItem(KEY,JSON.stringify(persist))}catch{}};
// The selected HEX is the exact source color; alpha is an independent property.
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
function apply(){const c=state.colors,el=document.documentElement;el.dataset.blend=state.blend;for(const [k,v] of Object.entries(c))el.style.setProperty('--'+k,v);for(const k of ['a','b','c'])el.style.setProperty('--paint-'+k,c[k]);for(const [k,v] of Object.entries({radius:state.radius+'px',alpha:state.opacity/100,'alpha-percent':state.opacity+'%',overlap:state.overlap+'px',shadow:state.shadow+'px',space:state.space+'px',scale:state.scale,blend:state.blend,'panel-text':state.blend==='multiply'?'#ffffff':'#161616'}))el.style.setProperty('--'+k,v);document.querySelector('meta[name="theme-color"]').content=c.bg;}
const switcher=()=>`<div class="switcher"><button data-theme="materials" class="${state.theme==='materials'?'active':''}">MATERIALS</button><button data-theme="inventions" class="${state.theme==='inventions'?'active':''}">INVENTIONS</button></div>`;
const heading=(tag,title,sub)=>`<div class="pageheading"><span class="eyebrow">${tag}</span><h1>${title}</h1><p>${sub}</p></div>`;
const card=(x,i)=>`<button class="entry" data-detail="${x.id}" aria-label="${esc(x.title)}の詳細"><span class="entrynum">${String(i+1).padStart(2,'0')} / ${esc(x.year)}</span><strong>${esc(x.title)}</strong><small>${esc(x.subtitle)}</small><span class="entryfoot">${esc(x.category)} <span>↗</span></span></button>`;
function home(){const xs=items();return `${switcher()}${heading('A STUDY IN OVERLAP','Knowledge,<br>in layers.',datasets[state.theme].intro)}<div class="composition" data-blend-canvas aria-label="重なり合う知識のカード"><div class="colorplane plane-a"></div><div class="colorplane plane-b"></div><div class="colorplane plane-c"></div><button class="compositionContent" data-detail="${xs[0].id}"><span>FEATURED KNOWLEDGE / 01</span><strong>${esc(xs[0].title)}</strong><small>${esc(xs[0].lead)}</small><span class="arrow">DISCOVER ↗</span></button></div><div class="sectionhead"><span>EXPLORE / ${state.theme.toUpperCase()}</span><span>${xs.length} ITEMS</span></div><div class="stack" data-blend-canvas>${xs.slice(1,5).map(card).join('')}</div><button class="more" data-nav="library">すべての項目を見る <span>↗</span></button>`}
function library(){const cats=['すべて',...new Set(items().map(x=>x.category))],xs=items().filter(x=>(state.category==='すべて'||state.category===x.category)&&[x.title,x.subtitle,x.body,...x.tags].join(' ').toLowerCase().includes(state.query.toLowerCase()));return `${switcher()}${heading('AN OPEN COLLECTION','The index.','関係する知識を、重ねながらたどる。')}<input id="search" class="search" type="search" value="${esc(state.query)}" placeholder="キーワードで検索" aria-label="キーワードで検索"><div class="chips">${cats.map(c=>`<button class="chip ${state.category===c?'selected':''}" data-category="${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="sectionhead"><span>ENTRIES</span><span>${xs.length} RESULTS</span></div>${xs.length?`<div class="stack" data-blend-canvas>${xs.map(card).join('')}</div>`:'<p class="empty">該当する項目がありません。</p>'}`}
function detail(){const x=itemById[state.detail];if(!x)return home();return `<button class="back" data-nav="${state.previous}">← 戻る</button><div class="detailtop" data-blend-canvas><div class="detailcolor a"></div><div class="detailcolor b"></div><div class="detailcontent"><span class="eyebrow">${esc(x.category)} / ${esc(x.year)}</span><h1>${esc(x.title)}</h1><p>${esc(x.subtitle)}</p></div></div><div class="panel-stack" data-blend-canvas><section class="panel"><span class="eyebrow">01 / INSIGHT</span><h2>${esc(x.lead)}</h2><p>${esc(x.body)}</p></section><section class="panel panel-alt"><span class="eyebrow">02 / ATTRIBUTES</span><div class="facts">${x.facts.map(([a,b])=>`<div class="fact"><span>${esc(a)}</span><strong>${esc(b)}</strong></div>`).join('')}</div></section><section class="panel"><span class="eyebrow">03 / QUESTION</span><h2>${esc(x.question)}</h2></section></div><div class="actionrow"><button data-like="${x.id}">${state.liked.includes(x.id)?'保存済み ✓':'お気に入り ☆'}</button><button data-add="${x.id}">比較に追加 ⇄</button></div><div class="sectionhead"><span>CONNECTIONS</span></div><div class="relations">${x.relations.map(id=>itemById[id]).filter(Boolean).map(y=>`<button data-detail="${y.id}">${esc(y.title)} ↗</button>`).join('')}</div><p class="disclaimer">学習用の概説です。樹脂の物性・耐薬品性はグレードや条件で変わるため、実務の適合性判断には利用しないでください。</p>`}
function compare(){const selected=state.comparison[state.theme],xs=selected.map(id=>itemById[id]).filter(Boolean);return `${switcher()}${heading('EXPLORE SIMILARITIES','Compare.','2〜3項目を選んで特徴を比較する。')}<div class="sectionhead"><span>SELECT</span><span>${selected.length} / 3</span></div><div class="picks">${items().map(x=>`<button data-compare="${x.id}" class="pick ${selected.includes(x.id)?'on':''}" ${selected.length>=3&&!selected.includes(x.id)?'disabled':''}><span>${selected.includes(x.id)?'✓':'+'}</span><strong>${esc(x.title)}</strong><small>${esc(x.category)}</small></button>`).join('')}</div><div class="sectionhead"><span>COMPARISON</span></div>${xs.length<2?'<p class="empty">2件以上を選んでください。</p>':`<div class="compareScroll"><table><tr><th>項目</th>${xs.map(x=>`<th>${esc(x.title)}</th>`).join('')}</tr><tr><td>分類</td>${xs.map(x=>`<td>${esc(x.category)}</td>`).join('')}</tr><tr><td>概要</td>${xs.map(x=>`<td>${esc(x.lead)}</td>`).join('')}</tr>${[0,1,2].map(i=>`<tr><td>特徴 ${i+1}</td>${xs.map(x=>`<td>${esc(x.facts[i]?.[0]||'—')}<br><b>${esc(x.facts[i]?.[1]||'—')}</b></td>`).join('')}</tr>`).join('')}</table></div><p class="disclaimer">値の測定条件や属性名が異なる場合、単純比較はできません。</p>`}`}
function saved(){const xs=state.liked.map(id=>itemById[id]).filter(Boolean);return `${heading('PERSONAL COLLECTION','Saved.','気になった知識を再びたどる。')}${xs.length?`<div class="stack" data-blend-canvas>${xs.map(card).join('')}</div>`:'<p class="empty">保存された項目はありません。</p>'}`}
function settings(){const names={bg:'背景色',text:'文字色',muted:'補助文字色',a:'パネル A',b:'パネル B',c:'パネル C'};return `<button class="back" data-nav="${state.previous}">← 戻る</button>${heading('LAYERS / STUDIO','Color &<br>depth.','パネルの色と透明度、重なり方を設定します。')}<div class="settingsgroup"><h2>COLORS</h2><div class="colorgrid">${Object.entries(names).map(([k,n])=>`<label class="colorwell"><input aria-label="${n}" type="color" data-color="${k}" value="${state.colors[k]}"><span>${n}</span></label>`).join('')}</div></div><div class="settingsgroup"><h2>BLENDING</h2><div class="modes"><button data-blend="multiply" class="${state.blend==='multiply'?'active':''}">MULTIPLY / 乗算</button><button data-blend="screen" class="${state.blend==='screen'?'active':''}">SCREEN / スクリーン</button><button data-blend="normal" class="${state.blend==='normal'?'active':''}">NORMAL</button></div><div class="blend-demo" data-blend-canvas aria-label="混色プレビュー"><div class="demo-plane demo-a"></div><div class="demo-plane demo-b"></div><div class="demo-plane demo-c"></div><span>BLEND PREVIEW / ${state.blend.toUpperCase()}</span></div>${[['opacity','パネル不透明度',0,100,1,'%'],['radius','角R',0,60,1,'px'],['overlap','重なり量',5,90,1,'px'],['shadow','影の柔らかさ',0,55,1,'px'],['space','左右余白',12,35,1,'px'],['scale','文字倍率',.85,1.25,.05,'×']].map(([k,n,min,max,step,u])=>`<label class="range"><span>${n}<output id="out-${k}">${state[k]}${u}</output></span><input data-range="${k}" type="range" min="${min}" max="${max}" step="${step}" value="${state[k]}"></label>`).join('')}</div><div class="actionrow"><button data-reset="1">初期設定に戻す</button><button data-export="1">設定を書き出す</button></div><p class="disclaimer">設定はこの端末に自動保存され、他のUIには影響しません。選択色は補正せず使用します。SCREENは単独のパネル色を保ちながら、重なり部分だけ明るく合成する独自モードです。</p>`}
function chooser(){return `<div class="veil" data-close="1"><section class="sheet" role="dialog" aria-modal="true" aria-label="UI切り替え"><span class="eyebrow">INTERFACE COLLECTION</span><h2>Choose a UI.</h2><a href="../index.html">01 — EDITORIAL ↗</a><a href="../neo/index.html">02 — SOFT NEO ↗</a><div class="current">03 — LAYERS ✓</div><button data-close="1">閉じる</button></section></div>`}
function nav(){return `<nav class="nav" aria-label="メインナビゲーション">${[['home','HOME'],['library','INDEX'],['compare','COMPARE'],['saved','SAVED']].map(([k,n])=>`<button data-nav="${k}" class="${state.screen===k?'on':''}">${n}</button>`).join('')}</nav>`}
function render(){apply();app.innerHTML=`<header class="top"><button type="button" class="brand app-home" data-nav="home" aria-label="ホームに戻る">KNOWLEDGE <b>/ LAB</b></button><div><button aria-label="UI切替" data-chooser="1">◫</button><button aria-label="設定" data-settings="1">⚙</button></div></header><main>${state.screen==='library'?library():state.screen==='detail'?detail():state.screen==='compare'?compare():state.screen==='saved'?saved():state.screen==='settings'?settings():home()}</main>${nav()}${state.chooser?chooser():''}`;queueBlendPaint()}
function go(s){state.screen=s;state.query='';state.category='すべて';save();render();window.scrollTo(0,0)}
app.addEventListener('click',e=>{let x=e.target.closest('[data-nav],[data-theme],[data-detail],[data-category],[data-like],[data-add],[data-compare],[data-chooser],[data-close],[data-settings],[data-blend],[data-reset],[data-export]');if(!x)return;const a=x.dataset;if(a.nav){go(a.nav);return}if(a.theme){state.theme=a.theme;save();go('home');return}if(a.detail){if(state.screen!=='detail')state.previous=state.screen;state.detail=a.detail;go('detail');return}if(a.category){state.category=a.category;render();return}if(a.like){state.liked=state.liked.includes(a.like)?state.liked.filter(id=>id!==a.like):[...state.liked,a.like];save();render();return}if(a.add){const l=state.comparison[state.theme];if(!l.includes(a.add)&&l.length<3)l.push(a.add);save();go('compare');return}if(a.compare){const l=state.comparison[state.theme];state.comparison[state.theme]=l.includes(a.compare)?l.filter(id=>id!==a.compare):[...l,a.compare].slice(0,3);save();render();return}if(a.chooser){state.chooser=true;render();return}if(a.close){state.chooser=false;render();return}if(a.settings){if(state.screen!=='settings')state.previous=state.screen;go('settings');return}if(a.blend){state.blend=a.blend;save();render();return}if(a.reset){if(confirm('LAYERSの表示設定を初期化しますか？')){state.colors={...defaults.colors};for(const k of ['radius','opacity','blend','overlap','shadow','space','scale'])state[k]=defaults[k];save();render()}return}if(a.export){const blob=new Blob([JSON.stringify({version:1,layers:{colors:state.colors,radius:state.radius,opacity:state.opacity,blend:state.blend,overlap:state.overlap,shadow:state.shadow,space:state.space,scale:state.scale}},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='knowledge-lab-layers-settings.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1500)}});
app.addEventListener('input',e=>{const x=e.target;if(x.id==='search'){const p=x.selectionStart;state.query=x.value;render();const y=document.getElementById('search');y.focus();y.setSelectionRange(p,p);return}if(x.dataset.color){state.colors[x.dataset.color]=x.value;save();apply();queueBlendPaint();return}if(x.dataset.range){const k=x.dataset.range;state[k]=Number(x.value);document.getElementById('out-'+k).textContent=x.value+(['radius','overlap','shadow','space'].includes(k)?'px':['opacity'].includes(k)?'%':k==='scale'?'×':'');save();apply();queueBlendPaint()}});

let paintFrame=0;
function queueBlendPaint(){cancelAnimationFrame(paintFrame);if(state.blend==='screen')paintFrame=requestAnimationFrame(paintScreenCanvases)}
function paintScreenCanvases(){
 if(state.blend!=='screen')return;
 document.querySelectorAll('[data-blend-canvas]').forEach(stage=>{
  const defs=stage.classList.contains('composition')?['.plane-a','.plane-b','.plane-c']:
    stage.classList.contains('detailtop')?['.detailcolor.a','.detailcolor.b']:
    stage.classList.contains('blend-demo')?['.demo-a','.demo-b','.demo-c']:
    stage.classList.contains('panel-stack')?['.panel']:['.entry'];
  const elements=defs.flatMap(sel=>[...stage.querySelectorAll(sel)]);
  if(!elements.length)return;
  let canvas=stage.querySelector(':scope > canvas.screen-paint');
  if(!canvas){canvas=document.createElement('canvas');canvas.className='screen-paint';stage.insertBefore(canvas,stage.firstChild)}
  const bounds=stage.getBoundingClientRect(),scale=Math.min(2,window.devicePixelRatio||1);
  const W=Math.max(1,Math.round(bounds.width*scale)),H=Math.max(1,Math.round(bounds.height*scale));
  if(canvas.width!==W)canvas.width=W;if(canvas.height!==H)canvas.height=H;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.clearRect(0,0,W,H);
  const colors=[state.colors.a,state.colors.b,state.colors.c];
  const list=elements.map((element,i)=>{
   const b=element.getBoundingClientRect();let col;
   if(stage.classList.contains('panel-stack'))col=i===1?1:i===2?2:0;
   else if(stage.classList.contains('detailtop'))col=i;
   else col=i%3;
   const x=(b.left-bounds.left)*scale,y=(b.top-bounds.top)*scale,w=b.width*scale,h=b.height*scale;
   const radius=Math.min(state.radius*scale,w/2,h/2);
   return {x,y,w,h,radius,color:rgb(colors[col]),hex:colors[col]};
  });
  // Shadows remain separate from color mixing, preserving a slight raised surface.
  list.forEach(it=>{
   ctx.save();ctx.shadowColor=it.hex+'45';ctx.shadowBlur=state.shadow*scale*.75;
   ctx.shadowOffsetY=7*scale;ctx.fillStyle='rgba(255,255,255,0.005)';
   ctx.beginPath();ctx.roundRect(it.x,it.y,it.w,it.h,it.radius);ctx.fill();ctx.restore();
  });
  const pixels=new Uint8ClampedArray(W*H*4);
  const opacity=state.opacity/100;
  // The initial colored film is normal-composited on transparency.
  // Only where two colored films overlap is SCREEN (1-(1-a)(1-b)) applied.
  for(const it of list){
    const [sr,sg,sb]=it.color;
    const x0=Math.max(0,Math.floor(it.x)),x1=Math.min(W,Math.ceil(it.x+it.w));
    const y0=Math.max(0,Math.floor(it.y)),y1=Math.min(H,Math.ceil(it.y+it.h));
    const r=it.radius;
    for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
      let dx=Math.max(it.x+r-x,0,x-(it.x+it.w-r));
      let dy=Math.max(it.y+r-y,0,y-(it.y+it.h-r));
      if(dx*dx+dy*dy>r*r)continue;
      const idx=(y*W+x)*4,ba=pixels[idx+3]/255,oa=opacity+ba*(1-opacity);
      if(oa<=0)continue;
      for(let k=0;k<3;k++){
        const src=[sr,sg,sb][k]/255,back=pixels[idx+k]/255;
        const scr=1-(1-back)*(1-src);
        const out=opacity*(1-ba)*src+opacity*ba*scr+(1-opacity)*ba*back;
        pixels[idx+k]=Math.round((out/oa)*255);
      }
      pixels[idx+3]=Math.round(oa*255);
    }
  }
  const offscreen=document.createElement('canvas');offscreen.width=W;offscreen.height=H;
  offscreen.getContext('2d').putImageData(new ImageData(pixels,W,H),0,0);ctx.drawImage(offscreen,0,0);
 });
}
window.addEventListener('resize',queueBlendPaint);
render();
