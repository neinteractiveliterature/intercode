"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[32881],{49395:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>u,Bullet:()=>o,Details:()=>h,SpecifiedBy:()=>p,assets:()=>c,contentTitle:()=>r,default:()=>x,frontMatter:()=>i,metadata:()=>l,toc:()=>v});var s=n(58040),d=n(1422),a=n(62340);const i={id:"update-event-input",title:"UpdateEventInput"},r=void 0,l={id:"graphql/types/inputs/update-event-input",title:"UpdateEventInput",description:"Autogenerated input type of UpdateEvent",source:"@site/docs/graphql/types/inputs/update-event-input.mdx",sourceDirName:"graphql/types/inputs",slug:"/graphql/types/inputs/update-event-input",permalink:"/docs/graphql/types/inputs/update-event-input",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/inputs/update-event-input.mdx",tags:[],version:"current",frontMatter:{id:"update-event-input",title:"UpdateEventInput"},sidebar:"sidebar",previous:{title:"UpdateEventCategoryInput",permalink:"/docs/graphql/types/inputs/update-event-category-input"},next:{title:"UpdateEventProposalAdminNotesInput",permalink:"/docs/graphql/types/inputs/update-event-proposal-admin-notes-input"}},c={},o=()=>{const e={span:"span",...(0,d.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,d.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const t={span:"span",...(0,d.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(t.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:t,children:n,startOpen:i=!1})=>{const r={details:"details",summary:"summary",...(0,d.R)()},[l,c]=(0,a.useState)(i);return(0,s.jsxs)(r.details,{...l?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(r.summary,{onClick:e=>{e.preventDefault(),c((e=>!e))},style:{listStyle:"none"},children:l?e:t}),l&&n]})},v=[{value:"Fields",id:"fields",level:3},{value:'<code>UpdateEventInput.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"updateeventinputclientmutationidstring-",level:4},{value:'<code>UpdateEventInput.<b>event</b></code><Bullet></Bullet><code>EventInput</code> <Badge class="badge badge--secondary"></Badge>',id:"updateeventinputeventeventinput-",level:4},{value:'<code>UpdateEventInput.<b>id</b></code><Bullet></Bullet><code>ID</code> <Badge class="badge badge--secondary"></Badge>',id:"updateeventinputidid-",level:4},{value:"Member Of",id:"member-of",level:3}];function g(e){const t={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,d.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"Autogenerated input type of UpdateEvent"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-graphql",children:"input UpdateEventInput {\n  clientMutationId: String\n  event: EventInput\n  id: ID\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(t.h4,{id:"updateeventinputclientmutationidstring-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateEventInput.",(0,s.jsx)("b",{children:"clientMutationId"})]})}),(0,s.jsx)(o,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(t.code,{children:"String"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n"]}),"\n",(0,s.jsxs)(t.h4,{id:"updateeventinputeventeventinput-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateEventInput.",(0,s.jsx)("b",{children:"event"})]})}),(0,s.jsx)(o,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/inputs/event-input",children:(0,s.jsx)(t.code,{children:"EventInput"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,s.jsx)(t.blockquote,{children:"\n"}),"\n",(0,s.jsxs)(t.h4,{id:"updateeventinputidid-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateEventInput.",(0,s.jsx)("b",{children:"id"})]})}),(0,s.jsx)(o,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/id",children:(0,s.jsx)(t.code,{children:"ID"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(t.blockquote,{children:"\n"}),"\n",(0,s.jsx)(t.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"/docs/graphql/api/mutations/update-event",children:(0,s.jsx)(t.code,{children:"updateEvent"})}),"  ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"mutation"})]})]})}function x(e={}){const{wrapper:t}={...(0,d.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(g,{...e})}):g(e)}},1422:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>r});var s=n(62340);const d={},a=s.createContext(d);function i(e){const t=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:i(e.components),s.createElement(a.Provider,{value:t},e.children)}}}]);