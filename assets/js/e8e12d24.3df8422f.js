"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[1230],{34599:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>p,Bullet:()=>d,Details:()=>m,SpecifiedBy:()=>u,assets:()=>o,contentTitle:()=>l,default:()=>g,frontMatter:()=>c,metadata:()=>a,toc:()=>h});const a=JSON.parse('{"id":"graphql/types/inputs/create-cms-layout-input","title":"CreateCmsLayoutInput","description":"Autogenerated input type of CreateCmsLayout","source":"@site/docs/graphql/types/inputs/create-cms-layout-input.mdx","sourceDirName":"graphql/types/inputs","slug":"/graphql/types/inputs/create-cms-layout-input","permalink":"/docs/graphql/types/inputs/create-cms-layout-input","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/inputs/create-cms-layout-input.mdx","tags":[],"version":"current","frontMatter":{"id":"create-cms-layout-input","title":"CreateCmsLayoutInput"},"sidebar":"sidebar","previous":{"title":"CreateCmsGraphqlQueryInput","permalink":"/docs/graphql/types/inputs/create-cms-graphql-query-input"},"next":{"title":"CreateCmsNavigationItemInput","permalink":"/docs/graphql/types/inputs/create-cms-navigation-item-input"}}');var s=n(58040),r=n(5365),i=n(62340);const c={id:"create-cms-layout-input",title:"CreateCmsLayoutInput"},l=void 0,o={},d=()=>{const e={span:"span",...(0,r.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},u=e=>{const t={a:"a",...(0,r.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const t={span:"span",...(0,r.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(t.span,{className:e.class,children:e.text})})},m=({dataOpen:e,dataClose:t,children:n,startOpen:a=!1})=>{const c={details:"details",summary:"summary",...(0,r.R)()},[l,o]=(0,i.useState)(a);return(0,s.jsxs)(c.details,{...l?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(c.summary,{onClick:e=>{e.preventDefault(),o((e=>!e))},style:{listStyle:"none"},children:l?e:t}),l&&n]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>CreateCmsLayoutInput.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"createcmslayoutinputclientmutationidstring-",level:4},{value:'<code>CreateCmsLayoutInput.<b>cms_layout</b></code><Bullet></Bullet><code>CmsLayoutInput!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"createcmslayoutinputcms_layoutcmslayoutinput--",level:4},{value:"Member Of",id:"member-of",level:3}];function y(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"Autogenerated input type of CreateCmsLayout"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-graphql",children:"input CreateCmsLayoutInput {\n  clientMutationId: String\n  cms_layout: CmsLayoutInput!\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(t.h4,{id:"createcmslayoutinputclientmutationidstring-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateCmsLayoutInput.",(0,s.jsx)("b",{children:"clientMutationId"})]})}),(0,s.jsx)(d,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(t.code,{children:"String"})})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,s.jsxs)(t.h4,{id:"createcmslayoutinputcms_layoutcmslayoutinput--",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateCmsLayoutInput.",(0,s.jsx)("b",{children:"cms_layout"})]})}),(0,s.jsx)(d,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/inputs/cms-layout-input",children:(0,s.jsx)(t.code,{children:"CmsLayoutInput!"})})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,s.jsx)(t.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"/docs/graphql/api/mutations/create-cms-layout",children:(0,s.jsx)(t.code,{children:"createCmsLayout"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"mutation"})]})]})}function g(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(y,{...e})}):y(e)}},5365:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>c});var a=n(62340);const s={},r=a.createContext(s);function i(e){const t=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),a.createElement(r.Provider,{value:t},e.children)}}}]);