"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[78126],{87381:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>g,Bullet:()=>i,Details:()=>h,SpecifiedBy:()=>p,assets:()=>l,contentTitle:()=>c,default:()=>b,frontMatter:()=>d,metadata:()=>o,toc:()=>x});var s=a(58040),n=a(1422),r=a(62340);const d={id:"department",title:"Department"},c=void 0,o={id:"graphql/types/objects/department",title:"Department",description:"No description",source:"@site/docs/graphql/types/objects/department.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/department",permalink:"/docs/graphql/types/objects/department",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/department.mdx",tags:[],version:"current",frontMatter:{id:"department",title:"Department"},sidebar:"sidebar",previous:{title:"DeleteUserConProfilePayload",permalink:"/docs/graphql/types/objects/delete-user-con-profile-payload"},next:{title:"DropEventPayload",permalink:"/docs/graphql/types/objects/drop-event-payload"}},l={},i=()=>{const e={span:"span",...(0,n.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,n.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},g=e=>{const t={span:"span",...(0,n.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(t.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:t,children:a,startOpen:d=!1})=>{const c={details:"details",summary:"summary",...(0,n.R)()},[o,l]=(0,r.useState)(d);return(0,s.jsxs)(c.details,{...o?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(c.summary,{onClick:e=>{e.preventDefault(),l((e=>!e))},style:{listStyle:"none"},children:o?e:t}),o&&a]})},x=[{value:"Fields",id:"fields",level:3},{value:'<code>Department.<b>event_categories</b></code><Bullet></Bullet><code>[EventCategory!]!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"departmentevent_categorieseventcategory--",level:4},{value:'<code>Department.<b>id</b></code><Bullet></Bullet><code>ID!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"departmentidid--",level:4},{value:'<code>Department.<b>name</b></code><Bullet></Bullet><code>String!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"departmentnamestring--",level:4},{value:'<code>Department.<b>proposal_description</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"departmentproposal_descriptionstring-",level:4},{value:"Member Of",id:"member-of",level:3}];function j(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,n.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"No description"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-graphql",children:"type Department {\n  event_categories: [EventCategory!]!\n  id: ID!\n  name: String!\n  proposal_description: String\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(t.h4,{id:"departmentevent_categorieseventcategory--",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Department.",(0,s.jsx)("b",{children:"event_categories"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/objects/event-category",children:(0,s.jsx)(t.code,{children:"[EventCategory!]!"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsxs)(t.h4,{id:"departmentidid--",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Department.",(0,s.jsx)("b",{children:"id"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/id",children:(0,s.jsx)(t.code,{children:"ID!"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(t.h4,{id:"departmentnamestring--",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Department.",(0,s.jsx)("b",{children:"name"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(t.code,{children:"String!"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(t.h4,{id:"departmentproposal_descriptionstring-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Department.",(0,s.jsx)("b",{children:"proposal_description"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(t.code,{children:"String"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(t.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"/docs/graphql/types/objects/convention",children:(0,s.jsx)(t.code,{children:"Convention"})}),"  ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(i,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/objects/create-department-payload",children:(0,s.jsx)(t.code,{children:"CreateDepartmentPayload"})}),"  ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(i,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/objects/delete-department-payload",children:(0,s.jsx)(t.code,{children:"DeleteDepartmentPayload"})}),"  ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(i,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/objects/event-category",children:(0,s.jsx)(t.code,{children:"EventCategory"})}),"  ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(i,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/objects/update-department-payload",children:(0,s.jsx)(t.code,{children:"UpdateDepartmentPayload"})}),"  ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"object"})]})]})}function b(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(j,{...e})}):j(e)}},1422:(e,t,a)=>{a.d(t,{R:()=>d,x:()=>c});var s=a(62340);const n={},r=s.createContext(n);function d(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:d(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);