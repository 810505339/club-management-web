import{d as s,u as d,__tla as T}from"./index.356a4008.js";import{K as n,aC as o,h as k,az as E,aD as b,k as v,i as _,ak as M,o as S,R as w,S as x,Y as u,u as c,n as A}from"./vue.6cd422f6.js";let i,C=Promise.all([(()=>{try{return T}catch{}})()]).then(async()=>{let e;e=n({name:"layoutTransverse"}),i=n({...e,setup(D){const f=o(()=>s(()=>import("./header.d0c593c3.js").then(async a=>(await a.__tla,a)),["assets/header.d0c593c3.js","assets/index.356a4008.js","assets/vue.6cd422f6.js","assets/index.ed9c0012.css"])),p=o(()=>s(()=>import("./main.e037d19e.js").then(async a=>(await a.__tla,a)),["assets/main.e037d19e.js","assets/index.356a4008.js","assets/vue.6cd422f6.js","assets/index.ed9c0012.css"])),t=k(),y=d(),{themeConfig:m}=E(y),h=b(),r=()=>{t.value.layoutMainScrollbarRef.update()},l=()=>{A(()=>{setTimeout(()=>{r(),t.value.layoutMainScrollbarRef.wrapRef.scrollTop=0},500)})};return v(()=>{l()}),_(()=>h.path,()=>{l()}),_(m,()=>{r()},{deep:!0}),(a,P)=>{const R=M("el-container");return S(),w(R,{class:"layout-container flex-center layout-backtop"},{default:x(()=>[u(c(f)),u(c(p),{ref_key:"layoutMainRef",ref:t},null,512)]),_:1})}}})});export{C as __tla,i as default};
