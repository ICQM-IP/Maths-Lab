const assert=require('node:assert/strict');const M=require('../math.js');
let seed=9182;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};let count=0;
for(const level of Object.keys(M.LEVELS))for(const op of M.OPS)for(let i=0;i<1000;i++){
 const q=M.generate(level,op,rng);let expected;switch(op){case'add':expected=q.a+q.b;assert(q.answer<=M.LEVELS[level].max);break;case'sub':expected=q.a-q.b;assert(q.a>=q.b);break;case'mul':expected=q.a*q.b;assert(q.a<=M.LEVELS[level].factor);break;case'div':expected=q.a/q.b;assert(q.b>0);assert.equal(q.a%q.b,0);break}
 assert.equal(q.answer,expected);assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert.equal(q.options.filter(x=>x===expected).length,1);assert(q.options.every(Number.isSafeInteger));assert(M.verify(q));assert(!M.verify({...q,answer:q.answer+1}));count++;
}
for(const raw of ['', '  ', '2e2','1.5','-1','Infinity','0x10','9007199254740992'])assert.equal(M.parseAnswer(raw),null);
assert.equal(M.parseAnswer(' ００７ '),7);assert.equal(M.parseAnswer('0'),0);
for(const boundary of [()=>0,()=>.999999])for(const level of Object.keys(M.LEVELS))for(const op of M.OPS)assert(M.verify(M.generate(level,op,boundary)));
console.log(`${count} generated questions independently checked; choices, boundaries and input validation passed.`);
