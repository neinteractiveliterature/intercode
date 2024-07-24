"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[31250],{43783:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>o,Bullet:()=>c,Details:()=>h,SpecifiedBy:()=>p,assets:()=>d,contentTitle:()=>a,default:()=>x,frontMatter:()=>l,metadata:()=>u,toc:()=>m});var s=n(58040),r=n(1422),i=n(62340);const l={id:"create-multiple-runs-input",title:"CreateMultipleRunsInput"},a=void 0,u={id:"graphql/types/inputs/create-multiple-runs-input",title:"CreateMultipleRunsInput",description:"Autogenerated input type of CreateMultipleRuns",source:"@site/docs/graphql/types/inputs/create-multiple-runs-input.mdx",sourceDirName:"graphql/types/inputs",slug:"/graphql/types/inputs/create-multiple-runs-input",permalink:"/docs/graphql/types/inputs/create-multiple-runs-input",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/inputs/create-multiple-runs-input.mdx",tags:[],version:"current",frontMatter:{id:"create-multiple-runs-input",title:"CreateMultipleRunsInput"},sidebar:"sidebar",previous:{title:"CreateMaximumEventProvidedTicketsOverrideInput",permalink:"/docs/graphql/types/inputs/create-maximum-event-provided-tickets-override-input"},next:{title:"CreateMySignupInput",permalink:"/docs/graphql/types/inputs/create-my-signup-input"}},d={},c=()=>{const e={span:"span",...(0,r.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,r.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},o=e=>{const t={span:"span",...(0,r.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(t.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:t,children:n,startOpen:l=!1})=>{const a={details:"details",summary:"summary",...(0,r.R)()},[u,d]=(0,i.useState)(l);return(0,s.jsxs)(a.details,{...u?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(a.summary,{onClick:e=>{e.preventDefault(),d((e=>!e))},style:{listStyle:"none"},children:u?e:t}),u&&n]})},m=[{value:"Fields",id:"fields",level:3},{value:'<code>CreateMultipleRunsInput.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"createmultiplerunsinputclientmutationidstring-",level:4},{value:'<code>CreateMultipleRunsInput.<b>eventId</b></code><Bullet></Bullet><code>ID</code> <Badge class="badge badge--secondary"></Badge>',id:"createmultiplerunsinputeventidid-",level:4},{value:'<code>CreateMultipleRunsInput.<b>runs</b></code><Bullet></Bullet><code>[RunInput!]!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"createmultiplerunsinputrunsruninput--",level:4},{value:"Member Of",id:"member-of",level:3}];function g(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"Autogenerated input type of CreateMultipleRuns"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-graphql",children:"input CreateMultipleRunsInput {\n  clientMutationId: String\n  eventId: ID\n  runs: [RunInput!]!\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(t.h4,{id:"createmultiplerunsinputclientmutationidstring-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateMultipleRunsInput.",(0,s.jsx)("b",{children:"clientMutationId"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(t.code,{children:"String"})})," ",(0,s.jsx)(o,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,s.jsxs)(t.h4,{id:"createmultiplerunsinputeventidid-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateMultipleRunsInput.",(0,s.jsx)("b",{children:"eventId"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/id",children:(0,s.jsx)(t.code,{children:"ID"})})," ",(0,s.jsx)(o,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(t.h4,{id:"createmultiplerunsinputrunsruninput--",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateMultipleRunsInput.",(0,s.jsx)("b",{children:"runs"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/inputs/run-input",children:(0,s.jsx)(t.code,{children:"[RunInput!]!"})})," ",(0,s.jsx)(o,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(o,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,s.jsx)(t.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"/docs/graphql/api/mutations/create-multiple-runs",children:(0,s.jsx)(t.code,{children:"createMultipleRuns"})}),"  ",(0,s.jsx)(o,{class:"badge badge--secondary",text:"mutation"})]})]})}function x(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(g,{...e})}):g(e)}},1422:(e,t,n)=>{n.d(t,{R:()=>l,x:()=>a});var s=n(62340);const r={},i=s.createContext(r);function l(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:l(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);