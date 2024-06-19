"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[82516],{23480:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>u,Bullet:()=>c,Details:()=>g,SpecifiedBy:()=>o,assets:()=>p,contentTitle:()=>r,default:()=>m,frontMatter:()=>i,metadata:()=>l,toc:()=>h});var a=n(58040),d=n(1422),s=n(62340);const i={id:"update-page-input",title:"UpdatePageInput"},r=void 0,l={id:"graphql/types/inputs/update-page-input",title:"UpdatePageInput",description:"Autogenerated input type of UpdatePage",source:"@site/docs/graphql/types/inputs/update-page-input.mdx",sourceDirName:"graphql/types/inputs",slug:"/graphql/types/inputs/update-page-input",permalink:"/docs/graphql/types/inputs/update-page-input",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/inputs/update-page-input.mdx",tags:[],version:"current",frontMatter:{id:"update-page-input",title:"UpdatePageInput"},sidebar:"sidebar",previous:{title:"UpdateOrganizationRoleInput",permalink:"/docs/graphql/types/inputs/update-organization-role-input"},next:{title:"UpdateProductInput",permalink:"/docs/graphql/types/inputs/update-product-input"}},p={},c=()=>{const e={span:"span",...(0,d.R)()};return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},o=e=>{const t={a:"a",...(0,d.R)()};return(0,a.jsxs)(a.Fragment,{children:["Specification",(0,a.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const t={span:"span",...(0,d.R)()};return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(t.span,{className:e.class,children:e.text})})},g=({dataOpen:e,dataClose:t,children:n,startOpen:i=!1})=>{const r={details:"details",summary:"summary",...(0,d.R)()},[l,p]=(0,s.useState)(i);return(0,a.jsxs)(r.details,{...l?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,a.jsx)(r.summary,{onClick:e=>{e.preventDefault(),p((e=>!e))},style:{listStyle:"none"},children:l?e:t}),l&&n]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>UpdatePageInput.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"updatepageinputclientmutationidstring-",level:4},{value:'<code>UpdatePageInput.<b>id</b></code><Bullet></Bullet><code>ID</code> <Badge class="badge badge--secondary"></Badge>',id:"updatepageinputidid-",level:4},{value:'<code>UpdatePageInput.<b>page</b></code><Bullet></Bullet><code>PageInput!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"updatepageinputpagepageinput--",level:4},{value:"Member Of",id:"member-of",level:3}];function x(e){const t={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,d.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.p,{children:"Autogenerated input type of UpdatePage"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-graphql",children:"input UpdatePageInput {\n  clientMutationId: String\n  id: ID\n  page: PageInput!\n}\n"})}),"\n",(0,a.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,a.jsxs)(t.h4,{id:"updatepageinputclientmutationidstring-",children:[(0,a.jsx)(t.a,{href:"#",children:(0,a.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdatePageInput.",(0,a.jsx)("b",{children:"clientMutationId"})]})}),(0,a.jsx)(c,{}),(0,a.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,a.jsx)(t.code,{children:"String"})})," ",(0,a.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,a.jsxs)(t.blockquote,{children:["\n",(0,a.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n"]}),"\n",(0,a.jsxs)(t.h4,{id:"updatepageinputidid-",children:[(0,a.jsx)(t.a,{href:"#",children:(0,a.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdatePageInput.",(0,a.jsx)("b",{children:"id"})]})}),(0,a.jsx)(c,{}),(0,a.jsx)(t.a,{href:"/docs/graphql/types/scalars/id",children:(0,a.jsx)(t.code,{children:"ID"})})," ",(0,a.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,a.jsx)(t.blockquote,{children:"\n"}),"\n",(0,a.jsxs)(t.h4,{id:"updatepageinputpagepageinput--",children:[(0,a.jsx)(t.a,{href:"#",children:(0,a.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdatePageInput.",(0,a.jsx)("b",{children:"page"})]})}),(0,a.jsx)(c,{}),(0,a.jsx)(t.a,{href:"/docs/graphql/types/inputs/page-input",children:(0,a.jsx)(t.code,{children:"PageInput!"})})," ",(0,a.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,a.jsx)(u,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,a.jsx)(t.blockquote,{children:"\n"}),"\n",(0,a.jsx)(t.h3,{id:"member-of",children:"Member Of"}),"\n",(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.a,{href:"/docs/graphql/api/mutations/update-page",children:(0,a.jsx)(t.code,{children:"updatePage"})}),"  ",(0,a.jsx)(u,{class:"badge badge--secondary",text:"mutation"})]})]})}function m(e={}){const{wrapper:t}={...(0,d.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(x,{...e})}):x(e)}},1422:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>r});var a=n(62340);const d={},s=a.createContext(d);function i(e){const t=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:i(e.components),a.createElement(s.Provider,{value:t},e.children)}}}]);