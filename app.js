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
    const [ch, key, name, type, qss, cl] = s;
    if (ncc && type !== ncc) return false;
    if (filter==="qss" && !qss) return false;
    if (filter==="cleanse" && !cl) return false;
    if (filter==="none" && (qss || cl)) return false;
    if (!nq) return true;
    return norm(`${ch} ${key} ${name} ${type}`).includes(nq);
  });
  count.textContent = out.length + " sort(s)";
  list.innerHTML = out.map(s=>{
    const [ch,key,name,type,qss,cl,note] = s;
    return `<div class="card"><div><div class="t">${ch} ${key} — ${name}</div><div class="s">${note||""}</div><div class="cc">${type}</div></div><div class="badges"><span class="b ${qss?"y":"n"}">QSS ${qss?"✓":"✗"}</span><span class="b ${cl?"y":"n"}">Cleanse ${cl?"✓":"✗"}</span></div></div>`;
  }).join("") || "<p>Aucun résultat.</p>";
}
render();
