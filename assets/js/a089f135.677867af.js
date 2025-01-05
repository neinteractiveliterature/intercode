"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[81434],{77095:(e,t,r)=>{r.r(t),r.d(t,{Badge:()=>u,Bullet:()=>l,Details:()=>m,SpecifiedBy:()=>p,assets:()=>d,contentTitle:()=>c,default:()=>g,frontMatter:()=>i,metadata:()=>n,toc:()=>h});const n=JSON.parse('{"id":"graphql/types/inputs/create-form-input","title":"CreateFormInput","description":"Autogenerated input type of CreateForm","source":"@site/docs/graphql/types/inputs/create-form-input.mdx","sourceDirName":"graphql/types/inputs","slug":"/graphql/types/inputs/create-form-input","permalink":"/docs/graphql/types/inputs/create-form-input","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/inputs/create-form-input.mdx","tags":[],"version":"current","frontMatter":{"id":"create-form-input","title":"CreateFormInput"},"sidebar":"sidebar","previous":{"title":"CreateFillerEventInput","permalink":"/docs/graphql/types/inputs/create-filler-event-input"},"next":{"title":"CreateFormItemInput","permalink":"/docs/graphql/types/inputs/create-form-item-input"}}');var s=r(58040),a=r(5365),o=r(62340);const i={id:"create-form-input",title:"CreateFormInput"},c=void 0,d={},l=()=>{const e={span:"span",...(0,a.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,a.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const t={span:"span",...(0,a.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(t.span,{className:e.class,children:e.text})})},m=({dataOpen:e,dataClose:t,children:r,startOpen:n=!1})=>{const i={details:"details",summary:"summary",...(0,a.R)()},[c,d]=(0,o.useState)(n);return(0,s.jsxs)(i.details,{...c?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(i.summary,{onClick:e=>{e.preventDefault(),d((e=>!e))},style:{listStyle:"none"},children:c?e:t}),c&&r]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>CreateFormInput.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"createforminputclientmutationidstring-",level:4},{value:'<code>CreateFormInput.<b>form</b></code><Bullet></Bullet><code>FormInput!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"createforminputformforminput--",level:4},{value:'<code>CreateFormInput.<b>form_type</b></code><Bullet></Bullet><code>FormType!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"createforminputform_typeformtype--",level:4},{value:"Member Of",id:"member-of",level:3}];function f(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"Autogenerated input type of CreateForm"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-graphql",children:"input CreateFormInput {\n  clientMutationId: String\n  form: FormInput!\n  form_type: FormType!\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(t.h4,{id:"createforminputclientmutationidstring-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateFormInput.",(0,s.jsx)("b",{children:"clientMutationId"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(t.code,{children:"String"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,s.jsxs)(t.h4,{id:"createforminputformforminput--",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateFormInput.",(0,s.jsx)("b",{children:"form"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/inputs/form-input",children:(0,s.jsx)(t.code,{children:"FormInput!"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,s.jsx)(t.p,{children:"The properties for the form to create."}),"\n",(0,s.jsxs)(t.h4,{id:"createforminputform_typeformtype--",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateFormInput.",(0,s.jsx)("b",{children:"form_type"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/enums/form-type",children:(0,s.jsx)(t.code,{children:"FormType!"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"enum"})]}),"\n",(0,s.jsx)(t.p,{children:"The type of form to create."}),"\n",(0,s.jsx)(t.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"/docs/graphql/api/mutations/create-form",children:(0,s.jsx)(t.code,{children:"createForm"})}),"  ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"mutation"})]})]})}function g(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(f,{...e})}):f(e)}},5365:(e,t,r)=>{r.d(t,{R:()=>o,x:()=>i});var n=r(62340);const s={},a=n.createContext(s);function o(e){const t=n.useContext(a);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),n.createElement(a.Provider,{value:t},e.children)}}}]);