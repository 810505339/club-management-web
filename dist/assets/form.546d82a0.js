import{d as b,__tla as k}from"./index.356a4008.js";import{K as m,aC as x,h as _,ak as i,o as C,R as D,S as t,b as R,Y as c,W as A,X as B,u as o,G as E}from"./vue.6cd422f6.js";let d,P=Promise.all([(()=>{try{return k}catch{}})()]).then(async()=>{let s,n;s={class:"dialog-footer"},n=m({name:"SysFileDialog"}),d=m({...n,emits:["refresh"],setup(S,{expose:f,emit:p}){const g=x(()=>b(()=>import("./index.65827893.js").then(async e=>(await e.__tla,e)),["assets/index.65827893.js","assets/index.356a4008.js","assets/vue.6cd422f6.js","assets/index.ed9c0012.css"])),a=_(!1),r=_([]),h=()=>{r.value=[],a.value=!0},v=()=>{p("refresh")};return f({openDialog:h}),(e,l)=>{const y=i("el-button"),V=i("el-dialog");return C(),D(V,{title:"\u4E0A\u4F20\u6587\u4EF6",modelValue:o(a),"onUpdate:modelValue":l[1]||(l[1]=u=>E(a)?a.value=u:null),"close-on-click-modal":!1,draggable:""},{footer:t(()=>[R("span",s,[c(y,{onClick:l[0]||(l[0]=u=>a.value=!1)},{default:t(()=>[A(B(e.$t("common.cancelButtonText")),1)]),_:1})])]),default:t(()=>[c(o(g),{onChange:v,"model-value":o(r)},null,8,["model-value"])]),_:1},8,["modelValue"])}}})});export{P as __tla,d as default};
