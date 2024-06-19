"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[77755],{22546:(e,r,t)=>{t.r(r),t.d(r,{Badge:()=>p,Bullet:()=>i,Details:()=>u,SpecifiedBy:()=>y,assets:()=>c,contentTitle:()=>o,default:()=>x,frontMatter:()=>s,metadata:()=>l,toc:()=>h});var n=t(58040),a=t(1422),d=t(62340);const s={id:"create-order-entry-payload",title:"CreateOrderEntryPayload"},o=void 0,l={id:"graphql/types/objects/create-order-entry-payload",title:"CreateOrderEntryPayload",description:"Autogenerated return type of CreateOrderEntry.",source:"@site/docs/graphql/types/objects/create-order-entry-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/create-order-entry-payload",permalink:"/docs/graphql/types/objects/create-order-entry-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/create-order-entry-payload.mdx",tags:[],version:"current",frontMatter:{id:"create-order-entry-payload",title:"CreateOrderEntryPayload"},sidebar:"sidebar",previous:{title:"CreateMySignupPayload",permalink:"/docs/graphql/types/objects/create-my-signup-payload"},next:{title:"CreateOrderPayload",permalink:"/docs/graphql/types/objects/create-order-payload"}},c={},i=()=>{const e={span:"span",...(0,a.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},y=e=>{const r={a:"a",...(0,a.R)()};return(0,n.jsxs)(n.Fragment,{children:["Specification",(0,n.jsx)(r.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const r={span:"span",...(0,a.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(r.span,{className:e.class,children:e.text})})},u=({dataOpen:e,dataClose:r,children:t,startOpen:s=!1})=>{const o={details:"details",summary:"summary",...(0,a.R)()},[l,c]=(0,d.useState)(s);return(0,n.jsxs)(o.details,{...l?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,n.jsx)(o.summary,{onClick:e=>{e.preventDefault(),c((e=>!e))},style:{listStyle:"none"},children:l?e:r}),l&&t]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>CreateOrderEntryPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"createorderentrypayloadclientmutationidstring-",level:4},{value:'<code>CreateOrderEntryPayload.<b>order_entry</b></code><Bullet></Bullet><code>OrderEntry!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"createorderentrypayloadorder_entryorderentry--",level:4},{value:"Returned By",id:"returned-by",level:3}];function g(e){const r={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.p,{children:"Autogenerated return type of CreateOrderEntry."}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-graphql",children:"type CreateOrderEntryPayload {\n  clientMutationId: String\n  order_entry: OrderEntry!\n}\n"})}),"\n",(0,n.jsx)(r.h3,{id:"fields",children:"Fields"}),"\n",(0,n.jsxs)(r.h4,{id:"createorderentrypayloadclientmutationidstring-",children:[(0,n.jsx)(r.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateOrderEntryPayload.",(0,n.jsx)("b",{children:"clientMutationId"})]})}),(0,n.jsx)(i,{}),(0,n.jsx)(r.a,{href:"/docs/graphql/types/scalars/string",children:(0,n.jsx)(r.code,{children:"String"})})," ",(0,n.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,n.jsxs)(r.blockquote,{children:["\n",(0,n.jsx)(r.p,{children:"A unique identifier for the client performing the mutation."}),"\n"]}),"\n",(0,n.jsxs)(r.h4,{id:"createorderentrypayloadorder_entryorderentry--",children:[(0,n.jsx)(r.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateOrderEntryPayload.",(0,n.jsx)("b",{children:"order_entry"})]})}),(0,n.jsx)(i,{}),(0,n.jsx)(r.a,{href:"/docs/graphql/types/objects/order-entry",children:(0,n.jsx)(r.code,{children:"OrderEntry!"})})," ",(0,n.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,n.jsx)(p,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,n.jsx)(r.blockquote,{children:"\n"}),"\n",(0,n.jsx)(r.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.a,{href:"/docs/graphql/api/mutations/create-order-entry",children:(0,n.jsx)(r.code,{children:"createOrderEntry"})}),"  ",(0,n.jsx)(p,{class:"badge badge--secondary",text:"mutation"})]})]})}function x(e={}){const{wrapper:r}={...(0,a.R)(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(g,{...e})}):g(e)}},1422:(e,r,t)=>{t.d(r,{R:()=>s,x:()=>o});var n=t(62340);const a={},d=n.createContext(a);function s(e){const r=n.useContext(d);return n.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function o(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:s(e.components),n.createElement(d.Provider,{value:r},e.children)}}}]);