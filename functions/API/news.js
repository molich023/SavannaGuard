const QUERIES = [
  ["Africa Now", "Africa"],
  ["East Africa", "Kenya OR Tanzania OR Uganda OR Rwanda OR Ethiopia"],
  ["West Africa", "Nigeria OR Ghana OR Senegal OR Gambia OR Côte d'Ivoire"],
  ["Southern Africa", "South Africa OR Zimbabwe OR Zambia OR Botswana OR Namibia OR Mozambique"],
  ["North Africa", "Egypt OR Morocco OR Algeria OR Tunisia OR Libya"],
  ["Central Africa", "DR Congo OR Cameroon OR Chad OR Gabon OR Congo"],
  ["Business & Tech", "Africa (business OR technology OR startup OR economy)"],
  ["Climate & Science", "Africa (climate OR science OR health OR environment)"],
  ["Sports & Culture", "Africa (sports OR football OR music OR culture)"]
];

function clean(value, max=500){return String(value||"").replace(/[<>]/g,"").slice(0,max)}
function normalize(article, category){return {
  title: clean(article.title,240),
  description: clean(article.seendate ? `Published ${article.seendate}` : "Latest African story",220),
  url: article.url,
  image: article.socialimage || "",
  source: clean(article.domain || article.sourcecountry || "African news source",100),
  date: article.seendate || "",
  category
}}

export async function onRequestGet(context){
  try{
    const requests=QUERIES.map(async ([category,query])=>{
      const url=`https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=12&format=json&sort=HybridRel&timespan=24h`;
      const r=await fetch(url,{headers:{"Accept":"application/json"}});
      if(!r.ok)return [];
      const data=await r.json();
      return (data.articles||[]).map(a=>normalize(a,category)).filter(a=>a.title&&a.url);
    });
    const groups=await Promise.all(requests);
    const seen=new Set(); const articles=[];
    for(const group of groups){for(const a of group){if(seen.has(a.url))continue;seen.add(a.url);articles.push(a);}}
    articles.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
    return Response.json({articles:articles.slice(0,48),updated:new Date().toISOString()},{headers:{"Cache-Control":"public, max-age=300, s-maxage=300"}});
  }catch(error){return Response.json({articles:[],error:"news_unavailable"},{status:502});}
}
