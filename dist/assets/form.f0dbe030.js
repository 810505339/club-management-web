import{b as C,g as V,__tla as j}from"./index.356a4008.js";import{p as E,a as K,g as O,__tla as P}from"./group.55ce7082.js";import{l as W,__tla as X}from"./template.a98dfdfc.js";import{K as x,h as m,a1 as Y,ak as s,au as z,o as n,R as _,S as r,b as A,Y as u,W as D,X as T,u as a,T as H,a as J,ab as M,F as Q,G as Z,n as ee}from"./vue.6cd422f6.js";let w,ae=Promise.all([(()=>{try{return j}catch{}})(),(()=>{try{return P}catch{}})(),(()=>{try{return X}catch{}})()]).then(async()=>{let h,b;h={class:"dialog-footer"},b=x({name:"GenGroupDialog"}),w=x({...b,emits:["refresh"],setup(le,{expose:I,emit:N}){const{t:p}=C(),g=m(),d=m(!1),i=m(!1),y=m([]),e=Y({id:"",groupName:"",groupDesc:"",templateId:[],putList:[]}),$=m({groupName:[{required:!0,message:"\u5206\u7EC4\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}],templateId:[{required:!0,message:"\u6A21\u677F\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}]}),k=l=>{d.value=!0,e.id="",ee(()=>{g.value.resetFields()}),l&&(e.id=l,B(l)),U()},G=async()=>{if(!await g.value.validate().catch(()=>{}))return!1;try{i.value=!0,e.id?await E(e):await K(e),V().success(p(e.id?"common.editSuccessText":"common.addSuccessText")),d.value=!1,N("refresh")}catch(l){V().error(l.msg)}finally{i.value=!1}},B=l=>{O(l).then(t=>{Object.assign(e,t.data),e.templateId=[],t.data.templateList&&t.data.templateList.forEach(c=>{e.templateId.push(c.id)})})},U=()=>{W().then(l=>{y.value=l.data})};return I({openDialog:k}),(l,t)=>{const c=s("el-input"),f=s("el-form-item"),F=s("el-option"),L=s("el-select"),R=s("el-form"),v=s("el-button"),S=s("el-dialog"),q=z("loading");return n(),_(S,{modelValue:a(d),"onUpdate:modelValue":t[4]||(t[4]=o=>Z(d)?d.value=o:null),title:a(e).id?l.$t("common.editBtn"):l.$t("common.addBtn"),width:"600"},{footer:r(()=>[A("span",h,[u(v,{onClick:t[3]||(t[3]=o=>d.value=!1)},{default:r(()=>[D(T(l.$t("common.cancelButtonText")),1)]),_:1}),u(v,{type:"primary",onClick:G,disabled:a(i)},{default:r(()=>[D(T(l.$t("common.confirmButtonText")),1)]),_:1},8,["disabled"])])]),default:r(()=>[H((n(),_(R,{ref_key:"dataFormRef",ref:g,model:a(e),rules:a($),formDialogRef:"","label-width":"90px"},{default:r(()=>[u(f,{label:a(p)("group.groupName"),prop:"groupName"},{default:r(()=>[u(c,{modelValue:a(e).groupName,"onUpdate:modelValue":t[0]||(t[0]=o=>a(e).groupName=o),placeholder:a(p)("group.inputGroupNameTip")},null,8,["modelValue","placeholder"])]),_:1},8,["label"]),u(f,{label:l.$t("group.templateType"),prop:"templateId"},{default:r(()=>[u(L,{modelValue:a(e).templateId,"onUpdate:modelValue":t[1]||(t[1]=o=>a(e).templateId=o),placeholder:l.$t("group.selectType"),class:"w100",clearable:"",multiple:""},{default:r(()=>[(n(!0),J(Q,null,M(a(y),o=>(n(),_(F,{key:o.id,label:o.templateName,value:o.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue","placeholder"])]),_:1},8,["label"]),u(f,{label:a(p)("group.groupDesc"),prop:"groupDesc"},{default:r(()=>[u(c,{type:"textarea",maxlength:"150",rows:"3",modelValue:a(e).groupDesc,"onUpdate:modelValue":t[2]||(t[2]=o=>a(e).groupDesc=o),placeholder:a(p)("group.inputGroupDescTip")},null,8,["modelValue","placeholder"])]),_:1},8,["label"])]),_:1},8,["model","rules"])),[[q,a(i)]])]),_:1},8,["modelValue","title"])}}})});export{ae as __tla,w as default};