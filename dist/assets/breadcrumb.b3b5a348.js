import{K as _,az as I,aD as P,aH as R,a1 as W,l as X,k as Y,aJ as j,ak as b,u as i,o as s,a as c,Y as d,S as p,a4 as q,F as A,ab as O,R as h,V as v,X as y,a6 as Q,W as T}from"./vue.6cd422f6.js";import{G as U,u as Z,o as f,L as C,_ as aa,__tla as ea}from"./index.356a4008.js";let F,ta=Promise.all([(()=>{try{return ea}catch{}})()]).then(async()=>{const x={key:0,class:"layout-navbars-breadcrumb"},V={key:0,class:"layout-navbars-breadcrumb-span"},w={key:1},B={key:2},N=["onClick"],E=_({name:"layoutBreadcrumb"}),M=_({...E,setup(ra){const z=U(),$=Z(),{themeConfig:u}=I($),{routesList:L}=I(z),l=P(),S=R(),a=W({breadcrumbList:[],routeSplit:[],routeSplitFirst:"",routeSplitIndex:1}),D=X(()=>{o(l.path);const{layout:e,isBreadcrumb:t}=u.value;return e==="classic"||e==="transverse"?!1:!!t}),G=e=>{const{redirect:t,path:n}=e;t?S.push(t):S.push(n)},H=()=>{u.value.isCollapse=!u.value.isCollapse,J()},J=()=>{C.remove("themeConfig"),C.set("themeConfig",u.value)},g=e=>{e.forEach(t=>{a.routeSplit.forEach((n,k,m)=>{a.routeSplitFirst===t.path&&(a.routeSplitFirst+=`/${m[a.routeSplitIndex]}`,a.breadcrumbList.push(t),a.routeSplitIndex++,t.children&&g(t.children))})})},o=e=>{if(!u.value.isBreadcrumb)return!1;a.breadcrumbList=[L.value[0]],a.routeSplit=e.split("/"),a.routeSplit.shift(),a.routeSplitFirst=`/${a.routeSplit[0]}`,a.routeSplitIndex=1,g(L.value),a.breadcrumbList.push(l),l.name==="router.home"||l.name==="staticRoutes.notFound"&&a.breadcrumbList.length>1?a.breadcrumbList.splice(0,a.breadcrumbList.length-1):a.breadcrumbList.length>0&&(a.breadcrumbList[a.breadcrumbList.length-1].meta.tagsViewName=f.setMenuI18n(l))};return Y(()=>{o(l.path)}),j(e=>{o(e.path)}),(e,t)=>{const n=b("SvgIcon"),k=b("el-breadcrumb-item"),m=b("el-breadcrumb");return i(D)?(s(),c("div",x,[d(n,{class:"layout-navbars-breadcrumb-icon",name:i(u).isCollapse?"ele-Expand":"ele-Fold",size:16,onClick:H},null,8,["name"]),d(m,{class:"layout-navbars-breadcrumb-hide"},{default:p(()=>[d(q,{name:"breadcrumb"},{default:p(()=>[(s(!0),c(A,null,O(a.breadcrumbList,(r,K)=>(s(),h(k,{key:r.meta.tagsViewName?r.meta.tagsViewName:r.name},{default:p(()=>[K===a.breadcrumbList.length-1?(s(),c("span",V,[i(u).isBreadcrumbIcon?(s(),h(n,{key:0,name:r.meta.icon,class:"layout-navbars-breadcrumb-iconfont"},null,8,["name"])):v("",!0),r.meta.tagsViewName?(s(),c("div",B,y(r.meta.tagsViewName),1)):(s(),c("div",w,y(i(f).setMenuI18n(r)),1))])):(s(),c("a",{key:1,onClick:Q(sa=>G(r),["prevent"])},[i(u).isBreadcrumbIcon?(s(),h(n,{key:0,name:r.meta.icon,class:"layout-navbars-breadcrumb-iconfont"},null,8,["name"])):v("",!0),T(y(i(f).setMenuI18n(r)),1)],8,N))]),_:2},1024))),128))]),_:1})]),_:1})])):v("",!0)}}});F=aa(M,[["__scopeId","data-v-7bfa0c9e"]])});export{ta as __tla,F as default};
