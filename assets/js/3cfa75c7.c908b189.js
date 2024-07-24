"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[51816],{88252:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>p,Bullet:()=>c,Details:()=>m,SpecifiedBy:()=>u,assets:()=>i,contentTitle:()=>r,default:()=>g,frontMatter:()=>d,metadata:()=>s,toc:()=>h});var l=a(58040),n=a(1422),o=a(62340);const d={id:"delete-email-route-payload",title:"DeleteEmailRoutePayload"},r=void 0,s={id:"graphql/types/objects/delete-email-route-payload",title:"DeleteEmailRoutePayload",description:"Autogenerated return type of DeleteEmailRoute.",source:"@site/docs/graphql/types/objects/delete-email-route-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/delete-email-route-payload",permalink:"/docs/graphql/types/objects/delete-email-route-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/delete-email-route-payload.mdx",tags:[],version:"current",frontMatter:{id:"delete-email-route-payload",title:"DeleteEmailRoutePayload"},sidebar:"sidebar",previous:{title:"DeleteDepartmentPayload",permalink:"/docs/graphql/types/objects/delete-department-payload"},next:{title:"DeleteEventCategoryPayload",permalink:"/docs/graphql/types/objects/delete-event-category-payload"}},i={},c=()=>{const e={span:"span",...(0,n.R)()};return(0,l.jsx)(l.Fragment,{children:(0,l.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},u=e=>{const t={a:"a",...(0,n.R)()};return(0,l.jsxs)(l.Fragment,{children:["Specification",(0,l.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const t={span:"span",...(0,n.R)()};return(0,l.jsx)(l.Fragment,{children:(0,l.jsx)(t.span,{className:e.class,children:e.text})})},m=({dataOpen:e,dataClose:t,children:a,startOpen:d=!1})=>{const r={details:"details",summary:"summary",...(0,n.R)()},[s,i]=(0,o.useState)(d);return(0,l.jsxs)(r.details,{...s?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,l.jsx)(r.summary,{onClick:e=>{e.preventDefault(),i((e=>!e))},style:{listStyle:"none"},children:s?e:t}),s&&a]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>DeleteEmailRoutePayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"deleteemailroutepayloadclientmutationidstring-",level:4},{value:'<code>DeleteEmailRoutePayload.<b>email_route</b></code><Bullet></Bullet><code>EmailRoute!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"deleteemailroutepayloademail_routeemailroute--",level:4},{value:"Returned By",id:"returned-by",level:3}];function y(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,n.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(t.p,{children:"Autogenerated return type of DeleteEmailRoute."}),"\n",(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:"language-graphql",children:"type DeleteEmailRoutePayload {\n  clientMutationId: String\n  email_route: EmailRoute!\n}\n"})}),"\n",(0,l.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,l.jsxs)(t.h4,{id:"deleteemailroutepayloadclientmutationidstring-",children:[(0,l.jsx)(t.a,{href:"#",children:(0,l.jsxs)("code",{style:{fontWeight:"normal"},children:["DeleteEmailRoutePayload.",(0,l.jsx)("b",{children:"clientMutationId"})]})}),(0,l.jsx)(c,{}),(0,l.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,l.jsx)(t.code,{children:"String"})})," ",(0,l.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,l.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,l.jsxs)(t.h4,{id:"deleteemailroutepayloademail_routeemailroute--",children:[(0,l.jsx)(t.a,{href:"#",children:(0,l.jsxs)("code",{style:{fontWeight:"normal"},children:["DeleteEmailRoutePayload.",(0,l.jsx)("b",{children:"email_route"})]})}),(0,l.jsx)(c,{}),(0,l.jsx)(t.a,{href:"/docs/graphql/types/objects/email-route",children:(0,l.jsx)(t.code,{children:"EmailRoute!"})})," ",(0,l.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,l.jsx)(p,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,l.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,l.jsxs)(t.p,{children:[(0,l.jsx)(t.a,{href:"/docs/graphql/api/mutations/delete-email-route",children:(0,l.jsx)(t.code,{children:"deleteEmailRoute"})}),"  ",(0,l.jsx)(p,{class:"badge badge--secondary",text:"mutation"})]})]})}function g(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,l.jsx)(t,{...e,children:(0,l.jsx)(y,{...e})}):y(e)}},1422:(e,t,a)=>{a.d(t,{R:()=>d,x:()=>r});var l=a(62340);const n={},o=l.createContext(n);function d(e){const t=l.useContext(o);return l.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:d(e.components),l.createElement(o.Provider,{value:t},e.children)}}}]);