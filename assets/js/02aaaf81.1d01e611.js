"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[20063],{7744:(e,n,t)=>{t.r(n),t.d(n,{Badge:()=>h,Bullet:()=>l,Details:()=>p,SpecifiedBy:()=>u,assets:()=>o,contentTitle:()=>c,default:()=>x,frontMatter:()=>r,metadata:()=>s,toc:()=>g});const s=JSON.parse('{"id":"graphql/types/enums/signup-ranked-choice-state","title":"SignupRankedChoiceState","description":"The processing state of a SignupRankedChoice","source":"@site/docs/graphql/types/enums/signup-ranked-choice-state.mdx","sourceDirName":"graphql/types/enums","slug":"/graphql/types/enums/signup-ranked-choice-state","permalink":"/docs/graphql/types/enums/signup-ranked-choice-state","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/enums/signup-ranked-choice-state.mdx","tags":[],"version":"current","frontMatter":{"id":"signup-ranked-choice-state","title":"SignupRankedChoiceState"},"sidebar":"sidebar","previous":{"title":"SignupMode","permalink":"/docs/graphql/types/enums/signup-mode"},"next":{"title":"SignupRequestState","permalink":"/docs/graphql/types/enums/signup-request-state"}}');var i=t(58040),a=t(5365),d=t(62340);const r={id:"signup-ranked-choice-state",title:"SignupRankedChoiceState"},c=void 0,o={},l=()=>{const e={span:"span",...(0,a.R)()};return(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},u=e=>{const n={a:"a",...(0,a.R)()};return(0,i.jsxs)(i.Fragment,{children:["Specification",(0,i.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},h=e=>{const n={span:"span",...(0,a.R)()};return(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(n.span,{className:e.class,children:e.text})})},p=({dataOpen:e,dataClose:n,children:t,startOpen:s=!1})=>{const r={details:"details",summary:"summary",...(0,a.R)()},[c,o]=(0,d.useState)(s);return(0,i.jsxs)(r.details,{...c?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,i.jsx)(r.summary,{onClick:e=>{e.preventDefault(),o((e=>!e))},style:{listStyle:"none"},children:c?e:n}),c&&t]})},g=[{value:"Values",id:"values",level:3},{value:"<code>SignupRankedChoiceState.<b>pending</b></code>",id:"signuprankedchoicestatepending",level:4},{value:"<code>SignupRankedChoiceState.<b>requested</b></code>",id:"signuprankedchoicestaterequested",level:4},{value:"<code>SignupRankedChoiceState.<b>signed_up</b></code>",id:"signuprankedchoicestatesigned_up",level:4},{value:"<code>SignupRankedChoiceState.<b>waitlisted</b></code>",id:"signuprankedchoicestatewaitlisted",level:4},{value:"Member Of",id:"member-of",level:3}];function m(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"The processing state of a SignupRankedChoice"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-graphql",children:"enum SignupRankedChoiceState {\n  pending\n  requested\n  signed_up\n  waitlisted\n}\n"})}),"\n",(0,i.jsx)(n.h3,{id:"values",children:"Values"}),"\n",(0,i.jsx)(n.h4,{id:"signuprankedchoicestatepending",children:(0,i.jsx)(n.a,{href:"#",children:(0,i.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRankedChoiceState.",(0,i.jsx)("b",{children:"pending"})]})})}),"\n",(0,i.jsx)(n.p,{children:"We have not yet attempted to process this choice"}),"\n",(0,i.jsx)(n.h4,{id:"signuprankedchoicestaterequested",children:(0,i.jsx)(n.a,{href:"#",children:(0,i.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRankedChoiceState.",(0,i.jsx)("b",{children:"requested"})]})})}),"\n",(0,i.jsx)(n.p,{children:"The attendee has had a signup request put in (see the result_signup_request field for the actual signup request)"}),"\n",(0,i.jsx)(n.h4,{id:"signuprankedchoicestatesigned_up",children:(0,i.jsx)(n.a,{href:"#",children:(0,i.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRankedChoiceState.",(0,i.jsx)("b",{children:"signed_up"})]})})}),"\n",(0,i.jsx)(n.p,{children:"The attendee has been signed up (see the result_signup field for the actual signup)"}),"\n",(0,i.jsx)(n.h4,{id:"signuprankedchoicestatewaitlisted",children:(0,i.jsx)(n.a,{href:"#",children:(0,i.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRankedChoiceState.",(0,i.jsx)("b",{children:"waitlisted"})]})})}),"\n",(0,i.jsx)(n.p,{children:"The attendee has been waitlisted (see the result_signup field for the actual signup)"}),"\n",(0,i.jsx)(n.h3,{id:"member-of",children:"Member Of"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"/docs/graphql/types/objects/signup-ranked-choice",children:(0,i.jsx)(n.code,{children:"SignupRankedChoice"})}),"  ",(0,i.jsx)(h,{class:"badge badge--secondary",text:"object"})]})]})}function x(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(m,{...e})}):m(e)}},5365:(e,n,t)=>{t.d(n,{R:()=>d,x:()=>r});var s=t(62340);const i={},a=s.createContext(i);function d(e){const n=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:d(e.components),s.createElement(a.Provider,{value:n},e.children)}}}]);