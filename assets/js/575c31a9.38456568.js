"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[54005],{44095:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>u,Bullet:()=>o,Details:()=>h,SpecifiedBy:()=>p,assets:()=>l,contentTitle:()=>i,default:()=>x,frontMatter:()=>s,metadata:()=>d,toc:()=>y});var c=a(58040),n=a(1422),r=a(62340);const s={id:"create-ticket-payload",title:"CreateTicketPayload"},i=void 0,d={id:"graphql/types/objects/create-ticket-payload",title:"CreateTicketPayload",description:"Autogenerated return type of CreateTicket.",source:"@site/docs/graphql/types/objects/create-ticket-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/create-ticket-payload",permalink:"/docs/graphql/types/objects/create-ticket-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/create-ticket-payload.mdx",tags:[],version:"current",frontMatter:{id:"create-ticket-payload",title:"CreateTicketPayload"},sidebar:"sidebar",previous:{title:"CreateTeamMemberPayload",permalink:"/docs/graphql/types/objects/create-team-member-payload"},next:{title:"CreateTicketTypePayload",permalink:"/docs/graphql/types/objects/create-ticket-type-payload"}},l={},o=()=>{const e={span:"span",...(0,n.R)()};return(0,c.jsx)(c.Fragment,{children:(0,c.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,n.R)()};return(0,c.jsxs)(c.Fragment,{children:["Specification",(0,c.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const t={span:"span",...(0,n.R)()};return(0,c.jsx)(c.Fragment,{children:(0,c.jsx)(t.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:t,children:a,startOpen:s=!1})=>{const i={details:"details",summary:"summary",...(0,n.R)()},[d,l]=(0,r.useState)(s);return(0,c.jsxs)(i.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,c.jsx)(i.summary,{onClick:e=>{e.preventDefault(),l((e=>!e))},style:{listStyle:"none"},children:d?e:t}),d&&a]})},y=[{value:"Fields",id:"fields",level:3},{value:'<code>CreateTicketPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"createticketpayloadclientmutationidstring-",level:4},{value:'<code>CreateTicketPayload.<b>ticket</b></code><Bullet></Bullet><code>Ticket!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"createticketpayloadticketticket--",level:4},{value:"Returned By",id:"returned-by",level:3}];function g(e){const t={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,n.R)(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(t.p,{children:"Autogenerated return type of CreateTicket."}),"\n",(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:"language-graphql",children:"type CreateTicketPayload {\n  clientMutationId: String\n  ticket: Ticket!\n}\n"})}),"\n",(0,c.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,c.jsxs)(t.h4,{id:"createticketpayloadclientmutationidstring-",children:[(0,c.jsx)(t.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateTicketPayload.",(0,c.jsx)("b",{children:"clientMutationId"})]})}),(0,c.jsx)(o,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,c.jsx)(t.code,{children:"String"})})," ",(0,c.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,c.jsxs)(t.blockquote,{children:["\n",(0,c.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n"]}),"\n",(0,c.jsxs)(t.h4,{id:"createticketpayloadticketticket--",children:[(0,c.jsx)(t.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateTicketPayload.",(0,c.jsx)("b",{children:"ticket"})]})}),(0,c.jsx)(o,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/objects/ticket",children:(0,c.jsx)(t.code,{children:"Ticket!"})})," ",(0,c.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,c.jsx)(u,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,c.jsx)(t.blockquote,{children:"\n"}),"\n",(0,c.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.a,{href:"/docs/graphql/api/mutations/create-ticket",children:(0,c.jsx)(t.code,{children:"createTicket"})}),"  ",(0,c.jsx)(u,{class:"badge badge--secondary",text:"mutation"})]})]})}function x(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(g,{...e})}):g(e)}},1422:(e,t,a)=>{a.d(t,{R:()=>s,x:()=>i});var c=a(62340);const n={},r=c.createContext(n);function s(e){const t=c.useContext(r);return c.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:s(e.components),c.createElement(r.Provider,{value:t},e.children)}}}]);