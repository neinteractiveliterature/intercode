"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[74048],{76128:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>u,Bullet:()=>c,Details:()=>h,SpecifiedBy:()=>p,assets:()=>l,contentTitle:()=>s,default:()=>m,frontMatter:()=>r,metadata:()=>d,toc:()=>g});var i=n(58040),o=n(1422),a=n(62340);const r={id:"revoke-authorized-application-input",title:"RevokeAuthorizedApplicationInput"},s=void 0,d={id:"graphql/types/inputs/revoke-authorized-application-input",title:"RevokeAuthorizedApplicationInput",description:"Autogenerated input type of RevokeAuthorizedApplication",source:"@site/docs/graphql/types/inputs/revoke-authorized-application-input.mdx",sourceDirName:"graphql/types/inputs",slug:"/graphql/types/inputs/revoke-authorized-application-input",permalink:"/docs/graphql/types/inputs/revoke-authorized-application-input",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/inputs/revoke-authorized-application-input.mdx",tags:[],version:"current",frontMatter:{id:"revoke-authorized-application-input",title:"RevokeAuthorizedApplicationInput"},sidebar:"sidebar",previous:{title:"RestoreDroppedEventInput",permalink:"/docs/graphql/types/inputs/restore-dropped-event-input"},next:{title:"RoomInput",permalink:"/docs/graphql/types/inputs/room-input"}},l={},c=()=>{const e={span:"span",...(0,o.R)()};return(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,o.R)()};return(0,i.jsxs)(i.Fragment,{children:["Specification",(0,i.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const t={span:"span",...(0,o.R)()};return(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(t.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:t,children:n,startOpen:r=!1})=>{const s={details:"details",summary:"summary",...(0,o.R)()},[d,l]=(0,a.useState)(r);return(0,i.jsxs)(s.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,i.jsx)(s.summary,{onClick:e=>{e.preventDefault(),l((e=>!e))},style:{listStyle:"none"},children:d?e:t}),d&&n]})},g=[{value:"Fields",id:"fields",level:3},{value:'<code>RevokeAuthorizedApplicationInput.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"revokeauthorizedapplicationinputclientmutationidstring-",level:4},{value:'<code>RevokeAuthorizedApplicationInput.<b>uid</b></code><Bullet></Bullet><code>ID!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"revokeauthorizedapplicationinputuidid--",level:4},{value:"Member Of",id:"member-of",level:3}];function x(e){const t={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.p,{children:"Autogenerated input type of RevokeAuthorizedApplication"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-graphql",children:"input RevokeAuthorizedApplicationInput {\n  clientMutationId: String\n  uid: ID!\n}\n"})}),"\n",(0,i.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,i.jsxs)(t.h4,{id:"revokeauthorizedapplicationinputclientmutationidstring-",children:[(0,i.jsx)(t.a,{href:"#",children:(0,i.jsxs)("code",{style:{fontWeight:"normal"},children:["RevokeAuthorizedApplicationInput.",(0,i.jsx)("b",{children:"clientMutationId"})]})}),(0,i.jsx)(c,{}),(0,i.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,i.jsx)(t.code,{children:"String"})})," ",(0,i.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,i.jsxs)(t.blockquote,{children:["\n",(0,i.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n"]}),"\n",(0,i.jsxs)(t.h4,{id:"revokeauthorizedapplicationinputuidid--",children:[(0,i.jsx)(t.a,{href:"#",children:(0,i.jsxs)("code",{style:{fontWeight:"normal"},children:["RevokeAuthorizedApplicationInput.",(0,i.jsx)("b",{children:"uid"})]})}),(0,i.jsx)(c,{}),(0,i.jsx)(t.a,{href:"/docs/graphql/types/scalars/id",children:(0,i.jsx)(t.code,{children:"ID!"})})," ",(0,i.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,i.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,i.jsx)(t.blockquote,{children:"\n"}),"\n",(0,i.jsx)(t.h3,{id:"member-of",children:"Member Of"}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.a,{href:"/docs/graphql/api/mutations/revoke-authorized-application",children:(0,i.jsx)(t.code,{children:"revokeAuthorizedApplication"})}),"  ",(0,i.jsx)(u,{class:"badge badge--secondary",text:"mutation"})]})]})}function m(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(x,{...e})}):x(e)}},1422:(e,t,n)=>{n.d(t,{R:()=>r,x:()=>s});var i=n(62340);const o={},a=i.createContext(o);function r(e){const t=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),i.createElement(a.Provider,{value:t},e.children)}}}]);