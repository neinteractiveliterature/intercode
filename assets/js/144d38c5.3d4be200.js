"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[97741],{58946:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>y,Bullet:()=>i,Details:()=>m,SpecifiedBy:()=>u,assets:()=>r,contentTitle:()=>d,default:()=>g,frontMatter:()=>n,metadata:()=>c,toc:()=>p});var s=a(58040),l=a(1422),o=a(62340);const n={id:"delete-cms-layout-payload",title:"DeleteCmsLayoutPayload"},d=void 0,c={id:"graphql/types/objects/delete-cms-layout-payload",title:"DeleteCmsLayoutPayload",description:"Autogenerated return type of DeleteCmsLayout.",source:"@site/docs/graphql/types/objects/delete-cms-layout-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/delete-cms-layout-payload",permalink:"/docs/graphql/types/objects/delete-cms-layout-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/delete-cms-layout-payload.mdx",tags:[],version:"current",frontMatter:{id:"delete-cms-layout-payload",title:"DeleteCmsLayoutPayload"},sidebar:"sidebar",previous:{title:"DeleteCmsGraphqlQueryPayload",permalink:"/docs/graphql/types/objects/delete-cms-graphql-query-payload"},next:{title:"DeleteCmsNavigationItemPayload",permalink:"/docs/graphql/types/objects/delete-cms-navigation-item-payload"}},r={},i=()=>{const e={span:"span",...(0,l.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},u=e=>{const t={a:"a",...(0,l.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},y=e=>{const t={span:"span",...(0,l.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(t.span,{className:e.class,children:e.text})})},m=({dataOpen:e,dataClose:t,children:a,startOpen:n=!1})=>{const d={details:"details",summary:"summary",...(0,l.R)()},[c,r]=(0,o.useState)(n);return(0,s.jsxs)(d.details,{...c?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(d.summary,{onClick:e=>{e.preventDefault(),r((e=>!e))},style:{listStyle:"none"},children:c?e:t}),c&&a]})},p=[{value:"Fields",id:"fields",level:3},{value:'<code>DeleteCmsLayoutPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"deletecmslayoutpayloadclientmutationidstring-",level:4},{value:'<code>DeleteCmsLayoutPayload.<b>cms_layout</b></code><Bullet></Bullet><code>CmsLayout!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"deletecmslayoutpayloadcms_layoutcmslayout--",level:4},{value:"Returned By",id:"returned-by",level:3}];function h(e){const t={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,l.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"Autogenerated return type of DeleteCmsLayout."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-graphql",children:"type DeleteCmsLayoutPayload {\n  clientMutationId: String\n  cms_layout: CmsLayout!\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(t.h4,{id:"deletecmslayoutpayloadclientmutationidstring-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["DeleteCmsLayoutPayload.",(0,s.jsx)("b",{children:"clientMutationId"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(t.code,{children:"String"})})," ",(0,s.jsx)(y,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n"]}),"\n",(0,s.jsxs)(t.h4,{id:"deletecmslayoutpayloadcms_layoutcmslayout--",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["DeleteCmsLayoutPayload.",(0,s.jsx)("b",{children:"cms_layout"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/objects/cms-layout",children:(0,s.jsx)(t.code,{children:"CmsLayout!"})})," ",(0,s.jsx)(y,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(y,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsx)(t.blockquote,{children:"\n"}),"\n",(0,s.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"/docs/graphql/api/mutations/delete-cms-layout",children:(0,s.jsx)(t.code,{children:"deleteCmsLayout"})}),"  ",(0,s.jsx)(y,{class:"badge badge--secondary",text:"mutation"})]})]})}function g(e={}){const{wrapper:t}={...(0,l.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},1422:(e,t,a)=>{a.d(t,{R:()=>n,x:()=>d});var s=a(62340);const l={},o=s.createContext(l);function n(e){const t=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:n(e.components),s.createElement(o.Provider,{value:t},e.children)}}}]);