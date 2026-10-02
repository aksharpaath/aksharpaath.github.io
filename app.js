(function(){
'use strict';
const CFG=window.APCONFIG||{};
const DEMO=!CFG.SUPABASE_URL||!CFG.SUPABASE_ANON_KEY;
const V='4';
let sb=null,sbP=null;
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>rej(new Error('load '+src));document.head.appendChild(s)})}
/* The Supabase client is only needed for sign-in, submitting and editing, so it loads after the first screen is visible. */
function getSB(){
  if(DEMO)return Promise.resolve(null);
  if(!sbP)sbP=(window.supabase?Promise.resolve():loadScript('vendor/supabase.js?v='+V)).then(()=>{sb=window.supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_ANON_KEY);return sb});
  return sbP;
}
const UPI_ID=CFG.UPI_ID||'yourname@upi';
const DEV='०१२३४५६७८९';
const dv=n=>String(n).replace(/\d/g,d=>DEV[d]);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MONTHS=['जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'];
const MON_EN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MAG='अक्षरपाठ';
const PLANS={20:{name:'छोटी रचना',kinds:'कविता, शायरी, हाइकु'},50:{name:'लेख या कहानी',kinds:'लघुकथा, लेख, संस्मरण'},100:{name:'विशेष रचना',kinds:'लंबा लेख, यात्रा-वृत्त'}};
const ST_REVIEW='review',ST_PUB='published';
const STL={review:'समीक्षा में',published:'प्रकाशित'};

/* Sample content shown only in demo mode (no Supabase keys in config.js). */
const SAMPLE=[
{vol:1,ank:3,m:8,y:2026,theme:'बारिश और स्मृतियाँ',
 note:'बारिश सिर्फ़ मौसम नहीं, याद भी है। इस अंक की रचनाएँ उसी भीगी हुई स्मृति के आसपास घूमती हैं।',
 articles:[
 {t:'भीगा हुआ शहर',by:'नीरजा सिंह',city:'वाराणसी',kind:'कविता',body:`बारिश ने आज फिर शहर को धो दिया,
छतरियाँ खुलीं, चेहरे छिप गए।
चाय की दुकान पर भाप उठती रही,
और पुरानी बातें फिर से जग गईं।

गली के मोड़ पर एक बच्चा कागज़ की नाव लिए,
पानी से पूछ रहा था, कहाँ तक जाओगे?
पानी चुप रहा, बस बहता रहा,
जैसे उसे भी अपना पता मालूम न हो।`},
 {t:'आख़िरी बस',by:'रमेश कुमार',city:'लखनऊ',kind:'लघुकथा',body:`रात के दस बजे थे। बस-अड्डे पर आख़िरी बस खड़ी थी और कंडक्टर बार-बार घड़ी देख रहा था।

एक बूढ़ी अम्मा हाँफती हुई आईं, हाथ में छोटी-सी पोटली थी। कंडक्टर ने कहा, "अम्मा, जल्दी बैठिए, देर हो रही है।"

अम्मा बैठीं और धीमे से बोलीं, "बेटा, गाँव में बेटे का इंतज़ार है। सुबह तक पहुँच जाऊँ तो बहुत है।"

कंडक्टर ने चुपचाप सीटी बजाई और ड्राइवर से कहा, "इस बार रास्ते में कहीं नहीं रुकना।" सुबह जब गाँव आया, तो उसने खुद उतरकर अम्मा की पोटली उठाई।`},
 {t:'हिंदी में विज्ञान लिखने की ज़रूरत',by:'डॉ. अनुपमा त्रिपाठी',city:'प्रयागराज',kind:'लेख',body:`विज्ञान की भाषा अक्सर अंग्रेज़ी मान ली जाती है, जबकि समझ किसी भी भाषा में बन सकती है। जब विद्यार्थी अपनी मातृभाषा में प्रयोग, तर्क और निष्कर्ष पढ़ता है, तो उसे रटना कम और सोचना ज़्यादा पड़ता है।

हिंदी में विज्ञान लेखन के लिए तीन चीज़ें चाहिए: सरल शब्द, स्थानीय उदाहरण और सटीक शब्दावली।

'ऊर्जा' और 'बल' जैसे शब्द रोज़मर्रा की बातचीत में भी आते हैं, इसलिए उन्हें कक्षा से जोड़ना कठिन नहीं है। ज़रूरत बस इतनी है कि लेखक जटिल बात को छोटे वाक्यों में समझाएँ और पाठक पर भरोसा रखें।`},
 {t:'अल्मोड़ा की एक सुबह',by:'सौरभ पांडे',city:'हल्द्वानी',kind:'यात्रा-संस्मरण',body:`सुबह के पाँच बजे थे और पहाड़ों पर धुंध उतर रही थी। मैं होमस्टे की बालकनी में चाय लेकर बैठा था।

सामने देवदार के पेड़ धीरे-धीरे धुंध से बाहर आ रहे थे, जैसे कोई पर्दा उठ रहा हो। नीचे घाटी में घंटी की आवाज़ आई, शायद किसी मंदिर की।

पास से गुज़रती एक महिला ने मुस्कुराकर पूछा, "चाय ठंडी तो नहीं हो गई?"

उस दिन पहली बार लगा कि शहर की भागदौड़ में हम सुबह को कितना खो देते हैं।`}
 ]},
{vol:1,ank:2,m:7,y:2026,theme:'घर और रसोई',
 note:'घर की बातें अक्सर रसोई से शुरू होती हैं। इस अंक में ऐसी ही रचनाएँ हैं।',
 articles:[
 {t:'माँ की रसोई',by:'अंजलि वर्मा',city:'भोपाल',kind:'कविता',body:`सुबह की पहली रोशनी से पहले
रसोई में बर्तनों की आवाज़ जाग जाती थी।
माँ की चूड़ियाँ खनकती थीं,
और घर को पता चल जाता था कि दिन शुरू हुआ।

आज भी जब कहीं तवे पर रोटी की महक उठती है,
मन एक क्षण को बच्चा बन जाता है।`},
 {t:'पुस्तकालय की खिड़की',by:'विनोद यादव',city:'जयपुर',kind:'लेख',body:`हमारे मोहल्ले का पुस्तकालय एक छोटे कमरे में चलता था। खिड़की के पास की मेज़ पर बैठकर मैंने पहली बार प्रेमचंद पढ़े थे।

वहाँ न कोई शोर था, न कोई जल्दी। बस किताबों की महक थी और पन्ने पलटने की धीमी आवाज़।

आज स्क्रीन पर सैकड़ों किताबें एक साथ मिल जाती हैं, फिर भी उस खिड़की वाली मेज़ की कमी खलती है। शायद पढ़ना सिर्फ़ शब्दों का नहीं, जगह का भी अनुभव होता है।`}
 ]},
{vol:1,ank:1,m:6,y:2026,theme:'शुभारंभ',
 note:'यह अक्षरपाठ का पहला अंक है। हम चाहते हैं कि हर पाठक यहाँ लेखक भी बने।',
 articles:[
 {t:'पहली बूँद',by:'कविता नेगी',city:'देहरादून',kind:'कविता',body:`तपती ज़मीन ने आसमान से
चुपचाप कुछ माँगा था,
और आसमान ने जवाब में
एक बूँद भेज दी।

मिट्टी ने गहरी साँस ली,
हवा में सोंधापन घुल गया।
कभी-कभी बहुत छोटा उत्तर भी
पूरी प्रतीक्षा को अर्थ दे देता है।`},
 {t:'लिखना क्यों ज़रूरी है',by:'संपादक मंडल',city:'',kind:'संपादकीय',body:`हर व्यक्ति के पास कम से कम एक कहानी होती है जो उसने कभी लिखी नहीं। अक्षरपाठ इसी अनसुनी आवाज़ के लिए बनाया गया है।

यहाँ नए और अनुभवी लेखक साथ छपेंगे। आपकी रचना छोटी हो सकती है, अधूरी-सी लग सकती है, फिर भी उसमें आपका देखा हुआ संसार होगा। हमें वही पढ़ना है।`}
 ]}];
let issues=[];

const S={view:'home',issue:0,page:1,unit:0,busy:false,done:null,user:null,role:null,mine:null,all:null,allIssues:null,editRef:null,openId:null,scrolled:null,loading:true};
const root=document.getElementById('root');
const toastEl=document.getElementById('toast');
let toastT=0;
function toast(msg,keep){toastEl.textContent=msg;toastEl.hidden=false;clearTimeout(toastT);if(!keep)toastT=setTimeout(()=>{toastEl.hidden=true},4200)}
const monthName=is=>MONTHS[is.m]+' '+dv(is.y);
const issueLabel=is=>'वर्ष '+dv(is.vol)+' · अंक '+dv(is.ank)+' · '+monthName(is);
const isEditor=()=>S.role==='editor';
const mq=window.matchMedia('(max-width:640px)');
const narrow=()=>mq.matches;

/* ---------- fonts ---------- */
let fontsP=null,fontsOK=false;
function fontsReady(){
  if(!fontsP)fontsP=(async()=>{
    try{
      const f=['400 16px "Noto Serif Devanagari"','600 16px "Noto Serif Devanagari"','400 16px "Tiro Devanagari Hindi"','400 16px Hind','600 16px Hind'];
      fontsOK=await Promise.race([Promise.all(f.map(x=>document.fonts.load(x,'अक्षर'))).then(()=>true),new Promise(r=>setTimeout(()=>r(false),3000))]);
    }catch(_){}
    return fontsOK;
  })();
  return fontsP;
}

/* ---------- splitting articles into magazine pages ---------- */
const PG_VER=3,PGK='ap_pg_';
const TOC_FIRST=8,TOC_REST=12;
const tocPageCount=n=>n<=TOC_FIRST?1:1+Math.ceil((n-TOC_FIRST)/TOC_REST);
function hashIssue(is){
  let h=2166136261>>>0;
  const mix=s=>{s=String(s||'');for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}};
  is.articles.forEach(a=>{mix(a.t);mix(a.kind);mix(a.by);mix(a.city);mix(a.body)});
  return h.toString(36)+'.'+is.articles.length;
}
function splitUnits(a){
  if(a._u)return a._u;
  const poem=a.kind==='कविता';
  const text=String(a.body||'').replace(/\r\n?/g,'\n').trim();
  a._u=poem
    ?{poem,paras:text.split(/\n\s*\n/).map(x=>x.split('\n').map(l=>l.replace(/\s+$/,''))).filter(l=>l.length&&l.join('')!=='')}
    :{poem,paras:text.split(/\n+/).map(x=>x.trim()).filter(Boolean).map(x=>x.split(/\s+/))};
  return a._u;
}
function segHtml(a,seg){
  const U=splitUnits(a),sep=U.poem?'\n':' ';
  return seg.map(s=>'<p>'+esc(U.paras[s[0]].slice(s[1],s[2]).join(sep))+'</p>').join('');
}
function artShell(is,ai,first,bodyHtml,pageNo){
  const a=is.articles[ai];
  const run='<div class="run"><span>'+MAG+'</span><span>'+issueLabel(is)+'</span></div>';
  const head=first
    ?'<div class="bar"></div><div class="kind">'+esc(a.kind)+'</div><div class="ttl">'+esc(a.t)+'</div><div class="by">'+esc(a.by)+(a.city?' · '+esc(a.city):'')+'</div>'
    :'<div class="cont">'+esc(a.t)+' · जारी</div>';
  return run+head+'<div class="body'+(a.kind==='कविता'?' poem':'')+'">'+bodyHtml+'</div><div class="folio"><b>'+(pageNo?dv(pageNo):'')+'</b></div>';
}
let measurer=null;
function getMeasurer(){
  if(!measurer){measurer=document.createElement('div');measurer.style.cssText='position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none';document.body.appendChild(measurer)}
  return measurer;
}
/* Fills one reference page at a time. It only lays out about one page of text per step, then narrows down the exact cut point. */
function paginateArticle(is,ai){
  const a=is.articles[ai],U=splitUnits(a),paras=U.paras,sep=U.poem?'\n':' ';
  const pw=420,fs=pw*0.036,host=getMeasurer();
  const el=document.createElement('div');
  el.className='mp';
  el.style.cssText='width:'+pw+'px;height:'+Math.round(pw*1.414)+'px;font-size:'+fs.toFixed(2)+'px';
  host.appendChild(el);
  const pages=[];
  let first=true,bodyEl=null,seg=[],used=0,est=U.poem?28:230;
  const open=()=>{el.innerHTML=artShell(is,ai,first,'',0);bodyEl=el.querySelector('.body');seg=[];used=0};
  const fits=()=>{const l=bodyEl.lastElementChild;return !l||l.getBoundingClientRect().bottom<=el.getBoundingClientRect().bottom-3.3*fs};
  const flush=()=>{pages.push({first,seg});if(used>est)est=used;first=false;open()};
  open();
  paras.forEach((toks,pi)=>{
    let i=0;
    while(i<toks.length){
      const remain=toks.length-i,p=document.createElement('p');
      bodyEl.appendChild(p);
      const set=n=>{p.textContent=toks.slice(i,i+n).join(sep)};
      const cap=Math.min(remain,Math.max(8,Math.ceil(est*1.5)));
      set(cap);
      let lo,hi;
      if(fits()){
        lo=cap;let step=cap;
        while(lo<remain){const t=Math.min(remain,lo+step);set(t);if(fits()){lo=t;step*=2}else{hi=t-1;break}}
        if(hi===undefined)hi=lo;
      }else{lo=0;hi=cap-1}
      while(lo<hi){const mid=(lo+hi+1)>>1;set(mid);if(fits())lo=mid;else hi=mid-1}
      if(lo===0){
        bodyEl.removeChild(p);
        if(seg.length===0){seg.push([pi,i,i+1]);used+=1;i+=1}
        flush();continue;
      }
      set(lo);
      seg.push([pi,i,i+lo]);used+=lo;i+=lo;
      if(i<toks.length)flush();
    }
  });
  if(seg.length||!pages.length)pages.push({first,seg});
  host.removeChild(el);
  return pages;
}
function pgKey(is){return is.id?PGK+is.id+'_'+hashIssue(is)+'_v'+PG_VER:null}
function readPgCache(is){
  const k=pgKey(is);if(!k)return null;
  try{const v=JSON.parse(localStorage.getItem(k)||'null');return Array.isArray(v)&&v.length===is.articles.length?v:null}catch(_){return null}
}
function writePgCache(is,art){
  const k=pgKey(is);if(!k||!fontsOK)return;
  try{
    const keys=[];
    for(let i=0;i<localStorage.length;i++){const kk=localStorage.key(i);if(kk&&kk.indexOf(PGK)===0)keys.push(kk)}
    keys.forEach(kk=>{if(kk.indexOf(PGK+is.id+'_')===0&&kk!==k)localStorage.removeItem(kk)});
    if(keys.length>8)keys.slice(0,keys.length-8).forEach(kk=>{if(kk!==k)localStorage.removeItem(kk)});
    localStorage.setItem(k,JSON.stringify(art));
  }catch(_){}
}
function buildPg(is,art){
  const n=is.articles.length,pages=[{t:'cover'}],tp=tocPageCount(n),start=[];
  for(let k=0;k<tp;k++){
    const from=k===0?0:TOC_FIRST+(k-1)*TOC_REST;
    const to=Math.min(n,k===0?TOC_FIRST:TOC_FIRST+k*TOC_REST);
    pages.push({t:'toc',from,to,first:k===0});
  }
  art.forEach((aps,ai)=>{start[ai]=pages.length+1;aps.forEach(ap=>pages.push({t:'art',ai,first:ap.first,seg:ap.seg}))});
  pages.push({t:'back'});
  return {pages,start};
}
function paginate(is){
  if(is._pg)return is._pg;
  let art=readPgCache(is);
  if(!art){art=is.articles.map((a,ai)=>paginateArticle(is,ai));writePgCache(is,art)}
  return (is._pg=buildPg(is,art));
}
function paginateAsync(is){
  if(is._pg)return Promise.resolve(is._pg);
  if(!is._pgP)is._pgP=(async()=>{
    await fontsReady();
    let art=readPgCache(is);
    if(!art){
      art=[];
      for(let ai=0;ai<is.articles.length;ai++){art.push(paginateArticle(is,ai));await new Promise(r=>setTimeout(r,0))}
      writePgCache(is,art);
    }
    return (is._pg=buildPg(is,art));
  })();
  return is._pgP;
}
function schedulePg(is){
  if(narrow()||is._pg||is._pgS)return;
  is._pgS=true;
  paginateAsync(is).then(()=>{if(S.view==='home'||S.view==='archive'||S.view==='reader')renderMain()}).catch(()=>{is._pgS=false});
}

/* ---------- one magazine page ---------- */
function coverHtml(is,pg){
  const list=is.articles.slice(0,6).map((a,i)=>'<li><span>'+esc(a.t)+'</span><span>'+(pg?dv(pg.start[i]):'')+'</span></li>').join('')
    +(is.articles.length>6?'<li><span>और भी रचनाएँ…</span><span></span></li>':'');
  return '<div class="cv-top"><span>मासिक हिंदी पत्रिका</span><span>वर्ष '+dv(is.vol)+' · अंक '+dv(is.ank)+'</span></div>'
   +'<div class="cv-bar"></div><div class="cv-name">'+MAG+'</div><div class="cv-sub">पढ़िए, लिखिए, छपिए</div>'
   +'<div class="cv-month">'+monthName(is)+'</div>'
   +'<div class="cv-theme">इस अंक का विषय<strong>'+esc(is.theme)+'</strong></div>'
   +'<ul>'+list+'</ul>';
}
function backHtml(is){
  const nx=new Date(is.y,is.m+1,1);
  return '<h2>आप भी लिखिए</h2><p>कविता, कहानी, लेख या संस्मरण भेजिए।<br>अगला अंक '+MONTHS[nx.getMonth()]+' '+dv(nx.getFullYear())+' में आएगा।</p>'
   +'<p class="fee">प्रकाशन शुल्क ₹'+dv(20)+' से ₹'+dv(100)+'</p><p>“रचना भेजें” पृष्ठ पर फ़ॉर्म भरिए।</p>';
}
function renderPage(is,d,pw,pageNo,pg){
  const el=document.createElement('div');
  el.className='mp';
  el.style.width=pw+'px';
  el.style.height=Math.round(pw*1.414)+'px';
  el.style.fontSize=(pw*0.036).toFixed(2)+'px';
  const run='<div class="run"><span>'+MAG+'</span><span>'+issueLabel(is)+'</span></div>';
  const folio='<div class="folio"><b>'+dv(pageNo)+'</b></div>';
  if(d.t==='cover'){
    el.classList.add('cover');el.innerHTML=coverHtml(is,pg);
  }else if(d.t==='toc'){
    const rows=is.articles.slice(d.from,d.to).map((a,k)=>'<div class="trow"><div><span class="t">'+esc(a.t)+'</span><span class="s">'+esc(a.kind)+' · '+esc(a.by)+'</span></div><span class="d"></span><span class="n">'+dv(pg.start[d.from+k])+'</span></div>').join('');
    el.innerHTML=run+'<h2 class="sec">विषय-सूची'+(d.first?'':' (जारी)')+'</h2>'+(d.first&&is.note?'<p class="note">'+esc(is.note)+'</p>':'')+rows+folio;
  }else if(d.t==='back'){
    el.classList.add('back');el.innerHTML=run+backHtml(is)+folio;
  }else{
    el.innerHTML=artShell(is,d.ai,d.first,segHtml(is.articles[d.ai],d.seg),pageNo);
  }
  return el;
}
function mountAll(){
  root.querySelectorAll('.pageslot').forEach(slot=>{
    const is=issues[+slot.dataset.issue];if(!is)return;
    const max=+slot.dataset.max||420,w=Math.max(240,Math.min(slot.clientWidth||max,max));
    if(slot.dataset.cover){slot.replaceChildren(renderPage(is,{t:'cover'},w,1,is._pg||null));return}
    const pg=is._pg;if(!pg)return;
    const p=+slot.dataset.page;
    slot.replaceChildren(renderPage(is,pg.pages[p-1],w,p,pg));
  });
}
/* Phone reading: one article as a normal scrolling page with comfortable text, no fixed page size. */
function flowArticle(is,ai){
  const a=is.articles[ai],U=splitUnits(a),sep=U.poem?'\n':' ';
  return '<article class="mp flow"><div class="run"><span>'+MAG+'</span><span>'+issueLabel(is)+'</span></div>'
   +'<div class="bar"></div><div class="kind">'+esc(a.kind)+'</div><div class="ttl">'+esc(a.t)+'</div><div class="by">'+esc(a.by)+(a.city?' · '+esc(a.city):'')+'</div>'
   +'<div class="body'+(U.poem?' poem':'')+'">'+U.paras.map(t=>'<p>'+esc(t.join(sep))+'</p>').join('')+'</div></article>';
}
function flowToc(is){
  return '<div class="mp flow"><div class="run"><span>'+MAG+'</span><span>'+issueLabel(is)+'</span></div><h2 class="sec">विषय-सूची</h2>'+(is.note?'<p class="note">'+esc(is.note)+'</p>':'')
   +is.articles.map((a,i)=>'<button class="tocbtn" data-act="unit" data-u="'+(i+2)+'"><span class="t">'+esc(a.t)+'</span><span class="s">'+esc(a.kind)+' · '+esc(a.by)+'</span></button>').join('')+'</div>';
}
const unitCount=is=>is.articles.length+3;

/* ---------- data ---------- */
const ICK='ap_issues_v3';
const REST=(CFG.SUPABASE_URL||'')+'/rest/v1/';
function rest(q){
  return fetch(REST+q,{headers:{apikey:CFG.SUPABASE_ANON_KEY,Authorization:'Bearer '+CFG.SUPABASE_ANON_KEY}}).then(r=>{if(!r.ok)throw new Error('http '+r.status);return r.json()});
}
function shapeIssues(a,b){
  const by=new Map();
  (b||[]).forEach(x=>{if(!by.has(x.issue_id))by.set(x.issue_id,[]);by.get(x.issue_id).push({id:x.id,t:x.title,by:x.name,city:x.city||'',kind:x.kind,body:x.body})});
  return (a||[]).map(i=>({id:i.id,vol:i.vol,ank:i.ank,m:i.month-1,y:i.year,theme:i.theme,note:i.note||'',articles:by.get(i.id)||[]}));
}
async function fetchPublic(){
  try{
    const r=await Promise.all([rest('issues?select=*&is_live=eq.true&order=ank.desc'),rest('public_articles?select=*&order=published_at.asc')]);
    return shapeIssues(r[0],r[1]);
  }catch(e){
    const c=await getSB();
    const r=await Promise.all([c.from('issues').select('*').eq('is_live',true).order('ank',{ascending:false}),c.from('public_articles').select('*').order('published_at',{ascending:true})]);
    if(r[0].error||r[1].error)throw (r[0].error||r[1].error);
    return shapeIssues(r[0].data,r[1].data);
  }
}
const sigOf=list=>list.map(i=>i.id+':'+i.theme+':'+(i.note||'')+':'+hashIssue(i)).join('|');
function readIssuesCache(){try{const v=JSON.parse(localStorage.getItem(ICK)||'null');return Array.isArray(v)?v:null}catch(_){return null}}
async function loadPublic(){
  if(DEMO){issues=SAMPLE;S.loading=false;return}
  try{
    const fresh=await fetchPublic();
    try{localStorage.setItem(ICK,JSON.stringify(fresh))}catch(_){}
    if(sigOf(fresh)!==sigOf(issues))issues=fresh;
  }catch(_){
    if(!issues.length)toast('अंक लोड नहीं हो सके। कुछ देर बाद पेज दोबारा खोलिए।');
  }
  S.loading=false;
}
async function setUser(session){
  S.user=session?session.user:null;S.role=null;
  if(S.user){const r=await sb.from('profiles').select('role').eq('id',S.user.id).maybeSingle();S.role=r.data?r.data.role:null}
}

/* ---------- views ---------- */
function header(){
  const t=(v,l)=>'<button class="tab" data-act="nav" data-v="'+v+'"'+(S.view===v||(v==='archive'&&S.view==='reader')?' aria-current="page"':'')+'>'+l+'</button>';
  const acct=DEMO?'':(S.user?'<button class="btn ghost sm" data-act="logout">साइन-आउट</button>':'<button class="btn ghost sm" data-act="nav" data-v="submit">साइन-इन</button>');
  return '<header class="top"><div class="wrap topin"><button class="brand" data-act="nav" data-v="home" aria-label="मुख्य पृष्ठ"><span class="brand-name">'+MAG+'</span><span class="brand-sub">मासिक हिंदी पत्रिका</span></button>'
   +'<nav class="tabs" aria-label="मुख्य">'+t('home','वर्तमान अंक')+t('archive','अंक-संग्रह')+t('submit','रचना भेजें')+(isEditor()?t('editor','संपादक पटल'):'')+acct+'</nav></div></header>';
}
function refreshHeader(){const h=document.getElementById('hdr');if(h)h.innerHTML=header()}
function pdfBtn(i,cls){return '<button class="btn '+(cls||'ghost')+'" data-act="pdf" data-i="'+i+'"'+(S.busy?' disabled':'')+'>PDF डाउनलोड</button>'}
function skeletonView(){
  return '<section class="wrap"><div class="skel-hero"><div class="skel skel-cover"></div><div class="skel-lines"><div class="skel" style="height:1.1rem;width:40%"></div><div class="skel" style="height:2.6rem;width:75%"></div><div class="skel" style="height:1rem;width:55%"></div><div class="skel" style="height:2.8rem;width:45%"></div></div></div></section>';
}
function emptyView(){
  return '<section class="wrap"><div class="card done" style="margin-top:40px"><h2>पहला अंक जल्द आ रहा है</h2><p>अक्षरपाठ में अभी कोई अंक प्रकाशित नहीं हुआ है। आप अपनी रचना भेज सकते हैं।</p><p style="margin-top:16px"><button class="btn" data-act="nav" data-v="submit">रचना भेजें</button></p></div></section>';
}
function homeView(){
  if(!issues.length)return S.loading?skeletonView():emptyView();
  const is=issues[0];schedulePg(is);
  const pg=narrow()?null:is._pg;
  return '<section class="wrap hero"><div class="pageslot" data-issue="0" data-cover="1" data-max="320"></div><div>'
   +'<p class="eyebrow">नवीनतम अंक · '+issueLabel(is)+'</p><h1>'+esc(is.theme)+'</h1>'
   +'<p class="issue-meta">'+(pg?dv(pg.pages.length)+' पृष्ठ · ':'')+dv(is.articles.length)+' रचनाएँ · हर महीने की पहली तारीख़ को नया अंक</p>'
   +'<div class="actions"><button class="btn" data-act="read" data-i="0">ऑनलाइन पढ़ें</button>'+pdfBtn(0)+'</div>'
   +'<h2 style="font-size:1.4rem;margin-bottom:8px">इस अंक में</h2><ol class="toc">'
   +is.articles.map((a,i)=>'<li><span class="pg">'+(pg?dv(pg.start[i]):'')+'</span><span class="tt"><button data-act="goto" data-i="0" data-ai="'+i+'"><b>'+esc(a.t)+'</b></button><span>'+esc(a.kind)+' · '+esc(a.by)+'</span></span></li>').join('')
   +'</ol></div></section>'
   +'<section class="wrap band"><div><h3>हर महीने एक अंक</h3><p>हर अंक में वर्ष, अंक संख्या, माह और पृष्ठ संख्या दर्ज रहती है, ताकि हर रचना का हवाला दिया जा सके।</p></div>'
   +'<div><h3>ऑनलाइन और PDF</h3><p>हर अंक वेबसाइट पर पढ़ा जा सकता है और पूरा अंक PDF में सहेजा भी जा सकता है।</p></div>'
   +'<div><h3>आपकी रचना, हमारे पन्नों पर</h3><p>कोई भी लेखक रचना भेज सकता है। प्रकाशन शुल्क ₹'+dv(20)+' से ₹'+dv(100)+' तक, आपकी इच्छा से।</p><p style="margin-top:12px"><button class="btn ghost sm" data-act="nav" data-v="submit">रचना भेजें</button></p></div></section>';
}
function archiveView(){
  if(!issues.length)return S.loading?skeletonView():emptyView();
  issues.slice(0,6).forEach(schedulePg);
  const nar=narrow();
  const row=(is,i)=>'<div class="row"><div class="ank"><small>अंक</small>'+dv(is.ank)+'</div><div class="info"><b>'+esc(is.theme)+'</b><span>'+monthName(is)+' · '+(!nar&&is._pg?dv(is._pg.pages.length)+' पृष्ठ · ':'')+dv(is.articles.length)+' रचनाएँ</span></div><div class="btns"><button class="btn sm" data-act="read" data-i="'+i+'">पढ़ें</button>'+pdfBtn(i,'ghost sm')+'</div></div>';
  const vols=[...new Set(issues.map(x=>x.vol))];
  return '<section class="wrap"><div class="page-h"><h1>अंक-संग्रह</h1><p>सभी प्रकाशित अंक, नए से पुराने क्रम में।</p></div>'
   +vols.map(v=>'<div class="vol"><h2>वर्ष '+dv(v)+'</h2>'+issues.map((is,i)=>is.vol===v?row(is,i):'').join('')+'</div>').join('')+'</section>';
}
function readerView(){
  const is=issues[S.issue],nar=narrow();
  const bar=edBtn=>'<div class="rbar"><div><button class="btn ghost sm" data-act="nav" data-v="archive">← संग्रह</button></div><div class="who">'+issueLabel(is)+'</div><div class="edbtns">'+edBtn+pdfBtn(S.issue,'ghost sm')+'</div></div>';
  const edFor=art=>(isEditor()&&art&&art.id)?'<button class="btn ghost sm" data-act="ed-open" data-id="'+esc(art.id)+'">इस रचना को संपादित करें</button>':'';
  const nav=(cur,n,opts)=>'<div class="rnav"><button class="btn ghost" data-act="pg" data-d="-1"'+(cur<=1?' disabled':'')+' aria-label="पिछला">← पिछला</button>'
    +'<span class="pgno">'+(nar?'':'पृष्ठ ')+dv(cur)+' / '+dv(n)+'</span>'
    +'<button class="btn ghost" data-act="pg" data-d="1"'+(cur>=n?' disabled':'')+' aria-label="अगला">अगला →</button>'
    +'<select id="jump" aria-label="'+(nar?'भाग चुनिए':'पृष्ठ पर जाएँ')+'">'+opts+'</select></div>';
  if(nar){
    const n=unitCount(is);if(S.unit>=n)S.unit=n-1;if(S.unit<0)S.unit=0;
    const u=S.unit,ai=u-2;
    const label=k=>k===0?'आवरण':k===1?'विषय-सूची':k===n-1?'अंतिम पृष्ठ':is.articles[k-2].t;
    const opts=Array.from({length:n},(_,k)=>'<option value="'+k+'"'+(k===u?' selected':'')+'>'+esc(label(k))+'</option>').join('');
    let stage;
    if(u===0)stage='<div class="rstage" id="rstage"><div class="pageslot" data-issue="'+S.issue+'" data-cover="1" data-max="420"></div></div>';
    else if(u===1)stage='<div class="flowwrap" id="rstage">'+flowToc(is)+'</div>';
    else if(u===n-1)stage='<div class="flowwrap" id="rstage"><div class="mp flow back"><div class="run"><span>'+MAG+'</span><span>'+issueLabel(is)+'</span></div>'+backHtml(is)+'</div></div>';
    else stage='<div class="flowwrap" id="rstage">'+flowArticle(is,ai)+'</div>';
    return '<section class="wrap">'+bar(edFor(ai>=0&&ai<is.articles.length?is.articles[ai]:null))+stage+nav(u+1,n,opts)+'</section>';
  }
  const pg=is._pg;
  if(!pg){schedulePg(is);return '<section class="wrap">'+bar('')+'<div class="card done" style="margin-block:24px"><p>पृष्ठ तैयार हो रहे हैं…</p></div></section>'}
  const n=pg.pages.length;if(S.page>n)S.page=n;if(S.page<1)S.page=1;
  const opts=pg.pages.map((d,k)=>{const p=k+1;const lab=d.t==='cover'?'आवरण':d.t==='toc'?'विषय-सूची':d.t==='back'?'अंतिम पृष्ठ':is.articles[d.ai].t+(d.first?'':' (जारी)');return '<option value="'+p+'"'+(p===S.page?' selected':'')+'>'+dv(p)+' · '+esc(lab)+'</option>'}).join('');
  const cd=pg.pages[S.page-1],art=cd&&cd.t==='art'?is.articles[cd.ai]:null;
  return '<section class="wrap">'+bar(edFor(art))+'<div class="rstage" id="rstage"><div class="pageslot" id="rslot" data-issue="'+S.issue+'" data-page="'+S.page+'" data-max="520"></div></div>'+nav(S.page,n,opts)+'</section>';
}


function submitFormView(){
  if(S.done){
    return '<section class="wrap"><div class="card done" style="margin-top:32px"><h2>रचना प्राप्त हुई</h2><p>आपकी रचना संपादक मंडल की जाँच के लिए जमा हो गई है।</p><div class="ref">'+esc(S.done)+'</div><p class="hint" style="margin-bottom:16px">यह संदर्भ संख्या संभाल कर रखिए।</p><button class="btn" data-act="again">एक और रचना भेजें</button></div></section>';
  }
  const plans=Object.keys(PLANS).map(k=>'<label class="plan"><input type="radio" name="plan" value="'+k+'"'+(k==='50'?' checked':'')+'><span class="amt">₹'+dv(k)+'</span><span class="nm">'+PLANS[k].name+'</span><span class="lim">'+PLANS[k].kinds+'</span></label>').join('');
  return '<section class="wrap"><div class="page-h"><h1>रचना भेजें</h1><p>अपनी रचना भेजिए और प्रकाशन शुल्क चुनिए। चुनी गई रचनाएँ आगामी मासिक अंक में छपेंगी।</p></div>'
   +'<div class="formgrid"><div style="min-width:0"><div id="mine" class="mine"></div><form id="subForm" class="card" novalidate><div id="editBanner"></div>'
   +'<div class="two"><div class="field"><label for="f-name">आपका नाम</label><input id="f-name" autocomplete="name" required></div><div class="field"><label for="f-city">शहर</label><input id="f-city" autocomplete="address-level2"></div></div>'
   +'<div class="field"><label for="f-contact">ईमेल या मोबाइल नंबर</label><input id="f-contact" autocomplete="email" required><span class="hint">प्रकाशन की सूचना इसी पर भेजी जाएगी।</span></div>'
   +'<div class="two"><div class="field"><label for="f-kind">विधा</label><select id="f-kind"><option>कविता</option><option>लघुकथा</option><option>कहानी</option><option>लेख</option><option>संस्मरण</option><option>यात्रा-वृत्त</option><option>अन्य</option></select></div><div class="field"><label for="f-title">रचना का शीर्षक</label><input id="f-title" required></div></div>'
   +'<div class="field"><label for="f-body">रचना</label><textarea id="f-body" lang="hi" required placeholder="अपनी रचना यहाँ लिखिए या चिपकाइए"></textarea><span class="count" id="wc"></span></div>'
   +'<div class="payblock"><fieldset class="plans"><legend class="legend" style="margin-bottom:8px">प्रकाशन शुल्क</legend>'+plans+'</fieldset>'
   +'<div class="field" style="margin-bottom:6px"><span class="legend">UPI से भुगतान</span><span class="hint">इस UPI ID पर शुल्क भेजिए, फिर नीचे लेन-देन संख्या (UTR) लिखिए।</span></div>'
   +'<div class="upi"><code id="upiId">'+UPI_ID+'</code><button type="button" class="btn ghost sm" data-act="copy">कॉपी करें</button></div>'
   +'<div class="field"><label for="f-utr">UPI लेन-देन संख्या (१२ अंक)</label><input id="f-utr" inputmode="numeric" maxlength="12" autocomplete="off" required></div>'
   +'<label class="chk"><input type="checkbox" id="f-own"><span>यह रचना मेरी मौलिक है और मैं इसे अक्षरपाठ में प्रकाशित करने की अनुमति देता/देती हूँ।</span></label></div>'
   +'<p class="err" id="formErr" role="alert" hidden></p>'
   +'<button class="btn" type="submit" id="subBtn">रचना जमा करें</button></form></div>'
   +'<aside class="side card"><h3>प्रक्रिया</h3><ul><li>रचना और शुल्क की जानकारी भरिए।</li><li>संपादक मंडल रचना और भुगतान की जाँच करता है।</li><li>चयनित रचना अगले मासिक अंक में वर्ष, अंक और पृष्ठ संख्या के साथ छपती है।</li><li>अंक ऑनलाइन पढ़ने और PDF के रूप में उपलब्ध रहता है।</li></ul></aside></div></section>';
}

function loginCard(){
  return '<div class="card" style="margin-bottom:18px"><h3 style="margin-bottom:6px">पहले साइन-इन कीजिए</h3><p class="hint" style="margin-bottom:12px">आपके ईमेल पर एक लिंक आएगा। पासवर्ड की ज़रूरत नहीं।</p><div class="field"><label for="f-mail">ईमेल</label><input id="f-mail" type="email" autocomplete="email"></div><button class="btn" data-act="login">लिंक भेजें</button><p class="hint" id="loginMsg" role="status" style="margin-top:10px"></p></div>';
}
function submitGate(){
  if(DEMO)return '<section class="wrap"><div class="page-h"><h1>रचना भेजें</h1></div><div class="card" style="margin-top:20px"><p>यह डेमो दृश्य है। config.js में Supabase की कुंजियाँ जोड़ने पर रचना भेजना चालू हो जाएगा।</p></div></section>';
  if(!S.user)return '<section class="wrap"><div class="page-h"><h1>रचना भेजें</h1><p>अपनी रचना भेजने और बाद में उसमें बदलाव करने के लिए साइन-इन कीजिए।</p></div><div style="max-width:520px;margin-top:24px">'+loginCard()+'</div></section>';
  return submitFormView();
}
function editorView(){
  return '<section class="wrap"><div class="page-h"><h1>संपादक पटल</h1><p>अंक बनाइए, रचनाएँ जाँचिए और प्रकाशित कीजिए। संपादक प्रकाशन से पहले और बाद, दोनों समय बदलाव कर सकते हैं।</p></div>'
   +'<div id="issuebox" style="margin-top:20px"></div><h2 style="font-size:1.4rem;margin:28px 0 12px">जमा हुई रचनाएँ</h2><div id="edlist"></div></section>';
}

function renderMain(){
  const m=document.getElementById('main');if(!m){render();return}
  const body=S.view==='home'?homeView():S.view==='archive'?archiveView():S.view==='reader'?readerView():null;
  if(body==null)return;
  m.innerHTML=body+'<div class="wrap foot">'+(DEMO?'डेमो: इस दृश्य में दिखाई गई रचनाएँ नमूना सामग्री हैं।':'© अक्षरपाठ')+'</div>';
  mountAll();
}
function render(){
  if(S.view!=='submit')S.editRef=null;
  if(S.view!=='editor')S.scrolled=null;
  if(S.view==='editor'&&!isEditor())S.view='home';
  const body=S.view==='home'?homeView():S.view==='archive'?archiveView():S.view==='reader'?readerView():S.view==='editor'?editorView():submitGate();
  root.innerHTML='<div id="hdr">'+header()+'</div><div id="main">'+body+'<div class="wrap foot">'+(DEMO?'डेमो: इस दृश्य में दिखाई गई रचनाएँ नमूना सामग्री हैं।':'© अक्षरपाठ')+'</div></div>';
  mountAll();
  if(S.view==='submit'&&S.user&&!DEMO){restoreDraft();updateCount();loadMine()}
  if(S.view==='editor')loadEditor();
}

/* ---------- submit form ---------- */
const DKEY='ap_draft_v1';
const DFIELDS=['f-name','f-city','f-contact','f-kind','f-title','f-body','f-utr'];
function saveDraft(){
  if(S.editRef)return;
  try{
    const d={};DFIELDS.forEach(id=>{const e=document.getElementById(id);if(e)d[id]=e.value});
    const r=root.querySelector('input[name=plan]:checked');if(r)d.plan=r.value;
    localStorage.setItem(DKEY,JSON.stringify(d));
  }catch(_){}
}
function restoreDraft(){
  if(S.editRef)return;
  try{
    const d=JSON.parse(localStorage.getItem(DKEY)||'null');if(!d)return;
    DFIELDS.forEach(id=>{const e=document.getElementById(id);if(e&&d[id]&&!e.value)e.value=d[id]});
    if(d.plan){const r=root.querySelector('input[name=plan][value="'+d.plan+'"]');if(r)r.checked=true}
  }catch(_){}
}
function clearDraft(){try{localStorage.removeItem(DKEY)}catch(_){}}
let draftT=0;
const words=t=>(t.trim().match(/\S+/g)||[]).length;
function curPlan(){if(S.editRef){const it=(S.mine||[]).find(x=>x.ref===S.editRef);if(it)return +it.plan}const r=root.querySelector('input[name=plan]:checked');return r?+r.value:50}
function updateCount(){
  const b=document.getElementById('f-body'),c=document.getElementById('wc');if(!b||!c)return;
  c.textContent=dv(words(b.value))+' शब्द';
}
function formError(msg){const e=document.getElementById('formErr');e.textContent=msg;e.hidden=!msg;if(msg)e.scrollIntoView({block:'nearest'})}
const val=id=>(document.getElementById(id).value||'').trim();

async function submitForm(){
  if(S.editRef)return saveEdit();
  const plan=curPlan();
  const name=val('f-name'),contact=val('f-contact'),title=val('f-title'),body=val('f-body'),utr=val('f-utr');
  if(!name)return formError('कृपया अपना नाम लिखिए।');
  if(!contact)return formError('कृपया ईमेल या मोबाइल नंबर लिखिए।');
  if(!title)return formError('कृपया रचना का शीर्षक लिखिए।');
  if(!body)return formError('कृपया रचना लिखिए।');
  if(!/^\d{12}$/.test(utr))return formError('UPI लेन-देन संख्या ठीक १२ अंकों की होनी चाहिए।');
  if(!document.getElementById('f-own').checked)return formError('कृपया मौलिकता की पुष्टि कीजिए।');
  formError('');
  const btn=document.getElementById('subBtn');btn.disabled=true;btn.textContent='जमा हो रही है…';
  const r=await sb.from('articles').insert({author_id:S.user.id,name,city:val('f-city'),contact,kind:val('f-kind'),title,body,plan,utr}).select('ref').single();
  if(r.error){btn.disabled=false;btn.textContent='रचना जमा करें';return formError('रचना जमा नहीं हो सकी। कुछ देर बाद फिर कोशिश कीजिए।')}
  clearDraft();S.done=r.data.ref;render();window.scrollTo(0,0);
}

/* ---------- author: my submissions (editable only until published; enforced by database rules) ---------- */
async function loadMine(){
  const r=await sb.from('articles').select('*').eq('author_id',S.user.id).order('created_at',{ascending:false});
  S.mine=r.error?null:r.data;renderMine();
}
function renderMine(){
  const el=document.getElementById('mine');if(!el)return;
  if(!S.mine||!S.mine.length){el.innerHTML='';return}
  el.innerHTML='<div class="card"><h3>मेरी रचनाएँ</h3><p class="hint" style="margin-bottom:6px">प्रकाशन से पहले आप रचना में बदलाव कर सकते हैं। प्रकाशन के बाद बदलाव केवल संपादक कर सकते हैं।</p>'
   +S.mine.map(it=>{const pub=it.status===ST_PUB;
     return '<div class="item"><div class="i-t"><b>'+esc(it.title)+'</b><span>'+esc(it.ref)+' · '+esc(it.kind)+'</span></div><span class="chip'+(pub?' pub':'')+'">'+STL[it.status]+'</span>'
      +(pub?'':'<button class="btn ghost sm" data-act="edit" data-ref="'+esc(it.ref)+'">संपादित करें</button>')+'</div>'}).join('')+'</div>';
}
function startEdit(ref){
  const it=(S.mine||[]).find(x=>x.ref===ref);if(!it||it.status===ST_PUB)return;
  S.editRef=ref;
  const set=(id,v)=>{document.getElementById(id).value=v||''};
  set('f-name',it.name);set('f-city',it.city);set('f-contact',it.contact);set('f-kind',it.kind);set('f-title',it.title);set('f-body',it.body);
  document.getElementById('subForm').classList.add('editing');
  document.getElementById('subBtn').textContent='बदलाव सहेजें';
  document.getElementById('editBanner').innerHTML='<div class="banner"><span>संपादित हो रही है: <b>'+esc(it.title)+'</b></span><button type="button" class="btn ghost sm" data-act="cancel-edit">रद्द करें</button></div>';
  formError('');updateCount();
  document.getElementById('subForm').scrollIntoView({block:'start'});
}
function endEdit(){
  S.editRef=null;
  const f=document.getElementById('subForm');if(!f)return;
  f.reset();f.classList.remove('editing');
  document.getElementById('subBtn').disabled=false;
  document.getElementById('subBtn').textContent='रचना जमा करें';
  document.getElementById('editBanner').innerHTML='';
  updateCount();
}
async function saveEdit(){
  const name=val('f-name'),contact=val('f-contact'),title=val('f-title'),body=val('f-body');
  if(!name||!contact||!title||!body)return formError('नाम, संपर्क, शीर्षक और रचना भरना ज़रूरी है।');
  const btn=document.getElementById('subBtn');btn.disabled=true;
  const it=(S.mine||[]).find(x=>x.ref===S.editRef);
  const r=await sb.from('articles').update({name,city:val('f-city'),contact,kind:val('f-kind'),title,body}).eq('id',it.id).eq('status',ST_REVIEW).select('id');
  if(r.error){btn.disabled=false;return formError('बदलाव सहेजे नहीं जा सके। कुछ देर बाद फिर कोशिश कीजिए।')}
  const locked=!r.data.length;
  endEdit();await loadMine();
  if(locked)formError('यह रचना प्रकाशित हो चुकी है। अब केवल संपादक इसमें बदलाव कर सकते हैं।');
  else{formError('');toast('बदलाव सहेज लिए गए।')}
}

/* ---------- editor / moderator panel ---------- */
async function loadEditor(){
  const [a,b]=await Promise.all([
    sb.from('issues').select('*').order('ank',{ascending:false}),
    sb.from('articles').select('*').order('created_at',{ascending:false})
  ]);
  S.allIssues=a.data||[];S.all=b.data||[];
  renderIssueBox();renderEditor();
}
function renderIssueBox(){
  const el=document.getElementById('issuebox');if(!el)return;
  const maxAnk=S.allIssues.reduce((m,x)=>Math.max(m,x.ank),0);
  const now=new Date();
  const list=S.allIssues.map(i=>'<div class="item"><div class="i-t"><b>वर्ष '+dv(i.vol)+' · अंक '+dv(i.ank)+' · '+MONTHS[i.month-1]+' '+dv(i.year)+'</b><span>'+esc(i.theme)+'</span></div><span class="chip'+(i.is_live?' pub':'')+'">'+(i.is_live?'जारी':'तैयारी में')+'</span>'
    +'<button class="btn ghost sm" data-act="issue-live" data-id="'+esc(i.id)+'" data-live="'+(i.is_live?'0':'1')+'">'+(i.is_live?'वापस लें':'जारी करें')+'</button></div>').join('');
  el.innerHTML='<div class="card"><h3 style="margin-bottom:8px">अंक</h3>'+(list||'<p class="hint">अभी कोई अंक नहीं है। पहला अंक बनाइए।</p>')
   +'<form id="issueForm" style="margin-top:16px" novalidate><div class="two"><div class="field"><label for="i-vol">वर्ष (Volume)</label><input id="i-vol" type="number" min="1" value="'+(S.allIssues[0]?S.allIssues[0].vol:1)+'"></div><div class="field"><label for="i-ank">अंक संख्या</label><input id="i-ank" type="number" min="1" value="'+(maxAnk+1)+'"></div></div>'
   +'<div class="two"><div class="field"><label for="i-month">माह</label><select id="i-month">'+MONTHS.map((m,k)=>'<option value="'+(k+1)+'"'+(k===now.getMonth()?' selected':'')+'>'+m+'</option>').join('')+'</select></div><div class="field"><label for="i-year">वर्ष (सन्)</label><input id="i-year" type="number" value="'+now.getFullYear()+'"></div></div>'
   +'<div class="field"><label for="i-theme">अंक का विषय</label><input id="i-theme"></div><div class="field"><label for="i-note">संपादकीय टिप्पणी</label><input id="i-note"></div>'
   +'<p class="err" id="issueErr" role="alert" hidden></p><button class="btn sm" type="submit">अंक बनाइए</button></form></div>';
}
function renderEditor(){
  const el=document.getElementById('edlist');if(!el)return;
  if(!S.all.length){el.innerHTML='<div class="card"><p>अभी कोई रचना जमा नहीं हुई है।</p></div>';return}
  const opts=S.allIssues.map(i=>'<option value="'+esc(i.id)+'">अंक '+dv(i.ank)+' · '+MONTHS[i.month-1]+' '+dv(i.year)+'</option>').join('');
  el.innerHTML=S.all.map(it=>{
    const pub=it.status===ST_PUB,id=esc(it.id),at='data-id="'+id+'"';
    return '<details class="ed" data-id="'+id+'"'+(S.openId===it.id?' open':'')+'><summary><span><b style="font-family:var(--f-display);font-weight:400;font-size:1.1rem">'+esc(it.title)+'</b> · '+esc(it.name)+'</span><span><span class="chip'+(pub?' pub':'')+'">'+STL[it.status]+'</span> ₹'+dv(it.plan)+'</span></summary><div class="edin">'
     +'<p class="meta">'+esc(it.ref)+' · '+esc(it.kind)+' · '+esc(it.contact)+' · UTR '+esc(it.utr)+'</p>'
     +'<div class="field"><label for="et-'+id+'">शीर्षक</label><input id="et-'+id+'" value="'+esc(it.title)+'"></div>'
     +'<div class="field"><label for="eb-'+id+'">रचना</label><textarea id="eb-'+id+'" lang="hi">'+esc(it.body)+'</textarea></div>'
     +(pub?'':'<div class="field"><label for="ei-'+id+'">किस अंक में छापें</label><select id="ei-'+id+'">'+(opts||'<option value="">पहले अंक बनाइए</option>')+'</select></div>')
     +'<div class="edbtns"><button class="btn ghost sm" data-act="ed-save" '+at+'>बदलाव सहेजें</button>'
     +(pub?'<button class="btn ghost sm" data-act="ed-unpub" '+at+'>प्रकाशन वापस लें</button>':'<button class="btn sm" data-act="ed-pub" '+at+'>प्रकाशित करें</button>')
     +'</div></div></details>';
  }).join('');
  if(S.openId&&S.scrolled!==S.openId){const d=el.querySelector('details[data-id="'+S.openId+'"]');if(d){S.scrolled=S.openId;d.scrollIntoView({block:'start'})}}
}
async function edAct(kind,id){
  const g=x=>document.getElementById(x+'-'+id);
  const patch={};
  if(kind!=='unpub'){const t=g('et').value.trim(),b=g('eb').value.trim();if(!t||!b){toast('शीर्षक और रचना खाली नहीं हो सकते।');return}patch.title=t;patch.body=b}
  if(kind==='pub'){const iss=g('ei')&&g('ei').value;if(!iss){toast('पहले अंक चुनिए।');return}patch.status=ST_PUB;patch.issue_id=iss;patch.published_at=new Date().toISOString()}
  if(kind==='unpub'){patch.status=ST_REVIEW;patch.issue_id=null;patch.published_at=null}
  const r=await sb.from('articles').update(patch).eq('id',id).select('id');
  if(r.error||!r.data.length){toast('यह बदलाव सहेजा नहीं जा सका।');return}
  S.openId=id;await Promise.all([loadEditor(),loadPublic()]);
  toast(kind==='pub'?'रचना प्रकाशित हो गई।':kind==='unpub'?'प्रकाशन वापस ले लिया गया।':'बदलाव सहेज लिए गए।');
}
async function createIssue(){
  const num=id=>parseInt(document.getElementById(id).value,10);
  const rec={vol:num('i-vol'),ank:num('i-ank'),month:num('i-month'),year:num('i-year'),theme:val('i-theme'),note:val('i-note')||null};
  const err=document.getElementById('issueErr');
  if(!(rec.vol>0&&rec.ank>0&&rec.year>2000)||!rec.theme){err.textContent='वर्ष, अंक संख्या, सन् और विषय भरना ज़रूरी है।';err.hidden=false;return}
  const r=await sb.from('issues').insert(rec);
  if(r.error){err.textContent='अंक नहीं बन सका। शायद यह वर्ष और अंक संख्या पहले से मौजूद है।';err.hidden=false;return}
  await loadEditor();toast('अंक बन गया।');
}
async function setLive(id,live){
  const r=await sb.from('issues').update({is_live:live}).eq('id',id);
  if(r.error){toast('बदलाव नहीं हो सका।');return}
  await Promise.all([loadEditor(),loadPublic()]);
  toast(live?'अंक जारी हो गया।':'अंक वापस ले लिया गया।');
}


/* ---------- PDF ---------- */
async function makePDF(i){
  if(S.busy)return;
  const is=issues[i];
  S.busy=true;syncBusy();toast('PDF की तैयारी…',true);
  const stage=document.createElement('div');
  stage.style.cssText='position:fixed;left:-10000px;top:0;';
  document.body.appendChild(stage);
  try{
    if(!window.html2canvas)await loadScript('vendor/html2canvas.min.js?v='+V);
    if(!window.jspdf)await loadScript('vendor/jspdf.umd.min.js?v='+V);
    await fontsReady();
    const pg=await paginateAsync(is),n=pg.pages.length;
    const pdf=new window.jspdf.jsPDF({unit:'mm',format:'a5',orientation:'portrait'});
    for(let p=1;p<=n;p++){
      toast('PDF बन रहा है… '+dv(p)+' / '+dv(n),true);
      const el=renderPage(is,pg.pages[p-1],420,p,pg);stage.replaceChildren(el);
      await new Promise(r=>requestAnimationFrame(r));
      const cv=await window.html2canvas(el,{scale:2,backgroundColor:'#ffffff',logging:false});
      if(p>1)pdf.addPage();
      pdf.addImage(cv.toDataURL('image/jpeg',0.88),'JPEG',0,0,148,210);
    }
    pdf.save('Aksharpaath_Vol'+is.vol+'_Ank'+is.ank+'_'+MON_EN[is.m]+is.y+'.pdf');
    toast('PDF तैयार है।');
  }catch(e){toast('PDF नहीं बन सका। कुछ देर बाद फिर कोशिश कीजिए।')}
  finally{stage.remove();S.busy=false;syncBusy()}
}
function syncBusy(){root.querySelectorAll('[data-act=pdf]').forEach(b=>{b.disabled=S.busy})}

/* ---------- reader movement (only the reading area is redrawn) ---------- */
function topOfReader(){const r=document.getElementById('rstage');if(r){const y=r.getBoundingClientRect().top+scrollY-70;if(scrollY>y)scrollTo(0,Math.max(0,y))}}
function go(unitOrPage){
  if(narrow())S.unit=unitOrPage;else S.page=unitOrPage;
  renderMain();topOfReader();
}
function curPos(){return narrow()?S.unit+1:S.page}
function totalPos(is){return narrow()?unitCount(is):(is._pg?is._pg.pages.length:1)}
function setPos(p){if(narrow())go(p-1);else go(p)}
function openReader(i,page,ai){
  S.issue=i;S.view='reader';
  const is=issues[i];
  if(narrow()){S.unit=ai!=null?ai+2:0}
  else{S.page=ai!=null&&is._pg?is._pg.start[ai]:(page||1)}
  render();scrollTo(0,0);
}

/* ---------- events ---------- */
root.addEventListener('click',async e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const a=b.dataset.act;
  if(a==='nav'){S.view=b.dataset.v;render();scrollTo(0,0)}
  else if(a==='read'){openReader(+b.dataset.i,1)}
  else if(a==='goto'){openReader(+b.dataset.i,1,+b.dataset.ai)}
  else if(a==='unit'){go(+b.dataset.u)}
  else if(a==='pg'){const n=totalPos(issues[S.issue]);setPos(Math.max(1,Math.min(n,curPos()+ +b.dataset.d)))}
  else if(a==='pdf'){makePDF(+b.dataset.i)}
  else if(a==='again'){S.done=null;render()}
  else if(a==='edit'){startEdit(b.dataset.ref)}
  else if(a==='ed-open'){S.openId=b.dataset.id;S.scrolled=null;S.view='editor';render();scrollTo(0,0)}
  else if(a==='cancel-edit'){endEdit()}
  else if(a==='ed-save'||a==='ed-pub'||a==='ed-unpub'){edAct(a.slice(3),b.dataset.id)}
  else if(a==='issue-live'){setLive(b.dataset.id,b.dataset.live==='1')}
  else if(a==='logout'){await getSB();await sb.auth.signOut();S.view='home';render()}
  else if(a==='login'){
    const mail=(document.getElementById('f-mail').value||'').trim(),msg=document.getElementById('loginMsg');
    if(!/^\S+@\S+\.\S+$/.test(mail)){msg.textContent='कृपया सही ईमेल लिखिए।';return}
    b.disabled=true;msg.textContent='भेजा जा रहा है…';
    try{await getSB()}catch(_){b.disabled=false;msg.textContent='कनेक्शन में समस्या है। फिर कोशिश कीजिए।';return}
    const r=await sb.auth.signInWithOtp({email:mail,options:{emailRedirectTo:location.origin+location.pathname}});
    b.disabled=false;
    msg.textContent=r.error?'लिंक नहीं भेजा जा सका। कुछ देर बाद फिर कोशिश कीजिए।':'लिंक भेज दिया गया है। अपना ईमेल खोलकर उस पर क्लिक कीजिए।';
  }
  else if(a==='copy'){
    const fallback=()=>{const r=document.createRange();r.selectNodeContents(document.getElementById('upiId'));const s=getSelection();s.removeAllRanges();s.addRange(r);toast('UPI ID चुना गया है, कॉपी कर लीजिए।')};
    try{navigator.clipboard.writeText(UPI_ID).then(()=>toast('UPI ID कॉपी हो गई।'),fallback)}catch(_){fallback()}
  }
});
root.addEventListener('input',e=>{
  if(e.target.id==='f-body')updateCount();
  if(e.target.closest&&e.target.closest('#subForm')){clearTimeout(draftT);draftT=setTimeout(saveDraft,400)}
});
root.addEventListener('change',e=>{
  if(e.target.name==='plan'){updateCount();saveDraft()}
  if(e.target.id==='f-kind')saveDraft();
  if(e.target.id==='jump')setPos(+e.target.value+(narrow()?1:0));
});
root.addEventListener('submit',e=>{
  if(e.target.id==='subForm'){e.preventDefault();submitForm()}
  if(e.target.id==='issueForm'){e.preventDefault();createIssue()}
});
document.addEventListener('keydown',e=>{
  if(S.view!=='reader'||!issues[S.issue])return;
  if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement&&document.activeElement.tagName))return;
  const n=totalPos(issues[S.issue]),c=curPos();
  if(e.key==='ArrowRight'&&c<n)setPos(c+1);
  if(e.key==='ArrowLeft'&&c>1)setPos(c-1);
});
/* swipe on touch screens */
let tx=0,ty=0;
root.addEventListener('touchstart',e=>{if(S.view!=='reader'||!e.touches[0])return;tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
root.addEventListener('touchend',e=>{
  if(S.view!=='reader'||!e.changedTouches[0]||!issues[S.issue])return;
  const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;
  if(Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*2)return;
  const n=totalPos(issues[S.issue]),c=curPos();
  if(dx<0&&c<n)setPos(c+1);else if(dx>0&&c>1)setPos(c-1);
},{passive:true});
let rt=0,wasNarrow=narrow();
window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{
  if(narrow()!==wasNarrow){wasNarrow=narrow();if(S.view==='reader'||S.view==='home'||S.view==='archive'){render();return}}
  mountAll();
},150)});

/* ---------- start ---------- */
(async function(){
  if(DEMO){issues=SAMPLE;S.loading=false}
  else{const c=readIssuesCache();if(c){issues=c;S.loading=false}}
  render();                                   // first paint straight away (cached issues or placeholder)
  fontsReady().then(()=>{if(S.view==='home'||S.view==='archive'||S.view==='reader')renderMain()});
  if(!DEMO){
    const before=sigOf(issues);
    await loadPublic();
    if(sigOf(issues)!==before||S.loading===false){if(S.view==='home'||S.view==='archive')renderMain();else if(S.view==='reader'){if(!issues[S.issue])S.view='archive';render()}}
    try{
      await getSB();
      const s=await sb.auth.getSession();
      await setUser(s.data.session);refreshHeader();
      if(S.view==='submit'||S.view==='editor')render();
      sb.auth.onAuthStateChange((ev,session)=>{
        if(ev==='INITIAL_SESSION')return;
        const newId=session&&session.user?session.user.id:null,oldId=S.user?S.user.id:null;
        if(newId===oldId)return;
        setTimeout(()=>{setUser(session).then(()=>{refreshHeader();if(S.view==='submit'||S.view==='editor')render()})},0);
      });
    }catch(_){}
  }
})();
})();
