import{u as c,__tla as w}from"./user.5f63bc5c.js";import{K as i,l as f,ak as $,o as s,a,b as e,X as t,u as o,V as A,F as B,ab as C,R as M}from"./vue.6cd422f6.js";import{_ as N,__tla as V}from"./index.356a4008.js";let d,D=Promise.all([(()=>{try{return w}catch{}})(),(()=>{try{return V}catch{}})()]).then(async()=>{const u={class:"layout-navbars-breadcrumb-user-news"},m={class:"head-box"},b={class:"head-box-title"},_={class:"content-box"},v={class:"content-box-msg"},y={class:"content-box-time"},p=i({name:"layoutBreadcrumbUserNews"}),h=i({...p,setup(F){const l=f(()=>c().getAllMsg()),x=()=>{c().removeAll()};return(n,I)=>{const k=$("el-empty");return s(),a("div",u,[e("div",m,[e("div",b,t(n.$t("user.newTitle")),1),o(l).length>0?(s(),a("div",{key:0,class:"head-box-btn",onClick:x},t(n.$t("user.newBtn")),1)):A("",!0)]),e("div",_,[o(l).length>0?(s(!0),a(B,{key:0},C(o(l),(r,g)=>(s(),a("div",{class:"content-box-item",key:g},[e("div",null,t(r.label),1),e("div",v,t(r.value),1),e("div",y,t(r.time),1)]))),128)):(s(),M(k,{key:1,description:n.$t("user.newDesc")},null,8,["description"]))])])}}});d=N(h,[["__scopeId","data-v-78e168c6"]])});export{D as __tla,d as default};
