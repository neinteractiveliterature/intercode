"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[70431],{73396:(e,n,t)=>{t.r(n),t.d(n,{Badge:()=>p,Bullet:()=>c,Details:()=>h,SpecifiedBy:()=>o,assets:()=>l,contentTitle:()=>i,default:()=>m,frontMatter:()=>r,metadata:()=>u,toc:()=>g});var s=t(58040),d=t(1422),a=t(62340);const r={id:"update-run-input",title:"UpdateRunInput"},i=void 0,u={id:"graphql/types/inputs/update-run-input",title:"UpdateRunInput",description:"Autogenerated input type of UpdateRun",source:"@site/docs/graphql/types/inputs/update-run-input.mdx",sourceDirName:"graphql/types/inputs",slug:"/graphql/types/inputs/update-run-input",permalink:"/docs/graphql/types/inputs/update-run-input",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/inputs/update-run-input.mdx",tags:[],version:"current",frontMatter:{id:"update-run-input",title:"UpdateRunInput"},sidebar:"sidebar",previous:{title:"UpdateRootSiteInput",permalink:"/docs/graphql/types/inputs/update-root-site-input"},next:{title:"UpdateSignupBucketInput",permalink:"/docs/graphql/types/inputs/update-signup-bucket-input"}},l={},c=()=>{const e={span:"span",...(0,d.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},o=e=>{const n={a:"a",...(0,d.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const n={span:"span",...(0,d.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(n.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:n,children:t,startOpen:r=!1})=>{const i={details:"details",summary:"summary",...(0,d.R)()},[u,l]=(0,a.useState)(r);return(0,s.jsxs)(i.details,{...u?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(i.summary,{onClick:e=>{e.preventDefault(),l((e=>!e))},style:{listStyle:"none"},children:u?e:n}),u&&t]})},g=[{value:"Fields",id:"fields",level:3},{value:'<code>UpdateRunInput.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"updateruninputclientmutationidstring-",level:4},{value:'<code>UpdateRunInput.<b>id</b></code><Bullet></Bullet><code>ID</code> <Badge class="badge badge--secondary"></Badge>',id:"updateruninputidid-",level:4},{value:'<code>UpdateRunInput.<b>run</b></code><Bullet></Bullet><code>RunInput!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"updateruninputrunruninput--",level:4},{value:"Member Of",id:"member-of",level:3}];function x(e){const n={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,d.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"Autogenerated input type of UpdateRun"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-graphql",children:"input UpdateRunInput {\n  clientMutationId: String\n  id: ID\n  run: RunInput!\n}\n"})}),"\n",(0,s.jsx)(n.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(n.h4,{id:"updateruninputclientmutationidstring-",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateRunInput.",(0,s.jsx)("b",{children:"clientMutationId"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(n.code,{children:"String"})})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsx)(n.p,{children:"A unique identifier for the client performing the mutation."}),"\n"]}),"\n",(0,s.jsxs)(n.h4,{id:"updateruninputidid-",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateRunInput.",(0,s.jsx)("b",{children:"id"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/id",children:(0,s.jsx)(n.code,{children:"ID"})})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.blockquote,{children:"\n"}),"\n",(0,s.jsxs)(n.h4,{id:"updateruninputrunruninput--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateRunInput.",(0,s.jsx)("b",{children:"run"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/inputs/run-input",children:(0,s.jsx)(n.code,{children:"RunInput!"})})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,s.jsx)(n.blockquote,{children:"\n"}),"\n",(0,s.jsx)(n.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"/docs/graphql/api/mutations/update-run",children:(0,s.jsx)(n.code,{children:"updateRun"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"mutation"})]})]})}function m(e={}){const{wrapper:n}={...(0,d.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(x,{...e})}):x(e)}},1422:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>i});var s=t(62340);const d={},a=s.createContext(d);function r(e){const n=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:r(e.components),s.createElement(a.Provider,{value:n},e.children)}}}]);