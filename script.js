'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const toAr=n=>Number(n).toLocaleString('ar-EG');
$('#year').textContent=toAr(2026);

/* الترويسة */
const hd=$('#hd');
addEventListener('scroll',()=>hd.classList.toggle('sc',scrollY>10),{passive:true});
$('#navT').onclick=()=>hd.classList.toggle('mo');
$$('.mnav a').forEach(a=>a.onclick=()=>hd.classList.remove('mo'));
/* تمييز الرابط النشط */
const secIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){$$('nav.main a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id|| (e.target.id==='top'&&a.getAttribute('href')==='#top')))}}),{rootMargin:'-40% 0px -55%'});
['top','features','editor','files','interface','shots','download','comments'].forEach(id=>{const el=document.getElementById(id);if(el)secIO.observe(el)});

/* الكشف عند التمرير */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));

/* الكتابة الحية في الواجهة */
const phrases=['اكتب بحريةٍ تامة…','نسّق مستنداتك بسهولة…','حوّل ملفاتك بضغطة…','ابحث واستبدل بدقة…'];
const tt=$('#typeTarget');
if(RM){tt.textContent=phrases[0]}else{(function loop(){let p=0;function type(){const ph=phrases[p];let i=0;const t=setInterval(()=>{tt.textContent=ph.slice(0,++i);if(i>=ph.length){clearInterval(t);setTimeout(del,1400)}},55)}function del(){let l=tt.textContent.length;const t=setInterval(()=>{tt.textContent=phrases[p].slice(0,--l);if(l<=0){clearInterval(t);p=(p+1)%phrases.length;setTimeout(type,350)}},28)}type()})()}

/* علامات تبويب الواجهة + قائمة ملف */
const hw=$('#heroWin');
$$('.dtab').forEach(b=>b.onclick=()=>{if(b.querySelector('i')&&event.target.tagName==='I')return;$$('.dtab').forEach(x=>x.classList.remove('on'));b.classList.add('on');const txt=b.dataset.mode==='txt';hw.classList.toggle('mode-txt',txt);$('#winTitle').textContent=txt?'مبتدأ البيان — ملاحظات.txt':'مبتدأ البيان — مستند عربي.docx';$('#statusFmt').textContent=txt?'TXT':'DOCX';});
[['fileBtn','fileMenu'],['fileBtn2','fileMenu2']].forEach(([b,m])=>{const B=document.getElementById(b),M=document.getElementById(m);B.onclick=e=>{e.stopPropagation();$$('.menu').forEach(x=>{if(x!==M)x.classList.remove('open')});M.classList.toggle('open')};});
document.addEventListener('click',()=>$$('.menu').forEach(m=>m.classList.remove('open')));

/* ===== تجربة البحث والاستبدال ===== */
let S='النص الجيد يبدأ بأداة جيدة. في مبتدأ البيان يبقى النص واضحًا مهما طال، ويمكنك أن تبحث عن كلمة نص أو عبارة النص العربي بدقة، بل وحتى عن Text وtext وTEXT مع حساسية حالة الأحرف. جرّب الاستبدال لترى كيف تُحدَّث الكلمات في النص فورًا.';
let cur=0, matches=[];
const esc=t=>t.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function buildRe(){const q=$('#q').value;if(!q)return null;const f='g'+($('#optCase').checked?'':'i');let src;
 if($('#optRegex').checked){src=q}else{const e=q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');src=$('#optWord').checked?`(?<![\\u0600-\\u06FF\\w])${e}(?![\\u0600-\\u06FF\\w])`:e}
 try{return new RegExp(src,f)}catch{return 'err'}}
function find(){matches=[];const re=buildRe();if(re==='err')return 'err';if(!re)return[];let m;while((m=re.exec(S))){matches.push([m.index,m.index+m[0].length]);if(m.index===re.lastIndex)re.lastIndex++}return matches}
function render(){const res=find();const box=$('#sample'),cnt=$('#cnt');
 if(res==='err'){cnt.textContent='تعبير نمطي غير صالح';box.innerHTML=esc(S);return}
 if(!matches.length){cnt.textContent='لا نتائج';box.innerHTML=esc(S);return}
 cur=((cur%matches.length)+matches.length)%matches.length;
 let out='',last=0;matches.forEach(([s,e],i)=>{out+=esc(S.slice(last,s))+`<mark class="${i===cur?'cur':''}">${esc(S.slice(s,e))}</mark>`;last=e});
 box.innerHTML=out+esc(S.slice(last));
 cnt.textContent=`النتائج: ${toAr(matches.length)} — الحالية: ${toAr(cur+1)}`}
['q','optRegex','optWord','optCase'].forEach(id=>document.getElementById(id).addEventListener('input',()=>{cur=0;render()}));
$('#btnNext').onclick=()=>{cur++;render()};
$('#btnPrev').onclick=()=>{cur--;render()};
$('#btnOne').onclick=()=>{if(!matches.length)return;const[s,e]=matches[cur];S=S.slice(0,s)+$('#r').value+S.slice(e);render()};
$('#btnAll').onclick=()=>{const res=find();if(res==='err'||!matches.length)return;for(let i=matches.length-1;i>=0;i--){const[s,e]=matches[i];S=S.slice(0,s)+$('#r').value+S.slice(e)}cur=0;render()};
render();

/* ===== السمات ===== */
const TH={
 night:{n:'ليلي',bg:'#0d141b',pn:'#16222c',tx:'#eaf3f4',ac:'#e3b25c',mu:'#9fb3bc'},
 light:{n:'فاتح',bg:'#f4efe6',pn:'#ffffff',tx:'#22313c',ac:'#a9762a',mu:'#8a97a1'},
 teal:{n:'فيروزي',bg:'#06201d',pn:'#0a2b27',tx:'#dcfff7',ac:'#2dd4bf',mu:'#7fb5ac'},
 violet:{n:'بنفسجي',bg:'#140f21',pn:'#1b1430',tx:'#efeaff',ac:'#a78bfa',mu:'#9d90c0'},
 sand:{n:'رملي',bg:'#efe3cf',pn:'#fbf4e6',tx:'#4a3a26',ac:'#c26d2c',mu:'#96826a'}};
const tp=$('#tprev'),sws=$('#sws');
function apply(t){const T=TH[t];tp.style.setProperty('--p-bg',T.bg);tp.style.setProperty('--p-panel',T.pn);tp.style.setProperty('--p-text',T.tx);tp.style.setProperty('--p-ac',T.ac);tp.style.setProperty('--p-mut',T.mu);tp.style.setProperty('--p-line',T.mu+'44');
 $('#pickBg').value=T.bg;$('#pickTx').value=T.tx;$('#pickAc').value=T.ac;
 $$('.sw').forEach(b=>b.classList.toggle('on',b.dataset.t===t))}
Object.entries(TH).forEach(([k,T],i)=>{const b=document.createElement('button');b.className='sw';b.dataset.t=k;b.innerHTML=`<span class="dots"><i style="background:${T.bg};border:1px solid #777"></i><i style="background:${T.ac}"></i><i style="background:${T.tx};border:1px solid #777"></i></span>${T.n}`;b.onclick=()=>apply(k);sws.appendChild(b);if(i===0)apply(k)});
$('#pickBg').oninput=e=>tp.style.setProperty('--p-bg',e.target.value);
$('#pickTx').oninput=e=>tp.style.setProperty('--p-text',e.target.value);
$('#pickAc').oninput=e=>tp.style.setProperty('--p-ac',e.target.value);

/* معرض اللقطات */
const tr=$('#shotTrack');
$('#shotNext').onclick=()=>tr.scrollBy({left:-580,behavior:RM?'auto':'smooth'});
$('#shotPrev').onclick=()=>tr.scrollBy({left:580,behavior:RM?'auto':'smooth'});

/* المنبثقات والتنبيه */
$$('[data-modal]').forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById(a.dataset.modal).classList.add('open')});
$$('.modal').forEach(m=>{m.querySelector('.ov').onclick=()=>m.classList.remove('open');m.querySelector('.x').onclick=()=>m.classList.remove('open')});
addEventListener('keydown',e=>{if(e.key==='Escape')$$('.modal').forEach(m=>m.classList.remove('open'))});
let toastT;function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),3400)}
/* زر التحميل أصبح رابطًا فعليًا (href="downloads/setup.exe")؛ استبدل هذا المسار
   بمسار ملف التثبيت الحقيقي أو رابط GitHub Releases / Google Drive المباشر. */

/* ===== زر الإعجاب (❤) ===== */
/*
  يستخدم هذا المثال خدمة عدّاد مجانية (countapi.xyz) لتخزين رقم الإعجابات
  بشكل مشترك بين كل الزوار دون الحاجة لخادم خاص بك. للاستخدام في موقع حقيقي
  يُفضّل لاحقًا استبدالها بخدمة تتحكم بها أنت (Firebase / Supabase) لضمان
  الموثوقية على المدى الطويل ومنع التلاعب بالعداد.
*/
(function(){
  const NS='mubtada-al-bayan-site', KEY='likes';
  const base=`https://api.countapi.xyz`;
  const btn=$('#likeBtn'), label=$('#likeLabel'), countEl=$('#likeCount');
  const likedFlag='mab_liked';
  function setUI(liked){
    btn.classList.toggle('on',liked);
    btn.setAttribute('aria-pressed',String(liked));
    label.textContent=liked?'أعجبك هذا':'أعجبني';
  }
  fetch(`${base}/get/${NS}/${KEY}`).then(r=>r.json()).then(d=>{countEl.textContent=toAr(d.value||0)}).catch(()=>{countEl.textContent='—'});
  setUI(localStorage.getItem(likedFlag)==='1');
  btn.onclick=async()=>{
    const liked=localStorage.getItem(likedFlag)==='1';
    try{
      const url=liked?`${base}/update/${NS}/${KEY}?amount=-1`:`${base}/hit/${NS}/${KEY}`;
      const r=await fetch(url); const d=await r.json();
      countEl.textContent=toAr(d.value||0);
      localStorage.setItem(likedFlag,liked?'0':'1');
      setUI(!liked);
    }catch{toast('تعذّر الاتصال بخدمة الإعجابات، حاول لاحقًا')}
  };
})();

/* ===== التعليقات (🗯️) ===== */
/*
  تُحفظ التعليقات هنا في localStorage الخاص بمتصفح كل زائر فقط (عرض تجريبي)،
  أي أن كل زائر يرى تعليقاته الخاصة به فقط، لا تعليقات بقية الزوار. لعرض
  تعليقات جميع الزوار للجميع، اربط هذا النموذج بخدمة مثل Giscus أو Disqus
  أو خزّن التعليقات في Firebase/Supabase بدل السطر التالي.
*/
(function(){
  const KEY='mab_comments';
  const list=$('#cList'), form=$('#cForm');
  const esc=t=>t.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  function load(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return[]}}
  function save(arr){localStorage.setItem(KEY,JSON.stringify(arr))}
  function render(){
    const arr=load();
    if(!arr.length){list.innerHTML='<p class="c-empty">لا توجد تعليقات بعد — كن أول من يشارك رأيه.</p>';return}
    list.innerHTML=arr.slice().reverse().map(c=>`<div class="c-item"><div class="c-head">🗯️ ${esc(c.name)}<span class="c-date">${esc(c.date)}</span></div><p>${esc(c.text)}</p></div>`).join('');
  }
  form.onsubmit=e=>{
    e.preventDefault();
    const name=$('#cName').value.trim(), text=$('#cText').value.trim();
    if(!name||!text)return;
    const arr=load();
    arr.push({name,text,date:new Date().toLocaleDateString('ar-EG')});
    save(arr);form.reset();render();
    toast('تم نشر تعليقك');
  };
  render();
})();

