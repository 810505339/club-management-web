import{K as o,ak as e,o as l,a as c,Y as n,S as s,R as r,F as x,ab as C,b as I,M as L,V as p}from"./vue.6cd422f6.js";import{_ as R,__tla as V}from"./index.356a4008.js";let m,z=Promise.all([(()=>{try{return V}catch{}})()]).then(async()=>{const f={class:"icon-selector-warp-row"},u=o({name:"iconSelectorList"}),d=o({...u,props:{list:{type:Array,default:()=>[]},empty:{type:String,default:()=>"\u65E0\u76F8\u5173\u56FE\u6807"},prefix:{type:String,default:()=>""}},emits:["get-icon"],setup(t,{emit:_}){const y=t,g=i=>{_("get-icon",i)};return(i,A)=>{const k=e("SvgIcon"),S=e("el-col"),v=e("el-row"),b=e("el-empty"),h=e("el-scrollbar");return l(),c("div",f,[n(h,{ref:"selectorScrollbarRef"},{default:s(()=>[y.list.length>0?(l(),r(v,{key:0,gutter:10},{default:s(()=>[(l(!0),c(x,null,C(t.list,(a,w)=>(l(),r(S,{xs:6,sm:4,md:4,lg:4,xl:4,key:w,onClick:B=>g(a)},{default:s(()=>[I("div",{class:L(["icon-selector-warp-item",{"icon-selector-active":t.prefix===a}])},[n(k,{name:a},null,8,["name"])],2)]),_:2},1032,["onClick"]))),128))]),_:1})):p("",!0),t.list.length<=0?(l(),r(b,{key:1,"image-size":100,description:t.empty},null,8,["description"])):p("",!0)]),_:1},512)])}}});m=R(d,[["__scopeId","data-v-f89cf40b"]])});export{z as __tla,m as default};