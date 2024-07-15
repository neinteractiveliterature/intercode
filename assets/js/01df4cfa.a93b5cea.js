"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[12316],{95513:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>p,Bullet:()=>c,Details:()=>u,SpecifiedBy:()=>f,assets:()=>l,contentTitle:()=>r,default:()=>g,frontMatter:()=>i,metadata:()=>d,toc:()=>h});var s=a(58040),o=a(1422),n=a(62340);const i={id:"create-staff-position-payload",title:"CreateStaffPositionPayload"},r=void 0,d={id:"graphql/types/objects/create-staff-position-payload",title:"CreateStaffPositionPayload",description:"Autogenerated return type of CreateStaffPosition.",source:"@site/docs/graphql/types/objects/create-staff-position-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/create-staff-position-payload",permalink:"/docs/graphql/types/objects/create-staff-position-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/create-staff-position-payload.mdx",tags:[],version:"current",frontMatter:{id:"create-staff-position-payload",title:"CreateStaffPositionPayload"},sidebar:"sidebar",previous:{title:"CreateSignupRoundPayload",permalink:"/docs/graphql/types/objects/create-signup-round-payload"},next:{title:"CreateTeamMemberPayload",permalink:"/docs/graphql/types/objects/create-team-member-payload"}},l={},c=()=>{const e={span:"span",...(0,o.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},f=e=>{const t={a:"a",...(0,o.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const t={span:"span",...(0,o.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(t.span,{className:e.class,children:e.text})})},u=({dataOpen:e,dataClose:t,children:a,startOpen:i=!1})=>{const r={details:"details",summary:"summary",...(0,o.R)()},[d,l]=(0,n.useState)(i);return(0,s.jsxs)(r.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(r.summary,{onClick:e=>{e.preventDefault(),l((e=>!e))},style:{listStyle:"none"},children:d?e:t}),d&&a]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>CreateStaffPositionPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"createstaffpositionpayloadclientmutationidstring-",level:4},{value:'<code>CreateStaffPositionPayload.<b>staff_position</b></code><Bullet></Bullet><code>StaffPosition!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"createstaffpositionpayloadstaff_positionstaffposition--",level:4},{value:"Returned By",id:"returned-by",level:3}];function y(e){const t={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"Autogenerated return type of CreateStaffPosition."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-graphql",children:"type CreateStaffPositionPayload {\n  clientMutationId: String\n  staff_position: StaffPosition!\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(t.h4,{id:"createstaffpositionpayloadclientmutationidstring-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateStaffPositionPayload.",(0,s.jsx)("b",{children:"clientMutationId"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(t.code,{children:"String"})})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n"]}),"\n",(0,s.jsxs)(t.h4,{id:"createstaffpositionpayloadstaff_positionstaffposition--",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateStaffPositionPayload.",(0,s.jsx)("b",{children:"staff_position"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/objects/staff-position",children:(0,s.jsx)(t.code,{children:"StaffPosition!"})})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsx)(t.blockquote,{children:"\n"}),"\n",(0,s.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"/docs/graphql/api/mutations/create-staff-position",children:(0,s.jsx)(t.code,{children:"createStaffPosition"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"mutation"})]})]})}function g(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(y,{...e})}):y(e)}},1422:(e,t,a)=>{a.d(t,{R:()=>i,x:()=>r});var s=a(62340);const o={},n=s.createContext(o);function i(e){const t=s.useContext(n);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),s.createElement(n.Provider,{value:t},e.children)}}}]);