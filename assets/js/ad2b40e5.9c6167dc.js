"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[78298],{34636:(e,t,s)=>{s.r(t),s.d(t,{Badge:()=>u,Bullet:()=>c,Details:()=>g,SpecifiedBy:()=>p,assets:()=>o,contentTitle:()=>l,default:()=>x,frontMatter:()=>d,metadata:()=>n,toc:()=>h});const n=JSON.parse('{"id":"graphql/types/objects/create-user-signup-payload","title":"CreateUserSignupPayload","description":"Autogenerated return type of CreateUserSignup.","source":"@site/docs/graphql/types/objects/create-user-signup-payload.mdx","sourceDirName":"graphql/types/objects","slug":"/graphql/types/objects/create-user-signup-payload","permalink":"/docs/graphql/types/objects/create-user-signup-payload","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/create-user-signup-payload.mdx","tags":[],"version":"current","frontMatter":{"id":"create-user-signup-payload","title":"CreateUserSignupPayload"},"sidebar":"sidebar","previous":{"title":"CreateUserConProfilePayload","permalink":"/docs/graphql/types/objects/create-user-con-profile-payload"},"next":{"title":"DeleteCmsContentGroupPayload","permalink":"/docs/graphql/types/objects/delete-cms-content-group-payload"}}');var a=s(58040),r=s(5365),i=s(62340);const d={id:"create-user-signup-payload",title:"CreateUserSignupPayload"},l=void 0,o={},c=()=>{const e={span:"span",...(0,r.R)()};return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,r.R)()};return(0,a.jsxs)(a.Fragment,{children:["Specification",(0,a.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const t={span:"span",...(0,r.R)()};return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(t.span,{className:e.class,children:e.text})})},g=({dataOpen:e,dataClose:t,children:s,startOpen:n=!1})=>{const d={details:"details",summary:"summary",...(0,r.R)()},[l,o]=(0,i.useState)(n);return(0,a.jsxs)(d.details,{...l?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,a.jsx)(d.summary,{onClick:e=>{e.preventDefault(),o((e=>!e))},style:{listStyle:"none"},children:l?e:t}),l&&s]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>CreateUserSignupPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"createusersignuppayloadclientmutationidstring-",level:4},{value:'<code>CreateUserSignupPayload.<b>signup</b></code><Bullet></Bullet><code>Signup!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"createusersignuppayloadsignupsignup--",level:4},{value:"Returned By",id:"returned-by",level:3}];function y(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.p,{children:"Autogenerated return type of CreateUserSignup."}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-graphql",children:"type CreateUserSignupPayload {\n  clientMutationId: String\n  signup: Signup!\n}\n"})}),"\n",(0,a.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,a.jsxs)(t.h4,{id:"createusersignuppayloadclientmutationidstring-",children:[(0,a.jsx)(t.a,{href:"#",children:(0,a.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateUserSignupPayload.",(0,a.jsx)("b",{children:"clientMutationId"})]})}),(0,a.jsx)(c,{}),(0,a.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,a.jsx)(t.code,{children:"String"})})," ",(0,a.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,a.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,a.jsxs)(t.h4,{id:"createusersignuppayloadsignupsignup--",children:[(0,a.jsx)(t.a,{href:"#",children:(0,a.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateUserSignupPayload.",(0,a.jsx)("b",{children:"signup"})]})}),(0,a.jsx)(c,{}),(0,a.jsx)(t.a,{href:"/docs/graphql/types/objects/signup",children:(0,a.jsx)(t.code,{children:"Signup!"})})," ",(0,a.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,a.jsx)(u,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,a.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.a,{href:"/docs/graphql/api/mutations/create-user-signup",children:(0,a.jsx)(t.code,{children:"createUserSignup"})}),"  ",(0,a.jsx)(u,{class:"badge badge--secondary",text:"mutation"})]})]})}function x(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(y,{...e})}):y(e)}},5365:(e,t,s)=>{s.d(t,{R:()=>i,x:()=>d});var n=s(62340);const a={},r=n.createContext(a);function i(e){const t=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),n.createElement(r.Provider,{value:t},e.children)}}}]);