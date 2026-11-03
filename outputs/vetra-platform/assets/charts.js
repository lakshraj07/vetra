/* Vetra charts — every figure drawn from data as inline SVG, themed by CSS variables. */
window.VCharts=(function(){
 const F="'IBM Plex Sans',system-ui,sans-serif", M="'IBM Plex Mono',ui-monospace,Menlo,monospace", D="'Newsreader',Georgia,serif";
 const e=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const t=(x,y,s,o={})=>`<text x="${x}" y="${y}" font-family="${o.f||F}" font-size="${(o.s||11)*1.15}" fill="${o.c||'var(--ink-2)'}" text-anchor="${o.a||'start'}" ${o.w?`font-weight="${o.w}"`:''} ${o.dy?`dy="${o.dy}"`:''}>${e(s)}</text>`;
 const wrap=(W,H,inner,label)=>`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${e(label||'')}" style="display:block;font-family:${F}">${inner}</svg>`;
 const anim=(i)=>`style="animation:vc-in .5s ${(i*60)}ms both"`;

 /* 1 · Human survival flat since 1980 — timeline of three registry analyses */
 function humanFlat(){
  const W=640,H=250,L=190,R=600,y0=58,row=44;const x=v=>L+(v-1975)/(2017-1975)*(R-L);
  const rows=[{n:'Allison 2012',s:'review of published series',a:1980,b:2012},{n:'Mirabello 2009 · SEER',s:'3,482 cases',a:1984,b:2004},{n:'Cole 2022 · SEER',s:'5,016 cases',a:1975,b:2017}];
  let o='';
  [1975,1985,1995,2005,2015].forEach(v=>{o+=`<line x1="${x(v)}" x2="${x(v)}" y1="${y0-14}" y2="${y0+row*3-8}" stroke="var(--line)" />`+t(x(v),y0+row*3+10,v,{f:M,s:10,c:'var(--muted)',a:'middle'})});
  rows.forEach((r,i)=>{const y=y0+i*row;
   o+=`<g ${anim(i)}>`+t(L-14,y+4,r.n,{a:'end',s:12,c:'var(--ink)',w:500})+t(L-14,y+19,r.s,{a:'end',s:10,c:'var(--muted)',f:M});
   o+=`<rect x="${x(r.a)}" y="${y-9}" width="${x(r.b)-x(r.a)}" height="20" rx="2" fill="var(--fap)" opacity=".85"/>`+t((x(r.a)+x(r.b))/2,y+5,`${r.a}–${r.b}`,{a:'middle',s:10,f:M,c:'var(--paper)',w:500})+'</g>'});
  o+=t(L,y0+row*3+40,'Five-year survival: flat across every window',{s:12,c:'var(--fap)',w:500});
  o+=t(L,y0+row*3+58,'Exception, ages 0–9: 71.8% → 80.4% in the latest decade',{s:10.5,c:'var(--muted)'});
  return wrap(W,H,o,'Human osteosarcoma five-year survival has not improved since 1980');
 }
 /* 2 · Dog median survival by treatment */
 function dogSurvival(){
  const W=640,H=270,L=250,R=590,y0=34,row=34;const x=v=>L+v/16*(R-L);
  const rows=[{n:'Limb-sparing surgery + chemo',s:'n = 20',v:14.1,adj:1},{n:'Amputation + carboplatin ×4',s:'n = 48',v:10.5,adj:1},{n:'Amputation + carboplatin / doxorubicin',s:'n = 470',v:9.3,adj:1},{n:'Amputation + doxorubicin ×5',s:'n = 303 + 124',v:8.1,lo:7.9,hi:8.3,adj:1},{n:'Limb-sparing radiation (SBRT)',s:'n = 123',v:7.7,adj:1},{n:'Amputation alone',s:'n = 162',v:4.4,adj:0}];
  let o='';
  [0,4,8,12,16].forEach(v=>{o+=`<line x1="${x(v)}" x2="${x(v)}" y1="${y0-10}" y2="${y0+row*6-10}" stroke="var(--line)"/>`+t(x(v),y0+row*6+6,v,{f:M,s:10,c:'var(--muted)',a:'middle'})});
  o+=`<rect x="${x(4)}" y="${y0-12}" width="${x(14.1)-x(4)}" height="${row*6-6}" fill="var(--dog)" opacity=".07"/>`;
  rows.forEach((r,i)=>{const y=y0+i*row;const c=r.adj?'var(--dog)':'var(--muted)';
   o+=`<g ${anim(i)}>`+t(L-14,y+4,r.n,{a:'end',s:11.5,c:'var(--ink)'})+t(L-14,y+18,r.s,{a:'end',s:10,c:'var(--muted)',f:M});
   o+=`<line x1="${x(0)}" x2="${x(r.v)}" y1="${y}" y2="${y}" stroke="${c}" stroke-width="2" opacity=".55"/>`;
   if(r.lo)o+=`<line x1="${x(r.lo)}" x2="${x(r.hi)}" y1="${y}" y2="${y}" stroke="${c}" stroke-width="6" opacity=".6"/>`;
   o+=`<circle cx="${x(r.v)}" cy="${y}" r="6" fill="${c}"/>`+t(x(r.v)+12,y+4,r.lo?`${r.lo}–${r.hi}`:r.v,{f:M,s:11,c:'var(--ink)'})+'</g>'});
  o+=t(L,y0+row*6+28,'Median survival (months) · every standard of care lands in a 4–14 month band',{s:10.5,c:'var(--muted)'});
  return wrap(W,H,o,'Dog median survival by treatment, 4 to 14 months');
 }
 /* 3 · FAP in dog cells — detection by cell type, share of signal */
 function fapCells(){
  const W=640,H=250,L=150,R=400,y0=40,row=40;const x=v=>L+v/100*(R-L);
  const rows=[{n:'Fibroblasts',s:'n = 769',v:77.8,sh:12.8},{n:'Tumour cells',s:'n = 11,987',v:41.5,sh:78.3,hi:1},{n:'Blood-vessel cells',s:'n = 732',v:5.3,sh:1.0},{n:'Immune / other',s:'n = 19,125',v:2.2,sh:8.0}];
  let o=t(L,22,'Cells with a detected FAP transcript',{s:11,c:'var(--muted)',f:M})+t(440,22,'Share of all FAP signal',{s:11,c:'var(--muted)',f:M});
  [0,25,50,75,100].forEach(v=>o+=`<line x1="${x(v)}" x2="${x(v)}" y1="${y0-8}" y2="${y0+row*4-12}" stroke="var(--line)"/>`+t(x(v),y0+row*4+4,v+(v===100?'%':''),{f:M,s:10,c:'var(--muted)',a:'middle'}));
  rows.forEach((r,i)=>{const y=y0+i*row;const c=r.hi?'var(--fap)':'var(--line-2)';
   o+=`<g ${anim(i)}>`+t(L-12,y+4,r.n,{a:'end',s:11.5,c:r.hi?'var(--ink)':'var(--ink-2)',w:r.hi?500:400})+t(L-12,y+18,r.s,{a:'end',s:10,c:'var(--muted)',f:M});
   o+=`<rect x="${x(0)}" y="${y-9}" width="${x(r.v)-x(0)}" height="18" rx="2" fill="${c}"/>`+t(x(r.v)+8,y+4,r.v+'%',{f:M,s:11,c:r.hi?'var(--fap)':'var(--ink-2)'})+'</g>'});
  // stacked share bar
  const bx=440,bw=170,by=y0-8,bh=row*4-6;let acc=0;
  rows.slice().sort((a,b)=>b.sh-a.sh).forEach((r,i)=>{const h=r.sh/100*bh;const c=r.hi?'var(--fap)':['var(--line-2)','var(--line)','var(--paper-2)'][i-1]||'var(--line)';
   o+=`<rect x="${bx}" y="${by+acc}" width="${bw}" height="${h}" fill="${c}" stroke="var(--paper)" stroke-width="1"/>`;
   if(h>14)o+=t(bx+bw/2,by+acc+h/2+4,`${r.n.split(' ')[0]} ${r.sh}%`,{a:'middle',s:10.5,f:M,c:r.hi?'var(--paper)':'var(--ink-2)',w:r.hi?500:400});acc+=h});
  o+=t(bx,by+bh+22,'summed transcript counts',{s:10,c:'var(--muted)',f:M});
  return wrap(W,H,o,'FAP sits on the cancer cells themselves');
 }
 /* 4 · Every canine dataset finds FAP — dot + Wilson CI */
 function fiveDatasets(){
  const W=640,H=290,L=250,R=600,y0=38,row=32;const x=v=>L+v/100*(R-L);
  const rows=[{n:'Protein · antibody 1',k:'9/10',v:90,lo:59.6,hi:98.2},{n:'Protein · antibody 2',k:'7/10',v:70,lo:39.7,hi:89.2},{n:'Single-cell RNA, dogs',k:'6/6',v:100,lo:61,hi:100},{n:'Bulk RNA-seq, primaries (top quartile)',k:'162/190',v:85,lo:79.5,hi:89.6},{n:'Bulk RNA-seq, metastases',k:'8/8',v:100,lo:67.6,hi:100},{n:'Expression array, primaries',k:'32/33',v:97,lo:84.7,hi:99.5},{n:'Cell lines (no stroma)',k:'23/28',v:82,lo:64.4,hi:92.1}];
  let o='';
  [0,25,50,75,100].forEach(v=>o+=`<line x1="${x(v)}" x2="${x(v)}" y1="${y0-10}" y2="${y0+row*7-10}" stroke="var(--line)"/>`+t(x(v),y0+row*7+6,v+(v===100?'%':''),{f:M,s:10,c:'var(--muted)',a:'middle'}));
  rows.forEach((r,i)=>{const y=y0+i*row;
   o+=`<g ${anim(i)}>`+t(L-14,y+4,r.n,{a:'end',s:11.5,c:'var(--ink)'});
   o+=`<line x1="${x(r.lo)}" x2="${x(r.hi)}" y1="${y}" y2="${y}" stroke="var(--fap)" stroke-width="2" opacity=".7"/><line x1="${x(r.lo)}" x2="${x(r.lo)}" y1="${y-5}" y2="${y+5}" stroke="var(--fap)" stroke-width="2"/><line x1="${x(r.hi)}" x2="${x(r.hi)}" y1="${y-5}" y2="${y+5}" stroke="var(--fap)" stroke-width="2"/>`;
   o+=`<circle cx="${x(r.v)}" cy="${y}" r="5.5" fill="var(--fap)" stroke="var(--paper)" stroke-width="1.5"/>`+t(R+6,y+4,r.k,{f:M,s:10,c:'var(--muted)'})+'</g>'});
  o+=t(L,y0+row*7+28,'FAP-positive tumours · 95% Wilson CI · 7 datasets, 3 technologies',{s:10.5,c:'var(--muted)'});
  return wrap(W,H,o,'Every canine dataset finds FAP in most tumours');
 }
 /* 5 · Relapse-free survival by FAP — schematic KM from the risk table, measured HR */
 function relapseKM(){
  const W=640,H=290,L=56,R=370,T=30,B=200;const x=m=>L+m/30*(R-L),y=p=>B-p/100*(B-T);
  const lo=[93,42,24,17,8,5],hi=[93,36,17,7,6,5];
  function steps(arr){let pts=[],prev=100;for(let i=0;i<arr.length-1;i++){const a=arr[i]/93*100,b=arr[i+1]/93*100;const n=7;for(let k=0;k<n;k++){const m=i*6+k*6/n;const p=a+(b-a)*(1-Math.pow(1-k/n,1.6));pts.push([x(m),y(Math.min(prev,p))]);prev=Math.min(prev,p)}}pts.push([x(30),y(arr[5]/93*100)]);let d=`M${x(0)} ${y(100)}`;let ly=y(100);pts.forEach(([px,py])=>{d+=` H${px} V${py}`;ly=py});return d}
  let o='';
  [0,25,50,75,100].forEach(p=>o+=`<line x1="${L}" x2="${R}" y1="${y(p)}" y2="${y(p)}" stroke="var(--line)"/>`+t(L-8,y(p)+4,p+(p===100?'%':''),{f:M,s:10,c:'var(--muted)',a:'end'}));
  [0,6,12,18,24,30].forEach(m=>o+=t(x(m),B+16,m,{f:M,s:10,c:'var(--muted)',a:'middle'}));
  o+=`<path d="${steps(lo)}" fill="none" stroke="var(--fap)" stroke-width="2.2" style="stroke-dasharray:1200;stroke-dashoffset:1200;animation:vc-draw 1.6s .2s forwards"/>`;
  o+=`<path d="${steps(hi)}" fill="none" stroke="var(--kill)" stroke-width="2.2" style="stroke-dasharray:1200;stroke-dashoffset:1200;animation:vc-draw 1.6s .5s forwards"/>`;
  o+=t(x(14),y(60),'Low FAP',{s:11,c:'var(--fap)',w:500})+t(x(9),y(22),'High FAP',{s:11,c:'var(--kill)',w:500});
  o+=t(L,T-12,'Relapse-free survival · schematic from the risk table',{s:10.5,c:'var(--muted)',f:M});
  // risk table
  o+=t(L-8,B+40,'at risk',{f:M,s:9.5,c:'var(--muted)',a:'end'});
  lo.forEach((v,i)=>o+=t(x(i*6),B+40,v,{f:M,s:10,c:'var(--fap)',a:'middle'}));hi.forEach((v,i)=>o+=t(x(i*6),B+54,v,{f:M,s:10,c:'var(--kill)',a:'middle'}));
  o+=t(L-8,B+54,'',{});
  // HR panel
  const px=430;o+=`<rect x="${px}" y="${T-6}" width="200" height="${B-T+60}" rx="4" fill="var(--paper-2)" stroke="var(--line)"/>`;
  o+=t(px+14,T+16,'186 dogs · 143 relapses',{f:M,s:10,c:'var(--muted)'});
  o+=t(px+14,T+62,'1.44',{f:D,s:44,c:'var(--indet)'})+t(px+14,T+80,'hazard ratio, high vs low FAP',{s:10.5,c:'var(--ink-2)'});
  o+=t(px+14,T+120,'0.99 – 2.10',{f:D,s:26,c:'var(--ink)'})+t(px+14,T+136,'95% confidence interval',{s:10.5,c:'var(--ink-2)'});
  o+=t(px+14,T+176,'P = 0.057',{f:D,s:26,c:'var(--ink)'})+t(px+14,T+192,'Cox model, median split, adjusted',{s:10.5,c:'var(--ink-2)'});
  o+=t(px+14,T+226,'COTC021/022 · GSE238110 · Patkar',{f:M,s:9,c:'var(--muted)'});
  return wrap(W,H,o,'Dogs with higher FAP trend toward faster relapse, HR 1.44');
 }
 /* 6 · Comparative loop — vertical */
 function loop(){
  const W=640,H=330,cx=200,bw=260,bh=58;const n=[{y:20,l:'Human observation',s:'one patient, n = 1',c:'var(--human)'},{y:130,l:'Dog study',s:'patients, not models',c:'var(--dog)'},{y:240,l:'Human study',s:'selection and endpoints',c:'var(--human)'}];
  let o='<defs><marker id="vc-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="var(--line-2)"/></marker></defs>';
  n.forEach((k,i)=>{o+=`<g ${anim(i*2)}><rect x="${cx-bw/2}" y="${k.y}" width="${bw}" height="${bh}" rx="6" fill="var(--paper-2)" stroke="${k.c}" stroke-width="1.2"/>`+t(cx,k.y+25,k.l,{a:'middle',s:13,c:'var(--ink)',w:500})+t(cx,k.y+43,k.s,{a:'middle',s:10.5,c:'var(--muted)',f:M})+'</g>'});
  o+=`<line x1="${cx}" y1="${20+bh}" x2="${cx}" y2="${130-4}" stroke="var(--line-2)" stroke-width="1.4" marker-end="url(#vc-ah)"/>`+t(cx+150,110,'same disease, same target',{s:10.5,c:'var(--muted)',f:M});
  o+=`<line x1="${cx}" y1="${130+bh}" x2="${cx}" y2="${240-4}" stroke="var(--line-2)" stroke-width="1.4" marker-end="url(#vc-ah)"/>`+t(cx+150,220,'who to select, what to measure,',{s:10.5,c:'var(--muted)',f:M})+t(cx+150,236,'why delivery works',{s:10.5,c:'var(--muted)',f:M});
  o+=`<path d="M${cx-bw/2} ${240+bh/2} H40 V${20+bh/2} H${cx-bw/2-4}" fill="none" stroke="var(--line-2)" stroke-width="1.4" stroke-dasharray="4 4" marker-end="url(#vc-ah)"/>`;
  o+=t(cx+150,40,'spontaneous tumour',{s:10.5,c:'var(--dog)',f:M})+t(cx+150,56,'shared home',{s:10.5,c:'var(--dog)',f:M})+t(cx+150,72,'relapse in months, not years',{s:10.5,c:'var(--dog)',f:M});
  o+=t(cx,318,'the dog result feeds the next human observation',{a:'middle',s:10,c:'var(--muted)',f:M});
  return wrap(W,H,o,'Human observation to dog study to human study, and back');
 }
 /* 7 · IC50 pass band (log scale) */
 function icBand(dog){
  const W=640,H=150,L=40,R=600,y=72;const lo=-1,hi=2.5;const x=v=>L+(Math.log10(v)-lo)/(hi-lo)*(R-L);
  let o=`<rect x="${x(.33)}" y="${y-22}" width="${x(33)-x(.33)}" height="44" rx="3" fill="var(--fap)" opacity=".16"/><rect x="${x(.33)}" y="${y-22}" width="${x(33)-x(.33)}" height="44" rx="3" fill="none" stroke="var(--fap)"/>`;
  o+=`<line x1="${L}" x2="${R}" y1="${y}" y2="${y}" stroke="var(--line-2)" stroke-width="2"/>`;
  [0.1,1,10,100].forEach(v=>o+=`<line x1="${x(v)}" x2="${x(v)}" y1="${y+24}" y2="${y+30}" stroke="var(--line-2)"/>`+t(x(v),y+44,v+' nM',{f:M,s:10,c:'var(--muted)',a:'middle'}));
  o+=t(x(.33),y-30,'0.33',{f:M,s:10,c:'var(--fap)',a:'middle'})+t(x(33),y-30,'33 nM',{f:M,s:10,c:'var(--fap)',a:'middle'})+t(x(3.3),y-30,'pass band · within 10× of human',{f:M,s:10,c:'var(--fap)',a:'middle'});
  o+=`<line x1="${x(3.3)}" x2="${x(3.3)}" y1="${y-22}" y2="${y+22}" stroke="var(--human)" stroke-width="2"/><circle cx="${x(3.3)}" cy="${y}" r="5" fill="var(--human)"/>`+t(x(3.3)-8,y+62,'human 3.3',{f:M,s:10.5,c:'var(--human)',a:'end'});
  o+=`<circle cx="${x(3.2)}" cy="${y}" r="4" fill="var(--muted)"/>`+t(x(3.2)-8,y+76,'mouse 3.2',{f:M,s:10.5,c:'var(--muted)',a:'end'});
  if(dog&&dog>0){const v=Math.min(Math.max(dog,0.1),316),ok=dog>=.33&&dog<=33,c=ok?'var(--fap)':'var(--kill)';o+=`<line x1="${x(v)}" x2="${x(v)}" y1="${y-26}" y2="${y+22}" stroke="${c}" stroke-width="2" stroke-dasharray="4 3"/><circle cx="${x(v)}" cy="${y}" r="6.5" fill="${c}"/>`+t(x(v)+10,y+62,`dog ${dog} nM · ${ok?'pass':'fail'}`,{f:M,s:10.5,c:c})}
  else o+=t(x(3.3)+10,y+62,'dog · in the wet lab now',{f:M,s:10.5,c:'var(--dog)'});
  return wrap(W,H,o,'IC50 pass band on a log scale');
 }
 return {humanFlat,dogSurvival,fapCells,fiveDatasets,relapseKM,loop,icBand};
})();
