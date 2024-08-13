"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[19197],{1175:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>y,Bullet:()=>i,Details:()=>g,SpecifiedBy:()=>p,assets:()=>l,contentTitle:()=>s,default:()=>v,frontMatter:()=>o,metadata:()=>c,toc:()=>u});var n=a(58040),d=a(1422),r=a(62340);const o={id:"update-event-category-payload",title:"UpdateEventCategoryPayload"},s=void 0,c={id:"graphql/types/objects/update-event-category-payload",title:"UpdateEventCategoryPayload",description:"Autogenerated return type of UpdateEventCategory.",source:"@site/docs/graphql/types/objects/update-event-category-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/update-event-category-payload",permalink:"/docs/graphql/types/objects/update-event-category-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/update-event-category-payload.mdx",tags:[],version:"current",frontMatter:{id:"update-event-category-payload",title:"UpdateEventCategoryPayload"},sidebar:"sidebar",previous:{title:"UpdateEventAdminNotesPayload",permalink:"/docs/graphql/types/objects/update-event-admin-notes-payload"},next:{title:"UpdateEventPayload",permalink:"/docs/graphql/types/objects/update-event-payload"}},l={},i=()=>{const e={span:"span",...(0,d.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,d.R)()};return(0,n.jsxs)(n.Fragment,{children:["Specification",(0,n.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},y=e=>{const t={span:"span",...(0,d.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(t.span,{className:e.class,children:e.text})})},g=({dataOpen:e,dataClose:t,children:a,startOpen:o=!1})=>{const s={details:"details",summary:"summary",...(0,d.R)()},[c,l]=(0,r.useState)(o);return(0,n.jsxs)(s.details,{...c?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,n.jsx)(s.summary,{onClick:e=>{e.preventDefault(),l((e=>!e))},style:{listStyle:"none"},children:c?e:t}),c&&a]})},u=[{value:"Fields",id:"fields",level:3},{value:'<code>UpdateEventCategoryPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"updateeventcategorypayloadclientmutationidstring-",level:4},{value:'<code>UpdateEventCategoryPayload.<b>event_category</b></code><Bullet></Bullet><code>EventCategory!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"updateeventcategorypayloadevent_categoryeventcategory--",level:4},{value:"Returned By",id:"returned-by",level:3}];function h(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,d.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.p,{children:"Autogenerated return type of UpdateEventCategory."}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-graphql",children:"type UpdateEventCategoryPayload {\n  clientMutationId: String\n  event_category: EventCategory!\n}\n"})}),"\n",(0,n.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,n.jsxs)(t.h4,{id:"updateeventcategorypayloadclientmutationidstring-",children:[(0,n.jsx)(t.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateEventCategoryPayload.",(0,n.jsx)("b",{children:"clientMutationId"})]})}),(0,n.jsx)(i,{}),(0,n.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,n.jsx)(t.code,{children:"String"})})," ",(0,n.jsx)(y,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,n.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,n.jsxs)(t.h4,{id:"updateeventcategorypayloadevent_categoryeventcategory--",children:[(0,n.jsx)(t.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateEventCategoryPayload.",(0,n.jsx)("b",{children:"event_category"})]})}),(0,n.jsx)(i,{}),(0,n.jsx)(t.a,{href:"/docs/graphql/types/objects/event-category",children:(0,n.jsx)(t.code,{children:"EventCategory!"})})," ",(0,n.jsx)(y,{class:"badge badge--secondary",text:"non-null"})," ",(0,n.jsx)(y,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,n.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.a,{href:"/docs/graphql/api/mutations/update-event-category",children:(0,n.jsx)(t.code,{children:"updateEventCategory"})}),"  ",(0,n.jsx)(y,{class:"badge badge--secondary",text:"mutation"})]})]})}function v(e={}){const{wrapper:t}={...(0,d.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},1422:(e,t,a)=>{a.d(t,{R:()=>o,x:()=>s});var n=a(62340);const d={},r=n.createContext(d);function o(e){const t=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:o(e.components),n.createElement(r.Provider,{value:t},e.children)}}}]);