"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[65898],{26740:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>p,Bullet:()=>i,Details:()=>y,SpecifiedBy:()=>u,assets:()=>c,contentTitle:()=>l,default:()=>g,frontMatter:()=>o,metadata:()=>r,toc:()=>m});var s=a(58040),d=a(1422),n=a(62340);const o={id:"update-cms-layout-payload",title:"UpdateCmsLayoutPayload"},l=void 0,r={id:"graphql/types/objects/update-cms-layout-payload",title:"UpdateCmsLayoutPayload",description:"Autogenerated return type of UpdateCmsLayout.",source:"@site/docs/graphql/types/objects/update-cms-layout-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/update-cms-layout-payload",permalink:"/docs/graphql/types/objects/update-cms-layout-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/update-cms-layout-payload.mdx",tags:[],version:"current",frontMatter:{id:"update-cms-layout-payload",title:"UpdateCmsLayoutPayload"},sidebar:"sidebar",previous:{title:"UpdateCmsGraphqlQueryPayload",permalink:"/docs/graphql/types/objects/update-cms-graphql-query-payload"},next:{title:"UpdateCmsNavigationItemPayload",permalink:"/docs/graphql/types/objects/update-cms-navigation-item-payload"}},c={},i=()=>{const e={span:"span",...(0,d.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},u=e=>{const t={a:"a",...(0,d.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const t={span:"span",...(0,d.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(t.span,{className:e.class,children:e.text})})},y=({dataOpen:e,dataClose:t,children:a,startOpen:o=!1})=>{const l={details:"details",summary:"summary",...(0,d.R)()},[r,c]=(0,n.useState)(o);return(0,s.jsxs)(l.details,{...r?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(l.summary,{onClick:e=>{e.preventDefault(),c((e=>!e))},style:{listStyle:"none"},children:r?e:t}),r&&a]})},m=[{value:"Fields",id:"fields",level:3},{value:'<code>UpdateCmsLayoutPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"updatecmslayoutpayloadclientmutationidstring-",level:4},{value:'<code>UpdateCmsLayoutPayload.<b>cms_layout</b></code><Bullet></Bullet><code>CmsLayout!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"updatecmslayoutpayloadcms_layoutcmslayout--",level:4},{value:"Returned By",id:"returned-by",level:3}];function h(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,d.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"Autogenerated return type of UpdateCmsLayout."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-graphql",children:"type UpdateCmsLayoutPayload {\n  clientMutationId: String\n  cms_layout: CmsLayout!\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(t.h4,{id:"updatecmslayoutpayloadclientmutationidstring-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateCmsLayoutPayload.",(0,s.jsx)("b",{children:"clientMutationId"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(t.code,{children:"String"})})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,s.jsxs)(t.h4,{id:"updatecmslayoutpayloadcms_layoutcmslayout--",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateCmsLayoutPayload.",(0,s.jsx)("b",{children:"cms_layout"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/objects/cms-layout",children:(0,s.jsx)(t.code,{children:"CmsLayout!"})})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"/docs/graphql/api/mutations/update-cms-layout",children:(0,s.jsx)(t.code,{children:"updateCmsLayout"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"mutation"})]})]})}function g(e={}){const{wrapper:t}={...(0,d.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},1422:(e,t,a)=>{a.d(t,{R:()=>o,x:()=>l});var s=a(62340);const d={},n=s.createContext(d);function o(e){const t=s.useContext(n);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:o(e.components),s.createElement(n.Provider,{value:t},e.children)}}}]);