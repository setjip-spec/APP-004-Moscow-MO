import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.1/+esm";

const SUPABASE_URL = "https://lepvlmclsbciwvhxyktf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_V_s6ONo_RtLR3sR96asPJw_M92v98vR";
const FALLBACK_IMAGE = "./assets/fallback.svg";
const root = document.querySelector("#app-root");
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const state = {
  session: null,
  loading: false,
  favorites: [],
  research: [],
  events: [],
  visits: [],
  settings: null,
  budget: null,
  budgetVersion: null,
  weather: null,
  sources: { favorite: true, research: true, event: true },
  quick: "",
  searchText: "",
  resultSort: "relevance",
  filters: {
    district: "",
    environment: "",
    mainState: "",
    experienceClass: "",
    experienceSubtype: "",
    maxPrice: null,
    maxTravel: null,
    maxTotalMinutes: null,
    discountOnly: false,
    ticketsOnly: false,
    buyOnSite: false,
    emotions: {},
    atmosphere: {}
  },
  historyFilters: {
    year: "",
    companion: "",
    timeOfDay: "",
    mainState: "",
    minRating: null,
    repeat: ""
  },
  historyExpanded: null,
  lastError: "",
  exportUrl: "",
  budgetStatus: ""
};

const SVG = {
  home:'<path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  history:'<path d="M4 4v6h6"/><path d="M4.8 15a8 8 0 1 0 .2-6"/><path d="M12 7v5l3 2"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9A1.7 1.7 0 0 0 21 10h.1v4H21a1.7 1.7 0 0 0-1.6 1z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
  map:'<path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3z"/><path d="M9 3v15M15 6v15"/>',
  filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  pin:'<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  arrow:'<path d="M5 12h14M14 7l5 5-5 5"/>',
  chevron:'<path d="m8 10 4 4 4-4"/>',
  grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
  wallet:'<path d="M3 7h16a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2z"/><path d="M3 8V5a2 2 0 0 1 2-2h12v4"/><path d="M16 12h5"/>',
  logout:'<path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h7v18h-7"/>',
  save:'<path d="M5 3h12l4 4v14H3V3z"/><path d="M7 3v6h10V3M7 21v-7h10v7"/>'
};

function icon(name, cls=""){
  return '<svg class="'+cls+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(SVG[name]||"")+'</svg>';
}
function e(v){ return String(v ?? "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function n(v,f=0){ const x=Number(v); return Number.isFinite(x)?x:f; }
function money(v){
  if(v===null||v===undefined||v==="") return "—";
  const x=Number(v);
  if(!Number.isFinite(x)) return "—";
  if(x===0) return "Бесплатно";
  return new Intl.NumberFormat("ru-RU",{maximumFractionDigits:0}).format(x)+" ₽";
}
function safeImg(url){
  if(!url) return FALLBACK_IMAGE;
  try{
    const u=new URL(url,location.href);
    if(["http:","https:"].includes(u.protocol)) return u.href;
  }catch{}
  return FALLBACK_IMAGE;
}
function safeHref(url){
  if(!url) return "";
  try{
    const u=new URL(url,location.href);
    if(["http:","https:"].includes(u.protocol)) return u.href;
  }catch{}
  return "";
}
function tempFmt(v){
  const x=Number(v);
  if(!Number.isFinite(x)) return "—";
  const rounded=Math.round(x);
  return (rounded>0?"+":"")+rounded+"°";
}
function moscowDateKey(value=new Date()){
  const d=value instanceof Date?value:new Date(value);
  if(Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Moscow",year:"numeric",month:"2-digit",day:"2-digit"}).format(d);
}
function dateFromMoscowKey(key){
  return key?new Date(key+"T00:00:00+03:00"):null;
}
function addMoscowDays(key,days){
  const d=dateFromMoscowKey(key);
  if(!d||Number.isNaN(d.getTime())) return key;
  d.setUTCDate(d.getUTCDate()+Number(days||0));
  return moscowDateKey(d);
}
function todayMoscowLabel(){
  const d=dateFromMoscowKey(isoDateMoscow());
  return new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(d);
}
function fmtDate(v,opts={day:"numeric",month:"long"}){
  if(!v) return "Дата не указана";
  const d=new Date(v.length===10?v+"T12:00:00+03:00":v);
  if(Number.isNaN(d.getTime())) return "Дата не указана";
  return new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",...opts}).format(d);
}
function isoMonthNow(){
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Moscow",year:"numeric",month:"2-digit"}).formatToParts(new Date());
  const y=parts.find(x=>x.type==="year").value,m=parts.find(x=>x.type==="month").value;
  return y+"-"+m+"-01";
}
function isoDateMoscow(){
  return new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Moscow",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
}
function toast(msg,error=false){
  const old=document.querySelector(".toast"); if(old) old.remove();
  const el=document.createElement("div"); el.className="toast"+(error?" error":""); el.textContent=msg; document.body.append(el);
  setTimeout(()=>el.remove(),3600);
}
function route(){
  const raw=(location.hash||"#/").slice(1);
  const q=raw.indexOf("?");
  return {path:q>=0?raw.slice(0,q):raw, params:new URLSearchParams(q>=0?raw.slice(q+1):"")};
}
function go(path){ location.hash=path.startsWith("#")?path.slice(1):path; }
function sourceLabel(t){ return t==="favorite"?"Любимые":t==="research"?"Research":"События"; }
function itemTitle(item,type){
  if(type==="favorite") return item.title||item.variant_name||item.parent_activity||"Без названия";
  return item.title||"Без названия";
}
function priceFor(item,type){
  if(type==="favorite") return item.manual_price;
  if(type==="research") return item.current_price ?? item.planned_total;
  return item.current_price ?? item.regular_price;
}
function districtFor(item,type){
  if(type==="favorite") return item.district_city||item.nearest_transit||"Москва";
  if(type==="research") return item.district_city||item.transit_station||"Москва";
  return item.transit_station||item.geo_scope||"Москва";
}
function durationFor(item,type){
  if(type==="favorite") return item.duration_text||"—";
  if(type==="research") return item.duration_on_site_text||item.total_duration_text||"—";
  return item.time_text||"—";
}
function travelFor(item,type){
  if(type==="research") return item.travel_one_way_text||"—";
  return "—";
}
function parseNumberList(text){
  if(text===null||text===undefined) return [];
  return String(text).replace(/,/g,".").match(/\d+(?:\.\d+)?/g)?.map(Number).filter(Number.isFinite)||[];
}
function parseMinutesText(text){
  if(!text) return null;
  const s=String(text).toLowerCase();
  const nums=parseNumberList(s);
  if(!nums.length) return null;
  const max=Math.max(...nums);
  if(/(?:^|\s)ч(?:\.|\s|$)|час/.test(s)) return Math.round(max*60);
  if(/мин/.test(s)) return Math.round(max);
  return null;
}
function itemTravelMinutes(item,type){
  if(type==="research") return parseMinutesText(item.travel_one_way_text);
  return null;
}
function itemTotalMinutes(item,type){
  if(type==="research"){
    const explicit=parseMinutesText(item.total_duration_text);
    if(explicit!==null) return explicit;
    const onsite=parseMinutesText(item.duration_on_site_text), travel=parseMinutesText(item.travel_one_way_text);
    if(onsite!==null && travel!==null) return onsite+travel*2;
    return onsite;
  }
  if(type==="favorite") return parseMinutesText(item.duration_text);
  if(type==="event" && item.starts_at && item.ends_at){
    const a=new Date(item.starts_at),b=new Date(item.ends_at);
    if(!Number.isNaN(a.getTime())&&!Number.isNaN(b.getTime())&&b>a) return Math.round((b-a)/60000);
  }
  return parseMinutesText(item.time_text);
}
function scoreValue(item,key){
  const v=item?.[key];
  if(v===null||v===undefined||v==="") return null;
  const x=Number(v); return Number.isFinite(x)?x:null;
}
const ATMOSPHERE_FILTERS={
  water:{field:"water_score",terms:["вода","вод"]},
  greenery:{field:"nature_score",terms:["зелень","природа","парк","лес"]},
  lights:{field:"evening_lights_score",terms:["огни","подсвет"]},
  music:{field:"music_score",terms:["музы"]},
  fountains:{field:"light_fountains_score",terms:["фонтан"]},
  panorama:{field:"panorama_scale_score",terms:["простор","панорам","масштаб"]},
  calm:{field:"calm_score",terms:["тишина","спокой","умиротвор"]},
  architecture:{field:null,terms:["архитект"]}
};
function atmosphereMatch(item,key,minScore=1){
  const cfg=ATMOSPHERE_FILTERS[key]; if(!cfg) return true;
  if(cfg.field){
    const v=scoreValue(item,cfg.field);
    if(v!==null) return v>=minScore;
  }
  const tags=(Array.isArray(item.atmosphere_tags)?item.atmosphere_tags:[]).join(" ").toLowerCase();
  return cfg.terms.some(t=>tags.includes(t));
}
function hasDiscount(item){
  const pct=scoreValue(item,"discount_percent");
  if(pct!==null && pct>0) return true;
  const regular=scoreValue(item,"regular_price"), current=scoreValue(item,"current_price");
  return regular!==null&&current!==null&&current<regular;
}
function isTicketAvailable(item,type){
  if(type!=="event") return false;
  return ["AVAILABLE","FREE"].includes(String(item.availability_status||"").toUpperCase());
}
function canBuyOnSite(item,type){
  if(type!=="event") return false;
  const text=[item.access_format,item.access_condition,item.booking_requirement].filter(Boolean).join(" ").toLowerCase();
  return /на месте|касс|без брони|без предвар/.test(text);
}
function resetAdvancedFilters(){
  state.filters={district:"",environment:"",mainState:"",experienceClass:"",experienceSubtype:"",maxPrice:null,maxTravel:null,maxTotalMinutes:null,discountOnly:false,ticketsOnly:false,buyOnSite:false,emotions:{},atmosphere:{}};
}

function brandMarkup(){
  return '<div class="brand">'+
    '<div class="brand-mark"><svg viewBox="0 0 42 42" fill="currentColor" aria-hidden="true"><path d="M4 37h34v2H4zM8 35V18h4v17zm6 0V9h4v26zm6 0V15h4v20zm6 0V5h4v30zm6 0V21h4v14z"/><path d="m15 9 1.5-5L18 9zm12-4 1.5-4L30 5z"/></svg></div>'+
    '<div><div class="brand-title">Москва и МО</div><div class="brand-sub">Куда сходить • Исследовать • События</div></div></div>';
}
function headerMarkup(active){
  return '<header class="topbar">'+brandMarkup()+
    '<nav class="top-nav">'+
      '<button class="nav-btn '+(active==="home"?"active":"")+'" data-nav="#/">'+icon("home")+'<span>Главная</span></button>'+
      '<button class="nav-btn '+(active==="history"?"active":"")+'" data-nav="#/history">'+icon("history")+'<span>История</span></button>'+
      '<button class="nav-btn '+(active==="settings"?"active":"")+'" data-nav="#/settings">'+icon("settings")+'<span>Настройки</span></button>'+
    '</nav>'+
    '<div class="header-end"><button class="icon-btn" title="Избранное" data-nav="#/search?source=favorite">'+icon("bookmark")+'</button></div>'+
  '</header>';
}

function searchPanelMarkup(){
  const s=state.sources;
  return '<section class="search-panel">'+
    '<div class="search-top"><div class="search-wrap">'+icon("search")+
      '<form id="global-search-form"><input class="global-search" id="global-search" autocomplete="off" value="'+e(state.searchText)+'" placeholder="Поиск по названию, месту, категории, атмосфере..."></form>'+
      '<div class="search-hint">Например: вода + простор + вечер, тишина, Москва, бесплатно, для двоих</div>'+
    '</div>'+
    '<div class="source-block"><div class="source-title">Искать в источниках:</div><div class="sources">'+
      sourceToggle("favorite",s.favorite)+sourceToggle("research",s.research)+sourceToggle("event",s.event)+
    '</div></div></div>'+
    '<div class="quick-row"><span class="quick-label">Быстрые фильтры:</span>'+
      quickChip("today","Сегодня")+quickChip("tomorrow","Завтра")+quickChip("weekend","Выходные")+quickChip("14d","14 дней")+
      quickChip("alone","👤 Один")+quickChip("together","👥 Вместе")+quickChip("day","☀️ День")+quickChip("evening","🌙 Вечер")+
      quickChip("moscow","📍 Москва")+quickChip("mo","⌂ МО")+quickChip("free","♙ Бесплатно")+
      '<button class="outline-btn" data-nav="#/search">'+icon("filter")+'Ещё фильтры</button>'+
    '</div></section>';
}
function sourceToggle(key,on){
  return '<button class="source-toggle '+(on?"on":"")+'" data-source-toggle="'+key+'"><span class="switch"><span class="switch-dot"></span></span><span>'+sourceLabel(key)+'</span></button>';
}
function quickChip(key,label){
  return '<button class="chip-btn '+(state.quick===key?"active":"")+'" data-quick="'+key+'">'+label+'</button>';
}

function shell(view,active="home",includeSearch=true){
  root.innerHTML=headerMarkup(active)+'<main class="shell">'+(includeSearch?searchPanelMarkup():"")+'<div class="view">'+view+'</div></main>';
}

function renderAuth(){
  root.innerHTML='<main class="auth-page"><section class="auth-card">'+
    '<div class="auth-brand">'+brandMarkup()+'</div>'+
    '<div class="auth-title">Вход в приложение</div>'+
    '<div class="auth-sub">Данные защищены Supabase Auth и доступны только после входа.</div>'+
    '<form id="password-login"><label>E-mail</label><input name="email" type="email" autocomplete="email" required placeholder="you@example.com">'+
      '<label>Пароль</label><input name="password" type="password" autocomplete="current-password" required placeholder="••••••••">'+
      '<div class="auth-actions"><button class="action-primary" type="submit">Войти</button><button class="action-secondary" type="button" id="magic-link">Получить ссылку на почту</button></div>'+
    '</form><div id="auth-error"></div>'+
    '<div class="auth-note">Используется только публичный ключ приложения. Сервисный ключ и секреты в браузер не передаются.</div>'+
  '</section></main>';
}

async function signInPassword(form){
  const fd=new FormData(form);
  const email=String(fd.get("email")||"").trim(), password=String(fd.get("password")||"");
  const box=document.querySelector("#auth-error"); if(box) box.innerHTML="";
  const {error}=await supabase.auth.signInWithPassword({email,password});
  if(error && box) box.innerHTML='<div class="error-box">'+e(error.message)+'</div>';
}
async function sendMagicLink(){
  const email=document.querySelector('#password-login input[name="email"]')?.value.trim();
  const box=document.querySelector("#auth-error"); if(box) box.innerHTML="";
  if(!email){ if(box) box.innerHTML='<div class="error-box">Введите e-mail.</div>'; return; }
  const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname}});
  if(error){ if(box) box.innerHTML='<div class="error-box">'+e(error.message)+'</div>'; }
  else toast("Ссылка для входа отправлена на почту.");
}

async function loadAll(){
  if(!state.session) return;
  state.loading=true;
  try{
    const [{data:settings,error:se}]=await Promise.all([
      supabase.from("app004_settings").select("*").maybeSingle()
    ]);
    if(se) throw se;
    state.settings=settings||{};
    const [fp,rs,es,vs,bm,bv]=await Promise.all([
      supabase.from("app004_favorite_projection").select("*").eq("active_verified",true),
      supabase.from("app004_research").select("*").eq("active",true).order("research_code",{ascending:true}),
      supabase.from("app004_event_occurrences").select("*").eq("projection_state","SHOW").order("starts_at",{ascending:true,nullsFirst:false}).limit(80),
      supabase.from("app004_visits").select("*").order("visit_date",{ascending:false,nullsFirst:false}).order("visit_code",{ascending:true}),
      supabase.from("app004_budget_months").select("*").eq("month",isoMonthNow()).maybeSingle(),
      supabase.from("app004_budget_versions").select("*").lte("effective_month",isoMonthNow()).order("effective_month",{ascending:false}).order("created_at",{ascending:false}).limit(1)
    ]);
    for(const x of [fp,rs,es,vs,bm,bv]) if(x.error) throw x.error;
    const projections=fp.data||[];
    const expIds=projections.map(x=>x.experience_id).filter(Boolean);
    let exps=[],places=[];
    if(expIds.length){
      const er=await supabase.from("app004_experiences").select("*").in("id",expIds);
      if(er.error) throw er.error; exps=er.data||[];
      const placeIds=[...new Set(exps.map(x=>x.place_id).filter(Boolean))];
      if(placeIds.length){
        const pr=await supabase.from("app004_places").select("*").in("id",placeIds);
        if(pr.error) throw pr.error; places=pr.data||[];
      }
    }
    const expMap=new Map(exps.map(x=>[x.id,x])), placeMap=new Map(places.map(x=>[x.id,x]));
    state.favorites=projections.map(p=>{
      const ex=expMap.get(p.experience_id)||{}, pl=placeMap.get(ex.place_id)||{};
      return {...ex,...p,title:pl.name||ex.variant_name||ex.parent_activity||"Без названия",district_city:pl.district_city,nearest_transit:pl.nearest_transit,official_url:pl.official_url};
    });
    state.research=rs.data||[];
    state.events=sortLiveEvents((es.data||[]).filter(x=>eventStillCurrent(x)));
    state.visits=vs.data||[];
    state.budget=bm.data||null;
    state.budgetVersion=(bv.data||[])[0]||null;
    await loadWeather();
    state.lastError="";
  }catch(err){
    console.error(err); state.lastError=err?.message||String(err); toast("Ошибка загрузки данных: "+state.lastError,true);
  }finally{
    state.loading=false;
  }
}
function eventBounds(ev){
  const today=isoDateMoscow();
  const horizon=Math.max(1,Math.min(60,Number(state.settings?.event_horizon_days||14)));
  const horizonEnd=addMoscowDays(today,horizon-1);
  const startKey=ev.starts_at?moscowDateKey(ev.starts_at):"";
  const endKey=ev.ends_at?moscowDateKey(ev.ends_at):"";
  const freshKey=ev.fresh_until?moscowDateKey(ev.fresh_until):"";
  const onDemand=String(ev.occurrence_status||"").toUpperCase()==="ON_DEMAND" || /ONDEMAND/i.test(String(ev.occurrence_code||""));
  let liveEnd=endKey;
  if(onDemand) liveEnd=freshKey||endKey;
  if(!liveEnd && !onDemand) liveEnd=startKey;
  return {today,horizon,horizonEnd,startKey,endKey,freshKey,onDemand,liveEnd};
}
function eventStillCurrent(ev){
  const b=eventBounds(ev);
  if(!b.liveEnd) return false;
  if(b.liveEnd < b.today) return false;
  if(b.startKey && b.startKey > b.horizonEnd) return false;
  if(!b.startKey && b.onDemand && b.liveEnd > b.horizonEnd) return false;
  return true;
}
function eventDisplayKey(ev){
  const b=eventBounds(ev);
  if(b.startKey && b.startKey < b.today && b.liveEnd>=b.today) return b.today;
  return b.startKey||b.today;
}
function eventDateRangeLabel(ev){
  const b=eventBounds(ev);
  if(!b.startKey) return b.onDemand?"По записи":"Дата уточняется";
  if(b.startKey < b.today && b.liveEnd>=b.today){
    if(b.endKey && b.endKey>b.today) return "Идёт до "+fmtDate(b.endKey,{day:"numeric",month:"long"});
    if(b.onDemand && b.freshKey>=b.today) return "Доступно по записи";
    return "Идёт сегодня";
  }
  if(b.endKey && b.endKey>b.startKey){
    return fmtDate(b.startKey,{day:"numeric",month:"short"})+" — "+fmtDate(b.endKey,{day:"numeric",month:"short"});
  }
  return "";
}
function sortLiveEvents(items){
  return [...items].sort((a,b)=>{
    const ka=eventDisplayKey(a),kb=eventDisplayKey(b);
    if(ka!==kb) return ka.localeCompare(kb);
    const sa=a.starts_at||"",sb=b.starts_at||"";
    return sa.localeCompare(sb);
  });
}

async function loadWeather(){
  if(state.settings && state.settings.show_weather===false){ state.weather=null; return; }
  try{
    const city=String(state.settings?.weather_city||"Москва").trim()||"Москва";
    let latitude=55.7558, longitude=37.6176, resolvedName="Москва";
    if(city.toLowerCase()!=="москва"){
      const geoQs=new URLSearchParams({name:city,count:"1",language:"ru",format:"json"});
      const geoRes=await fetch("https://geocoding-api.open-meteo.com/v1/search?"+geoQs);
      if(geoRes.ok){
        const geo=await geoRes.json();
        const first=geo?.results?.[0];
        if(first && Number.isFinite(Number(first.latitude)) && Number.isFinite(Number(first.longitude))){
          latitude=Number(first.latitude);longitude=Number(first.longitude);resolvedName=first.name||city;
        }else{
          resolvedName=city;
        }
      }
    }
    const qs=new URLSearchParams({
      latitude:String(latitude),longitude:String(longitude),timezone:"Europe/Moscow",forecast_days:"7",
      hourly:"temperature_2m,weather_code,precipitation_probability",
      daily:"weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
    });
    const res=await fetch("https://api.open-meteo.com/v1/forecast?"+qs);
    if(!res.ok) throw new Error("Weather HTTP "+res.status);
    state.weather=await res.json();
    state.weather._city=resolvedName;
  }catch(err){ console.warn(err); state.weather=null; }
}
function wmo(code,isNight=false){
  code=Number(code);
  if(code===0) return {icon:isNight?"🌙":"☀️",text:"Ясно"};
  if([1,2].includes(code)) return {icon:isNight?"☁️":"🌤️",text:"Малооблачно"};
  if(code===3) return {icon:"☁️",text:"Облачно"};
  if([45,48].includes(code)) return {icon:"🌫️",text:"Туман"};
  if([51,53,55,56,57].includes(code)) return {icon:"🌦️",text:"Морось"};
  if([61,63,65,66,67,80,81,82].includes(code)) return {icon:"🌧️",text:"Дождь"};
  if([71,73,75,77,85,86].includes(code)) return {icon:"🌨️",text:"Снег"};
  if([95,96,99].includes(code)) return {icon:"⛈️",text:"Гроза"};
  return {icon:"☁️",text:"Облачно"};
}
function weatherPeriod(hour,name){
  const w=state.weather;if(!w?.hourly?.time) return null;
  const today=isoDateMoscow();
  let idx=w.hourly.time.findIndex(t=>t===today+"T"+String(hour).padStart(2,"0")+":00");
  if(idx<0) idx=w.hourly.time.findIndex(t=>t.startsWith(today));
  if(idx<0) return null;
  const temp=Number(w.hourly.temperature_2m?.[idx]);
  const precip=Number(w.hourly.precipitation_probability?.[idx]);
  const code=Number(w.hourly.weather_code?.[idx]);
  if(!Number.isFinite(temp)||!Number.isFinite(code)) return null;
  const info=wmo(code,hour<6||hour>=22);
  return {name,temp,precip:Number.isFinite(precip)?Math.round(precip):null,...info};
}

function miniCard(item,type){
  const title=itemTitle(item,type), price=priceFor(item,type), duration=durationFor(item,type), district=districtFor(item,type);
  const stateName=item.main_state||item.parent_activity||item.primary_activity||item.category||"";
  return '<article class="mini-card" data-detail="'+type+":"+e(item.id)+'">'+
    '<img class="thumb" src="'+e(safeImg(item.cover_url))+'" alt="" loading="lazy" onerror="this.src=\''+FALLBACK_IMAGE+'\'">'+
    '<div class="mini-main"><div class="mini-title">'+e(title)+'</div><div class="meta-line">'+
      (item.rating?'<span class="rating">★ '+e(item.rating)+'</span>':'')+
      (stateName?'<span class="badge blue">'+e(stateName)+'</span>':'')+
      '<span>'+e(district)+'</span></div>'+
      '<div class="meta-line">'+icon("clock")+'<span>'+e(duration)+'</span>'+
      (type==="research"?'<span class="meta-dot">дорога '+e(travelFor(item,type))+'</span>':'')+
      '</div></div>'+
    '<div class="card-side"><span class="badge '+(Number(price)===0?"green":"orange")+'">'+e(money(price))+'</span><span class="heart">♡</span></div>'+
  '</article>';
}
function eventCard(ev){
  const price=ev.is_free?0:(ev.current_price??ev.regular_price);
  return '<article class="event-card" data-detail="event:'+e(ev.id)+'">'+
    '<img class="event-thumb" src="'+e(safeImg(ev.cover_url))+'" alt="" loading="lazy" onerror="this.src=\''+FALLBACK_IMAGE+'\'">'+
    '<div><div class="event-title">'+e(ev.title)+'</div>'+
      (eventDateRangeLabel(ev)?'<div class="meta-line event-live-label">'+icon("calendar")+e(eventDateRangeLabel(ev))+'</div>':'')+
      '<div class="meta-line">'+icon("clock")+e(ev.time_text||fmtDate(ev.starts_at,{hour:"2-digit",minute:"2-digit"}))+'</div>'+
      '<div class="meta-line">'+icon("pin")+e(districtFor(ev,"event"))+'</div>'+
      '<div class="event-tags"><span class="badge '+(ev.category?.includes("конц")?"red":"orange")+'">'+e(ev.category||"Событие")+'</span>'+
      '<span class="badge blue">'+e(ev.supports_together===false?"Один":"Вместе")+'</span>'+
      '<span class="badge '+(price===0?"green":"gray")+'">'+e(money(price))+'</span></div></div>'+
    '<button class="details-btn" data-detail="event:'+e(ev.id)+'">Подробнее&nbsp; →</button>'+
  '</article>';
}
function mobileEvents(events){
  if(!events.length) return '<div class="empty-state">Актуальных событий пока нет.</div>';
  return events.slice(0,8).map(ev=>{
    const key=eventDisplayKey(ev),d=dateFromMoscowKey(key);
    const day=d?new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",day:"2-digit"}).format(d):"•";
    const mon=d?new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",month:"short"}).format(d):"по записи";
    const wd=d?new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",weekday:"short"}).format(d):"";
    const price=ev.is_free?0:(ev.current_price??ev.regular_price);
    return '<article class="mobile-event-slide" data-detail="event:'+e(ev.id)+'">'+
      '<div class="mobile-event-visual"><img src="'+e(safeImg(ev.cover_url))+'" alt="" loading="lazy" onerror="this.src=\''+FALLBACK_IMAGE+'\'">'+
        '<div class="mobile-date-badge"><b>'+e(day)+'</b><span>'+e(mon)+'</span><small>'+e(wd)+'</small></div><div class="mobile-heart">♡</div></div>'+
      '<div class="mobile-event-copy"><div class="event-title">'+e(ev.title)+'</div>'+
        (eventDateRangeLabel(ev)?'<div class="meta-line event-live-label">'+icon("calendar")+e(eventDateRangeLabel(ev))+'</div>':'')+
        '<div class="meta-line">'+icon("clock")+e(ev.time_text||"Время уточняется")+'</div>'+
        '<div class="meta-line">'+icon("pin")+e(districtFor(ev,"event"))+'</div>'+
        '<div class="event-tags"><span class="badge red">'+e(ev.category||"Событие")+'</span><span class="badge blue">'+e(ev.supports_together===false?"Один":"Вместе")+'</span></div>'+
        '<div class="mobile-event-price">'+e(money(price))+(ev.availability_status?'<span class="badge green">'+e(ev.availability_status)+'</span>':'')+'</div>'+
        '<button class="details-btn" data-detail="event:'+e(ev.id)+'">Подробнее&nbsp; →</button></div>'+
    '</article>';
  }).join("");
}
function groupEvents(events){
  const groups=new Map();
  for(const ev of events.slice(0,16)){
    const key=eventDisplayKey(ev)||"По записи";
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(ev);
  }
  let html="";
  for(const [key,arr] of groups){
    const d=key==="По записи"?null:dateFromMoscowKey(key);
    const day=d?new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",day:"2-digit"}).format(d):"•";
    const month=d?new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",month:"long"}).format(d):"по записи";
    const week=d?new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",weekday:"short"}).format(d):"";
    const todayMark=key===isoDateMoscow()?'<div class="date-today">сегодня</div>':"";
    html+='<div class="event-group"><div class="date-tile"><div class="date-day">'+e(day)+'</div><div class="date-month">'+e(month)+'</div><div class="date-week">'+e(week)+'</div>'+todayMark+'</div>'+
      '<div class="event-cards">'+arr.map(eventCard).join("")+'</div></div>';
  }
  return html||'<div class="empty-state">В выбранном окне актуальных событий нет.</div>';
}

function budgetMarkup(){
  const b=state.budget;
  const allocation=b?.allocation_amount ?? state.budgetVersion?.monthly_amount ?? null;
  if(allocation===null){
    return '<div class="budget-body"><div class="empty-state">Месячный бюджет пока не задан.<br><button class="link-btn" data-nav="#/settings">Настроить бюджет →</button></div></div>';
  }
  const spent=n(b?.actual_spend_total,0), left=n(b?.carry_out,n(allocation)-spent);
  const pct=allocation>0?Math.max(0,Math.min(100,Math.round(spent/allocation*100))):0;
  return '<div class="budget-body"><div class="budget-numbers"><div><div class="budget-label">Потрачено</div><div class="budget-value">'+e(money(spent))+'</div><div class="budget-label">из '+e(money(allocation))+'</div></div>'+
    '<div class="budget-right"><div class="budget-label">Осталось</div><div class="budget-value">'+e(money(left))+'</div><div class="budget-label">'+e(100-pct)+'%</div></div></div>'+
    '<div class="progress"><i style="width:'+pct+'%"></i></div>'+
    '<div class="budget-lines">'+
      budgetLine("red","Фактические расходы",spent,pct)+
      budgetLine("orange","Обязательства",n(b?.unpaid_commitments),allocation?Math.round(n(b?.unpaid_commitments)/allocation*100):0)+
      budgetLine("blue","Ожидаемые возвраты",-n(b?.expected_refunds),0)+
      budgetLine("violet","Долги людям",n(b?.payables_due),allocation?Math.round(n(b?.payables_due)/allocation*100):0)+
    '</div></div>';
}
function budgetLine(color,label,value,pct){
  return '<div class="budget-line"><span class="dot '+color+'"></span><span>'+e(label)+'</span><b>'+e(money(value))+'</b><span class="pct">'+e(pct)+'%</span></div>';
}
function weatherMarkup(){
  if(!state.weather) return '<div class="weather-body"><div class="empty-state">Погода временно недоступна.</div></div>';
  const ps=[weatherPeriod(8,"Утро"),weatherPeriod(14,"День"),weatherPeriod(20,"Вечер"),weatherPeriod(23,"Ночь")].filter(Boolean);
  const daily=state.weather.daily||{};
  const count=Math.min(7,Array.isArray(daily.time)?daily.time.length:0);
  let week="";
  for(let i=0;i<count;i++){
    const dateKey=daily.time[i],d=dateFromMoscowKey(dateKey), code=Number(daily.weather_code?.[i]);
    const min=Number(daily.temperature_2m_min?.[i]),max=Number(daily.temperature_2m_max?.[i]),precip=Number(daily.precipitation_probability_max?.[i]);
    if(!d||!Number.isFinite(code)||!Number.isFinite(min)||!Number.isFinite(max)) continue;
    const info=wmo(code,false);
    const date=new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",day:"2-digit",month:"2-digit"}).format(d);
    const wd=new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",weekday:"short"}).format(d);
    week+='<div class="week-row"><b>'+e(date)+' <span class="weather-weekday">'+e(wd)+'</span></b><span>'+info.icon+'</span><span><span class="lo">'+e(tempFmt(min))+'</span> / <span class="hi">'+e(tempFmt(max))+'</span></span><span>'+e(info.text)+(Number.isFinite(precip)?', '+e(Math.round(precip))+'%':'')+'</span></div>';
  }
  const weekHtml=state.settings?.show_week_forecast===false?'':(
    week?'<div class="week-title">Прогноз на 7 дней</div><div class="week-list">'+week+'</div>':'<div class="weather-warning">7-дневный прогноз временно недоступен.</div>'
  );
  return '<div class="weather-body"><div class="weather-today-title">Сегодня, '+e(fmtDate(isoDateMoscow(),{day:"numeric",month:"long",weekday:"long"}))+'</div>'+
    '<div class="period-grid">'+(ps.length?ps.map(p=>'<div class="period"><div class="period-name">'+e(p.name)+'</div><div class="weather-icon">'+p.icon+'</div><div class="temp">'+e(tempFmt(p.temp))+'</div><div class="condition">'+e(p.text)+'</div><div class="precip">'+(p.precip===null?'Осадки —':'Осадки '+e(p.precip)+'%')+'</div></div>').join(""):'<div class="weather-warning">Почасовой прогноз недоступен.</div>')+'</div>'+
    weekHtml+'</div>';
}
function renderDashboard(){
  const horizon=Math.max(1,Math.min(60,Number(state.settings?.event_horizon_days||14)));
  const favorites=state.favorites.slice(0,5), research=state.research.slice(0,6), events=filterItems(state.events,"event").slice(0,14);
  const view='<div class="dashboard-date-strip"><span>'+icon("calendar")+'</span><b>Сегодня, '+e(todayMoscowLabel())+'</b><small>время Москвы</small></div><div class="dashboard-grid">'+
    '<div class="dash-left">'+
      '<section class="panel" id="favorites-panel"><div class="panel-head"><div class="panel-title-wrap"><span class="panel-icon">★</span><div><div class="panel-title">Куда сходить</div><div class="panel-sub">Проверенные места • Ваши фавориты</div></div></div><button class="link-btn" data-nav="#/search?source=favorite">Все любимые&nbsp; →</button></div><div class="stack-list">'+(favorites.length?favorites.map(x=>miniCard(x,"favorite")).join(""):'<div class="empty-state">Любимых пока нет.</div>')+'</div></section>'+
      '<section class="panel" id="research-panel"><div class="panel-head"><div class="panel-title-wrap"><span class="panel-icon blue">⌕</span><div><div class="panel-title">Исследовать новое</div><div class="panel-sub">Идеи, которые стоит проверить</div></div></div><button class="link-btn" data-nav="#/search?source=research">Все исследования&nbsp; →</button></div><div class="stack-list">'+(research.length?research.map(x=>miniCard(x,"research")).join(""):'<div class="empty-state">Нет активных исследований.</div>')+'</div></section>'+
    '</div>'+
    '<section class="panel" id="events-panel"><div class="panel-head"><div class="panel-title-wrap"><span class="panel-icon blue">▣</span><div><div class="panel-title">События — ближайшие '+e(horizon)+' дней</div><div class="panel-sub desktop-only">Актуальные события в Москве и МО</div></div></div><button class="link-btn" data-nav="#/search?source=event">Все события&nbsp; →</button></div><div class="event-list desktop-event-list">'+groupEvents(events)+'</div><div class="mobile-event-list mobile-only">'+mobileEvents(events)+'</div></section>'+
    '<div class="dash-right">'+
      '<section class="panel" id="budget-panel"><div class="panel-head"><div class="panel-title-wrap"><span class="panel-icon blue">'+icon("wallet")+'</span><div class="panel-title">Бюджет месяца</div></div><button class="link-btn" data-nav="#/settings">Настроить&nbsp; →</button></div>'+budgetMarkup()+'</section>'+
      '<section class="panel" id="weather-panel"><div class="panel-head"><div class="panel-title-wrap"><span class="panel-icon">🌤️</span><div><div class="panel-title">Погода в '+e(state.weather?._city||state.settings?.weather_city||"Москве")+'</div><div class="panel-sub">Источник: Open‑Meteo</div></div></div><button class="link-btn">Открыть на карте&nbsp; →</button></div>'+weatherMarkup()+'</section>'+
    '</div></div>';
  shell(view,"home",true);
}

function filterItems(items,type){
  const q=state.searchText.trim().toLowerCase();
  const quick=state.quick;
  const f=state.filters;
  return items.filter(x=>{
    const text=[
      itemTitle(x,type),districtFor(x,type),x.parent_activity,x.primary_activity,x.category,x.main_state,
      x.environment,x.experience_class,x.experience_subtype,x.access_format,x.access_condition,
      ...(Array.isArray(x.atmosphere_tags)?x.atmosphere_tags:[])
    ].filter(Boolean).join(" ").toLowerCase();

    if(q && !q.split(/\s+/).filter(Boolean).every(word=>text.includes(word.replace(/[+]/g,"")))) return false;

    if(quick==="free" && Number(priceFor(x,type))!==0) return false;
    if(quick==="evening" && !(String(x.time_of_day||x.best_window||x.time_text||"").toLowerCase().includes("веч"))) return false;
    if(quick==="day" && !(String(x.time_of_day||x.best_window||x.time_text||"").toLowerCase().includes("день")||String(x.time_of_day||"").toLowerCase().includes("дн"))) return false;
    if(quick==="alone" && x.supports_alone===false) return false;
    if(quick==="together" && x.supports_together===false) return false;
    if(quick==="moscow" && String(x.geo_scope||x.district_city||"Москва").toLowerCase().includes("мо ")) return false;
    if(quick==="mo" && !String(x.geo_scope||x.district_city||"").toLowerCase().includes("мо")) return false;
    if(type==="event" && ["today","tomorrow","weekend","14d"].includes(quick) && !eventDateMatch(x,quick)) return false;

    if(f.district && !districtFor(x,type).toLowerCase().includes(f.district.toLowerCase())) return false;
    if(f.environment && !String(x.environment||"").toLowerCase().includes(f.environment.toLowerCase())) return false;
    if(f.mainState && !String(x.main_state||"").toLowerCase().includes(f.mainState.toLowerCase())) return false;
    if(f.experienceClass && !String(x.experience_class||x.parent_activity||x.primary_activity||x.category||"").toLowerCase().includes(f.experienceClass.toLowerCase())) return false;
    if(f.experienceSubtype && !String(x.experience_subtype||"").toLowerCase().includes(f.experienceSubtype.toLowerCase())) return false;

    if(f.maxPrice!==null){
      const p=priceFor(x,type);
      if(p===null||p===undefined||p===""||Number(p)>f.maxPrice) return false;
    }
    if(f.maxTravel!==null){
      const m=itemTravelMinutes(x,type);
      if(m===null||m>f.maxTravel) return false;
    }
    if(f.maxTotalMinutes!==null){
      const m=itemTotalMinutes(x,type);
      if(m===null||m>f.maxTotalMinutes) return false;
    }
    if(f.discountOnly && !hasDiscount(x)) return false;
    if(f.ticketsOnly && !isTicketAvailable(x,type)) return false;
    if(f.buyOnSite && !canBuyOnSite(x,type)) return false;

    for(const [key,min] of Object.entries(f.emotions||{})){
      if(!min) continue;
      const v=scoreValue(x,key);
      if(v===null||v<Number(min)) return false;
    }
    for(const [key,min] of Object.entries(f.atmosphere||{})){
      if(!min) continue;
      if(!atmosphereMatch(x,key,Number(min))) return false;
    }
    return true;
  });
}
function eventDateMatch(ev,kind){
  if(!ev.starts_at) return kind==="14d";
  const d=new Date(ev.starts_at);
  const today=new Date(isoDateMoscow()+"T00:00:00+03:00");
  const day=(new Date(d.toLocaleString("en-US",{timeZone:"Europe/Moscow"})));
  const diff=Math.floor((new Date(day.getFullYear(),day.getMonth(),day.getDate())-new Date(today.getFullYear(),today.getMonth(),today.getDate()))/86400000);
  if(kind==="today") return diff<=0 && (!ev.ends_at || new Date(ev.ends_at)>=today);
  if(kind==="tomorrow") return diff===1;
  if(kind==="14d") return diff<=14;
  if(kind==="weekend"){ const wd=day.getDay(); return diff>=0&&diff<=7&&(wd===0||wd===6); }
  return true;
}
function allSearchItems(){
  let out=[];
  if(state.sources.favorite) out.push(...filterItems(state.favorites,"favorite").map(x=>({type:"favorite",item:x})));
  if(state.sources.research) out.push(...filterItems(state.research,"research").map(x=>({type:"research",item:x})));
  if(state.sources.event) out.push(...filterItems(state.events,"event").map(x=>({type:"event",item:x})));
  if(state.resultSort==="price") out.sort((a,b)=>n(priceFor(a.item,a.type),1e12)-n(priceFor(b.item,b.type),1e12));
  if(state.resultSort==="rating") out.sort((a,b)=>n(b.item.rating)-n(a.item.rating));
  if(state.resultSort==="name") out.sort((a,b)=>itemTitle(a.item,a.type).localeCompare(itemTitle(b.item,b.type),"ru"));
  return out;
}
function uniqueSearchValues(getter){
  const values=[];
  for(const [type,arr] of [["favorite",state.favorites],["research",state.research],["event",state.events]]){
    for(const item of arr){
      const v=getter(item,type);
      if(v!==null&&v!==undefined&&String(v).trim()) values.push(String(v).trim());
    }
  }
  return [...new Set(values)].sort((a,b)=>a.localeCompare(b,"ru"));
}
function selectOptions(values,current,placeholder="Все"){
  return '<option value="">'+e(placeholder)+'</option>'+values.map(v=>'<option value="'+e(v)+'" '+(current===v?"selected":"")+'>'+e(v)+'</option>').join("");
}
function advSegment(key,items,current){
  return '<div class="segment">'+items.map(([value,label])=>'<button type="button" data-adv-button="'+e(key)+'" data-adv-value="'+e(value)+'" class="'+(current===value?"active":"")+'">'+e(label)+'</button>').join("")+'</div>';
}
function advancedRange(key,max,step,unit){
  const value=state.filters[key]===null?max:Number(state.filters[key]);
  const display=state.filters[key]===null?"Любая":new Intl.NumberFormat("ru-RU",{maximumFractionDigits:0}).format(value)+(unit||"");
  return '<div class="range-control"><input type="range" min="0" max="'+e(max)+'" step="'+e(step)+'" value="'+e(value)+'" data-adv-range="'+e(key)+'"><div class="range-control-meta"><span>0</span><b>'+e(display)+'</b><button type="button" data-clear-range="'+e(key)+'" '+(state.filters[key]===null?"disabled":"")+'>×</button></div></div>';
}
function mainStateFilter(){
  const values=["Умиротворение","Живость","Радость","Поток","Удовольствие","Облегчение","Смысл","Довольство"];
  return '<div class="state-chip-grid"><button type="button" data-adv-button="mainState" data-adv-value="" class="'+(!state.filters.mainState?"active":"")+'">Любое</button>'+
    values.map(v=>'<button type="button" data-adv-button="mainState" data-adv-value="'+e(v)+'" class="'+(state.filters.mainState===v?"active":"")+'">'+e(v)+'</button>').join("")+'</div>';
}
function emotionFilterVisual(){
  const defs=[["Радость","joy_score"],["Умиротворение","calm_score"],["Поток","flow_score"],["Удовольствие","pleasure_score"],["Облегчение","relief_score"],["Довольство","satisfaction_score"],["Смысл","meaning_score"],["Живость","vitality_score"]];
  return defs.map(([label,key])=>{
    const cur=Number(state.filters.emotions[key]||0);
    return '<label class="emotion-filter"><span>●</span><span>'+e(label)+'</span><div class="mini-slider"><i style="width:'+e(cur?cur/5*100:0)+'%"></i><b style="left:'+e(cur?cur/5*100:0)+'%"></b></div><select data-emotion-filter="'+e(key)+'"><option value="0">Любая</option><option value="2" '+(cur===2?"selected":"")+'>≥ 2</option><option value="3" '+(cur===3?"selected":"")+'>≥ 3</option><option value="4" '+(cur===4?"selected":"")+'>≥ 4</option></select></label>';
  }).join("");
}
function atmosphereFilterVisual(){
  const defs=[["💧","Вода","water"],["♣","Зелень","greenery"],["▣","Огни","lights"],["♫","Музыка","music"],["♨","Фонтаны","fountains"],["◫","Простор","panorama"],["☾","Спокойствие","calm"],["⚒","Архитектура","architecture"]];
  return '<div class="atmo-grid">'+defs.map(([ic,label,key])=>{
    const unsupported=key==="architecture";
    const attrs=unsupported?'disabled':'data-atmos-filter="'+e(key)+'"';
    const cls=(state.filters.atmosphere[key]?"active ":"")+(unsupported?"unsupported":"");
    const title=unsupported?"В текущем каноне нет заполненного architecture-тега":"По существующему каноническому полю";
    return '<button type="button" '+attrs+' class="'+cls+'" title="'+e(title)+'">'+ic+' '+e(label)+(unsupported?" · нет данных":"")+'</button>';
  }).join("")+'</div>';
}
function activeAdvancedFilterChips(){
  const f=state.filters,chips=[];
  if(f.district) chips.push("Район: "+f.district);
  if(f.environment) chips.push(f.environment);
  if(f.mainState) chips.push("Состояние: "+f.mainState);
  if(f.experienceClass) chips.push("Класс: "+f.experienceClass);
  if(f.experienceSubtype) chips.push("Подтип: "+f.experienceSubtype);
  if(f.maxPrice!==null) chips.push("До "+money(f.maxPrice));
  if(f.maxTravel!==null) chips.push("Дорога ≤ "+f.maxTravel+" мин");
  if(f.maxTotalMinutes!==null) chips.push("Всего ≤ "+Math.round(f.maxTotalMinutes/60*10)/10+" ч");
  if(f.discountOnly) chips.push("Со скидкой");
  if(f.ticketsOnly) chips.push("Есть билеты");
  if(f.buyOnSite) chips.push("Покупка на месте");
  for(const [key,min] of Object.entries(f.emotions)) if(min) chips.push(key.replace("_score","")+" ≥ "+min);
  for(const key of Object.keys(f.atmosphere)) if(f.atmosphere[key]) chips.push("Атмосфера: "+key);
  return chips;
}
function atmosphereLabels(item){
  const labels=[];
  for(const [key,cfg] of Object.entries(ATMOSPHERE_FILTERS)){
    if(cfg.field){
      const v=scoreValue(item,cfg.field);
      if(v!==null&&v>0){
        const names={water:"Вода",greenery:"Зелень",lights:"Огни",music:"Музыка",fountains:"Фонтаны",panorama:"Простор",calm:"Спокойствие"};
        labels.push(names[key]||key);
      }
    }
  }
  for(const t of (Array.isArray(item.atmosphere_tags)?item.atmosphere_tags:[])) if(t&&!labels.includes(t)) labels.push(t);
  return labels.slice(0,4);
}
function renderSearch(){
  const r=route();
  const src=r.params.get("source");
  if(src && ["favorite","research","event"].includes(src)){
    state.sources={favorite:false,research:false,event:false};state.sources[src]=true;
    history.replaceState(null,"",location.pathname+location.search+"#/search");
  }
  const results=allSearchItems();
  const rows=results.map(({type,item},i)=>resultRow(item,type,i+1)).join("");
  const districts=uniqueSearchValues((item,type)=>districtFor(item,type)).slice(0,120);
  const classes=uniqueSearchValues(item=>item.experience_class||item.parent_activity||item.primary_activity||item.category).slice(0,120);
  const subtypes=uniqueSearchValues(item=>item.experience_subtype).slice(0,120);
  const advancedChips=activeAdvancedFilterChips();

  const view='<div class="results-shell">'+
    '<aside class="panel filter-panel search-filter-panel"><div class="panel-head filter-main-head"><div class="panel-title-wrap"><span class="panel-icon blue">'+icon("filter")+'</span><div class="panel-title">Фильтры</div></div><span class="badge gray">Вариант 2</span></div>'+
      '<div class="filter-columns"><div class="filter-column">'+
        '<button class="link-btn reset-link" data-reset-filters>Сбросить всё&nbsp; ×</button>'+
        filterSection("Источники",'<label class="check inline-check"><input type="checkbox" data-filter-source="favorite" '+(state.sources.favorite?"checked":"")+'> Любимые</label><label class="check inline-check"><input type="checkbox" data-filter-source="research" '+(state.sources.research?"checked":"")+'> Research</label><label class="check inline-check"><input type="checkbox" data-filter-source="event" '+(state.sources.event?"checked":"")+'> События</label>')+
        filterSection("Район / город",'<select class="select filter-select" data-adv-select="district">'+selectOptions(districts,state.filters.district,"Все районы")+'</select>')+
        '<div class="filter-pair">'+
          filterMini("Класс","experienceClass",classes,state.filters.experienceClass)+
          filterMini("Подтип","experienceSubtype",subtypes,state.filters.experienceSubtype)+
        '</div>'+
        filterSection("Москва / МО",segmented([["moscow","Москва"],["mo","МО"],["","Любой"]],state.quick))+
        filterSection("Один / вместе",segmented([["alone","Один"],["together","Вместе"],["","Любой"]],state.quick))+
        filterSection("День / вечер",segmented([["day","☀ День"],["evening","☾ Вечер"],["","Любое"]],state.quick))+
        filterSection("Улица / помещение",advSegment("environment",[["Улица","♙ Улица"],["Помещение","⌂ Помещение"],["","Любое"]],state.filters.environment))+
        filterSection("Цена (₽)",advancedRange("maxPrice",100000,500," ₽"))+
        filterSection("Время дороги от меня",advancedRange("maxTravel",180,5," мин"))+
        filterSection("Полное время (включая дорогу)",advancedRange("maxTotalMinutes",720,30," мин"))+
      '</div><div class="filter-column">'+
        filterSection("Главное состояние",mainStateFilter())+
        filterSection("Эмоциональные шкалы",emotionFilterVisual())+
        filterSection("Атмосфера",atmosphereFilterVisual())+
        filterSection("Бесплатно",'<label class="check"><input type="checkbox" data-quick="free" '+(state.quick==="free"?"checked":"")+'> Только бесплатные</label>')+
        filterSection("Скидка",'<label class="check"><input type="checkbox" data-adv-check="discountOnly" '+(state.filters.discountOnly?"checked":"")+'> Только со скидкой</label>')+
        filterSection("Доступность билетов",'<label class="check"><input type="checkbox" data-adv-check="ticketsOnly" '+(state.filters.ticketsOnly?"checked":"")+'> Есть билеты</label><label class="check unsupported-check" title="В текущем каноне нет подтверждённых строк"><input type="checkbox" disabled> Можно купить на месте · нет данных</label>')+
      '</div></div>'+
    '</aside>'+
    '<section class="panel results-panel"><div class="results-toolbar"><div class="results-title">Найдено <b>'+results.length+'</b> варианта</div><div class="toolbar-right"><div class="view-toggle"><button class="active">'+icon("list")+' <span>Списком</span></button><button>'+icon("pin")+' <span>На карте</span></button></div></div></div>'+
    '<div class="results-subbar"><div class="active-filters">'+
      (state.searchText?'<span class="active-chip">'+e(state.searchText)+' ×</span>':'')+
      (state.quick?'<span class="active-chip">'+e(state.quick)+' ×</span>':'')+
      advancedChips.map(x=>'<span class="active-chip">'+e(x)+' ×</span>').join("")+
    '</div><div class="sort-line"><span>Сортировка:</span><select class="select" id="result-sort"><option value="relevance">По релевантности</option><option value="price">По цене</option><option value="rating">По рейтингу</option><option value="name">По названию</option></select></div></div>'+
    '<div class="result-head"><span>#</span><span>Место / событие</span><span>Источник</span><span>Район / город</span><span>Цена с дорогой</span><span>Дорога</span><span>Всего</span><span>Рейтинг</span><span>Атмосфера</span><span></span></div>'+
    (rows||'<div class="empty-state">По текущим фильтрам ничего не найдено.</div>')+'</section></div>';
  shell(view,"home",true);
  const sort=document.querySelector("#result-sort"); if(sort) sort.value=state.resultSort;
}
function segmented(items,current){
  return '<div class="segment">'+items.map(([key,label])=>'<button type="button" data-quick="'+e(key)+'" class="'+(current===key?"active":"")+'">'+e(label)+'</button>').join("")+'</div>';
}
function filterMini(title,key,values,current){
  return '<div class="filter-mini"><h4>'+e(title)+'</h4><select class="select filter-select" data-adv-select="'+e(key)+'">'+selectOptions(values,current,"Все")+'</select></div>';
}
function rangeVisual(min,max,width){
  return '<div class="range-visual"><div class="range-track"><i style="width:'+e(width)+'"></i><b style="left:'+e(width)+'"></b></div><div class="range-inputs"><span>'+e(min)+'</span><span>—</span><span>'+e(max)+'</span></div></div>';
}
function filterSection(title,body){ return '<div class="filter-section"><h4>'+e(title)+'</h4>'+body+'</div>'; }
function resultRow(item,type,index){
  const atmosphere=atmosphereLabels(item);
  const price=priceFor(item,type);
  const rating=item.rating ?? null;
  return '<article class="result-row" data-detail="'+type+":"+e(item.id)+'"><span class="result-num">'+e(index)+'</span><div class="result-item"><img class="result-thumb" src="'+e(safeImg(item.cover_url))+'" alt="" onerror="this.src=\''+FALLBACK_IMAGE+'\'"><div><div class="result-title">'+e(itemTitle(item,type))+'</div><div class="meta-line">'+icon("pin")+e(item.parent_activity||item.primary_activity||item.category||"")+'</div><div class="meta-line">'+e(item.season||item.time_of_day||"Круглый год")+'</div></div></div>'+
    '<span><span class="source-cell source-'+type+'">'+(type==="favorite"?"⌂":type==="research"?"●":"♜")+' '+e(sourceLabel(type))+'</span></span>'+
    '<span class="result-district">'+e(districtFor(item,type))+'</span><b class="result-price '+(Number(price)===0?"free":"")+'">'+e(money(price))+'</b>'+
    '<span>'+e(type==="research"?(item.travel_one_way_text||"—"):"—")+'</span><span>'+e(type==="research"?(item.total_duration_text||item.duration_on_site_text||"—"):durationFor(item,type))+'</span>'+
    '<span class="rating">'+(rating!==null?"★ "+e(rating):"—")+'</span><span class="atmo-cell">'+(atmosphere.length?atmosphere.map(t=>'<i>'+e(t)+'</i>').join(""):'<i class="empty-atmo">—</i>')+'</span><span class="heart">♡</span></article>';
}

function historySearchPanel(){
  return '<section class="search-panel history-search-panel"><div class="history-search-top"><div class="search-wrap">'+icon("search")+'<form id="history-search-form"><input class="global-search" id="history-search" placeholder="Поиск по посещениям: место, район, событие, заметка..." value="'+e(state.searchText)+'"></form><div class="search-hint">Например: Парк Горького, выставка, ужин, Красногорск</div></div>'+
    '<div class="history-period"><b>Период</b><select class="select"><option>За всё время</option><option>Этот год</option><option>Последние 3 месяца</option></select></div>'+
    '<div class="history-years"><b>Быстрые фильтры:</b><div><button class="chip-btn active">Все</button><button class="chip-btn">2026</button><button class="chip-btn">2025</button><button class="chip-btn">2024</button><button class="chip-btn">2023</button></div></div></div>'+
    '<div class="history-search-bottom"><div class="history-active"><b>Активные фильтры:</b><span class="active-chip">Вместе ×</span><span class="active-chip">Вечер ×</span><span class="active-chip">Повторить: Да ×</span></div><div class="toolbar-right"><button class="outline-btn">⇅ Сортировка: Дата ↓</button><button class="outline-btn">▥ Колонки</button></div></div></section>';
}
function resetHistoryFilters(){
  state.historyFilters={year:"",companion:"",timeOfDay:"",mainState:"",minRating:null,repeat:""};
}
function historyCompanionMode(v){
  const s=String(v.companions||"").trim().toLowerCase();
  if(s==="один") return "alone";
  if(!s || s==="не уточнено") return "";
  return "together";
}
function historyRepeatMode(v){
  const s=String(v.repeat_verdict||"").trim().toLowerCase();
  if(!s || s==="уточнить") return "";
  if(s.startsWith("нет") || s.includes("низкий") || s.includes("не повтор")) return "no";
  if(s.startsWith("да") || s.includes("возможно") || s.includes("иногда") || s.includes("только")) return "yes";
  return "";
}
function historyFilteredVisits(){
  const q=state.searchText.trim().toLowerCase(), f=state.historyFilters;
  return state.visits.filter(v=>{
    if(q && ![v.place_route_name,v.main_state,v.conclusion,v.repeat_verdict,v.what_worked,v.what_failed,v.companions].filter(Boolean).join(" ").toLowerCase().includes(q)) return false;
    if(f.year && String(v.visit_date||"").slice(0,4)!==f.year) return false;
    if(f.companion && historyCompanionMode(v)!==f.companion) return false;
    if(f.timeOfDay && String(v.time_of_day||"").toLowerCase()!==f.timeOfDay.toLowerCase()) return false;
    if(f.mainState && String(v.main_state||"")!==f.mainState) return false;
    if(f.minRating!==null && (v.rating===null||v.rating===undefined||Number(v.rating)<Number(f.minRating))) return false;
    if(f.repeat && historyRepeatMode(v)!==f.repeat) return false;
    return true;
  });
}
function historySegment(key,items,current){
  return '<div class="segment">'+items.map(([value,label])=>'<button type="button" data-history-button="'+e(key)+'" data-history-value="'+e(value)+'" class="'+(current===value?"active":"")+'">'+e(label)+'</button>').join("")+'</div>';
}
function historyActiveChips(){
  const f=state.historyFilters,out=[];
  if(f.year) out.push(f.year);
  if(f.companion) out.push(f.companion==="alone"?"Один":"Вместе");
  if(f.timeOfDay) out.push(f.timeOfDay);
  if(f.mainState) out.push(f.mainState);
  if(f.minRating!==null) out.push("Оценка ≥ "+f.minRating);
  if(f.repeat) out.push("Повторить: "+(f.repeat==="yes"?"Да":"Нет"));
  return out;
}
function historyFilterMarkup(filteredCount){
  const f=state.historyFilters;
  const states=[...new Set(state.visits.map(v=>v.main_state).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"ru"));
  const years=[...new Set(state.visits.map(v=>String(v.visit_date||"").slice(0,4)).filter(y=>/^\d{4}$/.test(y)))].sort().reverse();
  return '<aside class="panel filter-panel history-filter"><div class="panel-head"><div class="panel-title-wrap"><span class="panel-icon blue">'+icon("filter")+'</span><div class="panel-title">Фильтры истории</div></div><button class="link-btn" data-reset-history>Сбросить всё</button></div>'+
    filterSection("▣ Период",'<select class="select filter-select" data-history-select="year"><option value="">За всё время</option>'+years.map(y=>'<option value="'+e(y)+'" '+(f.year===y?"selected":"")+'>'+e(y)+'</option>').join("")+'</select>')+
    filterSection("♙ С кем был(и)",historySegment("companion",[["","Любой"],["alone","Один"],["together","Вместе"]],f.companion))+
    filterSection("◷ Время посещения",historySegment("timeOfDay",[["","Любое"],["День","День"],["Вечер","Вечер"]],f.timeOfDay))+
    filterSection("⌖ Район / город",'<div class="panel-sub">Для legacy Visits отдельный район не заполнен; используйте поиск по названию/маршруту.</div>')+
    filterSection("☺ Главное состояние",'<select class="select filter-select" data-history-select="mainState"><option value="">Любое состояние</option>'+states.map(v=>'<option value="'+e(v)+'" '+(f.mainState===v?"selected":"")+'>'+e(v)+'</option>').join("")+'</select>')+
    filterSection("★ Оценка",'<div class="rating-segment">'+[["","Любая"],["5","5"],["4","4+"],["3","3+"],["2","2+"],["1","1+"]].map(([v,l])=>'<button type="button" data-history-rating="'+e(v)+'" class="'+((f.minRating===null&&v==="")||String(f.minRating)===v?"active":"")+'">'+e(l)+'</button>').join("")+'</div>')+
    filterSection("↻ Повторить посещение",historySegment("repeat",[["","Любой"],["yes","Да"],["no","Нет"]],f.repeat))+
    filterSection("₽ Стоимость Visit",'<div class="history-disabled-filter" title="В импортированных legacy Visits visit_total пока не заполнен">Нет фактических сумм в текущем legacy-каноне</div>')+
    filterSection("♡ Эмоциональные состояния",'<div class="panel-sub">Используйте «Главное состояние»; числовые эмоции доступны в подробной карточке Visit.</div>')+
    '<div class="history-filter-action"><button class="action-primary" type="button">'+icon("search")+' Показать результаты</button><div class="panel-sub">Найдено '+e(filteredCount)+' посещений</div></div></aside>';
}
function renderHistory(){
  const visits=historyFilteredVisits();
  const active=historyActiveChips();
  const groups=new Map();
  for(const v of visits){
    const key=v.visit_date?new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",month:"long",year:"numeric"}).format(new Date(v.visit_date+"T12:00:00+03:00")):"Дата не указана";
    if(!groups.has(key)) groups.set(key,[]); groups.get(key).push(v);
  }
  let body="";
  for(const [month,arr] of groups){
    const knownCosts=arr.map(v=>v.visit_total).filter(v=>v!==null&&v!==undefined&&v!=="");
    const spent=knownCosts.reduce((s,v)=>s+Number(v),0);
    body+='<section class="month-group"><div class="month-title"><span>'+e(month)+'</span><small>'+arr.length+' посещения'+(knownCosts.length?(' • Потрачено '+money(spent)):'')+'</small><span>⌃</span></div>'+arr.map(visitRow).join("")+'</section>';
  }
  const top=historySearchPanel().replace(
    '<div class="history-active"><b>Активные фильтры:</b><span class="active-chip">Вместе ×</span><span class="active-chip">Вечер ×</span><span class="active-chip">Повторить: Да ×</span></div>',
    '<div class="history-active"><b>Активные фильтры:</b>'+(active.length?active.map(x=>'<span class="active-chip">'+e(x)+'</span>').join(""):'<span class="panel-sub">нет</span>')+'</div>'
  );
  const view='<div>'+top+'<div class="history-shell">'+historyFilterMarkup(visits.length)+
    '<section class="panel history-main">'+(body||'<div class="empty-state">По текущим фильтрам посещений не найдено.</div>')+'</section></div></div>';
  shell(view,"history",false);
}
function visitRow(v){
  const expanded=state.historyExpanded===v.id;
  let day="—",month="",week="";
  if(v.visit_date){
    const d=new Date(v.visit_date+"T12:00:00+03:00");
    day=new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",day:"2-digit"}).format(d);
    month=new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",month:"long"}).format(d);
    week=new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",weekday:"short"}).format(d);
  }
  const together=String(v.companions||"").toLowerCase().includes("один")?"Один":"Вместе";
  const repeat=String(v.repeat_verdict||"").toLowerCase().startsWith("нет")?"Нет":"Да";
  return '<div><article class="visit-row">'+
    '<div class="visit-date-tile visit-date"><b>'+e(day)+'</b><span>'+e(month)+'</span><small>'+e(week)+'</small></div>'+
    '<div class="visit-place"><img src="'+e(safeImg(v.cover_url))+'" alt="" onerror="this.src=\''+FALLBACK_IMAGE+'\'"><div><div class="visit-title">'+e(v.place_route_name||"Без названия")+'</div><div class="meta-line">'+e(v.evidence_scope||v.fact_source||"Посещение")+'</div><div class="meta-line">'+icon("clock")+e(v.time_of_day||"Время не указано")+'</div></div></div>'+
    '<span class="badge blue">'+e(together)+'</span><span class="badge violet">'+e(v.time_of_day||"—")+'</span><span class="rating">'+(v.rating?"★ "+e(v.rating):"—")+'</span><span class="badge '+(v.main_state?"green":"gray")+'">'+e(v.main_state||"—")+'</span><b>'+e(money(v.visit_total))+'</b><span class="badge '+(repeat==="Да"?"green":"red")+'">↻ '+repeat+'</span><span class="visit-note">'+e(v.conclusion||v.what_worked||"")+'</span><button class="expand-btn visit-action" data-expand-visit="'+e(v.id)+'">'+(expanded?"⌃":"›")+'</button>'+
    '</article>'+(expanded?visitDetail(v):"")+'</div>';
}
function visitDetail(v){
  const img=e(safeImg(v.cover_url));
  return '<div class="visit-detail"><div class="visit-gallery-detail"><div class="visit-gallery-copy"><img class="visit-main-img" src="'+img+'" alt="" onerror="this.src=\''+FALLBACK_IMAGE+'\'"><div><h3>'+e(v.place_route_name||"Посещение")+'</h3><p>'+e(v.what_worked||v.conclusion||"Описание посещения не заполнено.")+'</p></div></div><div class="visit-gallery-thumbs">'+[0,1,2,3].map(()=>'<img src="'+img+'" alt="" onerror="this.src=\''+FALLBACK_IMAGE+'\'">').join("")+'</div></div>'+
    '<div class="visit-cost-card"><h3>Расходы на посещение</h3><div><span>🎟 Билет / активность</span><b>'+e(money(v.activity_cost))+'</b></div><div><span>🚌 Общественный транспорт</span><b>'+e(money(v.public_transport_cost))+'</b></div><div><span>🚕 Такси</span><b>'+e(money(v.taxi_cost))+'</b></div><div><span>🛣 Дорога всего</span><b>'+e(money(v.road_total))+'</b></div><strong><span>Сумма Visit</span><b>'+e(money(v.visit_total))+'</b></strong></div></div>';
}

function findItem(type,id){
  const arr=type==="favorite"?state.favorites:type==="research"?state.research:state.events;
  return arr.find(x=>x.id===id)||null;
}
function renderDetail(){
  const r=route(), type=r.params.get("type")||"research", id=r.params.get("id");
  const item=findItem(type,id);
  if(!item){ shell('<section class="panel"><div class="empty-state">Карточка не найдена.</div></section>',"home",true); return; }

  const title=itemTitle(item,type), price=priceFor(item,type);
  const tags=[item.main_state,item.parent_activity||item.primary_activity||item.category,...(item.atmosphere_tags||[])].filter(Boolean).slice(0,11);
  const visitHistory=state.visits.filter(v=>(type==="research"&&v.research_id===id)||(type==="favorite"&&v.experience_id===id)||(type==="event"&&v.event_occurrence_id===id)).slice(0,4);
  const actionUrl=safeHref(type==="event"?(item.purchase_url||item.reservation_url||item.listing_url):type==="research"?item.source_url:item.official_url);
  const mapUrl=safeHref(item.map_url||item.route_map_url);
  const primaryLabel=type==="event"?"Билет / запись":type==="research"?"Открыть источник":"Запланировать посещение";
  const description=item.profile_text||item.profile_reason||item.hypothesis||item.description||item.comment||item.result_summary||"Описание будет дополняться подтверждёнными данными.";
  const why=item.profile_reason||item.what_to_check||item.hypothesis||item.best_configuration||"Нет отдельной подтверждённой записи.";
  const downside=item.avoid_conditions||item.weak_window||item.possible_downside||item.comment||"Нет отдельной подтверждённой записи.";
  const lastVisit=visitHistory[0]||null;
  const repeatText=lastVisit?.repeat_verdict||"Нет данных";
  const road=type==="research"?(item.travel_one_way_text||"—"):"—";
  const totalTime=type==="research"?(item.total_duration_text||item.duration_on_site_text||"—"):durationFor(item,type);
  const galleryImg=e(safeImg(item.cover_url));

  const actions=(actionUrl
    ?'<a class="detail-primary-action" href="'+e(actionUrl)+'" target="_blank" rel="noopener noreferrer">▣ '+e(primaryLabel)+'</a>'
    :'<button class="detail-primary-action" disabled>▣ '+e(primaryLabel)+'</button>')+
    '<button class="detail-soft-action">♥ В избранном</button><button class="detail-soft-action">⌯ Поделиться</button><button class="detail-icon-action">⋮</button>';

  const view='<div class="detail-page">'+
    '<div class="detail-main-area"><section class="panel detail-hero-card"><button class="back-results" data-nav="#/search">← Назад к результатам</button>'+
      '<div class="detail-hero-grid"><div class="detail-gallery"><div class="hero-wrap"><img class="hero-img" src="'+galleryImg+'" alt="" onerror="this.src=\''+FALLBACK_IMAGE+'\'"><button class="gallery-arrow left">‹</button><button class="gallery-arrow right">›</button><span class="gallery-count">1 / 12</span></div>'+
        '<div class="gallery-strip">'+[0,1,2,3,4,5,6].map(()=>'<img src="'+galleryImg+'" alt="" onerror="this.src=\''+FALLBACK_IMAGE+'\'">').join("")+'</div></div>'+
      '<div class="detail-copy"><div class="detail-topline"><span class="badge blue">★ '+e(sourceLabel(type))+'</span><span class="detail-rating">★ <b>'+e(item.rating||"—")+'</b><small>'+e(item.rating?"оценка":"нет оценки")+'</small></span></div>'+
        '<div class="detail-name">'+e(title)+'</div><div class="detail-kind">'+e(item.parent_activity||item.primary_activity||item.category||"")+'</div>'+
        '<div class="detail-context"><span>'+icon("pin")+e(districtFor(item,type))+'</span><span class="badge gray">'+e(item.environment||"")+'</span><span class="badge gray">'+e(item.social_format||"Для всех")+'</span></div>'+
        '<div class="detail-labels">'+tags.map((t,i)=>'<span class="badge '+(["orange","blue","violet","red","green"][i%5])+'">'+e(t)+'</span>').join("")+'</div>'+
        '<p class="detail-description">'+e(description)+'</p><div class="detail-actions">'+actions+'</div></div></div></section>'+
      '<div class="detail-lower"><section class="panel emotions-card"><div class="detail-section-title">Главное состояние и эмоции <span>?</span></div><div class="main-state-box"><b>'+e(item.main_state||"Главное состояние не указано")+'</b><small>'+e(item.parent_activity||item.primary_activity||"")+'</small></div>'+emotionMarkup(item)+'<h4>Атмосфера</h4><div class="detail-labels">'+tags.slice(1).map(t=>'<span class="badge blue">'+e(t)+'</span>').join("")+'</div></section>'+
        '<div class="detail-center-stack"><section class="panel pros-cons"><div><h3>👍 Почему стоит идти</h3>'+bulletText(why,"good")+'</div><div><h3>⚠ Что может не понравиться</h3>'+bulletText(downside,"bad")+'</div></section>'+
          '<section class="panel route-card"><h3>📍 Как добраться</h3><div class="route-options">'+routeOption("На метро",districtFor(item,type),road)+routeOption("На авто","Маршрут рядом","~ 35 мин")+routeOption("Общественный транспорт","Автобусы, электробусы",road)+'</div><div class="route-bottom">'+(mapUrl?'<a class="outline-btn" href="'+e(mapUrl)+'" target="_blank" rel="noopener noreferrer">⌖ Показать маршрут на карте</a>':'<button class="outline-btn" disabled>⌖ Показать маршрут на карте</button>')+'<div class="map-placeholder"><span>📍</span><b>'+e(title)+'</b></div></div></section></div>'+
        '<aside class="detail-right-stack"><section class="panel detail-summary"><h3>Краткая информация</h3>'+summaryRow("▣","Цена",money(price))+summaryRow("▣","С дорогой (примерно)",money(price))+summaryRow("◷","Время на месте",durationFor(item,type))+summaryRow("🚙","Время дороги",road)+summaryRow("◷","Всего времени",totalTime)+'<hr>'+summaryRow("☀","Лучше всего",item.best_window||item.time_of_day||"День / Вечер")+summaryRow("♟","Один / Вместе",item.social_format||"Для всех")+summaryRow("❉","Сезон",item.season||"Круглый год")+'</section>'+
          '<section class="panel detail-history-side"><div class="side-head"><h3>▣ История посещений</h3><button class="link-btn" data-nav="#/history">Все посещения →</button></div>'+detailVisitHistory(visitHistory)+'</section>'+
          '<section class="panel repeat-card"><h3>↻ Повторить?</h3><strong>'+e(repeatText)+'</strong><p>'+e(lastVisit?.conclusion||"Решение появится после подтверждённого Visit.")+'</p></section></aside>'+
      '</div></div></div>';

  shell(view,"home",true);
}
function summaryRow(ic,label,value){
  return '<div class="summary-row"><span class="summary-ic">'+ic+'</span><span>'+e(label)+'</span><b>'+e(value)+'</b></div>';
}
function bulletText(text,kind){
  const parts=String(text||"").split(/[;•\n]+/).map(x=>x.trim()).filter(Boolean).slice(0,5);
  if(!parts.length) parts.push("Нет подтверждённой записи.");
  return '<ul class="detail-bullets '+kind+'">'+parts.map(x=>'<li>'+e(x)+'</li>').join("")+'</ul>';
}
function routeOption(title,main,time){
  return '<div class="route-option"><span class="badge blue">'+e(title)+'</span><b>'+e(main||"—")+'</b><small>'+e(time||"—")+'</small></div>';
}
function detailVisitHistory(visits){
  if(!visits.length) return '<div class="empty-state">Посещений пока нет.</div>';
  return visits.slice(0,3).map(v=>'<div class="detail-visit-mini"><img src="'+e(safeImg(v.cover_url))+'" alt="" onerror="this.src=\''+FALLBACK_IMAGE+'\'"><div><b>'+e(v.visit_date?fmtDate(v.visit_date,{day:"numeric",month:"long",year:"numeric"}):"Дата не указана")+'</b><div class="meta-line">'+e(v.conclusion||v.what_worked||"")+'</div></div><span class="rating">★ '+e(v.rating||"—")+'</span></div>').join("");
}
function emotionMarkup(item){
  const fields=[["Спокойствие","calm_score"],["Вдохновение","relief_score"],["Радость","joy_score"],["Энергия","vitality_score"],["Уединение","satisfaction_score"]];
  return '<div class="emotion-bars">'+fields.map(([label,key])=>{const val=n(item[key]);return '<div class="emotion-bar-row"><span>'+e(label)+'</span><div class="bar"><i style="width:'+Math.max(0,Math.min(100,val/5*100))+'%"></i></div><b>'+e(item[key]??"—")+'</b></div>';}).join("")+'</div>';
}


function settingsMenuItem(iconText,title,sub,active=false){
  return '<button type="button" class="setting-menu-btn '+(active?"active":"")+'"><span class="settings-menu-icon">'+iconText+'</span><span><b>'+e(title)+'</b><small>'+e(sub)+'</small></span></button>';
}
function settingSwitch(label,help,key){
  const checked=state.settings?.[key]!==false;
  return '<label class="setting-switch-row"><span><b>'+e(label)+'</b>'+(help?'<small>'+e(help)+'</small>':'')+'</span><span class="ui-switch"><input type="checkbox" name="'+e(key)+'" '+(checked?"checked":"")+'><i></i></span></label>';
}
function sourceSetting(key,label){
  const checked=state.settings?.[key]!==false;
  return '<label class="source-setting"><span class="ui-switch"><input type="checkbox" name="'+e(key)+'" '+(checked?"checked":"")+'><i></i></span><span>'+e(label)+'</span></label>';
}
function renderSettings(){
  const s=state.settings||{}, amount=state.budgetVersion?.monthly_amount??"";
  const currentAmount=state.budget?.allocation_amount??state.budgetVersion?.monthly_amount??null;
  const currentMonth=isoMonthNow().slice(0,7);
  const versionMonth=state.budgetVersion?.effective_month?.slice(0,7)||currentMonth;
  const effective=versionMonth>=currentMonth?versionMonth:currentMonth;
  const view='<div class="settings-layout">'+
    '<aside class="settings-menu">'+
      settingsMenuItem("⚙","Основные настройки","Бюджет, поиск, общий режим",true)+
      settingsMenuItem("⌕","Поиск и выдача","Источники, фильтры, период")+
      settingsMenuItem("▥","Таблица и колонки","Видимые поля, порядок")+
      settingsMenuItem("⌖","Местоположение и дорога","Базовая точка, транспорт")+
      settingsMenuItem("☁","Погода","Город, отображение")+
      settingsMenuItem("▣","Интерфейс","Внешний вид, формат")+
      settingsMenuItem("♙","Аккаунт","Профиль, синхронизация")+
      settingsMenuItem("▤","Данные","Экспорт, сброс настроек")+
    '</aside>'+
    '<form class="settings-main" id="settings-form"><div class="settings-heading"><h1>Основные настройки</h1><p>Ключевые параметры приложения. Изменения сохраняются по кнопке «Сохранить».</p></div>'+
      '<section class="panel setting-card budget-setting-card"><div class="setting-card-title"><span>♟</span><div><h3>Бюджет на досуг / события</h3><p>Задайте комфортную сумму, которую вы планируете тратить на мероприятия, рестораны, развлечения и другие активности.</p></div><div class="setting-info-note">ⓘ Новое значение начнёт действовать с выбранного месяца. Прошлые месяцы не изменяются.</div></div>'+
        '<div class="budget-setting-grid"><label><span>Сумма бюджета в месяц</span><div class="money-input"><input name="budget_amount" type="number" min="0" step="100" value="'+e(amount)+'" placeholder="Не задан"><b>₽</b></div></label>'+
        '<label><span>Действует с</span><input class="input" name="budget_month" type="month" value="'+e(effective)+'"></label>'+
        '<div class="budget-example"><b>Текущее состояние</b><span>Сейчас: '+e(currentAmount===null?"не задан":money(currentAmount))+'</span><span>Новое значение: '+e(amount===""?"не задан":money(amount))+'</span><button class="budget-save-btn" type="button" id="save-budget">'+icon("save")+' Сохранить бюджет</button><small class="budget-save-status '+(state.budgetStatus.startsWith("Ошибка")?"error":"")+'">'+e(state.budgetStatus)+'</small></div></div></section>'+
      '<section class="panel setting-card"><div class="setting-card-title"><span>⌕</span><div><h3>Быстрые настройки поиска</h3><p>Эти параметры определяют, что показывается по умолчанию на Главной и в поиске.</p></div></div>'+
        '<div class="search-setting-grid"><div><b>Источники по умолчанию</b><div class="source-settings">'+sourceSetting("default_favorites","Любимые")+sourceSetting("default_research","Research")+sourceSetting("default_events","События")+'</div></div>'+
        '<label><b>Период событий по умолчанию</b><select name="event_horizon_days" class="input"><option value="7" '+(s.event_horizon_days===7?"selected":"")+'>7 дней</option><option value="14" '+(s.event_horizon_days!==7&&s.event_horizon_days!==30?"selected":"")+'>14 дней</option><option value="30" '+(s.event_horizon_days===30?"selected":"")+'>30 дней</option></select></label>'+
        '<div class="remember-settings">'+settingSwitch("Сохранять последний запрос","", "remember_last_query")+settingSwitch("Сохранять последние фильтры","", "remember_last_filters")+'</div></div></section>'+
      '<section class="panel setting-card"><div class="setting-card-title"><span>⌖</span><div><h3>Местоположение и дорога</h3><p>Используется для расчёта времени и удобства маршрутов.</p></div></div>'+
        '<div class="location-setting-grid"><label><b>Базовая точка</b><div class="location-input">'+icon("pin")+'<input name="base_location" value="'+e(s.base_location||"Коптево")+'"></div></label>'+
        '<div><b>Рабочая область</b><div class="button-segment"><label><input type="radio" name="working_area" value="MOSCOW" '+(s.working_area==="MOSCOW"?"checked":"")+'>Москва</label><label><input type="radio" name="working_area" value="MOSCOW_MO" '+(s.working_area!=="MOSCOW"?"checked":"")+'>Москва и МО</label></div></div>'+
        '<div><b>Предпочитаемый транспорт</b><div class="button-segment three"><label><input type="radio" name="preferred_transport" value="ANY" '+(s.preferred_transport==="ANY"?"checked":"")+'>Любой</label><label><input type="radio" name="preferred_transport" value="PUBLIC" '+(s.preferred_transport==="PUBLIC"?"checked":"")+'>Общественный</label><label><input type="radio" name="preferred_transport" value="CAR" '+(s.preferred_transport==="CAR"?"checked":"")+'>Автомобиль</label></div></div></div></section>'+
      '<section class="panel setting-card"><div class="setting-card-title"><span>🌤️</span><div><h3>Погода</h3><p>Настройте отображение погодного блока.</p></div></div>'+
        '<div class="weather-settings-grid"><label><b>Город</b><input class="input" name="weather_city" value="'+e(s.weather_city||"Москва")+'"></label>'+settingSwitch("Показывать погоду на Главной","", "show_weather")+settingSwitch("Показывать прогноз на 7 дней","", "show_week_forecast")+'<label class="setting-switch-row disabled"><span><b>Использовать моё текущее местоположение</b><small>В будущем, если будет поддержка.</small></span><span class="ui-switch"><input type="checkbox" disabled><i></i></span></label></div></section>'+
      '<section class="panel setting-card"><div class="setting-card-title"><span>▣</span><div><h3>Интерфейс</h3><p>Настройте удобный для вас вид приложения.</p></div></div>'+
        '<div class="interface-settings-grid"><div><b>Компактность выдачи</b><div class="button-segment"><label><input type="radio" name="density" value="COMPACT" '+(s.density==="COMPACT"?"checked":"")+'>Компактно</label><label><input type="radio" name="density" value="STANDARD" '+(s.density!=="COMPACT"?"checked":"")+'>Стандартно</label></div></div>'+
        '<div><b>Формат результатов по умолчанию</b><div class="button-segment"><label><input type="radio" name="default_results_view" value="LIST" '+(s.default_results_view!=="GRID"?"checked":"")+'>Список</label><label><input type="radio" name="default_results_view" value="GRID" '+(s.default_results_view==="GRID"?"checked":"")+'>Таблица</label></div></div>'+
        '<div class="interface-toggles">'+settingSwitch("Показывать изображения","", "show_images")+settingSwitch("Показывать эмоциональные шкалы","", "show_emotion_scales")+settingSwitch("Показывать атмосферные теги","", "show_atmosphere_tags")+'</div></div></section>'+
      '<div class="save-bar"><button class="chip-btn" type="button" data-cancel-settings>Отменить изменения</button><button class="save-btn" type="submit">'+icon("save")+' Сохранить настройки</button></div></form>'+
    '<aside class="settings-side"><section class="panel side-card account-card"><h3>♙ Аккаунт</h3><div class="account-email">'+e(state.session?.user?.email||"Пользователь")+'<small>Ваш аккаунт</small></div><div class="sync-box">● <b>Данные синхронизированы</b><small>Supabase / RLS</small></div><button class="logout-btn" id="logout">⇥ Выйти</button></section>'+
      '<section class="panel side-card"><h3>▤ Мои данные</h3><button class="data-action" type="button" id="export-data">⇩ <span><b>Экспортировать мои данные</b><small>Скачать JSON с вашими местами, поездками и настройками.</small></span></button><div class="export-download-slot">'+(state.exportUrl?'<a class="export-ready-link" href="'+e(state.exportUrl)+'" download="APP-004-export-'+e(isoDateMoscow())+'.json">⇩ Скачать подготовленный файл</a>':'')+'</div><button class="data-action" type="button" id="reset-interface">↻ <span><b>Восстановить стандартные настройки</b><small>Сбросить базовые настройки интерфейса.</small></span></button></section>'+
      '<section class="panel side-card about-card"><h3>ⓘ О приложении</h3><div class="about-app"><span class="brand-mark"><svg viewBox="0 0 42 42" fill="currentColor"><path d="M4 37h34v2H4zM8 35V18h4v17zm6 0V9h4v26zm6 0V15h4v20zm6 0V5h4v30zm6 0V21h4v14z"/></svg></span><div><b>Москва и МО</b><small>Планируйте прогулки, открывайте новые места и следите за событиями.</small></div><em>v0.4</em></div></section></aside></div>';
  shell(view,"settings",false);
}
async function exportUserData(){
  const btn=document.querySelector("#export-data");
  if(btn){btn.disabled=true;btn.dataset.oldText=btn.innerHTML;btn.innerHTML='Подготавливаю экспорт…';}
  try{
    const tables=["app004_settings","app004_favorite_projection","app004_research","app004_visits","app004_budget_versions","app004_budget_months","app004_accounting_transactions","app004_commitments","app004_shared_expenses","app004_shared_receivables","app004_payables"];
    const out={exported_at:new Date().toISOString(),app:"APP-004",data:{}};
    for(const table of tables){
      const {data,error}=await supabase.from(table).select("*");
      if(error) throw error;
      out.data[table]=data||[];
    }
    if(state.exportUrl) URL.revokeObjectURL(state.exportUrl);
    const blob=new Blob([JSON.stringify(out,null,2)],{type:"application/json;charset=utf-8"});
    state.exportUrl=URL.createObjectURL(blob);
    const slot=document.querySelector(".export-download-slot");
    const filename="APP-004-export-"+isoDateMoscow()+".json";
    if(slot){
      slot.innerHTML='<a class="export-ready-link" href="'+e(state.exportUrl)+'" download="'+e(filename)+'">⇩ Скачать подготовленный файл</a>';
      const link=slot.querySelector("a");
      if(link) setTimeout(()=>link.click(),0);
    }
    toast("Экспорт готов. Если скачивание не началось, нажмите «Скачать подготовленный файл».");
  }catch(err){
    toast("Экспорт не выполнен: "+(err?.message||String(err)),true);
  }finally{
    if(btn){btn.disabled=false;btn.innerHTML=btn.dataset.oldText||'Экспортировать мои данные';}
  }
}
async function resetInterfaceSettings(){
  const patch={default_favorites:true,default_research:true,default_events:true,event_horizon_days:14,remember_last_query:true,remember_last_filters:true,show_weather:true,show_week_forecast:true,density:"STANDARD",default_results_view:"LIST",show_images:true,show_emotion_scales:true,show_atmosphere_tags:true};
  const {error}=await supabase.from("app004_settings").update(patch).eq("user_id",state.session.user.id);
  if(error){toast("Не удалось сбросить настройки: "+error.message,true);return;}
  toast("Базовые настройки интерфейса восстановлены.");await loadAll();renderSettings();
}
async function saveBudgetFromSettings(){
  const form=document.querySelector("#settings-form");
  if(!form) return;
  const fd=new FormData(form);
  const raw=String(fd.get("budget_amount")||"").trim();
  const monthBase=String(fd.get("budget_month")||"").trim();
  if(raw===""){ state.budgetStatus="Ошибка: введите сумму бюджета."; renderSettings(); return; }
  const amount=Number(raw);
  if(!Number.isFinite(amount)||amount<0){ state.budgetStatus="Ошибка: сумма должна быть 0 или больше."; renderSettings(); return; }
  if(!/^\d{4}-\d{2}$/.test(monthBase)){ state.budgetStatus="Ошибка: выберите месяц начала."; renderSettings(); return; }
  const currentMonth=isoMonthNow().slice(0,7);
  if(monthBase<currentMonth){ state.budgetStatus="Ошибка: нельзя создавать новую версию бюджета задним числом."; renderSettings(); return; }

  const currentBudget=state.budget?.allocation_amount??state.budgetVersion?.monthly_amount??null;
  const currentEffective=state.budgetVersion?.effective_month?.slice(0,7)||"";
  const same=Number(currentBudget)===amount && currentEffective===monthBase;
  if(!same){
    const {error}=await supabase.rpc("app004_set_budget_version",{p_effective_month:monthBase+"-01",p_monthly_amount:amount,p_comment:"Сохранено пользователем в Settings APP-004"});
    if(error){ state.budgetStatus="Ошибка: "+error.message; renderSettings(); return; }
  }
  const {error:recalcError}=await supabase.rpc("app004_recalculate_budget_month",{p_month:monthBase+"-01"});
  if(recalcError){ state.budgetStatus="Ошибка пересчёта: "+recalcError.message; renderSettings(); return; }
  state.budgetStatus=same?"Бюджет уже сохранён. Пересчёт обновлён.":"Сохранено: "+money(amount)+" с "+monthBase+".";
  await loadAll();
  renderSettings();
  toast(state.budgetStatus);
}

async function saveSettings(form){
  const fd=new FormData(form), checkboxKeys=["default_favorites","default_research","default_events","remember_last_query","remember_last_filters","show_weather","show_week_forecast","show_images","show_emotion_scales","show_atmosphere_tags"];
  const patch={
    base_location:String(fd.get("base_location")||"Коптево").trim(),
    working_area:String(fd.get("working_area")||"MOSCOW_MO"),
    preferred_transport:String(fd.get("preferred_transport")||"ANY"),
    event_horizon_days:Number(fd.get("event_horizon_days")||14),
    weather_city:String(fd.get("weather_city")||"Москва").trim(),
    density:String(fd.get("density")||"STANDARD"),
    default_results_view:String(fd.get("default_results_view")||"LIST")
  };
  for(const k of checkboxKeys) patch[k]=fd.get(k)==="on";
  const {error}=await supabase.from("app004_settings").update(patch).eq("user_id",state.session.user.id);
  if(error){ toast("Не удалось сохранить настройки: "+error.message,true); return; }
  toast("Настройки сохранены.");
  await loadAll(); renderSettings();
}

function renderCurrent(){
  if(!state.session){ renderAuth(); return; }
  const r=route();
  if(r.path==="/history") renderHistory();
  else if(r.path==="/settings") renderSettings();
  else if(r.path==="/search") renderSearch();
  else if(r.path==="/detail") renderDetail();
  else renderDashboard();
}

root.addEventListener("click",async ev=>{
  const nav=ev.target.closest("[data-nav]");
  if(nav){ ev.preventDefault(); go(nav.dataset.nav); return; }
  const detail=ev.target.closest("[data-detail]");
  if(detail){
    ev.preventDefault(); const [type,id]=detail.dataset.detail.split(":");
    go("#/detail?type="+encodeURIComponent(type)+"&id="+encodeURIComponent(id)); return;
  }
  const st=ev.target.closest("[data-source-toggle]");
  if(st){ const k=st.dataset.sourceToggle; state.sources[k]=!state.sources[k]; renderCurrent(); return; }
  const q=ev.target.closest("[data-quick]");
  if(q && q.tagName!=="INPUT"){ state.quick=state.quick===q.dataset.quick?"":q.dataset.quick; if(route().path==="/") go("#/search"); else renderCurrent(); return; }
  const adv=ev.target.closest("[data-adv-button]");
  if(adv){ const key=adv.dataset.advButton,value=adv.dataset.advValue||""; state.filters[key]=state.filters[key]===value?"":value; renderSearch(); return; }
  const atm=ev.target.closest("[data-atmos-filter]");
  if(atm){ const key=atm.dataset.atmosFilter; state.filters.atmosphere[key]=state.filters.atmosphere[key]?0:1; renderSearch(); return; }
  const clearRange=ev.target.closest("[data-clear-range]");
  if(clearRange){ state.filters[clearRange.dataset.clearRange]=null; renderSearch(); return; }
  const hist=ev.target.closest("[data-history-button]");
  if(hist){ const key=hist.dataset.historyButton,value=hist.dataset.historyValue||""; state.historyFilters[key]=value; renderHistory(); return; }
  const histRating=ev.target.closest("[data-history-rating]");
  if(histRating){ state.historyFilters.minRating=histRating.dataset.historyRating===""?null:Number(histRating.dataset.historyRating); renderHistory(); return; }
  if(ev.target.closest("[data-reset-history]")){ state.searchText=""; resetHistoryFilters(); renderHistory(); return; }
  const exp=ev.target.closest("[data-expand-visit]");
  if(exp){ state.historyExpanded=state.historyExpanded===exp.dataset.expandVisit?null:exp.dataset.expandVisit; renderHistory(); return; }
  if(ev.target.closest("[data-reset-filters]")){ state.quick="";state.searchText="";state.sources={favorite:true,research:true,event:true};resetAdvancedFilters();renderSearch();return; }
  if(ev.target.closest("#magic-link")){ await sendMagicLink(); return; }
  if(ev.target.closest("#logout")){ await supabase.auth.signOut(); return; }
  if(ev.target.closest("#save-budget")){ await saveBudgetFromSettings(); return; }
  if(ev.target.closest("#export-data")){ await exportUserData(); return; }
  if(ev.target.closest("#reset-interface")){ await resetInterfaceSettings(); return; }
  if(ev.target.closest("[data-cancel-settings]")){ renderSettings(); return; }
});
root.addEventListener("change",ev=>{
  if(ev.target.matches("[data-filter-source]")){ state.sources[ev.target.dataset.filterSource]=ev.target.checked; renderSearch(); }
  if(ev.target.matches("#result-sort")){ state.resultSort=ev.target.value; renderSearch(); }
  if(ev.target.matches('input[data-quick]')){ state.quick=ev.target.checked?ev.target.dataset.quick:"";renderSearch(); }
  if(ev.target.matches("[data-adv-select]")){ state.filters[ev.target.dataset.advSelect]=ev.target.value; renderSearch(); }
  if(ev.target.matches("[data-adv-check]")){ state.filters[ev.target.dataset.advCheck]=ev.target.checked; renderSearch(); }
  if(ev.target.matches("[data-adv-range]")){ const key=ev.target.dataset.advRange,max=Number(ev.target.max),value=Number(ev.target.value); state.filters[key]=value>=max?null:value; renderSearch(); }
  if(ev.target.matches("[data-emotion-filter]")){ const key=ev.target.dataset.emotionFilter,value=Number(ev.target.value); if(value) state.filters.emotions[key]=value; else delete state.filters.emotions[key]; renderSearch(); }
  if(ev.target.matches("[data-history-select]")){ state.historyFilters[ev.target.dataset.historySelect]=ev.target.value; renderHistory(); }
});
root.addEventListener("submit",async ev=>{
  ev.preventDefault();
  if(ev.target.id==="password-login"){ await signInPassword(ev.target); return; }
  if(ev.target.id==="global-search-form"){ state.searchText=document.querySelector("#global-search")?.value.trim()||""; go("#/search"); return; }
  if(ev.target.id==="history-search-form"){ state.searchText=document.querySelector("#history-search")?.value.trim()||""; renderHistory(); return; }
  if(ev.target.id==="settings-form"){ await saveSettings(ev.target); return; }
});

window.addEventListener("hashchange",()=>renderCurrent());

async function init(){
  const {data:{session}}=await supabase.auth.getSession();
  state.session=session;
  if(session) await loadAll();
  renderCurrent();
  supabase.auth.onAuthStateChange((event,sessionNow)=>{
    setTimeout(async()=>{
      const changed=(state.session?.access_token||"")!==(sessionNow?.access_token||"");
      state.session=sessionNow;
      if(changed && sessionNow){ await loadAll(); }
      if(!sessionNow){ state.favorites=[];state.research=[];state.events=[];state.visits=[];state.settings=null;state.budget=null; }
      renderCurrent();
    },0);
  });
}
init();
