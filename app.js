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
  historyExpanded: null,
  lastError: ""
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
  const x=Math.round(n(v));
  return (x>0?"+":"")+x+"°";
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
    state.events=(es.data||[]).filter(x=>eventStillCurrent(x));
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
function eventStillCurrent(ev){
  if(!ev.ends_at) return true;
  const end=new Date(ev.ends_at); if(Number.isNaN(end.getTime())) return true;
  const today=new Date(isoDateMoscow()+"T00:00:00+03:00");
  return end>=today;
}

async function loadWeather(){
  if(state.settings && state.settings.show_weather===false){ state.weather=null; return; }
  try{
    const qs=new URLSearchParams({
      latitude:"55.7558",longitude:"37.6176",timezone:"Europe/Moscow",forecast_days:"7",
      hourly:"temperature_2m,weather_code,precipitation_probability",
      daily:"weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
    });
    const res=await fetch("https://api.open-meteo.com/v1/forecast?"+qs);
    if(!res.ok) throw new Error("Weather HTTP "+res.status);
    state.weather=await res.json();
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
  const code=w.hourly.weather_code[idx], info=wmo(code,hour<6||hour>=22);
  return {name,temp:Math.round(n(w.hourly.temperature_2m[idx])),precip:Math.round(n(w.hourly.precipitation_probability[idx])),...info};
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
    const d=ev.starts_at?new Date(ev.starts_at):null;
    const day=d?new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",day:"2-digit"}).format(d):"•";
    const mon=d?new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",month:"short"}).format(d):"по записи";
    const wd=d?new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",weekday:"short"}).format(d):"";
    const price=ev.is_free?0:(ev.current_price??ev.regular_price);
    return '<article class="mobile-event-slide" data-detail="event:'+e(ev.id)+'">'+
      '<div class="mobile-event-visual"><img src="'+e(safeImg(ev.cover_url))+'" alt="" loading="lazy" onerror="this.src=\''+FALLBACK_IMAGE+'\'">'+
        '<div class="mobile-date-badge"><b>'+e(day)+'</b><span>'+e(mon)+'</span><small>'+e(wd)+'</small></div><div class="mobile-heart">♡</div></div>'+
      '<div class="mobile-event-copy"><div class="event-title">'+e(ev.title)+'</div>'+
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
    const key=ev.starts_at?fmtDate(ev.starts_at,{year:"numeric",month:"2-digit",day:"2-digit"}):"По записи";
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(ev);
  }
  let html="";
  for(const [key,arr] of groups){
    const d=arr[0].starts_at?new Date(arr[0].starts_at):null;
    const day=d?new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",day:"2-digit"}).format(d):"•";
    const month=d?new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",month:"long"}).format(d):"по записи";
    const week=d?new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",weekday:"short"}).format(d):"";
    html+='<div class="event-group"><div class="date-tile"><div class="date-day">'+e(day)+'</div><div class="date-month">'+e(month)+'</div><div class="date-week">'+e(week)+'</div></div>'+
      '<div class="event-cards">'+arr.map(eventCard).join("")+'</div></div>';
  }
  return html||'<div class="empty-state">Актуальных событий в проекции пока нет.</div>';
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
  let week="";
  for(let i=0;i<Math.min(7,daily.time?.length||0);i++){
    const d=new Date(daily.time[i]+"T12:00:00+03:00"), info=wmo(daily.weather_code[i],false);
    const date=new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",day:"2-digit",month:"2-digit"}).format(d);
    const wd=new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",weekday:"short"}).format(d);
    week+='<div class="week-row"><b>'+e(date)+' <span style="color:#2581dd">'+e(wd)+'</span></b><span>'+info.icon+'</span><span><span class="lo">+'+e(Math.round(n(daily.temperature_2m_min[i])))+'°</span> / <span class="hi">+'+e(Math.round(n(daily.temperature_2m_max[i])))+'°</span></span><span>'+e(info.text)+', '+e(Math.round(n(daily.precipitation_probability_max[i])))+'%</span></div>';
  }
  return '<div class="weather-body"><div class="weather-today-title">Сегодня, '+e(fmtDate(isoDateMoscow(),{day:"numeric",month:"long",weekday:"long"}))+'</div>'+
    '<div class="period-grid">'+ps.map(p=>'<div class="period"><div class="period-name">'+e(p.name)+'</div><div class="weather-icon">'+p.icon+'</div><div class="temp">'+(p.temp>=0?"+":"")+e(p.temp)+'°</div><div class="condition">'+e(p.text)+'</div><div class="precip">Осадки '+e(p.precip)+'%</div></div>').join("")+'</div>'+
    '<div class="week-title">Прогноз на 7 дней</div><div class="week-list">'+week+'</div></div>';
}
function renderDashboard(){
  const favorites=state.favorites.slice(0,5), research=state.research.slice(0,6), events=filterItems(state.events,"event").slice(0,14);
  const view='<div class="dashboard-grid">'+
    '<div class="dash-left">'+
      '<section class="panel" id="favorites-panel"><div class="panel-head"><div class="panel-title-wrap"><span class="panel-icon">★</span><div><div class="panel-title">Куда сходить</div><div class="panel-sub">Проверенные места • Ваши фавориты</div></div></div><button class="link-btn" data-nav="#/search?source=favorite">Все любимые&nbsp; →</button></div><div class="stack-list">'+(favorites.length?favorites.map(x=>miniCard(x,"favorite")).join(""):'<div class="empty-state">Любимых пока нет.</div>')+'</div></section>'+
      '<section class="panel" id="research-panel"><div class="panel-head"><div class="panel-title-wrap"><span class="panel-icon blue">⌕</span><div><div class="panel-title">Исследовать новое</div><div class="panel-sub">Идеи, которые стоит проверить</div></div></div><button class="link-btn" data-nav="#/search?source=research">Все исследования&nbsp; →</button></div><div class="stack-list">'+(research.length?research.map(x=>miniCard(x,"research")).join(""):'<div class="empty-state">Нет активных исследований.</div>')+'</div></section>'+
    '</div>'+
    '<section class="panel" id="events-panel"><div class="panel-head"><div class="panel-title-wrap"><span class="panel-icon blue">▣</span><div><div class="panel-title">События — ближайшие 14 дней</div><div class="panel-sub desktop-only">Актуальные события в Москве и МО</div></div></div><button class="link-btn" data-nav="#/search?source=event">Все события&nbsp; →</button></div><div class="event-list desktop-event-list">'+groupEvents(events)+'</div><div class="mobile-event-list mobile-only">'+mobileEvents(events)+'</div></section>'+
    '<div class="dash-right">'+
      '<section class="panel" id="budget-panel"><div class="panel-head"><div class="panel-title-wrap"><span class="panel-icon blue">'+icon("wallet")+'</span><div class="panel-title">Бюджет месяца</div></div><button class="link-btn" data-nav="#/settings">Настроить&nbsp; →</button></div>'+budgetMarkup()+'</section>'+
      '<section class="panel" id="weather-panel"><div class="panel-head"><div class="panel-title-wrap"><span class="panel-icon">🌤️</span><div><div class="panel-title">Погода в Москве</div><div class="panel-sub">Источник: Open‑Meteo</div></div></div><button class="link-btn">Открыть на карте&nbsp; →</button></div>'+weatherMarkup()+'</section>'+
    '</div></div>';
  shell(view,"home",true);
}

function filterItems(items,type){
  const q=state.searchText.trim().toLowerCase();
  const quick=state.quick;
  return items.filter(x=>{
    const text=[
      itemTitle(x,type),districtFor(x,type),x.parent_activity,x.primary_activity,x.category,x.main_state,
      ...(Array.isArray(x.atmosphere_tags)?x.atmosphere_tags:[])
    ].filter(Boolean).join(" ").toLowerCase();
    if(q && !q.split(/\s+/).every(word=>text.includes(word.replace(/[+]/g,"")))) return false;
    if(quick==="free" && Number(priceFor(x,type))!==0) return false;
    if(quick==="evening" && !(String(x.time_of_day||x.best_window||x.time_text||"").toLowerCase().includes("веч"))) return false;
    if(quick==="day" && !(String(x.time_of_day||x.best_window||x.time_text||"").toLowerCase().includes("день")||String(x.time_of_day||"").toLowerCase().includes("дн"))) return false;
    if(quick==="alone" && x.supports_alone===false) return false;
    if(quick==="together" && x.supports_together===false) return false;
    if(quick==="moscow" && String(x.geo_scope||x.district_city||"Москва").toLowerCase().includes("мо ")) return false;
    if(quick==="mo" && !String(x.geo_scope||x.district_city||"").toLowerCase().includes("мо")) return false;
    if(type==="event" && ["today","tomorrow","weekend","14d"].includes(quick) && !eventDateMatch(x,quick)) return false;
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
function renderSearch(){
  const r=route();
  const src=r.params.get("source");
  if(src && ["favorite","research","event"].includes(src)){
    state.sources={favorite:false,research:false,event:false};state.sources[src]=true;
    history.replaceState(null,"",location.pathname+location.search+"#/search");
  }
  const results=allSearchItems();
  const rows=results.map(({type,item},i)=>resultRow(item,type,i+1)).join("");
  const view='<div class="results-shell">'+
    '<aside class="panel filter-panel search-filter-panel"><div class="panel-head filter-main-head"><div class="panel-title-wrap"><span class="panel-icon blue">'+icon("filter")+'</span><div class="panel-title">Фильтры</div></div><span class="badge gray">Вариант 2</span></div>'+
      '<div class="filter-columns"><div class="filter-column">'+
        '<button class="link-btn reset-link" data-reset-filters>Сбросить всё&nbsp; ×</button>'+
        filterSection("Источники",'<label class="check inline-check"><input type="checkbox" data-filter-source="favorite" '+(state.sources.favorite?"checked":"")+'> Любимые</label><label class="check inline-check"><input type="checkbox" data-filter-source="research" '+(state.sources.research?"checked":"")+'> Research</label><label class="check inline-check"><input type="checkbox" data-filter-source="event" '+(state.sources.event?"checked":"")+'> События</label>')+
        filterSection("Район / город",'<select class="select filter-select"><option>Все районы</option><option>Москва</option><option>МО</option></select>')+
        '<div class="filter-pair">'+filterMini("Сектор") + filterMini("Класс")+'</div>'+
        '<div class="filter-pair">'+filterMini("Подтип") + filterMini("Дата")+'</div>'+
        filterSection("Москва / МО",segmented([["moscow","Москва"],["mo","МО"],["","Любой"]],state.quick))+
        filterSection("Один / вместе",segmented([["alone","Один"],["together","Вместе"],["","Любой"]],state.quick))+
        filterSection("День / вечер",segmented([["day","☀ День"],["evening","☾ Вечер"],["","Любое"]],state.quick))+
        filterSection("Улица / помещение",'<div class="segment"><button type="button">♙ Улица</button><button type="button">⌂ Помещение</button><button class="active" type="button">Любое</button></div>')+
        filterSection("Цена (₽)",rangeVisual("0","5000","72%"))+
        filterSection("Время дороги от меня",rangeVisual("0","90 мин","58%"))+
        filterSection("Полное время (включая дорогу)",rangeVisual("0","8 ч","64%"))+
      '</div><div class="filter-column">'+
        filterSection("Главное состояние",'<div class="state-chip-grid"><button>Любое</button><button>Спокойствие</button><button>Вдохновение</button><button>Активность</button><button>Романтика</button><button>Обучение</button><button>Семейное</button><button>Другое</button></div>')+
        filterSection("Эмоциональные шкалы",emotionFilterVisual())+
        filterSection("Атмосфера",'<div class="atmo-grid"><button>💧 Вода</button><button>Простор</button><button class="active">Тишина</button><button class="active">Зелень</button><button>▣ Огни</button><button>♫ Музыка</button><button>♨ Фонтаны</button><button>⚒ Архитектура</button></div>')+
        filterSection("Бесплатно",'<label class="check"><input type="checkbox" data-quick="free" '+(state.quick==="free"?"checked":"")+'> Только бесплатные</label>')+
        filterSection("Скидка",'<label class="check"><input type="checkbox"> Только со скидкой</label>')+
        filterSection("Доступность билетов",'<label class="check"><input type="checkbox"> Есть билеты</label><label class="check"><input type="checkbox"> Можно купить на месте</label>')+
      '</div></div>'+
    '</aside>'+
    '<section class="panel results-panel"><div class="results-toolbar"><div class="results-title">Найдено <b>'+results.length+'</b> варианта</div><div class="toolbar-right"><div class="view-toggle"><button class="active">'+icon("list")+' <span>Списком</span></button><button>'+icon("pin")+' <span>На карте</span></button></div></div></div>'+
    '<div class="results-subbar"><div class="active-filters">'+(state.searchText?'<span class="active-chip">'+e(state.searchText)+' ×</span>':'')+'<span class="active-chip">Москва и МО ×</span>'+(state.quick?'<span class="active-chip">'+e(state.quick)+' ×</span>':'')+'</div><div class="sort-line"><span>Сортировка:</span><select class="select" id="result-sort"><option value="relevance">Цена с дорогой ↑</option><option value="price">По цене</option><option value="rating">По рейтингу</option><option value="name">По названию</option></select></div></div>'+
    '<div class="result-head"><span>#</span><span>Место / событие</span><span>Источник</span><span>Район / город</span><span>Цена с дорогой</span><span>Дорога</span><span>Всего</span><span>Рейтинг</span><span>Атмосфера</span><span></span></div>'+
    (rows||'<div class="empty-state">По текущим фильтрам ничего не найдено.</div>')+'</section></div>';
  shell(view,"home",true);
  const sort=document.querySelector("#result-sort"); if(sort) sort.value=state.resultSort;
}
function segmented(items,current){
  return '<div class="segment">'+items.map(([key,label])=>'<button type="button" data-quick="'+e(key)+'" class="'+(current===key?"active":"")+'">'+e(label)+'</button>').join("")+'</div>';
}
function filterMini(title){
  return '<div class="filter-mini"><h4>'+e(title)+'</h4><select class="select filter-select"><option>Все</option></select></div>';
}
function rangeVisual(min,max,width){
  return '<div class="range-visual"><div class="range-track"><i style="width:'+e(width)+'"></i><b style="left:'+e(width)+'"></b></div><div class="range-inputs"><span>'+e(min)+'</span><span>—</span><span>'+e(max)+'</span></div></div>';
}
function emotionFilterVisual(){
  return [["⚓","Тишина","92%"],["♣","Зелень","92%"],["☾","Красота","42%"],["♡","Уединение","42%"],["⚡","Активность","42%"]].map(x=>
    '<div class="emotion-filter"><span>'+x[0]+'</span><span>'+x[1]+'</span><div class="mini-slider"><i style="width:'+x[2]+'"></i><b style="left:'+x[2]+'"></b></div><em>Любая</em></div>'
  ).join("");
}
function filterSection(title,body){ return '<div class="filter-section"><h4>'+e(title)+'</h4>'+body+'</div>'; }
function resultRow(item,type,index){
  const atmosphere=(Array.isArray(item.atmosphere_tags)&&item.atmosphere_tags.length?item.atmosphere_tags:[item.main_state,item.parent_activity||item.primary_activity]).filter(Boolean).slice(0,4);
  const price=priceFor(item,type);
  const rating=item.rating ?? null;
  return '<article class="result-row" data-detail="'+type+":"+e(item.id)+'"><span class="result-num">'+e(index)+'</span><div class="result-item"><img class="result-thumb" src="'+e(safeImg(item.cover_url))+'" alt="" onerror="this.src=\''+FALLBACK_IMAGE+'\'"><div><div class="result-title">'+e(itemTitle(item,type))+'</div><div class="meta-line">'+icon("pin")+e(item.parent_activity||item.primary_activity||item.category||"")+'</div><div class="meta-line">'+e(item.season||item.time_of_day||"Круглый год")+'</div></div></div>'+
    '<span><span class="source-cell source-'+type+'">'+(type==="favorite"?"⌂":type==="research"?"●":"♜")+' '+e(sourceLabel(type))+'</span></span>'+
    '<span class="result-district">'+e(districtFor(item,type))+'</span><b class="result-price '+(Number(price)===0?"free":"")+'">'+e(money(price))+'</b>'+
    '<span>'+e(type==="research"?(item.travel_one_way_text||"—"):"—")+'</span><span>'+e(type==="research"?(item.total_duration_text||item.duration_on_site_text||"—"):durationFor(item,type))+'</span>'+
    '<span class="rating">'+(rating!==null?"★ "+e(rating):"—")+'</span><span class="atmo-cell">'+atmosphere.map(t=>'<i>'+e(t)+'</i>').join("")+'</span><span class="heart">♡</span></article>';
}

function historySearchPanel(){
  return '<section class="search-panel history-search-panel"><div class="history-search-top"><div class="search-wrap">'+icon("search")+'<form id="history-search-form"><input class="global-search" id="history-search" placeholder="Поиск по посещениям: место, район, событие, заметка..." value="'+e(state.searchText)+'"></form><div class="search-hint">Например: Парк Горького, выставка, ужин, Красногорск</div></div>'+
    '<div class="history-period"><b>Период</b><select class="select"><option>За всё время</option><option>Этот год</option><option>Последние 3 месяца</option></select></div>'+
    '<div class="history-years"><b>Быстрые фильтры:</b><div><button class="chip-btn active">Все</button><button class="chip-btn">2026</button><button class="chip-btn">2025</button><button class="chip-btn">2024</button><button class="chip-btn">2023</button></div></div></div>'+
    '<div class="history-search-bottom"><div class="history-active"><b>Активные фильтры:</b><span class="active-chip">Вместе ×</span><span class="active-chip">Вечер ×</span><span class="active-chip">Повторить: Да ×</span></div><div class="toolbar-right"><button class="outline-btn">⇅ Сортировка: Дата ↓</button><button class="outline-btn">▥ Колонки</button></div></div></section>';
}
function historyFilterMarkup(){
  return '<aside class="panel filter-panel history-filter"><div class="panel-head"><div class="panel-title-wrap"><span class="panel-icon blue">'+icon("filter")+'</span><div class="panel-title">Фильтры истории</div></div><button class="link-btn">Сбросить всё</button></div>'+
    filterSection("▣ Период",'<select class="select filter-select"><option>За всё время</option></select>')+
    filterSection("♙ С кем был(и)",'<div class="segment"><button class="active">Любой</button><button>Один</button><button>Вместе</button></div>')+
    filterSection("◷ Время посещения",'<div class="segment"><button class="active">Любое</button><button>День</button><button>Вечер</button></div>')+
    filterSection("⌖ Район / город",'<select class="select filter-select"><option>Любой район / город</option></select>')+
    filterSection("☺ Главное состояние",'<select class="select filter-select"><option>Любое состояние</option></select>')+
    filterSection("★ Оценка",'<div class="rating-segment"><button class="active">Любая</button><button>5</button><button>4</button><button>3</button><button>2</button><button>1</button></div>')+
    filterSection("↻ Повторить посещение",'<div class="segment"><button class="active">Любой</button><button>Да</button><button>Нет</button></div>')+
    filterSection("₽ Стоимость Visit",'<div class="range-row"><input placeholder="от 0 ₽"><input placeholder="до 10 000 ₽"></div>')+
    filterSection("♡ Эмоциональные состояния",'<select class="select filter-select"><option>Любое состояние</option></select>')+
    '<div class="history-filter-action"><button class="action-primary">'+icon("search")+' Показать результаты</button><div class="panel-sub">Найдено '+e(state.visits.length)+' посещений</div></div></aside>';
}
function renderHistory(){
  const q=state.searchText.trim().toLowerCase();
  const visits=state.visits.filter(v=>!q||[v.place_route_name,v.main_state,v.conclusion,v.repeat_verdict,v.what_worked,v.what_failed].filter(Boolean).join(" ").toLowerCase().includes(q));
  const groups=new Map();
  for(const v of visits){
    const key=v.visit_date?new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",month:"long",year:"numeric"}).format(new Date(v.visit_date+"T12:00:00+03:00")):"Дата не указана";
    if(!groups.has(key)) groups.set(key,[]); groups.get(key).push(v);
  }
  let body="";
  for(const [month,arr] of groups){
    const spent=arr.reduce((s,v)=>s+n(v.visit_total),0);
    body+='<section class="month-group"><div class="month-title"><span>'+e(month)+'</span><small>'+arr.length+' посещения'+(spent?(' • Потрачено '+money(spent)):'')+'</small><span>⌃</span></div>'+arr.map(visitRow).join("")+'</section>';
  }
  const view='<div>'+historySearchPanel()+'<div class="history-shell">'+historyFilterMarkup()+
    '<section class="panel history-main">'+(body||'<div class="empty-state">Посещений не найдено.</div>')+'</section></div></div>';
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


function settingToggle(label,help,key){
  const checked=state.settings?.[key]!==false;
  return '<div class="setting-row"><div><div class="setting-name">'+e(label)+'</div><div class="setting-help">'+e(help)+'</div></div><label class="check"><input type="checkbox" name="'+e(key)+'" '+(checked?"checked":"")+'> Включено</label></div>';
}
function renderSettings(){
  const s=state.settings||{}, amount=state.budgetVersion?.monthly_amount??"";
  const view='<div class="settings-layout"><aside class="panel settings-menu">'+
    '<button class="setting-menu-btn active">Основные</button><button class="setting-menu-btn">Поиск</button><button class="setting-menu-btn">Локация и дорога</button><button class="setting-menu-btn">Погода</button><button class="setting-menu-btn">Интерфейс</button>'+
    '</aside><form class="settings-main" id="settings-form">'+
      '<section class="panel setting-card"><h3>Бюджет на досуг</h3><div class="setting-row"><div><div class="setting-name">Месячный бюджет</div><div class="setting-help">Новая версия начинает действовать с выбранного месяца и не переписывает прошлое.</div></div><input class="input" name="budget_amount" type="number" min="0" step="100" value="'+e(amount)+'" placeholder="Не задан"></div>'+
      '<div class="setting-row"><div><div class="setting-name">Действует с месяца</div></div><input class="input" name="budget_month" type="month" value="'+e(isoMonthNow().slice(0,7))+'"></div></section>'+
      '<section class="panel setting-card"><h3>Поиск по умолчанию</h3>'+settingToggle("Любимые","Искать среди проверенных Favorite","default_favorites")+settingToggle("Research","Искать среди гипотез на проверку","default_research")+settingToggle("События","Искать в Events LIVE","default_events")+settingToggle("Запоминать последний запрос","Сохранять запрос в текущей пользовательской логике","remember_last_query")+settingToggle("Запоминать фильтры","Сохранять выбранные фильтры","remember_last_filters")+
      '<div class="setting-row"><div><div class="setting-name">Горизонт событий</div></div><input class="input" name="event_horizon_days" type="number" min="1" max="60" value="'+e(s.event_horizon_days??14)+'"></div></section>'+
      '<section class="panel setting-card"><h3>Локация и дорога</h3><div class="setting-row"><div><div class="setting-name">Базовая точка</div></div><input class="input" name="base_location" value="'+e(s.base_location||"Коптево")+'"></div><div class="setting-row"><div><div class="setting-name">Рабочая область</div></div><select name="working_area"><option value="MOSCOW" '+(s.working_area==="MOSCOW"?"selected":"")+'>Москва</option><option value="MOSCOW_MO" '+(s.working_area!=="MOSCOW"?"selected":"")+'>Москва + МО</option></select></div><div class="setting-row"><div><div class="setting-name">Транспорт</div></div><select name="preferred_transport"><option value="ANY">Любой</option><option value="PUBLIC" '+(s.preferred_transport==="PUBLIC"?"selected":"")+'>Общественный</option><option value="CAR" '+(s.preferred_transport==="CAR"?"selected":"")+'>Автомобиль</option></select></div></section>'+
      '<section class="panel setting-card"><h3>Погода</h3><div class="setting-row"><div><div class="setting-name">Город</div></div><input class="input" name="weather_city" value="'+e(s.weather_city||"Москва")+'"></div>'+settingToggle("Показывать погоду","Погодный блок на Главной","show_weather")+settingToggle("Прогноз на неделю","7-дневный прогноз","show_week_forecast")+'</section>'+
      '<section class="panel setting-card"><h3>Интерфейс</h3><div class="setting-row"><div><div class="setting-name">Плотность</div></div><select name="density"><option value="STANDARD">Стандартная</option><option value="COMPACT" '+(s.density==="COMPACT"?"selected":"")+'>Компактная</option></select></div><div class="setting-row"><div><div class="setting-name">Выдача</div></div><select name="default_results_view"><option value="LIST">Список</option><option value="GRID" '+(s.default_results_view==="GRID"?"selected":"")+'>Сетка</option></select></div>'+settingToggle("Изображения","Показывать обложки карточек","show_images")+settingToggle("Эмоциональные шкалы","Показывать числовые шкалы","show_emotion_scales")+settingToggle("Теги атмосферы","Показывать атрибуты атмосферы","show_atmosphere_tags")+'</section>'+
      '<div class="save-bar"><button class="save-btn" type="submit">'+icon("save")+' Сохранить изменения</button></div></form>'+
    '<aside class="settings-side"><section class="panel side-card"><h3>Аккаунт</h3><div class="sync-ok">● Синхронизация активна</div><p class="panel-sub">'+e(state.session?.user?.email||"Пользователь")+'</p><button class="action-secondary" id="logout">'+icon("logout")+' Выйти</button></section><section class="panel side-card"><h3>Мои данные</h3><p class="panel-sub">Данные приложения хранятся в Supabase и защищены RLS.</p></section><section class="panel side-card"><h3>О приложении</h3><p class="panel-sub">APP-004 · Москва и МО · v0.3 backend parity</p></section></aside></div>';
  shell(view,"settings",false);
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
  const budgetRaw=String(fd.get("budget_amount")||"").trim();
  if(budgetRaw!==""){
    const amount=Number(budgetRaw), month=String(fd.get("budget_month")||"").trim()+"-01";
    const {error:be}=await supabase.rpc("app004_set_budget_version",{p_effective_month:month,p_monthly_amount:amount,p_comment:"Из настроек APP-004"});
    if(be){ toast("Настройки сохранены, но бюджет не обновлён: "+be.message,true); await loadAll(); renderSettings(); return; }
    await supabase.rpc("app004_recalculate_budget_month",{p_month:month});
  }
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
  const exp=ev.target.closest("[data-expand-visit]");
  if(exp){ state.historyExpanded=state.historyExpanded===exp.dataset.expandVisit?null:exp.dataset.expandVisit; renderHistory(); return; }
  if(ev.target.closest("[data-reset-filters]")){ state.quick="";state.searchText="";state.sources={favorite:true,research:true,event:true};renderSearch();return; }
  if(ev.target.closest("#magic-link")){ await sendMagicLink(); return; }
  if(ev.target.closest("#logout")){ await supabase.auth.signOut(); return; }
});
root.addEventListener("change",ev=>{
  if(ev.target.matches("[data-filter-source]")){ state.sources[ev.target.dataset.filterSource]=ev.target.checked; renderSearch(); }
  if(ev.target.matches("#result-sort")){ state.resultSort=ev.target.value; renderSearch(); }
  if(ev.target.matches('input[data-quick]')){ state.quick=ev.target.checked?ev.target.dataset.quick:"";renderSearch(); }
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
