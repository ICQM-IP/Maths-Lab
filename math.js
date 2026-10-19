/* Integer arithmetic only. Shared by the browser and the validation suite. */
(function(root){
'use strict';
const LEVELS={starter:{max:20,factor:5,quotient:5},standard:{max:100,factor:12,quotient:12},challenge:{max:999,factor:25,quotient:25}};
const OPS=['add','sub','mul','div'];
function integer(min,max,rng){return min+Math.floor(rng()*(max-min+1))}
function verify(q){if(!q||!Number.isSafeInteger(q.a)||!Number.isSafeInteger(q.b)||!Number.isSafeInteger(q.answer))return false;switch(q.op){case'add':return q.a+q.b===q.answer;case'sub':return q.a>=q.b&&q.a-q.b===q.answer;case'mul':return q.a*q.b===q.answer;case'div':return q.b>0&&q.a%q.b===0&&q.a/q.b===q.answer;default:return false}}
function generate(level='standard',operation='mix',rng=Math.random){const c=LEVELS[level]||LEVELS.standard;const op=OPS.includes(operation)?operation:OPS[integer(0,3,rng)];let a,b,answer;
if(op==='add'){a=integer(0,c.max,rng);b=integer(0,c.max-a,rng);answer=a+b}
if(op==='sub'){a=integer(0,c.max,rng);b=integer(0,a,rng);answer=a-b}
if(op==='mul'){a=integer(2,c.factor,rng);b=integer(1,c.factor,rng);answer=a*b}
if(op==='div'){b=integer(2,c.factor,rng);answer=integer(1,c.quotient,rng);a=b*answer}
const q={a,b,op,answer,level};if(!verify(q))throw Error('Invalid arithmetic question');const symbol={add:'＋',sub:'−',mul:'×',div:'÷'}[op];q.text=`${a} ${symbol} ${b} ＝ ?`;q.solution=`${a} ${symbol} ${b} ＝ ${answer}`;
const options=new Set([answer]);let attempts=0;while(options.size<3&&attempts++<30){const n=answer+integer(-9,9,rng);if(n>=0&&n!==answer)options.add(n)}for(let d=1;options.size<3;d++)options.add(answer+d);q.options=[...options];for(let i=q.options.length-1;i>0;i--){const j=integer(0,i,rng);[q.options[i],q.options[j]]=[q.options[j],q.options[i]]}return q}
function parseAnswer(raw){const text=String(raw).trim().replace(/[０-９]/g,c=>String(c.charCodeAt(0)-65296));return /^\d+$/.test(text)&&Number.isSafeInteger(Number(text))?Number(text):null}
const api={LEVELS,OPS,generate,verify,parseAnswer};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SmartPigMath=api;
})(typeof window!=='undefined'?window:globalThis);
