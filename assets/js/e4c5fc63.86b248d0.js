"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[74212],{39460:(e,t,r)=>{r.r(t),r.d(t,{Badge:()=>u,Bullet:()=>c,Details:()=>f,SpecifiedBy:()=>p,assets:()=>i,contentTitle:()=>d,default:()=>g,frontMatter:()=>a,metadata:()=>n,toc:()=>h});const n=JSON.parse('{"id":"graphql/types/objects/delete-user-con-profile-payload","title":"DeleteUserConProfilePayload","description":"Autogenerated return type of DeleteUserConProfile.","source":"@site/docs/graphql/types/objects/delete-user-con-profile-payload.mdx","sourceDirName":"graphql/types/objects","slug":"/graphql/types/objects/delete-user-con-profile-payload","permalink":"/docs/graphql/types/objects/delete-user-con-profile-payload","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/delete-user-con-profile-payload.mdx","tags":[],"version":"current","frontMatter":{"id":"delete-user-con-profile-payload","title":"DeleteUserConProfilePayload"},"sidebar":"sidebar","previous":{"title":"DeleteUserActivityAlertPayload","permalink":"/docs/graphql/types/objects/delete-user-activity-alert-payload"},"next":{"title":"Department","permalink":"/docs/graphql/types/objects/department"}}');var l=r(58040),o=r(5365),s=r(62340);const a={id:"delete-user-con-profile-payload",title:"DeleteUserConProfilePayload"},d=void 0,i={},c=()=>{const e={span:"span",...(0,o.R)()};return(0,l.jsx)(l.Fragment,{children:(0,l.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,o.R)()};return(0,l.jsxs)(l.Fragment,{children:["Specification",(0,l.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const t={span:"span",...(0,o.R)()};return(0,l.jsx)(l.Fragment,{children:(0,l.jsx)(t.span,{className:e.class,children:e.text})})},f=({dataOpen:e,dataClose:t,children:r,startOpen:n=!1})=>{const a={details:"details",summary:"summary",...(0,o.R)()},[d,i]=(0,s.useState)(n);return(0,l.jsxs)(a.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,l.jsx)(a.summary,{onClick:e=>{e.preventDefault(),i((e=>!e))},style:{listStyle:"none"},children:d?e:t}),d&&r]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>DeleteUserConProfilePayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"deleteuserconprofilepayloadclientmutationidstring-",level:4},{value:'<code>DeleteUserConProfilePayload.<b>user_con_profile</b></code><Bullet></Bullet><code>UserConProfile!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"deleteuserconprofilepayloaduser_con_profileuserconprofile--",level:4},{value:"Returned By",id:"returned-by",level:3}];function y(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(t.p,{children:"Autogenerated return type of DeleteUserConProfile."}),"\n",(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:"language-graphql",children:"type DeleteUserConProfilePayload {\n  clientMutationId: String\n  user_con_profile: UserConProfile!\n}\n"})}),"\n",(0,l.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,l.jsxs)(t.h4,{id:"deleteuserconprofilepayloadclientmutationidstring-",children:[(0,l.jsx)(t.a,{href:"#",children:(0,l.jsxs)("code",{style:{fontWeight:"normal"},children:["DeleteUserConProfilePayload.",(0,l.jsx)("b",{children:"clientMutationId"})]})}),(0,l.jsx)(c,{}),(0,l.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,l.jsx)(t.code,{children:"String"})})," ",(0,l.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,l.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,l.jsxs)(t.h4,{id:"deleteuserconprofilepayloaduser_con_profileuserconprofile--",children:[(0,l.jsx)(t.a,{href:"#",children:(0,l.jsxs)("code",{style:{fontWeight:"normal"},children:["DeleteUserConProfilePayload.",(0,l.jsx)("b",{children:"user_con_profile"})]})}),(0,l.jsx)(c,{}),(0,l.jsx)(t.a,{href:"/docs/graphql/types/objects/user-con-profile",children:(0,l.jsx)(t.code,{children:"UserConProfile!"})})," ",(0,l.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,l.jsx)(u,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,l.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,l.jsxs)(t.p,{children:[(0,l.jsx)(t.a,{href:"/docs/graphql/api/mutations/delete-user-con-profile",children:(0,l.jsx)(t.code,{children:"deleteUserConProfile"})}),"  ",(0,l.jsx)(u,{class:"badge badge--secondary",text:"mutation"})]})]})}function g(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,l.jsx)(t,{...e,children:(0,l.jsx)(y,{...e})}):y(e)}},5365:(e,t,r)=>{r.d(t,{R:()=>s,x:()=>a});var n=r(62340);const l={},o=n.createContext(l);function s(e){const t=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:s(e.components),n.createElement(o.Provider,{value:t},e.children)}}}]);