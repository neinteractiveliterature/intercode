"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[27625],{55100:(e,a,t)=>{t.r(a),t.d(a,{Badge:()=>g,Bullet:()=>c,Details:()=>u,SpecifiedBy:()=>p,assets:()=>s,contentTitle:()=>d,default:()=>x,frontMatter:()=>i,metadata:()=>l,toc:()=>h});var n=t(58040),o=t(1422),r=t(62340);const i={id:"update-organization-role-payload",title:"UpdateOrganizationRolePayload"},d=void 0,l={id:"graphql/types/objects/update-organization-role-payload",title:"UpdateOrganizationRolePayload",description:"Autogenerated return type of UpdateOrganizationRole.",source:"@site/docs/graphql/types/objects/update-organization-role-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/update-organization-role-payload",permalink:"/docs/graphql/types/objects/update-organization-role-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/update-organization-role-payload.mdx",tags:[],version:"current",frontMatter:{id:"update-organization-role-payload",title:"UpdateOrganizationRolePayload"},sidebar:"sidebar",previous:{title:"UpdateOrderPayload",permalink:"/docs/graphql/types/objects/update-order-payload"},next:{title:"UpdatePagePayload",permalink:"/docs/graphql/types/objects/update-page-payload"}},s={},c=()=>{const e={span:"span",...(0,o.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const a={a:"a",...(0,o.R)()};return(0,n.jsxs)(n.Fragment,{children:["Specification",(0,n.jsx)(a.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},g=e=>{const a={span:"span",...(0,o.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(a.span,{className:e.class,children:e.text})})},u=({dataOpen:e,dataClose:a,children:t,startOpen:i=!1})=>{const d={details:"details",summary:"summary",...(0,o.R)()},[l,s]=(0,r.useState)(i);return(0,n.jsxs)(d.details,{...l?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,n.jsx)(d.summary,{onClick:e=>{e.preventDefault(),s((e=>!e))},style:{listStyle:"none"},children:l?e:a}),l&&t]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>UpdateOrganizationRolePayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"updateorganizationrolepayloadclientmutationidstring-",level:4},{value:'<code>UpdateOrganizationRolePayload.<b>organization_role</b></code><Bullet></Bullet><code>OrganizationRole!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"updateorganizationrolepayloadorganization_roleorganizationrole--",level:4},{value:"Returned By",id:"returned-by",level:3}];function y(e){const a={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(a.p,{children:"Autogenerated return type of UpdateOrganizationRole."}),"\n",(0,n.jsx)(a.pre,{children:(0,n.jsx)(a.code,{className:"language-graphql",children:"type UpdateOrganizationRolePayload {\n  clientMutationId: String\n  organization_role: OrganizationRole!\n}\n"})}),"\n",(0,n.jsx)(a.h3,{id:"fields",children:"Fields"}),"\n",(0,n.jsxs)(a.h4,{id:"updateorganizationrolepayloadclientmutationidstring-",children:[(0,n.jsx)(a.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateOrganizationRolePayload.",(0,n.jsx)("b",{children:"clientMutationId"})]})}),(0,n.jsx)(c,{}),(0,n.jsx)(a.a,{href:"/docs/graphql/types/scalars/string",children:(0,n.jsx)(a.code,{children:"String"})})," ",(0,n.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,n.jsx)(a.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,n.jsxs)(a.h4,{id:"updateorganizationrolepayloadorganization_roleorganizationrole--",children:[(0,n.jsx)(a.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateOrganizationRolePayload.",(0,n.jsx)("b",{children:"organization_role"})]})}),(0,n.jsx)(c,{}),(0,n.jsx)(a.a,{href:"/docs/graphql/types/objects/organization-role",children:(0,n.jsx)(a.code,{children:"OrganizationRole!"})})," ",(0,n.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,n.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,n.jsx)(a.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,n.jsxs)(a.p,{children:[(0,n.jsx)(a.a,{href:"/docs/graphql/api/mutations/update-organization-role",children:(0,n.jsx)(a.code,{children:"updateOrganizationRole"})}),"  ",(0,n.jsx)(g,{class:"badge badge--secondary",text:"mutation"})]})]})}function x(e={}){const{wrapper:a}={...(0,o.R)(),...e.components};return a?(0,n.jsx)(a,{...e,children:(0,n.jsx)(y,{...e})}):y(e)}},1422:(e,a,t)=>{t.d(a,{R:()=>i,x:()=>d});var n=t(62340);const o={},r=n.createContext(o);function i(e){const a=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function d(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),n.createElement(r.Provider,{value:a},e.children)}}}]);