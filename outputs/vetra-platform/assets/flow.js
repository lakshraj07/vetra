/* Editable staged-flow widget. mountFlow(el, spec) -> renders; text is click-to-edit. */
window.mountFlow=function(host,spec){
 const S=JSON.parse(JSON.stringify(spec));
 host.innerHTML=`<div class="fw">
   <div class="fw-bar">
     <button class="btn" data-fw="edit">Edit text</button>
     <button class="btn" data-fw="step">Step through</button>
     <button class="btn" data-fw="reset">Reset</button>
     <button class="btn" data-fw="copy">Copy JSON</button>
   </div>
   <div class="fw-canvas">
     <svg class="fw-wires" aria-hidden="true"></svg>
     <div class="fw-stages"></div>
     <div class="fw-fb"></div>
     <div class="fw-outs"></div>
   </div></div>`;
 const q=s=>host.querySelector(s);
 const stagesEl=q('.fw-stages'), outsEl=q('.fw-outs'), fbEl=q('.fw-fb'), wires=q('.fw-wires');
 let editing=false, active=-1, timer=null;

 function ed(tag,cls,txt,path){
  const e=document.createElement(tag); e.className=cls; e.textContent=txt;
  e.dataset.path=path; return e;
 }
 function render(){
  stagesEl.innerHTML=''; outsEl.innerHTML='';
  S.stages.forEach((st,i)=>{
   const c=document.createElement('div'); c.className='fw-card'; c.dataset.i=i;
   const hd=document.createElement('div'); hd.className='fw-hd';
   hd.appendChild(ed('span','fw-n',st.n,`stages.${i}.n`));
   hd.appendChild(ed('span','fw-t',st.title,`stages.${i}.title`));
   c.appendChild(hd);
   st.lines.forEach((l,j)=>c.appendChild(ed('div','fw-l',l,`stages.${i}.lines.${j}`)));
   const g=document.createElement('div'); g.className='fw-gate';
   g.appendChild(document.createTextNode('Gate: '));
   g.appendChild(ed('span','fw-gt',st.gate,`stages.${i}.gate`));
   c.appendChild(g);
   c.onclick=e=>{ if(editing) return; setActive(i); };
   stagesEl.appendChild(c);
  });
  S.outputs.forEach((o,i)=>{
   const c=document.createElement('div'); c.className='fw-out';
   c.appendChild(ed('div','fw-ot',o.title,`outputs.${i}.title`));
   c.appendChild(ed('div','fw-os',o.sub,`outputs.${i}.sub`));
   outsEl.appendChild(c);
  });
  fbEl.innerHTML=''; fbEl.appendChild(ed('span','fw-fbl',S.feedback.label,'feedback.label'));
  applyEdit(); requestAnimationFrame(wire);
 }
 function applyEdit(){
  host.querySelectorAll('[data-path]').forEach(e=>{
   e.contentEditable=editing?'true':'false';
   e.classList.toggle('fw-editing',editing);
   e.oninput=()=>{ const p=e.dataset.path.split('.'); let o=S;
     for(let k=0;k<p.length-1;k++) o=o[p[k]];
     o[p[p.length-1]]=e.textContent; };
  });
 }
 function setActive(i){
  active=i;
  host.querySelectorAll('.fw-card').forEach((c,j)=>c.classList.toggle('on',j===i));
  wire();
 }
 function wire(){
  const box=q('.fw-canvas').getBoundingClientRect();
  const cards=[...host.querySelectorAll('.fw-card')].map(c=>c.getBoundingClientRect());
  const outs=[...host.querySelectorAll('.fw-out')].map(c=>c.getBoundingClientRect());
  if(!cards.length) return;
  wires.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
  wires.setAttribute('width',box.width); wires.setAttribute('height',box.height);
  const R=r=>({x:r.left-box.left,y:r.top-box.top,w:r.width,h:r.height});
  let d='';
  const head=(x,y,dir)=>`<polygon points="${x},${y} ${x-7*dir},${y-4.5} ${x-7*dir},${y+4.5}" class="fw-ah"/>`;
  let marks='';
  for(let i=0;i<cards.length-1;i++){
   const a=R(cards[i]), b=R(cards[i+1]);
   const y=a.y+a.h/2;
   d+=`M${a.x+a.w+2} ${y} L${b.x-9} ${y} `;
   marks+=head(b.x-2,y,1);
  }
  // feedback: from stage 3 bottom back to stage 1 bottom
  const fi=Math.min(S.feedback.from-1,cards.length-1), ti=Math.max(S.feedback.to-1,0);
  const f=R(cards[fi]), t=R(cards[ti]);
  const fbY=f.y+f.h+34;
  d+=`M${f.x+f.w/2} ${f.y+f.h} L${f.x+f.w/2} ${fbY} L${t.x+t.w/2} ${fbY} L${t.x+t.w/2} ${t.y+t.h+9} `;
  marks+=`<polygon points="${t.x+t.w/2},${t.y+t.h+2} ${t.x+t.w/2-4.5},${t.y+t.h+9} ${t.x+t.w/2+4.5},${t.y+t.h+9}" class="fw-ah"/>`;
  // outputs: from last stage bottom down to a bus, then to each output
  if(outs.length){
   const last=R(cards[cards.length-1]);
   const busY=R(outs[0]).y-26;
   d+=`M${last.x+last.w/2} ${last.y+last.h} L${last.x+last.w/2} ${busY} `;
   const xs=outs.map(o=>R(o).x+R(o).w/2);
   d+=`M${Math.min(...xs)} ${busY} L${Math.max(...xs,last.x+last.w/2)} ${busY} `;
   xs.forEach(x=>{ const o=R(outs[xs.indexOf(x)]);
     d+=`M${x} ${busY} L${x} ${o.y-9} `;
     marks+=`<polygon points="${x},${o.y-2} ${x-4.5},${o.y-9} ${x+4.5},${o.y-9}" class="fw-ah"/>`;});
  }
  wires.innerHTML=`<path d="${d}" class="fw-wire"/>${marks}`;
 }
 q('[data-fw="edit"]').onclick=e=>{editing=!editing;e.target.classList.toggle('on',editing);
   e.target.textContent=editing?'Done':'Edit text';applyEdit();};
 q('[data-fw="step"]').onclick=e=>{clearInterval(timer);let i=0;setActive(0);
   timer=setInterval(()=>{i++;if(i>=S.stages.length){clearInterval(timer);return;}setActive(i);},1100);};
 q('[data-fw="reset"]').onclick=()=>{clearInterval(timer);setActive(-1);};
 q('[data-fw="copy"]').onclick=async e=>{try{await navigator.clipboard.writeText(JSON.stringify(S,null,1));
   e.target.textContent='Copied';setTimeout(()=>e.target.textContent='Copy JSON',1400);}catch(_){}};
 addEventListener('resize',wire);
 render();
 return {spec:S,redraw:wire};
};
