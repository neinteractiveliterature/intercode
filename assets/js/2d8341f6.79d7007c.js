"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[61543],{92403:(e,a,r)=>{r.r(a),r.d(a,{Badge:()=>u,Bullet:()=>i,Details:()=>h,SpecifiedBy:()=>p,assets:()=>o,contentTitle:()=>d,default:()=>g,frontMatter:()=>c,metadata:()=>t,toc:()=>y});const t=JSON.parse('{"id":"graphql/types/objects/create-cms-graphql-query-payload","title":"CreateCmsGraphqlQueryPayload","description":"Autogenerated return type of CreateCmsGraphqlQuery.","source":"@site/docs/graphql/types/objects/create-cms-graphql-query-payload.mdx","sourceDirName":"graphql/types/objects","slug":"/graphql/types/objects/create-cms-graphql-query-payload","permalink":"/docs/graphql/types/objects/create-cms-graphql-query-payload","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/create-cms-graphql-query-payload.mdx","tags":[],"version":"current","frontMatter":{"id":"create-cms-graphql-query-payload","title":"CreateCmsGraphqlQueryPayload"},"sidebar":"sidebar","previous":{"title":"CreateCmsFilePayload","permalink":"/docs/graphql/types/objects/create-cms-file-payload"},"next":{"title":"CreateCmsLayoutPayload","permalink":"/docs/graphql/types/objects/create-cms-layout-payload"}}');var s=r(58040),l=r(5365),n=r(62340);const c={id:"create-cms-graphql-query-payload",title:"CreateCmsGraphqlQueryPayload"},d=void 0,o={},i=()=>{const e={span:"span",...(0,l.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const a={a:"a",...(0,l.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(a.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const a={span:"span",...(0,l.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(a.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:a,children:r,startOpen:t=!1})=>{const c={details:"details",summary:"summary",...(0,l.R)()},[d,o]=(0,n.useState)(t);return(0,s.jsxs)(c.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(c.summary,{onClick:e=>{e.preventDefault(),o((e=>!e))},style:{listStyle:"none"},children:d?e:a}),d&&r]})},y=[{value:"Fields",id:"fields",level:3},{value:'<code>CreateCmsGraphqlQueryPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"createcmsgraphqlquerypayloadclientmutationidstring-",level:4},{value:'<code>CreateCmsGraphqlQueryPayload.<b>query</b></code><Bullet></Bullet><code>CmsGraphqlQuery!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"createcmsgraphqlquerypayloadquerycmsgraphqlquery--",level:4},{value:"Returned By",id:"returned-by",level:3}];function m(e){const a={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,l.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(a.p,{children:"Autogenerated return type of CreateCmsGraphqlQuery."}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{className:"language-graphql",children:"type CreateCmsGraphqlQueryPayload {\n  clientMutationId: String\n  query: CmsGraphqlQuery!\n}\n"})}),"\n",(0,s.jsx)(a.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(a.h4,{id:"createcmsgraphqlquerypayloadclientmutationidstring-",children:[(0,s.jsx)(a.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateCmsGraphqlQueryPayload.",(0,s.jsx)("b",{children:"clientMutationId"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(a.code,{children:"String"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(a.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,s.jsxs)(a.h4,{id:"createcmsgraphqlquerypayloadquerycmsgraphqlquery--",children:[(0,s.jsx)(a.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateCmsGraphqlQueryPayload.",(0,s.jsx)("b",{children:"query"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/cms-graphql-query",children:(0,s.jsx)(a.code,{children:"CmsGraphqlQuery!"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsx)(a.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,s.jsxs)(a.p,{children:[(0,s.jsx)(a.a,{href:"/docs/graphql/api/mutations/create-cms-graphql-query",children:(0,s.jsx)(a.code,{children:"createCmsGraphqlQuery"})}),"  ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"mutation"})]})]})}function g(e={}){const{wrapper:a}={...(0,l.R)(),...e.components};return a?(0,s.jsx)(a,{...e,children:(0,s.jsx)(m,{...e})}):m(e)}},5365:(e,a,r)=>{r.d(a,{R:()=>n,x:()=>c});var t=r(62340);const s={},l=t.createContext(s);function n(e){const a=t.useContext(l);return t.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function c(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:n(e.components),t.createElement(l.Provider,{value:a},e.children)}}}]);