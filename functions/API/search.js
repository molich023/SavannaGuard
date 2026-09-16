function clean(value,max=600){return String(value||"").replace(/[<>]/g,"").slice(0,max)}
export async function onRequestGet(context){
  const q=new URL(context.request.url).searchParams.get("q")?.trim();
  if(!q)return Response.json({articles:[]});
  try{
    const url=`https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(q)}&mode=artlist&maxrecords=30&format=json&sort=HybridRel&timespan=7d`;
    const r=await fetch(url,{headers:{"Accept":"application/json"}});
    if(!r.ok)throw new Error("upstream");
    const data=await r.json();
    const articles=(data.articles||[]).map(a=>({title:clean(a.title,240),description:clean(a.domain||a.sourcecountry||"Open-web result",180),url:a.url,source:clean(a.domain||a.sourcecountry||"Source",100),date:a.seendate||""})).filter(a=>a.title&&a.url);
    return Response.json({query:q,articles},{headers:{"Cache-Control":"public, max-age=120, s-maxage=120"}});
  }catch(error){return Response.json({query:q,articles:[],error:"search_unavailable"},{status:502});}
}
