"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[11215],{50378:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>p,Bullet:()=>o,Details:()=>h,SpecifiedBy:()=>u,assets:()=>c,contentTitle:()=>d,default:()=>g,frontMatter:()=>l,metadata:()=>i,toc:()=>y});var n=a(58040),r=a(1422),s=a(62340);const l={id:"create-multiple-runs-payload",title:"CreateMultipleRunsPayload"},d=void 0,i={id:"graphql/types/objects/create-multiple-runs-payload",title:"CreateMultipleRunsPayload",description:"Autogenerated return type of CreateMultipleRuns.",source:"@site/docs/graphql/types/objects/create-multiple-runs-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/create-multiple-runs-payload",permalink:"/docs/graphql/types/objects/create-multiple-runs-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/create-multiple-runs-payload.mdx",tags:[],version:"current",frontMatter:{id:"create-multiple-runs-payload",title:"CreateMultipleRunsPayload"},sidebar:"sidebar",previous:{title:"CreateMaximumEventProvidedTicketsOverridePayload",permalink:"/docs/graphql/types/objects/create-maximum-event-provided-tickets-override-payload"},next:{title:"CreateMySignupPayload",permalink:"/docs/graphql/types/objects/create-my-signup-payload"}},c={},o=()=>{const e={span:"span",...(0,r.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},u=e=>{const t={a:"a",...(0,r.R)()};return(0,n.jsxs)(n.Fragment,{children:["Specification",(0,n.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const t={span:"span",...(0,r.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(t.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:t,children:a,startOpen:l=!1})=>{const d={details:"details",summary:"summary",...(0,r.R)()},[i,c]=(0,s.useState)(l);return(0,n.jsxs)(d.details,{...i?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,n.jsx)(d.summary,{onClick:e=>{e.preventDefault(),c((e=>!e))},style:{listStyle:"none"},children:i?e:t}),i&&a]})},y=[{value:"Fields",id:"fields",level:3},{value:'<code>CreateMultipleRunsPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"createmultiplerunspayloadclientmutationidstring-",level:4},{value:'<code>CreateMultipleRunsPayload.<b>runs</b></code><Bullet></Bullet><code>[Run!]!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"createmultiplerunspayloadrunsrun--",level:4},{value:"Returned By",id:"returned-by",level:3}];function m(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.p,{children:"Autogenerated return type of CreateMultipleRuns."}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-graphql",children:"type CreateMultipleRunsPayload {\n  clientMutationId: String\n  runs: [Run!]!\n}\n"})}),"\n",(0,n.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,n.jsxs)(t.h4,{id:"createmultiplerunspayloadclientmutationidstring-",children:[(0,n.jsx)(t.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateMultipleRunsPayload.",(0,n.jsx)("b",{children:"clientMutationId"})]})}),(0,n.jsx)(o,{}),(0,n.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,n.jsx)(t.code,{children:"String"})})," ",(0,n.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,n.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,n.jsxs)(t.h4,{id:"createmultiplerunspayloadrunsrun--",children:[(0,n.jsx)(t.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateMultipleRunsPayload.",(0,n.jsx)("b",{children:"runs"})]})}),(0,n.jsx)(o,{}),(0,n.jsx)(t.a,{href:"/docs/graphql/types/objects/run",children:(0,n.jsx)(t.code,{children:"[Run!]!"})})," ",(0,n.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,n.jsx)(p,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,n.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.a,{href:"/docs/graphql/api/mutations/create-multiple-runs",children:(0,n.jsx)(t.code,{children:"createMultipleRuns"})}),"  ",(0,n.jsx)(p,{class:"badge badge--secondary",text:"mutation"})]})]})}function g(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(m,{...e})}):m(e)}},1422:(e,t,a)=>{a.d(t,{R:()=>l,x:()=>d});var n=a(62340);const r={},s=n.createContext(r);function l(e){const t=n.useContext(s);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:l(e.components),n.createElement(s.Provider,{value:t},e.children)}}}]);