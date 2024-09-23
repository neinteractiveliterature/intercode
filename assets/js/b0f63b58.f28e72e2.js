"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[26621],{59783:(e,s,a)=>{a.r(s),a.d(s,{Badge:()=>g,Bullet:()=>c,Details:()=>h,SpecifiedBy:()=>u,assets:()=>i,contentTitle:()=>n,default:()=>j,frontMatter:()=>l,metadata:()=>o,toc:()=>p});var r=a(58040),t=a(1422),d=a(62340);const l={id:"email-route",title:"EmailRoute"},n=void 0,o={id:"graphql/types/objects/email-route",title:"EmailRoute",description:"No description",source:"@site/docs/graphql/types/objects/email-route.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/email-route",permalink:"/docs/graphql/types/objects/email-route",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/email-route.mdx",tags:[],version:"current",frontMatter:{id:"email-route",title:"EmailRoute"},sidebar:"sidebar",previous:{title:"DropEventPayload",permalink:"/docs/graphql/types/objects/drop-event-payload"},next:{title:"EmailRoutesPagination",permalink:"/docs/graphql/types/objects/email-routes-pagination"}},i={},c=()=>{const e={span:"span",...(0,t.R)()};return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},u=e=>{const s={a:"a",...(0,t.R)()};return(0,r.jsxs)(r.Fragment,{children:["Specification",(0,r.jsx)(s.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},g=e=>{const s={span:"span",...(0,t.R)()};return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(s.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:s,children:a,startOpen:l=!1})=>{const n={details:"details",summary:"summary",...(0,t.R)()},[o,i]=(0,d.useState)(l);return(0,r.jsxs)(n.details,{...o?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,r.jsx)(n.summary,{onClick:e=>{e.preventDefault(),i((e=>!e))},style:{listStyle:"none"},children:o?e:s}),o&&a]})},p=[{value:"Fields",id:"fields",level:3},{value:'<code>EmailRoute.<b>forward_addresses</b></code><Bullet></Bullet><code>[String!]</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"emailrouteforward_addressesstring--",level:4},{value:'<code>EmailRoute.<b>id</b></code><Bullet></Bullet><code>ID!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"emailrouteidid--",level:4},{value:'<code>EmailRoute.<b>receiver_address</b></code><Bullet></Bullet><code>String!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"emailroutereceiver_addressstring--",level:4},{value:"Returned By",id:"returned-by",level:3},{value:"Member Of",id:"member-of",level:3}];function x(e){const s={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.p,{children:"No description"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-graphql",children:"type EmailRoute {\n  forward_addresses: [String!]\n  id: ID!\n  receiver_address: String!\n}\n"})}),"\n",(0,r.jsx)(s.h3,{id:"fields",children:"Fields"}),"\n",(0,r.jsxs)(s.h4,{id:"emailrouteforward_addressesstring--",children:[(0,r.jsx)(s.a,{href:"#",children:(0,r.jsxs)("code",{style:{fontWeight:"normal"},children:["EmailRoute.",(0,r.jsx)("b",{children:"forward_addresses"})]})}),(0,r.jsx)(c,{}),(0,r.jsx)(s.a,{href:"/docs/graphql/types/scalars/string",children:(0,r.jsx)(s.code,{children:"[String!]"})})," ",(0,r.jsx)(g,{class:"badge badge--secondary",text:"list"})," ",(0,r.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,r.jsxs)(s.h4,{id:"emailrouteidid--",children:[(0,r.jsx)(s.a,{href:"#",children:(0,r.jsxs)("code",{style:{fontWeight:"normal"},children:["EmailRoute.",(0,r.jsx)("b",{children:"id"})]})}),(0,r.jsx)(c,{}),(0,r.jsx)(s.a,{href:"/docs/graphql/types/scalars/id",children:(0,r.jsx)(s.code,{children:"ID!"})})," ",(0,r.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,r.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,r.jsxs)(s.h4,{id:"emailroutereceiver_addressstring--",children:[(0,r.jsx)(s.a,{href:"#",children:(0,r.jsxs)("code",{style:{fontWeight:"normal"},children:["EmailRoute.",(0,r.jsx)("b",{children:"receiver_address"})]})}),(0,r.jsx)(c,{}),(0,r.jsx)(s.a,{href:"/docs/graphql/types/scalars/string",children:(0,r.jsx)(s.code,{children:"String!"})})," ",(0,r.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,r.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,r.jsx)(s.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.a,{href:"/docs/graphql/api/queries/email-route",children:(0,r.jsx)(s.code,{children:"email_route"})}),"  ",(0,r.jsx)(g,{class:"badge badge--secondary",text:"query"})]}),"\n",(0,r.jsx)(s.h3,{id:"member-of",children:"Member Of"}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.a,{href:"/docs/graphql/types/objects/create-email-route-payload",children:(0,r.jsx)(s.code,{children:"CreateEmailRoutePayload"})}),"  ",(0,r.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,r.jsx)(c,{}),(0,r.jsx)(s.a,{href:"/docs/graphql/types/objects/delete-email-route-payload",children:(0,r.jsx)(s.code,{children:"DeleteEmailRoutePayload"})}),"  ",(0,r.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,r.jsx)(c,{}),(0,r.jsx)(s.a,{href:"/docs/graphql/types/objects/email-routes-pagination",children:(0,r.jsx)(s.code,{children:"EmailRoutesPagination"})}),"  ",(0,r.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,r.jsx)(c,{}),(0,r.jsx)(s.a,{href:"/docs/graphql/types/objects/update-email-route-payload",children:(0,r.jsx)(s.code,{children:"UpdateEmailRoutePayload"})}),"  ",(0,r.jsx)(g,{class:"badge badge--secondary",text:"object"})]})]})}function j(e={}){const{wrapper:s}={...(0,t.R)(),...e.components};return s?(0,r.jsx)(s,{...e,children:(0,r.jsx)(x,{...e})}):x(e)}},1422:(e,s,a)=>{a.d(s,{R:()=>l,x:()=>n});var r=a(62340);const t={},d=r.createContext(t);function l(e){const s=r.useContext(d);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function n(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:l(e.components),r.createElement(d.Provider,{value:s},e.children)}}}]);