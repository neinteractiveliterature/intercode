"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[56580],{82844:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>p,Bullet:()=>i,Details:()=>h,SpecifiedBy:()=>u,assets:()=>l,contentTitle:()=>n,default:()=>x,frontMatter:()=>o,metadata:()=>s,toc:()=>y});var r=a(58040),d=a(1422),c=a(62340);const o={id:"create-product-payload",title:"CreateProductPayload"},n=void 0,s={id:"graphql/types/objects/create-product-payload",title:"CreateProductPayload",description:"Autogenerated return type of CreateProduct.",source:"@site/docs/graphql/types/objects/create-product-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/create-product-payload",permalink:"/docs/graphql/types/objects/create-product-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/create-product-payload.mdx",tags:[],version:"current",frontMatter:{id:"create-product-payload",title:"CreateProductPayload"},sidebar:"sidebar",previous:{title:"CreatePagePayload",permalink:"/docs/graphql/types/objects/create-page-payload"},next:{title:"CreateRankedChoiceUserConstraintPayload",permalink:"/docs/graphql/types/objects/create-ranked-choice-user-constraint-payload"}},l={},i=()=>{const e={span:"span",...(0,d.R)()};return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},u=e=>{const t={a:"a",...(0,d.R)()};return(0,r.jsxs)(r.Fragment,{children:["Specification",(0,r.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const t={span:"span",...(0,d.R)()};return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(t.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:t,children:a,startOpen:o=!1})=>{const n={details:"details",summary:"summary",...(0,d.R)()},[s,l]=(0,c.useState)(o);return(0,r.jsxs)(n.details,{...s?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,r.jsx)(n.summary,{onClick:e=>{e.preventDefault(),l((e=>!e))},style:{listStyle:"none"},children:s?e:t}),s&&a]})},y=[{value:"Fields",id:"fields",level:3},{value:'<code>CreateProductPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"createproductpayloadclientmutationidstring-",level:4},{value:'<code>CreateProductPayload.<b>product</b></code><Bullet></Bullet><code>Product!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"createproductpayloadproductproduct--",level:4},{value:"Returned By",id:"returned-by",level:3}];function g(e){const t={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,d.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.p,{children:"Autogenerated return type of CreateProduct."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-graphql",children:"type CreateProductPayload {\n  clientMutationId: String\n  product: Product!\n}\n"})}),"\n",(0,r.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,r.jsxs)(t.h4,{id:"createproductpayloadclientmutationidstring-",children:[(0,r.jsx)(t.a,{href:"#",children:(0,r.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateProductPayload.",(0,r.jsx)("b",{children:"clientMutationId"})]})}),(0,r.jsx)(i,{}),(0,r.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,r.jsx)(t.code,{children:"String"})})," ",(0,r.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,r.jsxs)(t.blockquote,{children:["\n",(0,r.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n"]}),"\n",(0,r.jsxs)(t.h4,{id:"createproductpayloadproductproduct--",children:[(0,r.jsx)(t.a,{href:"#",children:(0,r.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateProductPayload.",(0,r.jsx)("b",{children:"product"})]})}),(0,r.jsx)(i,{}),(0,r.jsx)(t.a,{href:"/docs/graphql/types/objects/product",children:(0,r.jsx)(t.code,{children:"Product!"})})," ",(0,r.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,r.jsx)(p,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,r.jsx)(t.blockquote,{children:"\n"}),"\n",(0,r.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.a,{href:"/docs/graphql/api/mutations/create-product",children:(0,r.jsx)(t.code,{children:"createProduct"})}),"  ",(0,r.jsx)(p,{class:"badge badge--secondary",text:"mutation"})]})]})}function x(e={}){const{wrapper:t}={...(0,d.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(g,{...e})}):g(e)}},1422:(e,t,a)=>{a.d(t,{R:()=>o,x:()=>n});var r=a(62340);const d={},c=r.createContext(d);function o(e){const t=r.useContext(c);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function n(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:o(e.components),r.createElement(c.Provider,{value:t},e.children)}}}]);