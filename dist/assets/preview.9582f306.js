import{z as S,d as F,_ as G,__tla as K}from"./index.356a4008.js";import{e as Y,__tla as j}from"./table.c1cb8ecc.js";import{c as q,__tla as B}from"./commonFunction.18c8f8ad.js";import{K as k,aC as H,h as m,a1 as J,ak as d,o as g,R as P,S as i,Y as s,u as r,a as Z,ab as $,F as M,G as V}from"./vue.6cd422f6.js";let N,Q=Promise.all([(()=>{try{return K}catch{}})(),(()=>{try{return j}catch{}})(),(()=>{try{return B}catch{}})()]).then(async()=>{const x=k({name:"preview"}),C=k({...x,setup(W,{expose:I}){const T=H(()=>F(()=>import("./index.ae4dbe0e.js").then(async a=>(await a.__tla,a)),["assets/index.ae4dbe0e.js","assets/vue.6cd422f6.js","assets/index.356a4008.js","assets/index.ed9c0012.css","assets/index.3d09312f.css"])),{copyText:w}=q(),h=m(!1),p=J({open:!1,titel:"\u4EE3\u7801\u9884\u89C8",fileTree:[],activeName:""}),f=m([]),_=m(""),v=m([]),R=async a=>{await D(a),h.value=!0},b=m(!1),z=m(),D=a=>{b.value=!0,v.value=[],Y(a).then(e=>{f.value=e;for(let n in e)v.value.push(e[n].codePath);_.value=e[0].code,p.activeName=e[0].codePath;const l=U(v);p.fileTree=S(l,"id","parentId","children","/")}).finally(()=>{b.value=!1})},E=async(a,e)=>{if(e&&!e.isLeaf)return!1;p.activeName=a.id;const l=f.value.filter(n=>n.codePath===a.id);l.length>0&&(_.value=l[0].code)},O=a=>{const e=f.value.filter(l=>l.codePath===a.paneName);e.length>0&&(_.value=e[0].code)},U=a=>{const e={},l=[];for(const n of a.value){let o=[];n.includes("\\")?o=n.split("\\"):o=n.split("/");let c="";for(let u=0;u<o.length;u++){const y=c;c=c.length===0?o[u]:c.replaceAll(".","/")+"/"+o[u],!e[c]&&(e[c]=!0,l.push({id:c,label:o[u],parentId:y||"/",templateName:n.k}))}}return l};return I({openDialog:R}),(a,e)=>{const l=d("el-tree"),n=d("el-scrollbar"),o=d("pane"),c=d("SvgIcon"),u=d("el-tab-pane"),y=d("el-tabs"),A=d("splitpanes"),L=d("el-dialog");return g(),P(L,{fullscreen:"",title:"\u4EE3\u7801\u9884\u89C8",modelValue:r(h),"onUpdate:modelValue":e[2]||(e[2]=t=>V(h)?h.value=t:null),width:"90%",top:"3vh","append-to-body":"","close-on-click-modal":!1},{default:i(()=>[s(A,null,{default:i(()=>[s(o,{size:"25"},{default:i(()=>[s(n,{height:"calc(100vh - 100px)",class:"mt20"},{default:i(()=>[s(l,{ref:"treeRef","node-key":"id",data:r(p).fileTree,"expand-on-click-node":!1,"highlight-current":"",onNodeClick:E},null,8,["data"])]),_:1})]),_:1}),s(o,null,{default:i(()=>[s(y,{modelValue:r(p).activeName,"onUpdate:modelValue":e[1]||(e[1]=t=>r(p).activeName=t),onTabClick:O},{default:i(()=>[(g(!0),Z(M,null,$(r(f),t=>(g(),P(u,{label:t.codePath.substring(t.codePath.lastIndexOf("/")+1),name:t.codePath,key:t.codePath},{default:i(()=>[s(c,{name:"ele-CopyDocument",size:25,class:"copy_btn",onClick:X=>r(w)(t.code)},null,8,["onClick"])]),_:2},1032,["label","name"]))),128)),s(r(T),{ref_key:"codeEditorRef",ref:z,theme:"darcula",modelValue:r(_),"onUpdate:modelValue":e[0]||(e[0]=t=>V(_)?_.value=t:null),mode:"go",readOnly:"",height:"calc(100vh - 100px)"},null,8,["modelValue"])]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1},8,["modelValue"])}}});N=G(C,[["__scopeId","data-v-b2dd9e04"]])});export{Q as __tla,N as default};
