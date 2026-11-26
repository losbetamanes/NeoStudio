const NEO={
$:id=>document.getElementById(id),
get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
el(t,c,x){const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e},
esc:s=>String(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])),
shell(t,s){document.title=t;const m=document.createElement("main");m.innerHTML='<a class="back" href="../index.html">← Volver al inicio</a><h1><span>'+s+'</span>'+t+'</h1>';document.body.append(m);return m},
save(n,txt){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt]));a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)},
print(h){const w=window.open("");w.document.write(h);w.document.close();w.print()},
db(name){const o=indexedDB.open(name,1);o.onupgradeneeded=()=>o.result.createObjectStore("s",{keyPath:"id"});
 const p=new Promise((r,j)=>{o.onsuccess=()=>r(o.result);o.onerror=()=>j(o.error)});
 const tx=(m,f)=>p.then(d=>new Promise((r,j)=>{const t=d.transaction("s",m),q=f(t.objectStore("s"));t.oncomplete=()=>r(q&&q.result);t.onerror=()=>j(t.error)}));
 return{put:v=>tx("readwrite",s=>s.put(v)),all:()=>tx("readonly",s=>s.getAll()),del:id=>tx("readwrite",s=>s.delete(id))}},
app(c){
 const {el,get,set}=NEO,root=NEO.shell(c.title,c.sub);
 let L=get(c.key,[]),ed=null,arm=null;const sv=()=>set(c.key,L);
 if(c.before)c.before(root);
 const bar=el("div","row"),qi=el("input"),fs=el("select"),add=el("button","p","+ Nuevo");
 qi.placeholder="Buscar...";bar.append(qi);
 if(c.filter){fs.append(new Option("Todos",""));c.fields.find(x=>x.k===c.filter).o.forEach(o=>fs.append(new Option(o,o)));bar.append(fs)}
 bar.append(add);
 const form=el("div","card hide"),list=el("div"),inp={};
 c.fields.forEach(x=>{const lb=el("label","",x.l),i=x.o?el("select"):x.ta?el("textarea"):el("input");
  if(x.o)x.o.forEach(o=>i.append(new Option(o,o)));if(x.t)i.type=x.t;i.placeholder=x.p||"";inp[x.k]=i;lb.append(i);form.append(lb)});
 const sb=el("button","p w","Guardar"),cb=el("button","w","Cancelar");form.append(sb,cb);
 function draw(){
  list.textContent="";const t=qi.value.toLowerCase(),ff=fs.value;
  const r=L.filter(x=>(!ff||x[c.filter]===ff)&&JSON.stringify(x).toLowerCase().includes(t));
  if(!r.length)list.append(el("div","empty","Nada por aquí todavía. Toca + Nuevo."));
  r.forEach(x=>{const d=el("div","card");d.append(el("div","name",x[c.head]||"(sin título)"),el("div","meta",c.line?c.line(x):""));
   const a=el("div","row");
   (c.actions||[]).forEach(z=>{const b=el("button","",z.l);b.onclick=()=>z.fn(x);a.append(b)});
   const e=el("button","","Editar"),del=el("button","del",arm===x.id?"¿Seguro?":"Borrar");
   e.onclick=()=>show(x);del.onclick=()=>{if(arm===x.id){L=L.filter(y=>y.id!==x.id);arm=null;sv()}else arm=x.id;draw()};
   a.append(e,del);d.append(a);list.append(d)})}
 function show(x){ed=x||null;c.fields.forEach(f=>inp[f.k].value=x?x[f.k]||"":(f.o?f.o[0]:""));form.className="card";scrollTo(0,0)}
 add.onclick=()=>show();cb.onclick=()=>form.className="card hide";qi.oninput=fs.onchange=draw;
 sb.onclick=()=>{const o={};c.fields.forEach(f=>o[f.k]=inp[f.k].value.trim());if(!o[c.head]){inp[c.head].focus();return}
  if(ed)Object.assign(ed,o);else L.unshift(Object.assign({id:Date.now()},o));sv();form.className="card hide";draw()};
 const bk=el("div","row"),dl=el("button","","Descargar copia"),ld=el("button","","Cargar copia"),fi=el("input");fi.type="file";fi.hidden=true;
 dl.onclick=()=>NEO.save(c.key+".json",JSON.stringify(L));ld.onclick=()=>fi.click();
 fi.onchange=()=>{const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d))throw 0;L=d.concat(L.filter(y=>!d.some(z=>z.id===y.id)));sv();draw()}catch(e){alert("La copia no es válida")}};r.readAsText(fi.files[0]);fi.value=""};
 bk.append(dl,ld,fi);root.append(bar,form,list,bk);draw();
}};
