"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[53167],{58212:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>h,Bullet:()=>i,Details:()=>u,SpecifiedBy:()=>p,assets:()=>c,contentTitle:()=>l,default:()=>v,frontMatter:()=>s,metadata:()=>d,toc:()=>y});var n=a(58040),r=a(1422),o=a(62340);const s={id:"create-event-proposal-payload",title:"CreateEventProposalPayload"},l=void 0,d={id:"graphql/types/objects/create-event-proposal-payload",title:"CreateEventProposalPayload",description:"Autogenerated return type of CreateEventProposal.",source:"@site/docs/graphql/types/objects/create-event-proposal-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/create-event-proposal-payload",permalink:"/docs/graphql/types/objects/create-event-proposal-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/create-event-proposal-payload.mdx",tags:[],version:"current",frontMatter:{id:"create-event-proposal-payload",title:"CreateEventProposalPayload"},sidebar:"sidebar",previous:{title:"CreateEventPayload",permalink:"/docs/graphql/types/objects/create-event-payload"},next:{title:"CreateFillerEventPayload",permalink:"/docs/graphql/types/objects/create-filler-event-payload"}},c={},i=()=>{const e={span:"span",...(0,r.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,r.R)()};return(0,n.jsxs)(n.Fragment,{children:["Specification",(0,n.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},h=e=>{const t={span:"span",...(0,r.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(t.span,{className:e.class,children:e.text})})},u=({dataOpen:e,dataClose:t,children:a,startOpen:s=!1})=>{const l={details:"details",summary:"summary",...(0,r.R)()},[d,c]=(0,o.useState)(s);return(0,n.jsxs)(l.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,n.jsx)(l.summary,{onClick:e=>{e.preventDefault(),c((e=>!e))},style:{listStyle:"none"},children:d?e:t}),d&&a]})},y=[{value:"Fields",id:"fields",level:3},{value:'<code>CreateEventProposalPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"createeventproposalpayloadclientmutationidstring-",level:4},{value:'<code>CreateEventProposalPayload.<b>event_proposal</b></code><Bullet></Bullet><code>EventProposal!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"createeventproposalpayloadevent_proposaleventproposal--",level:4},{value:"Returned By",id:"returned-by",level:3}];function g(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.p,{children:"Autogenerated return type of CreateEventProposal."}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-graphql",children:"type CreateEventProposalPayload {\n  clientMutationId: String\n  event_proposal: EventProposal!\n}\n"})}),"\n",(0,n.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,n.jsxs)(t.h4,{id:"createeventproposalpayloadclientmutationidstring-",children:[(0,n.jsx)(t.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateEventProposalPayload.",(0,n.jsx)("b",{children:"clientMutationId"})]})}),(0,n.jsx)(i,{}),(0,n.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,n.jsx)(t.code,{children:"String"})})," ",(0,n.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,n.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,n.jsxs)(t.h4,{id:"createeventproposalpayloadevent_proposaleventproposal--",children:[(0,n.jsx)(t.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateEventProposalPayload.",(0,n.jsx)("b",{children:"event_proposal"})]})}),(0,n.jsx)(i,{}),(0,n.jsx)(t.a,{href:"/docs/graphql/types/objects/event-proposal",children:(0,n.jsx)(t.code,{children:"EventProposal!"})})," ",(0,n.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,n.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,n.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.a,{href:"/docs/graphql/api/mutations/create-event-proposal",children:(0,n.jsx)(t.code,{children:"createEventProposal"})}),"  ",(0,n.jsx)(h,{class:"badge badge--secondary",text:"mutation"})]})]})}function v(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(g,{...e})}):g(e)}},1422:(e,t,a)=>{a.d(t,{R:()=>s,x:()=>l});var n=a(62340);const r={},o=n.createContext(r);function s(e){const t=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),n.createElement(o.Provider,{value:t},e.children)}}}]);