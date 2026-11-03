window.mountUMAP=function(mount,url){
 mount.innerHTML=`<div class="umwrap">
   <div class="umhead">
     <button class="btn" id="umFap">Zoom to FAP⁺ cells</button>
     <button class="btn" id="umIn">+</button><button class="btn" id="umOut">−</button>
     <button class="btn" id="umReset">Reset</button>
     <span class="umcap" style="margin:0">drag to pan · wheel to zoom</span>
   </div>
   <div class="umpanels">
     <div class="umpanel"><h3 class="umcap">Cell types</h3><div class="umstage" id="umS0"><canvas id="umC0"></canvas></div></div>
     <div class="umpanel"><h3 class="umcap">FAP detected</h3><div class="umstage" id="umS1"><canvas id="umC1"></canvas></div></div>
   </div>
   <div class="umleg" id="umLeg"></div></div>`;
 let D=null,off=0;
 const view={k:1,x:0,y:0};
 const cv=[document.getElementById('umC0'),document.getElementById('umC1')];
 const hidden=new Set();
 function css(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
 function fit(c){const r=c.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;
   c.width=r.width*d;c.height=r.height*d;return {w:r.width,h:r.height,d}}
 function draw(){
  if(!D)return;
  const AR=D.render&&D.render.AR||2.245, YS=D.render&&D.render.YS||1.55;
  const names=Object.keys(D.colors);
  cv.forEach((c,panel)=>{
   const {w,h,d}=fit(c), ctx=c.getContext('2d');
   ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);
   const pad=10, sx=(w-pad*2)/AR, sy=(h-pad*2)/YS, s=Math.min(sx,sy)*view.k;
   const ox=pad+(w-pad*2-AR*s)/2+view.x, oy=pad+(h-pad*2-YS*s)/2+view.y;
   const notDet=css('--line-2')||'#4b4333', fapc=css('--fap')||'#4fcaa6';
   for(const p of D.pts){
    const ti=p[2];
    if(hidden.has(names[ti]))continue;
    const X=ox+p[0]*AR*s, Y=oy+(1-p[1])*YS*s;
    if(X<-5||Y<-5||X>w+5||Y>h+5)continue;
    ctx.fillStyle = panel===0 ? (D.colors[names[ti]]||'#888') : (p[3]?fapc:notDet);
    ctx.globalAlpha = panel===1&&!p[3] ? .5 : .9;
    ctx.beginPath();ctx.arc(X,Y,Math.max(.8,1.5*Math.sqrt(view.k)),0,6.283);ctx.fill();
   }
   ctx.globalAlpha=1;
   const r=D.render&&D.render.ring;
   if(r){ctx.strokeStyle=fapc;ctx.setLineDash([5,4]);ctx.lineWidth=1.3;
    ctx.beginPath();ctx.ellipse(ox+r.x*AR*s,oy+(1-r.y)*YS*s,r.rx*AR*s,r.ry*YS*s,0,0,6.283);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=fapc;ctx.font='10px ui-monospace,Menlo,monospace';
    ctx.fillText('FAP⁺ territory',ox+(r.x-r.rx)*AR*s,oy+(1-r.y-r.ry)*YS*s-6);}
  });
 }
 window.__umapRedraw=draw;
 function legend(){
  const L=document.getElementById('umLeg');L.innerHTML='';
  Object.entries(D.colors).forEach(([n,c])=>{
   const s=document.createElement('span');
   s.innerHTML=`<i style="background:${c}"></i>${n}`;
   s.onclick=()=>{hidden.has(n)?hidden.delete(n):hidden.add(n);s.classList.toggle('off');draw();};
   L.appendChild(s);});
  const t=document.createElement('span');t.style.cursor='default';
  t.innerHTML=`<i style="background:var(--fap)"></i>FAP transcript detected`;L.appendChild(t);
 }
 document.getElementById('umIn').onclick=()=>{view.k*=1.4;draw()};
 document.getElementById('umOut').onclick=()=>{view.k=Math.max(.4,view.k/1.4);draw()};
 document.getElementById('umReset').onclick=()=>{view.k=1;view.x=0;view.y=0;draw()};
 document.getElementById('umFap').onclick=()=>{
  const r=D.render&&D.render.ring;if(!r)return;
  const c=cv[0],rect=c.parentElement.getBoundingClientRect();
  view.k=3.1;
  const AR=D.render.AR,YS=D.render.YS,pad=10;
  const s=Math.min((rect.width-20)/AR,(rect.height-20)/YS)*view.k;
  view.x=rect.width/2-(pad+r.x*AR*s)-(rect.width-20-AR*s)/2;
  view.y=rect.height/2-(pad+(1-r.y)*YS*s)-(rect.height-20-YS*s)/2;
  draw();};
 cv.forEach(c=>{
  let drag=false,px=0,py=0;
  const st=c.parentElement;
  st.addEventListener('pointerdown',e=>{drag=true;px=e.clientX;py=e.clientY;st.setPointerCapture(e.pointerId)});
  st.addEventListener('pointermove',e=>{if(!drag)return;view.x+=e.clientX-px;view.y+=e.clientY-py;px=e.clientX;py=e.clientY;draw()});
  st.addEventListener('pointerup',e=>{drag=false});
  st.addEventListener('wheel',e=>{e.preventDefault();view.k=Math.max(.4,Math.min(14,view.k*(e.deltaY<0?1.12:1/1.12)));draw()},{passive:false});
 });
 addEventListener('resize',draw);
 fetch(url).then(r=>r.json()).then(j=>{D=j;legend();draw();
   new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)draw()}),{threshold:.1}).observe(mount);})
  .catch(()=>{mount.innerHTML='<div class="umwrap">UMAP data could not be loaded.</div>'});
};
