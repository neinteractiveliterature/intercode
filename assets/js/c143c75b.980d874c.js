"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[18651],{40589:(e,r,a)=>{a.r(r),a.d(r,{Badge:()=>u,Bullet:()=>c,Details:()=>h,SpecifiedBy:()=>p,assets:()=>l,contentTitle:()=>o,default:()=>y,frontMatter:()=>s,metadata:()=>i,toc:()=>m});var d=a(58040),t=a(1422),n=a(62340);const s={id:"mark-order-paid-payload",title:"MarkOrderPaidPayload"},o=void 0,i={id:"graphql/types/objects/mark-order-paid-payload",title:"MarkOrderPaidPayload",description:"Autogenerated return type of MarkOrderPaid.",source:"@site/docs/graphql/types/objects/mark-order-paid-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/mark-order-paid-payload",permalink:"/docs/graphql/types/objects/mark-order-paid-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/mark-order-paid-payload.mdx",tags:[],version:"current",frontMatter:{id:"mark-order-paid-payload",title:"MarkOrderPaidPayload"},sidebar:"sidebar",previous:{title:"MailingLists",permalink:"/docs/graphql/types/objects/mailing-lists"},next:{title:"MaximumEventProvidedTicketsOverride",permalink:"/docs/graphql/types/objects/maximum-event-provided-tickets-override"}},l={},c=()=>{const e={span:"span",...(0,t.R)()};return(0,d.jsx)(d.Fragment,{children:(0,d.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const r={a:"a",...(0,t.R)()};return(0,d.jsxs)(d.Fragment,{children:["Specification",(0,d.jsx)(r.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const r={span:"span",...(0,t.R)()};return(0,d.jsx)(d.Fragment,{children:(0,d.jsx)(r.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:r,children:a,startOpen:s=!1})=>{const o={details:"details",summary:"summary",...(0,t.R)()},[i,l]=(0,n.useState)(s);return(0,d.jsxs)(o.details,{...i?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,d.jsx)(o.summary,{onClick:e=>{e.preventDefault(),l((e=>!e))},style:{listStyle:"none"},children:i?e:r}),i&&a]})},m=[{value:"Fields",id:"fields",level:3},{value:'<code>MarkOrderPaidPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"markorderpaidpayloadclientmutationidstring-",level:4},{value:'<code>MarkOrderPaidPayload.<b>order</b></code><Bullet></Bullet><code>Order!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"markorderpaidpayloadorderorder--",level:4},{value:"Returned By",id:"returned-by",level:3}];function g(e){const r={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(r.p,{children:"Autogenerated return type of MarkOrderPaid."}),"\n",(0,d.jsx)(r.pre,{children:(0,d.jsx)(r.code,{className:"language-graphql",children:"type MarkOrderPaidPayload {\n  clientMutationId: String\n  order: Order!\n}\n"})}),"\n",(0,d.jsx)(r.h3,{id:"fields",children:"Fields"}),"\n",(0,d.jsxs)(r.h4,{id:"markorderpaidpayloadclientmutationidstring-",children:[(0,d.jsx)(r.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["MarkOrderPaidPayload.",(0,d.jsx)("b",{children:"clientMutationId"})]})}),(0,d.jsx)(c,{}),(0,d.jsx)(r.a,{href:"/docs/graphql/types/scalars/string",children:(0,d.jsx)(r.code,{children:"String"})})," ",(0,d.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,d.jsxs)(r.blockquote,{children:["\n",(0,d.jsx)(r.p,{children:"A unique identifier for the client performing the mutation."}),"\n"]}),"\n",(0,d.jsxs)(r.h4,{id:"markorderpaidpayloadorderorder--",children:[(0,d.jsx)(r.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["MarkOrderPaidPayload.",(0,d.jsx)("b",{children:"order"})]})}),(0,d.jsx)(c,{}),(0,d.jsx)(r.a,{href:"/docs/graphql/types/objects/order",children:(0,d.jsx)(r.code,{children:"Order!"})})," ",(0,d.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,d.jsx)(u,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,d.jsx)(r.blockquote,{children:"\n"}),"\n",(0,d.jsx)(r.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,d.jsxs)(r.p,{children:[(0,d.jsx)(r.a,{href:"/docs/graphql/api/mutations/mark-order-paid",children:(0,d.jsx)(r.code,{children:"markOrderPaid"})}),"  ",(0,d.jsx)(u,{class:"badge badge--secondary",text:"mutation"})]})]})}function y(e={}){const{wrapper:r}={...(0,t.R)(),...e.components};return r?(0,d.jsx)(r,{...e,children:(0,d.jsx)(g,{...e})}):g(e)}},1422:(e,r,a)=>{a.d(r,{R:()=>s,x:()=>o});var d=a(62340);const t={},n=d.createContext(t);function s(e){const r=d.useContext(n);return d.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function o(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),d.createElement(n.Provider,{value:r},e.children)}}}]);