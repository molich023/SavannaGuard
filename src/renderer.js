const $ = id => document.getElementById(id);
const view = $("view"), home = $("home"), browser = $("browser");

const feeds = {
  africa: [
    ["https://www.aljazeera.com/xml/rss/all.xml","Al Jazeera"],
    ["https://www.theafricareport.com/feed/","The Africa Report"],
    ["https://www.africanews.com/feed/","Africanews"]
  ],
  world: [
    ["https://feeds.bbci.co.uk/news/world/rss.xml","BBC World"],
    ["https://rss.dw.com/rdf/rss-en-world","DW World"]
  ]
};

function searchURL(q){
  const custom = localStorage.getItem("searchEndpoint");
  if(custom) return custom + encodeURIComponent(q);
  // No Google dependency. DuckDuckGo HTML is used only as an out-of-box public fallback.
  // For maximum privacy, configure a self-hosted SearXNG endpoint in Settings.
  return "https://html.duckduckgo.com/html/?q=" + encodeURIComponent(q);
}

function navigate(input){
  let s = input.trim();
  if(!s) return;
  if(!/^https?:\/\//i.test(s) && !s.includes(" ")) s = "https://" + s;
  const url = s.includes(" ") ? searchURL(s) : s;
  home.classList.add("hidden"); browser.classList.remove("hidden");
  view.src = url;
}

$("go").onclick=()=>navigate($("address").value);
$("address").addEventListener("keydown",e=>{if(e.key==="Enter")navigate($("address").value)});
$("homeGo").onclick=()=>navigate($("homeSearch").value);
$("homeSearch").addEventListener("keydown",e=>{if(e.key==="Enter")navigate($("homeSearch").value)});
$("back").onclick=()=>view.goBack(); $("forward").onclick=()=>view.goForward(); $("reload").onclick=()=>view.reload();
$("homeBtn").onclick=()=>{browser.classList.add("hidden");home.classList.remove("hidden")};
$("settings").onclick=()=>{$("settingsDialog").showModal()};
$("closeSettings").onclick=()=>{$("settingsDialog").close()};
$("clear").onclick=async()=>{await window.savanna.clearData();alert("Local browser data cleared.")};

document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>navigate(b.dataset.q));
document.querySelectorAll(".feature[data-url]").forEach(b=>b.onclick=()=>navigate(b.dataset.url));

$("searchEndpoint").value=localStorage.getItem("searchEndpoint")||"";
$("searchEndpoint").addEventListener("change",e=>{
  let v=e.target.value.trim();
  if(v && !v.endsWith("q=")) v += v.includes("?") ? "&q=" : "?q=";
  localStorage.setItem("searchEndpoint",v);
});

const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function loadFeed(url,name,target){
  try{
    // RSS is fetched through a public CORS proxy solely for this prototype.
    // Production build should use a first-party feed relay/self-hosted service.
    const r=await fetch("https://api.allorigins.win/raw?url="+encodeURIComponent(url));
    const text=await r.text();
    const xml=new DOMParser().parseFromString(text,"text/xml");
    const items=[...xml.querySelectorAll("item")].slice(0,6);
    target.insertAdjacentHTML("beforeend",items.map(i=>{
      const title=i.querySelector("title")?.textContent||"Untitled";
      const link=i.querySelector("link")?.textContent||"#";
      const date=i.querySelector("pubDate")?.textContent||"";
      return `<div class="story"><a href="${esc(link)}" data-story="${esc(link)}">${esc(title)}</a><small>${esc(name)} · ${esc(date)}</small></div>`;
    }).join(""));
    target.querySelectorAll("[data-story]").forEach(a=>a.onclick=e=>{e.preventDefault();navigate(a.dataset.story)});
  }catch(e){target.insertAdjacentHTML("beforeend",`<div class="story"><small>Feed temporarily unavailable: ${esc(name)}</small></div>`)}
}
feeds.africa.forEach(([u,n])=>loadFeed(u,n,$("africaNews")));
feeds.world.forEach(([u,n])=>loadFeed(u,n,$("worldNews")));

$("lang").onchange=e=>{
  if(e.target.value==="sw"){
    $("headline").textContent="Afrika, kwa mtazamo mmoja.";
    $("sub").textContent="Faragha huru. Udhibiti wa ndani. Hakuna uhusiano na Google.";
  }else{
    $("headline").textContent="Africa, at a glance.";
    $("sub").textContent="Independent privacy. Local control. No Google affiliation.";
  }
};
