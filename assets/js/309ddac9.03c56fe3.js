"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[76876],{30607:(e,a,t)=>{t.r(a),t.d(a,{Badge:()=>m,Bullet:()=>o,Details:()=>h,SpecifiedBy:()=>p,assets:()=>c,contentTitle:()=>i,default:()=>g,frontMatter:()=>d,metadata:()=>l,toc:()=>u});const l=JSON.parse('{"id":"graphql/types/objects/delete-cms-partial-payload","title":"DeleteCmsPartialPayload","description":"Autogenerated return type of DeleteCmsPartial.","source":"@site/docs/graphql/types/objects/delete-cms-partial-payload.mdx","sourceDirName":"graphql/types/objects","slug":"/graphql/types/objects/delete-cms-partial-payload","permalink":"/docs/graphql/types/objects/delete-cms-partial-payload","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/delete-cms-partial-payload.mdx","tags":[],"version":"current","frontMatter":{"id":"delete-cms-partial-payload","title":"DeleteCmsPartialPayload"},"sidebar":"sidebar","previous":{"title":"DeleteCmsNavigationItemPayload","permalink":"/docs/graphql/types/objects/delete-cms-navigation-item-payload"},"next":{"title":"DeleteCmsVariablePayload","permalink":"/docs/graphql/types/objects/delete-cms-variable-payload"}}');var s=t(58040),r=t(5365),n=t(62340);const d={id:"delete-cms-partial-payload",title:"DeleteCmsPartialPayload"},i=void 0,c={},o=()=>{const e={span:"span",...(0,r.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const a={a:"a",...(0,r.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(a.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},m=e=>{const a={span:"span",...(0,r.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(a.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:a,children:t,startOpen:l=!1})=>{const d={details:"details",summary:"summary",...(0,r.R)()},[i,c]=(0,n.useState)(l);return(0,s.jsxs)(d.details,{...i?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(d.summary,{onClick:e=>{e.preventDefault(),c((e=>!e))},style:{listStyle:"none"},children:i?e:a}),i&&t]})},u=[{value:"Fields",id:"fields",level:3},{value:'<code>DeleteCmsPartialPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"deletecmspartialpayloadclientmutationidstring-",level:4},{value:'<code>DeleteCmsPartialPayload.<b>cms_partial</b></code><Bullet></Bullet><code>CmsPartial!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"deletecmspartialpayloadcms_partialcmspartial--",level:4},{value:"Returned By",id:"returned-by",level:3}];function y(e){const a={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(a.p,{children:"Autogenerated return type of DeleteCmsPartial."}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{className:"language-graphql",children:"type DeleteCmsPartialPayload {\n  clientMutationId: String\n  cms_partial: CmsPartial!\n}\n"})}),"\n",(0,s.jsx)(a.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(a.h4,{id:"deletecmspartialpayloadclientmutationidstring-",children:[(0,s.jsx)(a.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["DeleteCmsPartialPayload.",(0,s.jsx)("b",{children:"clientMutationId"})]})}),(0,s.jsx)(o,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(a.code,{children:"String"})})," ",(0,s.jsx)(m,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(a.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,s.jsxs)(a.h4,{id:"deletecmspartialpayloadcms_partialcmspartial--",children:[(0,s.jsx)(a.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["DeleteCmsPartialPayload.",(0,s.jsx)("b",{children:"cms_partial"})]})}),(0,s.jsx)(o,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/cms-partial",children:(0,s.jsx)(a.code,{children:"CmsPartial!"})})," ",(0,s.jsx)(m,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(m,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsx)(a.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,s.jsxs)(a.p,{children:[(0,s.jsx)(a.a,{href:"/docs/graphql/api/mutations/delete-cms-partial",children:(0,s.jsx)(a.code,{children:"deleteCmsPartial"})}),"  ",(0,s.jsx)(m,{class:"badge badge--secondary",text:"mutation"})]})]})}function g(e={}){const{wrapper:a}={...(0,r.R)(),...e.components};return a?(0,s.jsx)(a,{...e,children:(0,s.jsx)(y,{...e})}):y(e)}},5365:(e,a,t)=>{t.d(a,{R:()=>n,x:()=>d});var l=t(62340);const s={},r=l.createContext(s);function n(e){const a=l.useContext(r);return l.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function d(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:n(e.components),l.createElement(r.Provider,{value:a},e.children)}}}]);