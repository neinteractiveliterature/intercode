"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[54448],{25389:(e,a,n)=>{n.r(a),n.d(a,{Badge:()=>h,Bullet:()=>c,Details:()=>x,SpecifiedBy:()=>g,assets:()=>l,contentTitle:()=>t,default:()=>p,frontMatter:()=>i,metadata:()=>d,toc:()=>b});var s=n(58040),o=n(1422),r=n(62340);const i={id:"organization-role",title:"OrganizationRole"},t=void 0,d={id:"graphql/types/objects/organization-role",title:"OrganizationRole",description:"No description",source:"@site/docs/graphql/types/objects/organization-role.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/organization-role",permalink:"/docs/graphql/types/objects/organization-role",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/organization-role.mdx",tags:[],version:"current",frontMatter:{id:"organization-role",title:"OrganizationRole"},sidebar:"sidebar",previous:{title:"OrdersPagination",permalink:"/docs/graphql/types/objects/orders-pagination"},next:{title:"Organization",permalink:"/docs/graphql/types/objects/organization"}},l={},c=()=>{const e={span:"span",...(0,o.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},g=e=>{const a={a:"a",...(0,o.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(a.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},h=e=>{const a={span:"span",...(0,o.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(a.span,{className:e.class,children:e.text})})},x=({dataOpen:e,dataClose:a,children:n,startOpen:i=!1})=>{const t={details:"details",summary:"summary",...(0,o.R)()},[d,l]=(0,r.useState)(i);return(0,s.jsxs)(t.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(t.summary,{onClick:e=>{e.preventDefault(),l((e=>!e))},style:{listStyle:"none"},children:d?e:a}),d&&n]})},b=[{value:"Fields",id:"fields",level:3},{value:'<code>OrganizationRole.<b>id</b></code><Bullet></Bullet><code>ID!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"organizationroleidid--",level:4},{value:'<code>OrganizationRole.<b>name</b></code><Bullet></Bullet><code>String!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"organizationrolenamestring--",level:4},{value:'<code>OrganizationRole.<b>organization</b></code><Bullet></Bullet><code>Organization!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"organizationroleorganizationorganization--",level:4},{value:'<code>OrganizationRole.<b>permissions</b></code><Bullet></Bullet><code>[Permission!]!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"organizationrolepermissionspermission--",level:4},{value:'<code>OrganizationRole.<b>users</b></code><Bullet></Bullet><code>[User!]!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"organizationroleusersuser--",level:4},{value:"Member Of",id:"member-of",level:3},{value:"Implemented By",id:"implemented-by",level:3}];function j(e){const a={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(a.p,{children:"No description"}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{className:"language-graphql",children:"type OrganizationRole {\n  id: ID!\n  name: String!\n  organization: Organization!\n  permissions: [Permission!]!\n  users: [User!]!\n}\n"})}),"\n",(0,s.jsx)(a.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(a.h4,{id:"organizationroleidid--",children:[(0,s.jsx)(a.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["OrganizationRole.",(0,s.jsx)("b",{children:"id"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/scalars/id",children:(0,s.jsx)(a.code,{children:"ID!"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(a.h4,{id:"organizationrolenamestring--",children:[(0,s.jsx)(a.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["OrganizationRole.",(0,s.jsx)("b",{children:"name"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(a.code,{children:"String!"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(a.h4,{id:"organizationroleorganizationorganization--",children:[(0,s.jsx)(a.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["OrganizationRole.",(0,s.jsx)("b",{children:"organization"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/organization",children:(0,s.jsx)(a.code,{children:"Organization!"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsxs)(a.h4,{id:"organizationrolepermissionspermission--",children:[(0,s.jsx)(a.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["OrganizationRole.",(0,s.jsx)("b",{children:"permissions"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/permission",children:(0,s.jsx)(a.code,{children:"[Permission!]!"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsxs)(a.h4,{id:"organizationroleusersuser--",children:[(0,s.jsx)(a.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["OrganizationRole.",(0,s.jsx)("b",{children:"users"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/user",children:(0,s.jsx)(a.code,{children:"[User!]!"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsx)(a.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(a.p,{children:[(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/create-organization-role-payload",children:(0,s.jsx)(a.code,{children:"CreateOrganizationRolePayload"})}),"  ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(c,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/organization",children:(0,s.jsx)(a.code,{children:"Organization"})}),"  ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(c,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/update-organization-role-payload",children:(0,s.jsx)(a.code,{children:"UpdateOrganizationRolePayload"})}),"  ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsx)(a.h3,{id:"implemented-by",children:"Implemented By"}),"\n",(0,s.jsxs)(a.p,{children:[(0,s.jsx)(a.a,{href:"/docs/graphql/types/unions/permissioned-role",children:(0,s.jsx)(a.code,{children:"PermissionedRole"})}),"  ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"union"})]})]})}function p(e={}){const{wrapper:a}={...(0,o.R)(),...e.components};return a?(0,s.jsx)(a,{...e,children:(0,s.jsx)(j,{...e})}):j(e)}},1422:(e,a,n)=>{n.d(a,{R:()=>i,x:()=>t});var s=n(62340);const o={},r=s.createContext(o);function i(e){const a=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function t(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),s.createElement(r.Provider,{value:a},e.children)}}}]);