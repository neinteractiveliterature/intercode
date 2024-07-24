"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[52104],{58890:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>u,Bullet:()=>o,Details:()=>h,SpecifiedBy:()=>p,assets:()=>c,contentTitle:()=>l,default:()=>f,frontMatter:()=>r,metadata:()=>d,toc:()=>m});var s=n(58040),i=n(1422),a=n(62340);const r={id:"create-cms-file-input",title:"CreateCmsFileInput"},l=void 0,d={id:"graphql/types/inputs/create-cms-file-input",title:"CreateCmsFileInput",description:"Autogenerated input type of CreateCmsFile",source:"@site/docs/graphql/types/inputs/create-cms-file-input.mdx",sourceDirName:"graphql/types/inputs",slug:"/graphql/types/inputs/create-cms-file-input",permalink:"/docs/graphql/types/inputs/create-cms-file-input",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/inputs/create-cms-file-input.mdx",tags:[],version:"current",frontMatter:{id:"create-cms-file-input",title:"CreateCmsFileInput"},sidebar:"sidebar",previous:{title:"CreateCmsContentGroupInput",permalink:"/docs/graphql/types/inputs/create-cms-content-group-input"},next:{title:"CreateCmsGraphqlQueryInput",permalink:"/docs/graphql/types/inputs/create-cms-graphql-query-input"}},c={},o=()=>{const e={span:"span",...(0,i.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,i.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const t={span:"span",...(0,i.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(t.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:t,children:n,startOpen:r=!1})=>{const l={details:"details",summary:"summary",...(0,i.R)()},[d,c]=(0,a.useState)(r);return(0,s.jsxs)(l.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(l.summary,{onClick:e=>{e.preventDefault(),c((e=>!e))},style:{listStyle:"none"},children:d?e:t}),d&&n]})},m=[{value:"Fields",id:"fields",level:3},{value:'<code>CreateCmsFileInput.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"createcmsfileinputclientmutationidstring-",level:4},{value:'<code>CreateCmsFileInput.<b>file</b></code><Bullet></Bullet><code>Upload</code> <Badge class="badge badge--deprecated badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"createcmsfileinputfileupload--",level:4},{value:'<code>CreateCmsFileInput.<b>signedBlobId</b></code><Bullet></Bullet><code>ID</code> <Badge class="badge badge--secondary"></Badge>',id:"createcmsfileinputsignedblobidid-",level:4},{value:"Member Of",id:"member-of",level:3}];function g(e){const t={a:"a",admonition:"admonition",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"Autogenerated input type of CreateCmsFile"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-graphql",children:"input CreateCmsFileInput {\n  clientMutationId: String\n  file: Upload @deprecated\n  signedBlobId: ID\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(t.h4,{id:"createcmsfileinputclientmutationidstring-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateCmsFileInput.",(0,s.jsx)("b",{children:"clientMutationId"})]})}),(0,s.jsx)(o,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(t.code,{children:"String"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,s.jsxs)(t.h4,{id:"createcmsfileinputfileupload--",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateCmsFileInput.",(0,s.jsx)("b",{children:"file"})]})}),(0,s.jsx)(o,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/upload",children:(0,s.jsx)(t.code,{children:"Upload"})})," ",(0,s.jsx)(u,{class:"badge badge--deprecated badge--secondary",text:"deprecated"})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(t.admonition,{title:"DEPRECATED",type:"warning",children:(0,s.jsx)(t.p,{children:"Migrating to ActiveStorage direct uploads; please use signed_blob_id instead"})}),"\n",(0,s.jsxs)(t.h4,{id:"createcmsfileinputsignedblobidid-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateCmsFileInput.",(0,s.jsx)("b",{children:"signedBlobId"})]})}),(0,s.jsx)(o,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/id",children:(0,s.jsx)(t.code,{children:"ID"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(t.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"/docs/graphql/api/mutations/create-cms-file",children:(0,s.jsx)(t.code,{children:"createCmsFile"})}),"  ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"mutation"})]})]})}function f(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(g,{...e})}):g(e)}},1422:(e,t,n)=>{n.d(t,{R:()=>r,x:()=>l});var s=n(62340);const i={},a=s.createContext(i);function r(e){const t=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),s.createElement(a.Provider,{value:t},e.children)}}}]);