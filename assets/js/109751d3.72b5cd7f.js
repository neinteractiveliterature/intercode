"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[36945],{79313:(e,t,s)=>{s.r(t),s.d(t,{Badge:()=>p,Bullet:()=>c,Details:()=>g,SpecifiedBy:()=>u,assets:()=>o,contentTitle:()=>d,default:()=>x,frontMatter:()=>i,metadata:()=>l,toc:()=>h});var a=s(58040),n=s(1422),r=s(62340);const i={id:"withdraw-user-signup-payload",title:"WithdrawUserSignupPayload"},d=void 0,l={id:"graphql/types/objects/withdraw-user-signup-payload",title:"WithdrawUserSignupPayload",description:"Autogenerated return type of WithdrawUserSignup.",source:"@site/docs/graphql/types/objects/withdraw-user-signup-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/withdraw-user-signup-payload",permalink:"/docs/graphql/types/objects/withdraw-user-signup-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/withdraw-user-signup-payload.mdx",tags:[],version:"current",frontMatter:{id:"withdraw-user-signup-payload",title:"WithdrawUserSignupPayload"},sidebar:"sidebar",previous:{title:"WithdrawSignupRequestPayload",permalink:"/docs/graphql/types/objects/withdraw-signup-request-payload"},next:{title:"BigDecimal",permalink:"/docs/graphql/types/scalars/big-decimal"}},o={},c=()=>{const e={span:"span",...(0,n.R)()};return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},u=e=>{const t={a:"a",...(0,n.R)()};return(0,a.jsxs)(a.Fragment,{children:["Specification",(0,a.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const t={span:"span",...(0,n.R)()};return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(t.span,{className:e.class,children:e.text})})},g=({dataOpen:e,dataClose:t,children:s,startOpen:i=!1})=>{const d={details:"details",summary:"summary",...(0,n.R)()},[l,o]=(0,r.useState)(i);return(0,a.jsxs)(d.details,{...l?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,a.jsx)(d.summary,{onClick:e=>{e.preventDefault(),o((e=>!e))},style:{listStyle:"none"},children:l?e:t}),l&&s]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>WithdrawUserSignupPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"withdrawusersignuppayloadclientmutationidstring-",level:4},{value:'<code>WithdrawUserSignupPayload.<b>signup</b></code><Bullet></Bullet><code>Signup!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"withdrawusersignuppayloadsignupsignup--",level:4},{value:"Returned By",id:"returned-by",level:3}];function y(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,n.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.p,{children:"Autogenerated return type of WithdrawUserSignup."}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-graphql",children:"type WithdrawUserSignupPayload {\n  clientMutationId: String\n  signup: Signup!\n}\n"})}),"\n",(0,a.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,a.jsxs)(t.h4,{id:"withdrawusersignuppayloadclientmutationidstring-",children:[(0,a.jsx)(t.a,{href:"#",children:(0,a.jsxs)("code",{style:{fontWeight:"normal"},children:["WithdrawUserSignupPayload.",(0,a.jsx)("b",{children:"clientMutationId"})]})}),(0,a.jsx)(c,{}),(0,a.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,a.jsx)(t.code,{children:"String"})})," ",(0,a.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,a.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,a.jsxs)(t.h4,{id:"withdrawusersignuppayloadsignupsignup--",children:[(0,a.jsx)(t.a,{href:"#",children:(0,a.jsxs)("code",{style:{fontWeight:"normal"},children:["WithdrawUserSignupPayload.",(0,a.jsx)("b",{children:"signup"})]})}),(0,a.jsx)(c,{}),(0,a.jsx)(t.a,{href:"/docs/graphql/types/objects/signup",children:(0,a.jsx)(t.code,{children:"Signup!"})})," ",(0,a.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,a.jsx)(p,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,a.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.a,{href:"/docs/graphql/api/mutations/withdraw-user-signup",children:(0,a.jsx)(t.code,{children:"withdrawUserSignup"})}),"  ",(0,a.jsx)(p,{class:"badge badge--secondary",text:"mutation"})]})]})}function x(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(y,{...e})}):y(e)}},1422:(e,t,s)=>{s.d(t,{R:()=>i,x:()=>d});var a=s(62340);const n={},r=a.createContext(n);function i(e){const t=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:i(e.components),a.createElement(r.Provider,{value:t},e.children)}}}]);