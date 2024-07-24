"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[38812],{33518:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>h,Bullet:()=>c,Details:()=>u,SpecifiedBy:()=>p,assets:()=>i,contentTitle:()=>a,default:()=>v,frontMatter:()=>s,metadata:()=>l,toc:()=>y});var r=n(58040),d=n(1422),o=n(62340);const s={id:"restore-dropped-event-payload",title:"RestoreDroppedEventPayload"},a=void 0,l={id:"graphql/types/objects/restore-dropped-event-payload",title:"RestoreDroppedEventPayload",description:"Autogenerated return type of RestoreDroppedEvent.",source:"@site/docs/graphql/types/objects/restore-dropped-event-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/restore-dropped-event-payload",permalink:"/docs/graphql/types/objects/restore-dropped-event-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/restore-dropped-event-payload.mdx",tags:[],version:"current",frontMatter:{id:"restore-dropped-event-payload",title:"RestoreDroppedEventPayload"},sidebar:"sidebar",previous:{title:"RenameCmsFilePayload",permalink:"/docs/graphql/types/objects/rename-cms-file-payload"},next:{title:"RevokeAuthorizedApplicationPayload",permalink:"/docs/graphql/types/objects/revoke-authorized-application-payload"}},i={},c=()=>{const e={span:"span",...(0,d.R)()};return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,d.R)()};return(0,r.jsxs)(r.Fragment,{children:["Specification",(0,r.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},h=e=>{const t={span:"span",...(0,d.R)()};return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(t.span,{className:e.class,children:e.text})})},u=({dataOpen:e,dataClose:t,children:n,startOpen:s=!1})=>{const a={details:"details",summary:"summary",...(0,d.R)()},[l,i]=(0,o.useState)(s);return(0,r.jsxs)(a.details,{...l?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,r.jsx)(a.summary,{onClick:e=>{e.preventDefault(),i((e=>!e))},style:{listStyle:"none"},children:l?e:t}),l&&n]})},y=[{value:"Fields",id:"fields",level:3},{value:'<code>RestoreDroppedEventPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"restoredroppedeventpayloadclientmutationidstring-",level:4},{value:'<code>RestoreDroppedEventPayload.<b>event</b></code><Bullet></Bullet><code>Event!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"restoredroppedeventpayloadeventevent--",level:4},{value:"Returned By",id:"returned-by",level:3}];function g(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,d.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.p,{children:"Autogenerated return type of RestoreDroppedEvent."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-graphql",children:"type RestoreDroppedEventPayload {\n  clientMutationId: String\n  event: Event!\n}\n"})}),"\n",(0,r.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,r.jsxs)(t.h4,{id:"restoredroppedeventpayloadclientmutationidstring-",children:[(0,r.jsx)(t.a,{href:"#",children:(0,r.jsxs)("code",{style:{fontWeight:"normal"},children:["RestoreDroppedEventPayload.",(0,r.jsx)("b",{children:"clientMutationId"})]})}),(0,r.jsx)(c,{}),(0,r.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,r.jsx)(t.code,{children:"String"})})," ",(0,r.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,r.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,r.jsxs)(t.h4,{id:"restoredroppedeventpayloadeventevent--",children:[(0,r.jsx)(t.a,{href:"#",children:(0,r.jsxs)("code",{style:{fontWeight:"normal"},children:["RestoreDroppedEventPayload.",(0,r.jsx)("b",{children:"event"})]})}),(0,r.jsx)(c,{}),(0,r.jsx)(t.a,{href:"/docs/graphql/types/objects/event",children:(0,r.jsx)(t.code,{children:"Event!"})})," ",(0,r.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,r.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,r.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.a,{href:"/docs/graphql/api/mutations/restore-dropped-event",children:(0,r.jsx)(t.code,{children:"restoreDroppedEvent"})}),"  ",(0,r.jsx)(h,{class:"badge badge--secondary",text:"mutation"})]})]})}function v(e={}){const{wrapper:t}={...(0,d.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(g,{...e})}):g(e)}},1422:(e,t,n)=>{n.d(t,{R:()=>s,x:()=>a});var r=n(62340);const d={},o=r.createContext(d);function s(e){const t=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:s(e.components),r.createElement(o.Provider,{value:t},e.children)}}}]);