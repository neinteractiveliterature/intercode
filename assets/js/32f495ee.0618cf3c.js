"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[46014],{36306:(e,t,r)=>{r.r(t),r.d(t,{Badge:()=>p,Bullet:()=>o,Details:()=>h,SpecifiedBy:()=>u,assets:()=>i,contentTitle:()=>l,default:()=>j,frontMatter:()=>a,metadata:()=>c,toc:()=>m});var s=r(58040),n=r(1422),d=r(62340);const a={id:"order-status",title:"OrderStatus"},l=void 0,c={id:"graphql/types/enums/order-status",title:"OrderStatus",description:"No description",source:"@site/docs/graphql/types/enums/order-status.mdx",sourceDirName:"graphql/types/enums",slug:"/graphql/types/enums/order-status",permalink:"/docs/graphql/types/enums/order-status",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/enums/order-status.mdx",tags:[],version:"current",frontMatter:{id:"order-status",title:"OrderStatus"},sidebar:"sidebar",previous:{title:"FormType",permalink:"/docs/graphql/types/enums/form-type"},next:{title:"PaymentMode",permalink:"/docs/graphql/types/enums/payment-mode"}},i={},o=()=>{const e={span:"span",...(0,n.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},u=e=>{const t={a:"a",...(0,n.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const t={span:"span",...(0,n.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(t.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:t,children:r,startOpen:a=!1})=>{const l={details:"details",summary:"summary",...(0,n.R)()},[c,i]=(0,d.useState)(a);return(0,s.jsxs)(l.details,{...c?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(l.summary,{onClick:e=>{e.preventDefault(),i((e=>!e))},style:{listStyle:"none"},children:c?e:t}),c&&r]})},m=[{value:"Values",id:"values",level:3},{value:"<code>OrderStatus.<b>cancelled</b></code>",id:"orderstatuscancelled",level:4},{value:"<code>OrderStatus.<b>paid</b></code>",id:"orderstatuspaid",level:4},{value:"<code>OrderStatus.<b>pending</b></code>",id:"orderstatuspending",level:4},{value:"<code>OrderStatus.<b>unpaid</b></code>",id:"orderstatusunpaid",level:4},{value:"Member Of",id:"member-of",level:3}];function x(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,n.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"No description"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-graphql",children:"enum OrderStatus {\n  cancelled\n  paid\n  pending\n  unpaid\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"values",children:"Values"}),"\n",(0,s.jsx)(t.h4,{id:"orderstatuscancelled",children:(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["OrderStatus.",(0,s.jsx)("b",{children:"cancelled"})]})})}),"\n",(0,s.jsx)(t.p,{children:"Order has been cancelled"}),"\n",(0,s.jsx)(t.h4,{id:"orderstatuspaid",children:(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["OrderStatus.",(0,s.jsx)("b",{children:"paid"})]})})}),"\n",(0,s.jsx)(t.p,{children:"Order has been submitted and paid"}),"\n",(0,s.jsx)(t.h4,{id:"orderstatuspending",children:(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["OrderStatus.",(0,s.jsx)("b",{children:"pending"})]})})}),"\n",(0,s.jsx)(t.p,{children:"Order has not yet been submitted"}),"\n",(0,s.jsx)(t.h4,{id:"orderstatusunpaid",children:(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["OrderStatus.",(0,s.jsx)("b",{children:"unpaid"})]})})}),"\n",(0,s.jsx)(t.p,{children:"Order is submitted but not yet paid"}),"\n",(0,s.jsx)(t.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"/docs/graphql/types/inputs/create-order-input",children:(0,s.jsx)(t.code,{children:"CreateOrderInput"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"input"}),(0,s.jsx)(o,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/objects/order",children:(0,s.jsx)(t.code,{children:"Order"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(o,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/objects/sales-count-by-product-and-payment-amount",children:(0,s.jsx)(t.code,{children:"SalesCountByProductAndPaymentAmount"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"})]})]})}function j(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(x,{...e})}):x(e)}},1422:(e,t,r)=>{r.d(t,{R:()=>a,x:()=>l});var s=r(62340);const n={},d=s.createContext(n);function a(e){const t=s.useContext(d);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:a(e.components),s.createElement(d.Provider,{value:t},e.children)}}}]);