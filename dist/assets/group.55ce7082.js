import{s as e,__tla as s}from"./index.356a4008.js";let n,u,a,o,g,l,p=Promise.all([(()=>{try{return s}catch{}})()]).then(async()=>{a=function(t){return e({url:"/gen/group/page",method:"get",params:t})},n=function(t){return e({url:"/gen/group",method:"post",data:t})},o=function(t){return e({url:"/gen/group/"+t,method:"get"})},u=function(t){return e({url:"/gen/group",method:"delete",data:t})},l=function(t){return e({url:"/gen/group",method:"put",data:t})},g=function(){return e({url:"/gen/group/list",method:"get"})}});export{p as __tla,n as a,u as d,a as f,o as g,g as l,l as p};