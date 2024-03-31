"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[40374],{74725:(e,r,n)=>{n.r(r),n.d(r,{Badge:()=>u,Bullet:()=>s,SpecifiedBy:()=>l,assets:()=>i,contentTitle:()=>a,default:()=>h,frontMatter:()=>o,metadata:()=>c,toc:()=>p});var t=n(35091),d=n(1422);const o={id:"add-order-entry-to-current-pending-order-payload",title:"AddOrderEntryToCurrentPendingOrderPayload",hide_table_of_contents:!1},a=void 0,c={id:"graphql/objects/add-order-entry-to-current-pending-order-payload",title:"AddOrderEntryToCurrentPendingOrderPayload",description:"Autogenerated return type of AddOrderEntryToCurrentPendingOrder.",source:"@site/docs/graphql/objects/add-order-entry-to-current-pending-order-payload.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/add-order-entry-to-current-pending-order-payload",permalink:"/docs/graphql/objects/add-order-entry-to-current-pending-order-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/add-order-entry-to-current-pending-order-payload.mdx",tags:[],version:"current",frontMatter:{id:"add-order-entry-to-current-pending-order-payload",title:"AddOrderEntryToCurrentPendingOrderPayload",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"ActiveStorageAttachment",permalink:"/docs/graphql/objects/active-storage-attachment"},next:{title:"AttachImageToEventPayload",permalink:"/docs/graphql/objects/attach-image-to-event-payload"}},i={},s=()=>{const e={span:"span",...(0,d.R)()};return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},l=e=>{const r={a:"a",...(0,d.R)()};return(0,t.jsxs)(t.Fragment,{children:["Specification",(0,t.jsx)(r.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const r={span:"span",...(0,d.R)()};return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(r.span,{class:"badge badge--"+e.class,children:e.text})})},p=[{value:"Fields",id:"fields",level:3},{value:'<code>AddOrderEntryToCurrentPendingOrderPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="secondary"></Badge>',id:"addorderentrytocurrentpendingorderpayloadclientmutationidstring-",level:4},{value:'<code>AddOrderEntryToCurrentPendingOrderPayload.<b>order_entry</b></code><Bullet></Bullet><code>OrderEntry!</code> <Badge class="secondary"></Badge> <Badge class="secondary"></Badge>',id:"addorderentrytocurrentpendingorderpayloadorder_entryorderentry--",level:4},{value:"Returned by",id:"returned-by",level:3}];function y(e){const r={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,d.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(r.p,{children:"Autogenerated return type of AddOrderEntryToCurrentPendingOrder."}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-graphql",children:"type AddOrderEntryToCurrentPendingOrderPayload {\n  clientMutationId: String\n  order_entry: OrderEntry!\n}\n"})}),"\n",(0,t.jsx)(r.h3,{id:"fields",children:"Fields"}),"\n",(0,t.jsxs)(r.h4,{id:"addorderentrytocurrentpendingorderpayloadclientmutationidstring-",children:[(0,t.jsx)(r.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["AddOrderEntryToCurrentPendingOrderPayload.",(0,t.jsx)("b",{children:"clientMutationId"})]})}),(0,t.jsx)(s,{}),(0,t.jsx)(r.a,{href:"/docs/graphql/scalars/string",children:(0,t.jsx)(r.code,{children:"String"})})," ",(0,t.jsx)(u,{class:"secondary",text:"scalar"})]}),"\n",(0,t.jsxs)(r.blockquote,{children:["\n",(0,t.jsx)(r.p,{children:"A unique identifier for the client performing the mutation."}),"\n"]}),"\n",(0,t.jsxs)(r.h4,{id:"addorderentrytocurrentpendingorderpayloadorder_entryorderentry--",children:[(0,t.jsx)(r.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["AddOrderEntryToCurrentPendingOrderPayload.",(0,t.jsx)("b",{children:"order_entry"})]})}),(0,t.jsx)(s,{}),(0,t.jsx)(r.a,{href:"/docs/graphql/objects/order-entry",children:(0,t.jsx)(r.code,{children:"OrderEntry!"})})," ",(0,t.jsx)(u,{class:"secondary",text:"non-null"})," ",(0,t.jsx)(u,{class:"secondary",text:"object"})]}),"\n",(0,t.jsx)(r.blockquote,{children:"\n"}),"\n",(0,t.jsx)(r.h3,{id:"returned-by",children:"Returned by"}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.a,{href:"/docs/graphql/mutations/add-order-entry-to-current-pending-order",children:(0,t.jsx)(r.code,{children:"addOrderEntryToCurrentPendingOrder"})}),"  ",(0,t.jsx)(u,{class:"secondary",text:"mutation"})]})]})}function h(e={}){const{wrapper:r}={...(0,d.R)(),...e.components};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(y,{...e})}):y(e)}},1422:(e,r,n)=>{n.d(r,{R:()=>a,x:()=>c});var t=n(7731);const d={},o=t.createContext(d);function a(e){const r=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function c(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:a(e.components),t.createElement(o.Provider,{value:r},e.children)}}}]);