"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[34827],{39332:(e,n,t)=>{t.r(n),t.d(n,{Badge:()=>p,Bullet:()=>l,Details:()=>h,SpecifiedBy:()=>u,assets:()=>o,contentTitle:()=>c,default:()=>k,frontMatter:()=>s,metadata:()=>d,toc:()=>g});var i=t(58040),r=t(1422),a=t(62340);const s={id:"create-signup-ranked-choice-input",title:"CreateSignupRankedChoiceInput"},c=void 0,d={id:"graphql/types/inputs/create-signup-ranked-choice-input",title:"CreateSignupRankedChoiceInput",description:"Autogenerated input type of CreateSignupRankedChoice",source:"@site/docs/graphql/types/inputs/create-signup-ranked-choice-input.mdx",sourceDirName:"graphql/types/inputs",slug:"/graphql/types/inputs/create-signup-ranked-choice-input",permalink:"/docs/graphql/types/inputs/create-signup-ranked-choice-input",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/inputs/create-signup-ranked-choice-input.mdx",tags:[],version:"current",frontMatter:{id:"create-signup-ranked-choice-input",title:"CreateSignupRankedChoiceInput"},sidebar:"sidebar",previous:{title:"CreateRunInput",permalink:"/docs/graphql/types/inputs/create-run-input"},next:{title:"CreateSignupRequestInput",permalink:"/docs/graphql/types/inputs/create-signup-request-input"}},o={},l=()=>{const e={span:"span",...(0,r.R)()};return(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},u=e=>{const n={a:"a",...(0,r.R)()};return(0,i.jsxs)(i.Fragment,{children:["Specification",(0,i.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const n={span:"span",...(0,r.R)()};return(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(n.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:n,children:t,startOpen:s=!1})=>{const c={details:"details",summary:"summary",...(0,r.R)()},[d,o]=(0,a.useState)(s);return(0,i.jsxs)(c.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,i.jsx)(c.summary,{onClick:e=>{e.preventDefault(),o((e=>!e))},style:{listStyle:"none"},children:d?e:n}),d&&t]})},g=[{value:"Fields",id:"fields",level:3},{value:'<code>CreateSignupRankedChoiceInput.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"createsignuprankedchoiceinputclientmutationidstring-",level:4},{value:'<code>CreateSignupRankedChoiceInput.<b>requested_bucket_key</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"createsignuprankedchoiceinputrequested_bucket_keystring-",level:4},{value:'<code>CreateSignupRankedChoiceInput.<b>targetRunId</b></code><Bullet></Bullet><code>ID</code> <Badge class="badge badge--secondary"></Badge>',id:"createsignuprankedchoiceinputtargetrunidid-",level:4},{value:"Member Of",id:"member-of",level:3}];function x(e){const n={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"Autogenerated input type of CreateSignupRankedChoice"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-graphql",children:"input CreateSignupRankedChoiceInput {\n  clientMutationId: String\n  requested_bucket_key: String\n  targetRunId: ID\n}\n"})}),"\n",(0,i.jsx)(n.h3,{id:"fields",children:"Fields"}),"\n",(0,i.jsxs)(n.h4,{id:"createsignuprankedchoiceinputclientmutationidstring-",children:[(0,i.jsx)(n.a,{href:"#",children:(0,i.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateSignupRankedChoiceInput.",(0,i.jsx)("b",{children:"clientMutationId"})]})}),(0,i.jsx)(l,{}),(0,i.jsx)(n.a,{href:"/docs/graphql/types/scalars/string",children:(0,i.jsx)(n.code,{children:"String"})})," ",(0,i.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"A unique identifier for the client performing the mutation."}),"\n"]}),"\n",(0,i.jsxs)(n.h4,{id:"createsignuprankedchoiceinputrequested_bucket_keystring-",children:[(0,i.jsx)(n.a,{href:"#",children:(0,i.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateSignupRankedChoiceInput.",(0,i.jsx)("b",{children:"requested_bucket_key"})]})}),(0,i.jsx)(l,{}),(0,i.jsx)(n.a,{href:"/docs/graphql/types/scalars/string",children:(0,i.jsx)(n.code,{children:"String"})})," ",(0,i.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"The bucket key to queue a signup ranked choice in, or null to queue a no-preference choice"}),"\n"]}),"\n",(0,i.jsxs)(n.h4,{id:"createsignuprankedchoiceinputtargetrunidid-",children:[(0,i.jsx)(n.a,{href:"#",children:(0,i.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateSignupRankedChoiceInput.",(0,i.jsx)("b",{children:"targetRunId"})]})}),(0,i.jsx)(l,{}),(0,i.jsx)(n.a,{href:"/docs/graphql/types/scalars/id",children:(0,i.jsx)(n.code,{children:"ID"})})," ",(0,i.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"The ID of the run to queue a signup ranked choice for"}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"member-of",children:"Member Of"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"/docs/graphql/api/mutations/create-signup-ranked-choice",children:(0,i.jsx)(n.code,{children:"createSignupRankedChoice"})}),"  ",(0,i.jsx)(p,{class:"badge badge--secondary",text:"mutation"})]})]})}function k(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(x,{...e})}):x(e)}},1422:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>c});var i=t(62340);const r={},a=i.createContext(r);function s(e){const n=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),i.createElement(a.Provider,{value:n},e.children)}}}]);