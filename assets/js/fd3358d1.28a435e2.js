"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[86197],{29058:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>p,Bullet:()=>i,Details:()=>b,SpecifiedBy:()=>m,assets:()=>c,contentTitle:()=>s,default:()=>y,frontMatter:()=>d,metadata:()=>o,toc:()=>u});var r=a(58040),l=a(1422),n=a(62340);const d={id:"delete-team-member-payload",title:"DeleteTeamMemberPayload"},s=void 0,o={id:"graphql/types/objects/delete-team-member-payload",title:"DeleteTeamMemberPayload",description:"Autogenerated return type of DeleteTeamMember.",source:"@site/docs/graphql/types/objects/delete-team-member-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/delete-team-member-payload",permalink:"/docs/graphql/types/objects/delete-team-member-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/delete-team-member-payload.mdx",tags:[],version:"current",frontMatter:{id:"delete-team-member-payload",title:"DeleteTeamMemberPayload"},sidebar:"sidebar",previous:{title:"DeleteStaffPositionPayload",permalink:"/docs/graphql/types/objects/delete-staff-position-payload"},next:{title:"DeleteTicketPayload",permalink:"/docs/graphql/types/objects/delete-ticket-payload"}},c={},i=()=>{const e={span:"span",...(0,l.R)()};return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},m=e=>{const t={a:"a",...(0,l.R)()};return(0,r.jsxs)(r.Fragment,{children:["Specification",(0,r.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const t={span:"span",...(0,l.R)()};return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(t.span,{className:e.class,children:e.text})})},b=({dataOpen:e,dataClose:t,children:a,startOpen:d=!1})=>{const s={details:"details",summary:"summary",...(0,l.R)()},[o,c]=(0,n.useState)(d);return(0,r.jsxs)(s.details,{...o?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,r.jsx)(s.summary,{onClick:e=>{e.preventDefault(),c((e=>!e))},style:{listStyle:"none"},children:o?e:t}),o&&a]})},u=[{value:"Fields",id:"fields",level:3},{value:'<code>DeleteTeamMemberPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"deleteteammemberpayloadclientmutationidstring-",level:4},{value:'<code>DeleteTeamMemberPayload.<b>team_member</b></code><Bullet></Bullet><code>TeamMember!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"deleteteammemberpayloadteam_memberteammember--",level:4},{value:"Returned By",id:"returned-by",level:3}];function h(e){const t={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,l.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.p,{children:"Autogenerated return type of DeleteTeamMember."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-graphql",children:"type DeleteTeamMemberPayload {\n  clientMutationId: String\n  team_member: TeamMember!\n}\n"})}),"\n",(0,r.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,r.jsxs)(t.h4,{id:"deleteteammemberpayloadclientmutationidstring-",children:[(0,r.jsx)(t.a,{href:"#",children:(0,r.jsxs)("code",{style:{fontWeight:"normal"},children:["DeleteTeamMemberPayload.",(0,r.jsx)("b",{children:"clientMutationId"})]})}),(0,r.jsx)(i,{}),(0,r.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,r.jsx)(t.code,{children:"String"})})," ",(0,r.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,r.jsxs)(t.blockquote,{children:["\n",(0,r.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n"]}),"\n",(0,r.jsxs)(t.h4,{id:"deleteteammemberpayloadteam_memberteammember--",children:[(0,r.jsx)(t.a,{href:"#",children:(0,r.jsxs)("code",{style:{fontWeight:"normal"},children:["DeleteTeamMemberPayload.",(0,r.jsx)("b",{children:"team_member"})]})}),(0,r.jsx)(i,{}),(0,r.jsx)(t.a,{href:"/docs/graphql/types/objects/team-member",children:(0,r.jsx)(t.code,{children:"TeamMember!"})})," ",(0,r.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,r.jsx)(p,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,r.jsx)(t.blockquote,{children:"\n"}),"\n",(0,r.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.a,{href:"/docs/graphql/api/mutations/delete-team-member",children:(0,r.jsx)(t.code,{children:"deleteTeamMember"})}),"  ",(0,r.jsx)(p,{class:"badge badge--secondary",text:"mutation"})]})]})}function y(e={}){const{wrapper:t}={...(0,l.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(h,{...e})}):h(e)}},1422:(e,t,a)=>{a.d(t,{R:()=>d,x:()=>s});var r=a(62340);const l={},n=r.createContext(l);function d(e){const t=r.useContext(n);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:d(e.components),r.createElement(n.Provider,{value:t},e.children)}}}]);