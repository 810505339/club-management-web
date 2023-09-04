import{b as fe,g as c,k as C,d as K,__tla as we}from"./index.356a4008.js";import{K as O,aC as A,h as v,a1 as H,ak as b,au as Q,o as i,a as N,b as J,T as y,Z as ve,u as e,Y as l,S as a,ac as xe,F as W,ab as X,R as d,W as m,X as f,G as Se,V as Y,P as ge}from"./vue.6cd422f6.js";import{u as Ce,__tla as ke}from"./table.14331786.js";import{f as Te,s as Ee,b as Ne,r as $e,d as Ve,__tla as qe}from"./job.988231a4.js";import{u as Fe,__tla as Pe}from"./dict.a1deca05.js";import{__tla as De}from"./dict.110fabba.js";let Z,Ie=Promise.all([(()=>{try{return we}catch{}})(),(()=>{try{return ke}catch{}})(),(()=>{try{return qe}catch{}})(),(()=>{try{return Pe}catch{}})(),(()=>{try{return De}catch{}})()]).then(async()=>{let $,V,q,F;$={class:"layout-padding"},V={class:"layout-padding-auto layout-padding-view"},q={class:"mb8",style:{width:"100%"}},F=O({name:"systemSysJob"}),Z=O({...F,setup(Re){const M=A(()=>K(()=>import("./form.09d0562c.js").then(async o=>(await o.__tla,o)),["assets/form.09d0562c.js","assets/index.356a4008.js","assets/vue.6cd422f6.js","assets/index.ed9c0012.css","assets/dict.a1deca05.js","assets/dict.110fabba.js","assets/job.988231a4.js"])),ee=A(()=>K(()=>import("./job-log.23f453ea.js").then(async o=>(await o.__tla,o)),["assets/job-log.23f453ea.js","assets/table.14331786.js","assets/index.356a4008.js","assets/vue.6cd422f6.js","assets/index.ed9c0012.css","assets/dict.a1deca05.js","assets/dict.110fabba.js"])),{t:r}=fe(),k=v(),P=v(),T=H({jobName:"",jobGroup:"",jobStatus:"",jobExecuteStatus:""}),x=v(!0),D=v([]),I=v(!0),{job_status:R,job_execute_status:B,misfire_policy:oe,job_type:le}=Fe("job_status","job_execute_status","misfire_policy","job_type"),n=H({queryForm:T,pageList:Te}),{getDataList:_,currentChangeHandle:te,sizeChangeHandle:ae,downBlobFile:re,tableStyle:L}=Ce(n),se=()=>{Object.keys(T).forEach(o=>T[o]=""),_()},ue=o=>{D.value=o,I.value=!o.length},ie=()=>{re("/job/sys-job/export",n.queryForm,"job.xlsx")},ne=o=>{P.value.openDialog(o.jobId)},be=o=>{const s=o.jobStatus;s==="1"||s==="3"?k.value.openDialog(o.jobId):c().error("\u8FD0\u884C\u4E2D\u5B9A\u65F6\u4EFB\u52A1\u4E0D\u53EF\u4FEE\u6539\uFF0C\u8BF7\u5148\u6682\u505C\u540E\u64CD\u4F5C")},ce=async o=>{const s=o.jobStatus;if(s==="1"||s==="3"){try{await C().confirm(`\u5373\u5C06\u53D1\u5E03\u6216\u542F\u52A8(\u4EFB\u52A1\u540D\u79F0: ${o.jobName}), \u662F\u5426\u7EE7\u7EED?`)}catch{return}try{await Ee(o.jobId),_(),c().success(r("common.optSuccessText"))}catch(w){c().error(w.msg)}}else c().error("\u5B9A\u65F6\u4EFB\u52A1\u5DF2\u8FD0\u884C")},pe=async o=>{if(o.jobStatus==="2"){try{await C().confirm(`\u5373\u5C06\u6682\u505C(\u4EFB\u52A1\u540D\u79F0: ${o.jobName}), \u662F\u5426\u7EE7\u7EED?`)}catch{return}try{await Ne(o.jobId),_(),c().success(r("common.optSuccessText"))}catch(s){c().error(s.msg)}}else c().error("\u5DF2\u6682\u505C\uFF0C\u4E0D\u8981\u91CD\u590D\u64CD\u4F5C")},de=async o=>{try{await C().confirm(`\u7ACB\u523B\u6267\u884C\u4E00\u6B21\u4EFB\u52A1(\u4EFB\u52A1\u540D\u79F0: ${o.jobName}), \u662F\u5426\u7EE7\u7EED?`)}catch{return}try{await $e(o.jobId),_(),c().success(r("common.optSuccessText"))}catch{c().error("\u8FD0\u884C\u5931\u8D25")}},E=async o=>{if(!o){D.value.forEach(E);return}const{jobId:s,jobName:w}=o;try{await C().confirm(`${r("common.delConfirmText")}(\u4EFB\u52A1\u540D\u79F0:${w})`)}catch{return}try{await Ve(s),_(),c().success(r("common.delSuccessText"))}catch{c().error("\u5220\u9664\u5931\u8D25")}};return(o,s)=>{const w=b("el-input"),S=b("el-form-item"),G=b("el-option"),U=b("el-select"),p=b("el-button"),me=b("el-form"),z=b("el-row"),_e=b("right-toolbar"),u=b("el-table-column"),g=b("dict-tag"),je=b("el-table"),ye=b("pagination"),h=Q("auth"),he=Q("loading");return i(),N("div",$,[J("div",V,[y(l(z,{class:"ml10"},{default:a(()=>[l(me,{inline:!0,model:e(n).queryForm,ref:"queryRef"},{default:a(()=>[l(S,{label:o.$t("job.jobName"),prop:"jobName"},{default:a(()=>[l(w,{placeholder:o.$t("job.inputjobNameTip"),onKeyup:xe(e(_),["enter"]),clearable:"",modelValue:e(n).queryForm.jobName,"onUpdate:modelValue":s[0]||(s[0]=t=>e(n).queryForm.jobName=t)},null,8,["placeholder","onKeyup","modelValue"])]),_:1},8,["label"]),l(S,{label:e(r)("job.jobStatus"),prop:"jobStatus"},{default:a(()=>[l(U,{placeholder:e(r)("job.inputjobStatusTip"),modelValue:e(n).queryForm.jobStatus,"onUpdate:modelValue":s[1]||(s[1]=t=>e(n).queryForm.jobStatus=t)},{default:a(()=>[(i(!0),N(W,null,X(e(R),(t,j)=>(i(),d(G,{key:j,label:t.label,value:t.value},null,8,["label","value"]))),128))]),_:1},8,["placeholder","modelValue"])]),_:1},8,["label"]),l(S,{label:e(r)("job.jobExecuteStatus"),prop:"jobExecuteStatus"},{default:a(()=>[l(U,{placeholder:e(r)("job.inputjobExecuteStatusTip"),modelValue:e(n).queryForm.jobExecuteStatus,"onUpdate:modelValue":s[2]||(s[2]=t=>e(n).queryForm.jobExecuteStatus=t)},{default:a(()=>[(i(!0),N(W,null,X(e(B),(t,j)=>(i(),d(G,{key:j,label:t.label,value:t.value},null,8,["label","value"]))),128))]),_:1},8,["placeholder","modelValue"])]),_:1},8,["label"]),l(S,null,{default:a(()=>[l(p,{onClick:e(_),icon:"Search",type:"primary"},{default:a(()=>[m(f(o.$t("common.queryBtn")),1)]),_:1},8,["onClick"]),l(p,{onClick:se,icon:"Refresh"},{default:a(()=>[m(f(o.$t("common.resetBtn")),1)]),_:1})]),_:1})]),_:1},8,["model"])]),_:1},512),[[ve,e(x)]]),l(z,null,{default:a(()=>[J("div",q,[y((i(),d(p,{onClick:s[3]||(s[3]=t=>e(k).openDialog()),class:"ml10",icon:"folder-add",type:"primary"},{default:a(()=>[m(f(o.$t("common.addBtn")),1)]),_:1})),[[h,"job_sys_job_add"]]),y((i(),d(p,{plain:"",disabled:e(I),onClick:s[4]||(s[4]=t=>E(void 0)),class:"ml10",icon:"Delete",type:"primary"},{default:a(()=>[m(f(o.$t("common.delBtn")),1)]),_:1},8,["disabled"])),[[h,"job_sys_job_del"]]),l(_e,{export:"job_sys_job_add",onExportExcel:ie,onQueryTable:e(_),class:"ml10",style:{float:"right","margin-right":"20px"},showSearch:e(x),"onUpdate:showSearch":s[5]||(s[5]=t=>Se(x)?x.value=t:null)},null,8,["onQueryTable","showSearch"])])]),_:1}),y((i(),d(je,{data:e(n).dataList,onSelectionChange:ue,style:{width:"100%"},border:"","cell-style":e(L).cellStyle,"header-cell-style":e(L).headerCellStyle},{default:a(()=>[l(u,{align:"center",type:"selection",width:"40"}),l(u,{label:e(r)("job.index"),fixed:"left",type:"index",width:"60"},null,8,["label"]),l(u,{label:e(r)("job.jobName"),fixed:"left",prop:"jobName","show-overflow-tooltip":"",width:"120"},null,8,["label"]),l(u,{label:e(r)("job.jobGroup"),prop:"jobGroup","show-overflow-tooltip":"",width:"120"},null,8,["label"]),l(u,{label:e(r)("job.jobStatus"),prop:"jobStatus","show-overflow-tooltip":"",width:"120"},{default:a(t=>[l(g,{options:e(R),value:t.row.jobStatus},null,8,["options","value"])]),_:1},8,["label"]),l(u,{label:e(r)("job.jobExecuteStatus"),prop:"jobExecuteStatus","show-overflow-tooltip":"",width:"120"},{default:a(t=>[l(g,{options:e(B),value:t.row.jobExecuteStatus},null,8,["options","value"])]),_:1},8,["label"]),l(u,{label:e(r)("job.startTime"),prop:"startTime","show-overflow-tooltip":"",width:"120"},null,8,["label"]),l(u,{label:e(r)("job.previousTime"),prop:"previousTime","show-overflow-tooltip":"",width:"120"},null,8,["label"]),l(u,{label:e(r)("job.nextTime"),prop:"nextTime","show-overflow-tooltip":"",width:"120"},null,8,["label"]),l(u,{label:e(r)("job.jobType"),prop:"jobType","show-overflow-tooltip":"",width:"120"},{default:a(t=>[l(g,{options:e(le),value:t.row.jobType},null,8,["options","value"])]),_:1},8,["label"]),l(u,{label:e(r)("job.executePath"),prop:"executePath","show-overflow-tooltip":"",width:"120"},null,8,["label"]),l(u,{label:e(r)("job.className"),prop:"className","show-overflow-tooltip":"",width:"120"},null,8,["label"]),l(u,{label:e(r)("job.methodName"),prop:"methodName","show-overflow-tooltip":"",width:"120"},null,8,["label"]),l(u,{label:e(r)("job.methodParamsValue"),prop:"methodParamsValue","show-overflow-tooltip":"",width:"120"},null,8,["label"]),l(u,{label:e(r)("job.cronExpression"),prop:"cronExpression","show-overflow-tooltip":"",width:"120"},null,8,["label"]),l(u,{label:e(r)("job.misfirePolicy"),prop:"misfirePolicy","show-overflow-tooltip":"",width:"200"},{default:a(t=>[l(g,{options:e(oe),value:t.row.misfirePolicy},null,8,["options","value"])]),_:1},8,["label"]),l(u,{label:o.$t("common.action"),fixed:"right",width:"300"},{default:a(t=>[l(p,{onClick:j=>ne(t.row),text:"",type:"primary"},{default:a(()=>[m("\u65E5\u5FD7")]),_:2},1032,["onClick"]),t.row.jobStatus!=="2"?y((i(),d(p,{key:0,onClick:j=>ce(t.row),text:"",type:"primary"},{default:a(()=>[m("\u542F\u52A8 ")]),_:2},1032,["onClick"])),[[h,"job_sys_job_start_job"]]):Y("",!0),t.row.jobStatus==="2"?y((i(),d(p,{key:1,onClick:j=>pe(t.row),text:"",type:"primary"},{default:a(()=>[m("\u6682\u505C ")]),_:2},1032,["onClick"])),[[h,"job_sys_job_shutdown_job"]]):Y("",!0),y((i(),d(p,{onClick:j=>be(t.row),text:"",type:"primary"},{default:a(()=>[m(f(o.$t("common.editBtn")),1)]),_:2},1032,["onClick"])),[[h,"job_sys_job_edit"]]),y((i(),d(p,{onClick:j=>de(t.row),text:"",type:"primary"},{default:a(()=>[m("\u6267\u884C")]),_:2},1032,["onClick"])),[[h,"job_sys_job_start_job"]]),y((i(),d(p,{onClick:j=>E(t.row),text:"",type:"primary"},{default:a(()=>[m(f(o.$t("common.delBtn")),1)]),_:2},1032,["onClick"])),[[h,"job_sys_job_del"]])]),_:1},8,["label"])]),_:1},8,["data","cell-style","header-cell-style"])),[[he,e(n).loading]]),l(ye,ge({onCurrentChange:e(te),onSizeChange:e(ae)},e(n).pagination),null,16,["onCurrentChange","onSizeChange"])]),l(e(M),{onRefresh:s[6]||(s[6]=t=>e(_)()),ref_key:"formDialogRef",ref:k},null,512),l(e(ee),{ref_key:"jobLogRef",ref:P},null,512)])}}})});export{Ie as __tla,Z as default};
