"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[19358],{96779:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>u,Bullet:()=>l,Details:()=>h,SpecifiedBy:()=>o,assets:()=>r,contentTitle:()=>p,default:()=>x,frontMatter:()=>c,metadata:()=>i,toc:()=>y});const i=JSON.parse('{"id":"graphql/types/inputs/update-ticket-type-input","title":"UpdateTicketTypeInput","description":"Autogenerated input type of UpdateTicketType","source":"@site/docs/graphql/types/inputs/update-ticket-type-input.mdx","sourceDirName":"graphql/types/inputs","slug":"/graphql/types/inputs/update-ticket-type-input","permalink":"/docs/graphql/types/inputs/update-ticket-type-input","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/inputs/update-ticket-type-input.mdx","tags":[],"version":"current","frontMatter":{"id":"update-ticket-type-input","title":"UpdateTicketTypeInput"},"sidebar":"sidebar","previous":{"title":"UpdateTicketInput","permalink":"/docs/graphql/types/inputs/update-ticket-input"},"next":{"title":"UpdateUserActivityAlertInput","permalink":"/docs/graphql/types/inputs/update-user-activity-alert-input"}}');var s=n(58040),a=n(5365),d=n(62340);const c={id:"update-ticket-type-input",title:"UpdateTicketTypeInput"},p=void 0,r={},l=()=>{const e={span:"span",...(0,a.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},o=e=>{const t={a:"a",...(0,a.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const t={span:"span",...(0,a.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(t.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:t,children:n,startOpen:i=!1})=>{const c={details:"details",summary:"summary",...(0,a.R)()},[p,r]=(0,d.useState)(i);return(0,s.jsxs)(c.details,{...p?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(c.summary,{onClick:e=>{e.preventDefault(),r((e=>!e))},style:{listStyle:"none"},children:p?e:t}),p&&n]})},y=[{value:"Fields",id:"fields",level:3},{value:'<code>UpdateTicketTypeInput.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"updatetickettypeinputclientmutationidstring-",level:4},{value:'<code>UpdateTicketTypeInput.<b>id</b></code><Bullet></Bullet><code>ID</code> <Badge class="badge badge--secondary"></Badge>',id:"updatetickettypeinputidid-",level:4},{value:'<code>UpdateTicketTypeInput.<b>ticket_type</b></code><Bullet></Bullet><code>TicketTypeInput!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"updatetickettypeinputticket_typetickettypeinput--",level:4},{value:"Member Of",id:"member-of",level:3}];function g(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"Autogenerated input type of UpdateTicketType"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-graphql",children:"input UpdateTicketTypeInput {\n  clientMutationId: String\n  id: ID\n  ticket_type: TicketTypeInput!\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(t.h4,{id:"updatetickettypeinputclientmutationidstring-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateTicketTypeInput.",(0,s.jsx)("b",{children:"clientMutationId"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(t.code,{children:"String"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,s.jsxs)(t.h4,{id:"updatetickettypeinputidid-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateTicketTypeInput.",(0,s.jsx)("b",{children:"id"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/id",children:(0,s.jsx)(t.code,{children:"ID"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(t.h4,{id:"updatetickettypeinputticket_typetickettypeinput--",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateTicketTypeInput.",(0,s.jsx)("b",{children:"ticket_type"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/inputs/ticket-type-input",children:(0,s.jsx)(t.code,{children:"TicketTypeInput!"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,s.jsx)(t.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"/docs/graphql/api/mutations/update-ticket-type",children:(0,s.jsx)(t.code,{children:"updateTicketType"})}),"  ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"mutation"})]})]})}function x(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(g,{...e})}):g(e)}},5365:(e,t,n)=>{n.d(t,{R:()=>d,x:()=>c});var i=n(62340);const s={},a=i.createContext(s);function d(e){const t=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:d(e.components),i.createElement(a.Provider,{value:t},e.children)}}}]);