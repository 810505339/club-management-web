import{d as r,u as v,N as D,__tla as S}from"./index.356a4008.js";import{K as i,aC as s,h as p,aD as A,az as L,k as M,i as y,ak as R,o as P,R as C,S as o,Y as t,u as _,n as I}from"./vue.6cd422f6.js";let d,O=Promise.all([(()=>{try{return S}catch{}})()]).then(async()=>{let n;n=i({name:"layoutDefaults"}),d=i({...n,setup(V){const h=s(()=>r(()=>import("./aside.4da01ee6.js").then(async a=>(await a.__tla,a)),["assets/aside.4da01ee6.js","assets/index.356a4008.js","assets/vue.6cd422f6.js","assets/index.ed9c0012.css"])),m=s(()=>r(()=>import("./header.d0c593c3.js").then(async a=>(await a.__tla,a)),["assets/header.d0c593c3.js","assets/index.356a4008.js","assets/vue.6cd422f6.js","assets/index.ed9c0012.css"])),w=s(()=>r(()=>import("./main.e037d19e.js").then(async a=>(await a.__tla,a)),["assets/main.e037d19e.js","assets/index.356a4008.js","assets/vue.6cd422f6.js","assets/index.ed9c0012.css"])),e=p(""),l=p(),E=A(),T=v(),{themeConfig:b}=L(T),u=()=>{e.value.update(),l.value.layoutMainScrollbarRef.update()},c=()=>{I(()=>{setTimeout(()=>{u(),e.value.wrapRef.scrollTop=0,l.value.layoutMainScrollbarRef.wrapRef.scrollTop=0},500)})};return M(()=>{c(),D.done(600)}),y(()=>E.path,()=>{c()}),y(b,()=>{u()},{deep:!0}),(a,g)=>{const k=R("el-scrollbar"),f=R("el-container");return P(),C(f,{class:"layout-container"},{default:o(()=>[t(_(h)),t(f,{class:"layout-container-view h100"},{default:o(()=>[t(k,{ref_key:"layoutScrollbarRef",ref:e,class:"layout-backtop"},{default:o(()=>[t(_(m)),t(_(w),{ref_key:"layoutMainRef",ref:l},null,512)]),_:1},512)]),_:1})]),_:1})}}})});export{O as __tla,d as default};
