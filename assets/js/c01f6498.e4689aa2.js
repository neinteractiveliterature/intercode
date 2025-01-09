"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[58334],{90112:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>g,Bullet:()=>i,Details:()=>p,SpecifiedBy:()=>y,assets:()=>c,contentTitle:()=>d,default:()=>v,frontMatter:()=>s,metadata:()=>n,toc:()=>u});const n=JSON.parse('{"id":"graphql/types/objects/delete-event-category-payload","title":"DeleteEventCategoryPayload","description":"Autogenerated return type of DeleteEventCategory.","source":"@site/docs/graphql/types/objects/delete-event-category-payload.mdx","sourceDirName":"graphql/types/objects","slug":"/graphql/types/objects/delete-event-category-payload","permalink":"/docs/graphql/types/objects/delete-event-category-payload","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/delete-event-category-payload.mdx","tags":[],"version":"current","frontMatter":{"id":"delete-event-category-payload","title":"DeleteEventCategoryPayload"},"sidebar":"sidebar","previous":{"title":"DeleteEmailRoutePayload","permalink":"/docs/graphql/types/objects/delete-email-route-payload"},"next":{"title":"DeleteEventProposalPayload","permalink":"/docs/graphql/types/objects/delete-event-proposal-payload"}}');var r=a(58040),o=a(5365),l=a(62340);const s={id:"delete-event-category-payload",title:"DeleteEventCategoryPayload"},d=void 0,c={},i=()=>{const e={span:"span",...(0,o.R)()};return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},y=e=>{const t={a:"a",...(0,o.R)()};return(0,r.jsxs)(r.Fragment,{children:["Specification",(0,r.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},g=e=>{const t={span:"span",...(0,o.R)()};return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(t.span,{className:e.class,children:e.text})})},p=({dataOpen:e,dataClose:t,children:a,startOpen:n=!1})=>{const s={details:"details",summary:"summary",...(0,o.R)()},[d,c]=(0,l.useState)(n);return(0,r.jsxs)(s.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,r.jsx)(s.summary,{onClick:e=>{e.preventDefault(),c((e=>!e))},style:{listStyle:"none"},children:d?e:t}),d&&a]})},u=[{value:"Fields",id:"fields",level:3},{value:'<code>DeleteEventCategoryPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"deleteeventcategorypayloadclientmutationidstring-",level:4},{value:'<code>DeleteEventCategoryPayload.<b>event_category</b></code><Bullet></Bullet><code>EventCategory!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"deleteeventcategorypayloadevent_categoryeventcategory--",level:4},{value:"Returned By",id:"returned-by",level:3}];function h(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.p,{children:"Autogenerated return type of DeleteEventCategory."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-graphql",children:"type DeleteEventCategoryPayload {\n  clientMutationId: String\n  event_category: EventCategory!\n}\n"})}),"\n",(0,r.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,r.jsxs)(t.h4,{id:"deleteeventcategorypayloadclientmutationidstring-",children:[(0,r.jsx)(t.a,{href:"#",children:(0,r.jsxs)("code",{style:{fontWeight:"normal"},children:["DeleteEventCategoryPayload.",(0,r.jsx)("b",{children:"clientMutationId"})]})}),(0,r.jsx)(i,{}),(0,r.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,r.jsx)(t.code,{children:"String"})})," ",(0,r.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,r.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,r.jsxs)(t.h4,{id:"deleteeventcategorypayloadevent_categoryeventcategory--",children:[(0,r.jsx)(t.a,{href:"#",children:(0,r.jsxs)("code",{style:{fontWeight:"normal"},children:["DeleteEventCategoryPayload.",(0,r.jsx)("b",{children:"event_category"})]})}),(0,r.jsx)(i,{}),(0,r.jsx)(t.a,{href:"/docs/graphql/types/objects/event-category",children:(0,r.jsx)(t.code,{children:"EventCategory!"})})," ",(0,r.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,r.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,r.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.a,{href:"/docs/graphql/operations/mutations/delete-event-category",children:(0,r.jsx)(t.code,{children:"deleteEventCategory"})}),"  ",(0,r.jsx)(g,{class:"badge badge--secondary",text:"mutation"})]})]})}function v(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(h,{...e})}):h(e)}},5365:(e,t,a)=>{a.d(t,{R:()=>l,x:()=>s});var n=a(62340);const r={},o=n.createContext(r);function l(e){const t=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:l(e.components),n.createElement(o.Provider,{value:t},e.children)}}}]);