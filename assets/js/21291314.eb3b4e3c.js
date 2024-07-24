"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[33380],{72780:(e,a,t)=>{t.r(a),t.d(a,{Badge:()=>p,Bullet:()=>c,Details:()=>u,SpecifiedBy:()=>m,assets:()=>i,contentTitle:()=>l,default:()=>y,frontMatter:()=>s,metadata:()=>o,toc:()=>b});var r=t(58040),d=t(1422),n=t(62340);const s={id:"update-team-member-payload",title:"UpdateTeamMemberPayload"},l=void 0,o={id:"graphql/types/objects/update-team-member-payload",title:"UpdateTeamMemberPayload",description:"Autogenerated return type of UpdateTeamMember.",source:"@site/docs/graphql/types/objects/update-team-member-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/update-team-member-payload",permalink:"/docs/graphql/types/objects/update-team-member-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/update-team-member-payload.mdx",tags:[],version:"current",frontMatter:{id:"update-team-member-payload",title:"UpdateTeamMemberPayload"},sidebar:"sidebar",previous:{title:"UpdateStaffPositionPermissionsPayload",permalink:"/docs/graphql/types/objects/update-staff-position-permissions-payload"},next:{title:"UpdateTicketPayload",permalink:"/docs/graphql/types/objects/update-ticket-payload"}},i={},c=()=>{const e={span:"span",...(0,d.R)()};return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},m=e=>{const a={a:"a",...(0,d.R)()};return(0,r.jsxs)(r.Fragment,{children:["Specification",(0,r.jsx)(a.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const a={span:"span",...(0,d.R)()};return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(a.span,{className:e.class,children:e.text})})},u=({dataOpen:e,dataClose:a,children:t,startOpen:s=!1})=>{const l={details:"details",summary:"summary",...(0,d.R)()},[o,i]=(0,n.useState)(s);return(0,r.jsxs)(l.details,{...o?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,r.jsx)(l.summary,{onClick:e=>{e.preventDefault(),i((e=>!e))},style:{listStyle:"none"},children:o?e:a}),o&&t]})},b=[{value:"Fields",id:"fields",level:3},{value:'<code>UpdateTeamMemberPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"updateteammemberpayloadclientmutationidstring-",level:4},{value:'<code>UpdateTeamMemberPayload.<b>team_member</b></code><Bullet></Bullet><code>TeamMember!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"updateteammemberpayloadteam_memberteammember--",level:4},{value:"Returned By",id:"returned-by",level:3}];function h(e){const a={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,d.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(a.p,{children:"Autogenerated return type of UpdateTeamMember."}),"\n",(0,r.jsx)(a.pre,{children:(0,r.jsx)(a.code,{className:"language-graphql",children:"type UpdateTeamMemberPayload {\n  clientMutationId: String\n  team_member: TeamMember!\n}\n"})}),"\n",(0,r.jsx)(a.h3,{id:"fields",children:"Fields"}),"\n",(0,r.jsxs)(a.h4,{id:"updateteammemberpayloadclientmutationidstring-",children:[(0,r.jsx)(a.a,{href:"#",children:(0,r.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateTeamMemberPayload.",(0,r.jsx)("b",{children:"clientMutationId"})]})}),(0,r.jsx)(c,{}),(0,r.jsx)(a.a,{href:"/docs/graphql/types/scalars/string",children:(0,r.jsx)(a.code,{children:"String"})})," ",(0,r.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,r.jsx)(a.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,r.jsxs)(a.h4,{id:"updateteammemberpayloadteam_memberteammember--",children:[(0,r.jsx)(a.a,{href:"#",children:(0,r.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateTeamMemberPayload.",(0,r.jsx)("b",{children:"team_member"})]})}),(0,r.jsx)(c,{}),(0,r.jsx)(a.a,{href:"/docs/graphql/types/objects/team-member",children:(0,r.jsx)(a.code,{children:"TeamMember!"})})," ",(0,r.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,r.jsx)(p,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,r.jsx)(a.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,r.jsxs)(a.p,{children:[(0,r.jsx)(a.a,{href:"/docs/graphql/api/mutations/update-team-member",children:(0,r.jsx)(a.code,{children:"updateTeamMember"})}),"  ",(0,r.jsx)(p,{class:"badge badge--secondary",text:"mutation"})]})]})}function y(e={}){const{wrapper:a}={...(0,d.R)(),...e.components};return a?(0,r.jsx)(a,{...e,children:(0,r.jsx)(h,{...e})}):h(e)}},1422:(e,a,t)=>{t.d(a,{R:()=>s,x:()=>l});var r=t(62340);const d={},n=r.createContext(d);function s(e){const a=r.useContext(n);return r.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function l(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:s(e.components),r.createElement(n.Provider,{value:a},e.children)}}}]);