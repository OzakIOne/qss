const q = document.getElementById("q");
const cc = document.getElementById("cc");
const list = document.getElementById("list");
const count = document.getElementById("count");
let filter = "all";

for (const c of CC_LIST) {
  const o = document.createElement("option");
  o.value = c; o.textContent = c;
  cc.appendChild(o);
}
document.querySelectorAll(".btns button").forEach(b => b.onclick = () => {
  document.querySelectorAll(".btns button").forEach(x => x.classList.remove("on"));
  b.classList.add("on"); filter = b.dataset.f; render();
});
q.oninput = render; cc.onchange = render;

function norm(s){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}

function render(){
  const nq = norm(q.value.trim());
  const ncc = cc.value;
  const out = SPELLS.filter(s=>{
    const [ch, key, name, type, qss, cl, mik] = s;
    if (ncc && type !== ncc) return false;
    if (filter==="qss" && !qss) return false;
    if (filter==="cleanse" && !cl) return false;
    if (filter==="mikael" && !mik) return false;
    if (filter==="none" && (qss || cl || mik)) return false;
    if (!nq) return true;
    return norm(`${ch} ${key} ${name} ${type}`).includes(nq);
  });
  count.textContent = out.length + " sort(s)";
  list.innerHTML = out.map(s=>{
    const [ch,key,name,type,qss,cl,mik,note] = s;
    const showNote = note && norm(note).replace(/[.\s]+$/,"") !== norm(type);
    const sub = showNote ? `<div class="s">${note}</div>` : "";
    return `<div class="card"><div><div class="t">${ch} ${key} — ${name}</div>${sub}<div class="cc">${type}</div></div><div class="badges"><span class="b ${qss?"y":"n"}">QSS ${qss?"✓":"✗"}</span><span class="b ${cl?"y":"n"}">Cleanse ${cl?"✓":"✗"}</span><span class="b ${mik?"y":"n"}">Mikael ${mik?"✓":"✗"}</span></div></div>`;
  }).join("") || "<p>Aucun résultat.</p>";
}
render();

const rsp = document.getElementById("rep-spell");
const rlist = document.getElementById("rep-list");
const repLabel = s => `${s[0]} ${s[1]} — ${s[2]}`;
SPELLS.forEach(s=>{
  const o = document.createElement("option");
  o.value = repLabel(s);
  rlist.appendChild(o);
});
let repIdx = 0;
const tick = v => v ? "✓" : "✗";
function repFix(id, cur){
  const sel = document.getElementById(id);
  sel.innerHTML = "";
  const none = document.createElement("option");
  none.value = ""; none.textContent = "—";
  const opp = document.createElement("option");
  opp.value = cur ? "0" : "1";
  opp.textContent = cur ? "Devrait être ✗" : "Devrait être ✓";
  sel.append(none, opp);
}
function repCur(){
  const hit = SPELLS.findIndex(s=>repLabel(s)===rsp.value.trim());
  if (hit < 0) return;
  repIdx = hit;
  const [,,, ,qss,cl,mik] = SPELLS[repIdx];
  document.getElementById("cur-qss").textContent = tick(qss);
  document.getElementById("cur-cl").textContent = tick(cl);
  document.getElementById("cur-mik").textContent = tick(mik);
  repFix("rep-qss",qss); repFix("rep-cl",cl); repFix("rep-mik",mik);
}
rsp.value = repLabel(SPELLS[0]);
rsp.oninput = repCur; repCur();
document.getElementById("rep-go").onclick = ()=>{
  const [ch,key,name,type,qss,cl,mik] = SPELLS[repIdx];
  const want = (id,label)=>{ const v=document.getElementById(id).value; return v==="" ? null : `${label} devrait être ${v==="1"?"✓":"✗"}`; };
  const fixes = [want("rep-qss","QSS"),want("rep-cl","Cleanse"),want("rep-mik","Mikael")].filter(Boolean);
  const src = document.getElementById("rep-src").value.trim();
  const msg = document.getElementById("rep-msg").value.trim();
  const title = `[data] ${ch} ${key} — ${name}`;
  const body = `- Sort : ${ch} ${key} — ${name} (${type})\n- Actuel : QSS ${tick(qss)} / Cleanse ${tick(cl)} / Mikael ${tick(mik)}\n- Correction : ${fixes.join(", ")||"à préciser"}\n- Source : ${src||"à préciser"}\n- Détail : ${msg||"—"}`;
  open(`https://github.com/OzakIOne/qss/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`,"_blank");
};
