"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[39610],{36706:(e,t,s)=>{s.r(t),s.d(t,{Badge:()=>u,Bullet:()=>c,Details:()=>h,SpecifiedBy:()=>p,assets:()=>i,contentTitle:()=>d,default:()=>y,frontMatter:()=>l,metadata:()=>a,toc:()=>b});const a=JSON.parse('{"id":"graphql/types/objects/submit-event-proposal-payload","title":"SubmitEventProposalPayload","description":"Autogenerated return type of SubmitEventProposal.","source":"@site/docs/graphql/types/objects/submit-event-proposal-payload.mdx","sourceDirName":"graphql/types/objects","slug":"/graphql/types/objects/submit-event-proposal-payload","permalink":"/docs/graphql/types/objects/submit-event-proposal-payload","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/submit-event-proposal-payload.mdx","tags":[],"version":"current","frontMatter":{"id":"submit-event-proposal-payload","title":"SubmitEventProposalPayload"},"sidebar":"sidebar","previous":{"title":"StripeAccount","permalink":"/docs/graphql/types/objects/stripe-account"},"next":{"title":"SubmitOrderPayload","permalink":"/docs/graphql/types/objects/submit-order-payload"}}');var n=s(58040),o=s(5365),r=s(62340);const l={id:"submit-event-proposal-payload",title:"SubmitEventProposalPayload"},d=void 0,i={},c=()=>{const e={span:"span",...(0,o.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,o.R)()};return(0,n.jsxs)(n.Fragment,{children:["Specification",(0,n.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const t={span:"span",...(0,o.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(t.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:t,children:s,startOpen:a=!1})=>{const l={details:"details",summary:"summary",...(0,o.R)()},[d,i]=(0,r.useState)(a);return(0,n.jsxs)(l.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,n.jsx)(l.summary,{onClick:e=>{e.preventDefault(),i((e=>!e))},style:{listStyle:"none"},children:d?e:t}),d&&s]})},b=[{value:"Fields",id:"fields",level:3},{value:'<code>SubmitEventProposalPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"submiteventproposalpayloadclientmutationidstring-",level:4},{value:'<code>SubmitEventProposalPayload.<b>event_proposal</b></code><Bullet></Bullet><code>EventProposal!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"submiteventproposalpayloadevent_proposaleventproposal--",level:4},{value:"Returned By",id:"returned-by",level:3}];function m(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.p,{children:"Autogenerated return type of SubmitEventProposal."}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-graphql",children:"type SubmitEventProposalPayload {\n  clientMutationId: String\n  event_proposal: EventProposal!\n}\n"})}),"\n",(0,n.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,n.jsxs)(t.h4,{id:"submiteventproposalpayloadclientmutationidstring-",children:[(0,n.jsx)(t.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["SubmitEventProposalPayload.",(0,n.jsx)("b",{children:"clientMutationId"})]})}),(0,n.jsx)(c,{}),(0,n.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,n.jsx)(t.code,{children:"String"})})," ",(0,n.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,n.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,n.jsxs)(t.h4,{id:"submiteventproposalpayloadevent_proposaleventproposal--",children:[(0,n.jsx)(t.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["SubmitEventProposalPayload.",(0,n.jsx)("b",{children:"event_proposal"})]})}),(0,n.jsx)(c,{}),(0,n.jsx)(t.a,{href:"/docs/graphql/types/objects/event-proposal",children:(0,n.jsx)(t.code,{children:"EventProposal!"})})," ",(0,n.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,n.jsx)(u,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,n.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.a,{href:"/docs/graphql/api/mutations/submit-event-proposal",children:(0,n.jsx)(t.code,{children:"submitEventProposal"})}),"  ",(0,n.jsx)(u,{class:"badge badge--secondary",text:"mutation"})]})]})}function y(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(m,{...e})}):m(e)}},5365:(e,t,s)=>{s.d(t,{R:()=>r,x:()=>l});var a=s(62340);const n={},o=a.createContext(n);function r(e){const t=a.useContext(o);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:r(e.components),a.createElement(o.Provider,{value:t},e.children)}}}]);