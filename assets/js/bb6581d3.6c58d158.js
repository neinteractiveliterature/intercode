"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[84162],{94387:(e,n,t)=>{t.r(n),t.d(n,{Badge:()=>c,Bullet:()=>u,Details:()=>g,SpecifiedBy:()=>p,assets:()=>l,contentTitle:()=>i,default:()=>x,frontMatter:()=>r,metadata:()=>d,toc:()=>h});const d=JSON.parse('{"id":"graphql/types/objects/update-signup-round-payload","title":"UpdateSignupRoundPayload","description":"Autogenerated return type of UpdateSignupRound.","source":"@site/docs/graphql/types/objects/update-signup-round-payload.mdx","sourceDirName":"graphql/types/objects","slug":"/graphql/types/objects/update-signup-round-payload","permalink":"/docs/graphql/types/objects/update-signup-round-payload","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/update-signup-round-payload.mdx","tags":[],"version":"current","frontMatter":{"id":"update-signup-round-payload","title":"UpdateSignupRoundPayload"},"sidebar":"sidebar","previous":{"title":"UpdateSignupRankedChoicePriorityPayload","permalink":"/docs/graphql/types/objects/update-signup-ranked-choice-priority-payload"},"next":{"title":"UpdateStaffPositionPayload","permalink":"/docs/graphql/types/objects/update-staff-position-payload"}}');var a=t(58040),s=t(5365),o=t(62340);const r={id:"update-signup-round-payload",title:"UpdateSignupRoundPayload"},i=void 0,l={},u=()=>{const e={span:"span",...(0,s.R)()};return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const n={a:"a",...(0,s.R)()};return(0,a.jsxs)(a.Fragment,{children:["Specification",(0,a.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},c=e=>{const n={span:"span",...(0,s.R)()};return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(n.span,{className:e.class,children:e.text})})},g=({dataOpen:e,dataClose:n,children:t,startOpen:d=!1})=>{const r={details:"details",summary:"summary",...(0,s.R)()},[i,l]=(0,o.useState)(d);return(0,a.jsxs)(r.details,{...i?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,a.jsx)(r.summary,{onClick:e=>{e.preventDefault(),l((e=>!e))},style:{listStyle:"none"},children:i?e:n}),i&&t]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>UpdateSignupRoundPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"updatesignuproundpayloadclientmutationidstring-",level:4},{value:'<code>UpdateSignupRoundPayload.<b>signup_round</b></code><Bullet></Bullet><code>SignupRound!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"updatesignuproundpayloadsignup_roundsignupround--",level:4},{value:"Returned By",id:"returned-by",level:3}];function y(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.p,{children:"Autogenerated return type of UpdateSignupRound."}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-graphql",children:"type UpdateSignupRoundPayload {\n  clientMutationId: String\n  signup_round: SignupRound!\n}\n"})}),"\n",(0,a.jsx)(n.h3,{id:"fields",children:"Fields"}),"\n",(0,a.jsxs)(n.h4,{id:"updatesignuproundpayloadclientmutationidstring-",children:[(0,a.jsx)(n.a,{href:"#",children:(0,a.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateSignupRoundPayload.",(0,a.jsx)("b",{children:"clientMutationId"})]})}),(0,a.jsx)(u,{}),(0,a.jsx)(n.a,{href:"/docs/graphql/types/scalars/string",children:(0,a.jsx)(n.code,{children:"String"})})," ",(0,a.jsx)(c,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,a.jsx)(n.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,a.jsxs)(n.h4,{id:"updatesignuproundpayloadsignup_roundsignupround--",children:[(0,a.jsx)(n.a,{href:"#",children:(0,a.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateSignupRoundPayload.",(0,a.jsx)("b",{children:"signup_round"})]})}),(0,a.jsx)(u,{}),(0,a.jsx)(n.a,{href:"/docs/graphql/types/objects/signup-round",children:(0,a.jsx)(n.code,{children:"SignupRound!"})})," ",(0,a.jsx)(c,{class:"badge badge--secondary",text:"non-null"})," ",(0,a.jsx)(c,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,a.jsx)(n.p,{children:"The SignupRound that has just been reprioritized"}),"\n",(0,a.jsx)(n.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.a,{href:"/docs/graphql/api/mutations/update-signup-round",children:(0,a.jsx)(n.code,{children:"updateSignupRound"})}),"  ",(0,a.jsx)(c,{class:"badge badge--secondary",text:"mutation"})]})]})}function x(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(y,{...e})}):y(e)}},5365:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>r});var d=t(62340);const a={},s=d.createContext(a);function o(e){const n=d.useContext(s);return d.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),d.createElement(s.Provider,{value:n},e.children)}}}]);