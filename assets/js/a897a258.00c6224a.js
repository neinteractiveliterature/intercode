"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[57986],{83996:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>u,Bullet:()=>c,Details:()=>m,SpecifiedBy:()=>p,assets:()=>l,contentTitle:()=>o,default:()=>g,frontMatter:()=>i,metadata:()=>r,toc:()=>h});const r=JSON.parse('{"id":"graphql/types/inputs/update-form-input","title":"UpdateFormInput","description":"Autogenerated input type of UpdateForm","source":"@site/docs/graphql/types/inputs/update-form-input.mdx","sourceDirName":"graphql/types/inputs","slug":"/graphql/types/inputs/update-form-input","permalink":"/docs/graphql/types/inputs/update-form-input","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/inputs/update-form-input.mdx","tags":[],"version":"current","frontMatter":{"id":"update-form-input","title":"UpdateFormInput"},"sidebar":"sidebar","previous":{"title":"UpdateEventProposalInput","permalink":"/docs/graphql/types/inputs/update-event-proposal-input"},"next":{"title":"UpdateFormItemInput","permalink":"/docs/graphql/types/inputs/update-form-item-input"}}');var s=n(58040),a=n(5365),d=n(62340);const i={id:"update-form-input",title:"UpdateFormInput"},o=void 0,l={},c=()=>{const e={span:"span",...(0,a.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,a.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const t={span:"span",...(0,a.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(t.span,{className:e.class,children:e.text})})},m=({dataOpen:e,dataClose:t,children:n,startOpen:r=!1})=>{const i={details:"details",summary:"summary",...(0,a.R)()},[o,l]=(0,d.useState)(r);return(0,s.jsxs)(i.details,{...o?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(i.summary,{onClick:e=>{e.preventDefault(),l((e=>!e))},style:{listStyle:"none"},children:o?e:t}),o&&n]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>UpdateFormInput.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"updateforminputclientmutationidstring-",level:4},{value:'<code>UpdateFormInput.<b>form</b></code><Bullet></Bullet><code>FormInput!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"updateforminputformforminput--",level:4},{value:'<code>UpdateFormInput.<b>id</b></code><Bullet></Bullet><code>ID</code> <Badge class="badge badge--secondary"></Badge>',id:"updateforminputidid-",level:4},{value:"Member Of",id:"member-of",level:3}];function f(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"Autogenerated input type of UpdateForm"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-graphql",children:"input UpdateFormInput {\n  clientMutationId: String\n  form: FormInput!\n  id: ID\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(t.h4,{id:"updateforminputclientmutationidstring-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateFormInput.",(0,s.jsx)("b",{children:"clientMutationId"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(t.code,{children:"String"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,s.jsxs)(t.h4,{id:"updateforminputformforminput--",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateFormInput.",(0,s.jsx)("b",{children:"form"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/inputs/form-input",children:(0,s.jsx)(t.code,{children:"FormInput!"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,s.jsxs)(t.h4,{id:"updateforminputidid-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateFormInput.",(0,s.jsx)("b",{children:"id"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/id",children:(0,s.jsx)(t.code,{children:"ID"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(t.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"/docs/graphql/api/mutations/update-form",children:(0,s.jsx)(t.code,{children:"updateForm"})}),"  ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"mutation"})]})]})}function g(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(f,{...e})}):f(e)}},5365:(e,t,n)=>{n.d(t,{R:()=>d,x:()=>i});var r=n(62340);const s={},a=r.createContext(s);function d(e){const t=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:d(e.components),r.createElement(a.Provider,{value:t},e.children)}}}]);