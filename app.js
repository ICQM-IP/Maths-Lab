'use strict';
const $=selector=>document.querySelector(selector);const $$=selector=>[...document.querySelectorAll(selector)];
let language='zh';try{language=localStorage.getItem('pig-lab-language')==='en'?'en':'zh'}catch{}
const say=(zh,en)=>language==='zh'?zh:en;
let refreshChallenge=()=>{},refreshFilter=()=>{};
function translate(){document.documentElement.lang=language==='zh'?'zh-Hant':'en';$$('[data-zh]').forEach(e=>e.textContent=e.dataset[language]);$$('[data-placeholder-zh]').forEach(e=>e.placeholder=e.dataset['placeholder'+(language==='zh'?'Zh':'En')]);$('#language').textContent=language==='zh'?'EN':'中';refreshChallenge();refreshFilter()}
$('#language').addEventListener('click',()=>{language=language==='zh'?'en':'zh';try{localStorage.setItem('pig-lab-language',language)}catch{}translate();hideBubble()});
// Presentation is an in-page layout; full-screen is optional and never required.
let presenting=false;try{presenting=sessionStorage.getItem('pig-lab-presentation')==='1'}catch{}
function setPresentation(value){presenting=value;document.body.classList.toggle('presenting',value);$$('.projection-toggle').forEach(b=>b.setAttribute('aria-pressed',String(value)));try{sessionStorage.setItem('pig-lab-presentation',value?'1':'0')}catch{}if(!value&&document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});}
$$('.projection-toggle').forEach(b=>b.addEventListener('click',()=>setPresentation(!presenting)));
$('#fullscreen').addEventListener('click',async()=>{setPresentation(true);try{if(document.fullscreenElement){await document.exitFullscreen()}else if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen()}else throw Error('unsupported')}catch{$('#global-status').textContent=say('投影版面已啟用；此瀏覽器暫未能進入全螢幕。','Presentation is active; full screen is unavailable in this browser.')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&presenting)setPresentation(false)});setPresentation(presenting);
// One speech lane below the board. It never overlays question or answer controls.
const cheers={boy:[['加油！！','You can do it!'],['你得㗎！','Go for it!'],['再試一次！','Try again!']],girl:[['努力呀～','Keep going!'],['好叻呀！','Good job!'],['慢慢諗～','Think it through!']],all:[['一齊加油！','Let’s go!'],['你得㗎！','You can do it!']]};const previousCheer={};let bubbleTimer;const pigTimers=new Map();
function hideBubble(){clearTimeout(bubbleTimer);if($('#pig-bubble'))$('#pig-bubble').hidden=true}
function animatePig(button){clearTimeout(pigTimers.get(button));button.classList.remove('happy');void button.offsetWidth;button.classList.add('happy');pigTimers.set(button,setTimeout(()=>button.classList.remove('happy'),2100))}
function encourage(who='all',message){const bubble=$('#pig-bubble');if(!bubble)return;clearTimeout(bubbleTimer);let pair=message;if(!pair){const list=cheers[who];let i=Math.floor(Math.random()*list.length);if(i===previousCheer[who])i=(i+1)%list.length;previousCheer[who]=i;pair=list[i]}bubble.textContent=pair[language==='zh'?0:1];bubble.dataset.speaker=who;bubble.hidden=false;bubbleTimer=setTimeout(()=>bubble.hidden=true,2500)}
$$('[data-pig]').forEach(button=>button.addEventListener('click',()=>{animatePig(button);encourage(button.dataset.pig)}));
try{if($('[data-pig]')&&!sessionStorage.getItem('pig-lab-wave-v8')){$$('[data-pig]').forEach(animatePig);sessionStorage.setItem('pig-lab-wave-v8','1')}}catch{}
// Topic buttons genuinely filter the visible game / teacher cards.
const filters=$$('[data-filter]');if(filters.length){let selected='all';refreshFilter=()=>{let count=0;$$('.game-card[data-category],.teacher-card[data-category]').forEach(card=>{card.hidden=selected!=='all'&&card.dataset.category!==selected;if(!card.hidden)count++});const label=$('#filter-count');if(label)label.textContent=say(`顯示 ${count} 款遊戲`,`${count} ${count===1?'game':'games'} shown`)};filters.forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.filter;filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));refreshFilter()}))}
// A small optional multiple-choice interaction, ready immediately.
if($('#chalkboard')){
 const M=window.SmartPigMath,feedback=$('#challenge-feedback');
 let question,solved=false,state='active',last='',starsTimer;
 refreshChallenge=()=>{feedback.textContent=state==='correct'?say('答啱啦！好叻呀！','Correct! Good job!'):state==='wrong'?say('再試一次，你得㗎！','Try again. You can do it!'):say('揀一個答案，玩一玩！','Pick an answer and have a go!');feedback.dataset.state=state};
 function newQuestion(){let candidate;for(let i=0;i<20;i++){candidate=M.generate('starter','mix');if(candidate.text!==last)break}question=candidate;last=question.text;solved=false;state='active';$('#question').textContent=question.text;const options=$('#answer-choices');options.replaceChildren();question.options.forEach(answer=>{const button=document.createElement('button');button.type='button';button.textContent=String(answer);button.dataset.answer=String(answer);button.addEventListener('click',()=>{if(solved)return;if(answer===question.answer){solved=true;state='correct';$$('#answer-choices button').forEach(b=>{b.disabled=true;if(Number(b.dataset.answer)===answer)b.classList.add('is-correct')});clearTimeout(starsTimer);$('#chalkboard').classList.remove('celebrate');void $('#chalkboard').offsetWidth;$('#chalkboard').classList.add('celebrate');starsTimer=setTimeout(()=>$('#chalkboard').classList.remove('celebrate'),1100);$$('[data-pig]').forEach(animatePig);encourage('all',['答啱啦！','Good job!'])}else{state='wrong';button.classList.add('is-wrong');setTimeout(()=>button.classList.remove('is-wrong'),600)}refreshChallenge()});options.append(button)});refreshChallenge()}
 $('#next-question').addEventListener('click',newQuestion);newQuestion();
}
translate();
