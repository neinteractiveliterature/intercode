"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[76698],{50383:(e,t,s)=>{s.r(t),s.d(t,{Badge:()=>p,Bullet:()=>c,Details:()=>u,SpecifiedBy:()=>f,assets:()=>r,contentTitle:()=>d,default:()=>g,frontMatter:()=>l,metadata:()=>a,toc:()=>h});const a=JSON.parse('{"id":"graphql/types/objects/delete-staff-position-payload","title":"DeleteStaffPositionPayload","description":"Autogenerated return type of DeleteStaffPosition.","source":"@site/docs/graphql/types/objects/delete-staff-position-payload.mdx","sourceDirName":"graphql/types/objects","slug":"/graphql/types/objects/delete-staff-position-payload","permalink":"/docs/graphql/types/objects/delete-staff-position-payload","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/delete-staff-position-payload.mdx","tags":[],"version":"current","frontMatter":{"id":"delete-staff-position-payload","title":"DeleteStaffPositionPayload"},"sidebar":"sidebar","previous":{"title":"DeleteSignupRoundPayload","permalink":"/docs/graphql/types/objects/delete-signup-round-payload"},"next":{"title":"DeleteTeamMemberPayload","permalink":"/docs/graphql/types/objects/delete-team-member-payload"}}');var n=s(58040),o=s(5365),i=s(62340);const l={id:"delete-staff-position-payload",title:"DeleteStaffPositionPayload"},d=void 0,r={},c=()=>{const e={span:"span",...(0,o.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},f=e=>{const t={a:"a",...(0,o.R)()};return(0,n.jsxs)(n.Fragment,{children:["Specification",(0,n.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const t={span:"span",...(0,o.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(t.span,{className:e.class,children:e.text})})},u=({dataOpen:e,dataClose:t,children:s,startOpen:a=!1})=>{const l={details:"details",summary:"summary",...(0,o.R)()},[d,r]=(0,i.useState)(a);return(0,n.jsxs)(l.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,n.jsx)(l.summary,{onClick:e=>{e.preventDefault(),r((e=>!e))},style:{listStyle:"none"},children:d?e:t}),d&&s]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>DeleteStaffPositionPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"deletestaffpositionpayloadclientmutationidstring-",level:4},{value:'<code>DeleteStaffPositionPayload.<b>staff_position</b></code><Bullet></Bullet><code>StaffPosition!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"deletestaffpositionpayloadstaff_positionstaffposition--",level:4},{value:"Returned By",id:"returned-by",level:3}];function y(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.p,{children:"Autogenerated return type of DeleteStaffPosition."}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-graphql",children:"type DeleteStaffPositionPayload {\n  clientMutationId: String\n  staff_position: StaffPosition!\n}\n"})}),"\n",(0,n.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,n.jsxs)(t.h4,{id:"deletestaffpositionpayloadclientmutationidstring-",children:[(0,n.jsx)(t.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["DeleteStaffPositionPayload.",(0,n.jsx)("b",{children:"clientMutationId"})]})}),(0,n.jsx)(c,{}),(0,n.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,n.jsx)(t.code,{children:"String"})})," ",(0,n.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,n.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n",(0,n.jsxs)(t.h4,{id:"deletestaffpositionpayloadstaff_positionstaffposition--",children:[(0,n.jsx)(t.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["DeleteStaffPositionPayload.",(0,n.jsx)("b",{children:"staff_position"})]})}),(0,n.jsx)(c,{}),(0,n.jsx)(t.a,{href:"/docs/graphql/types/objects/staff-position",children:(0,n.jsx)(t.code,{children:"StaffPosition!"})})," ",(0,n.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,n.jsx)(p,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,n.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.a,{href:"/docs/graphql/api/mutations/delete-staff-position",children:(0,n.jsx)(t.code,{children:"deleteStaffPosition"})}),"  ",(0,n.jsx)(p,{class:"badge badge--secondary",text:"mutation"})]})]})}function g(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(y,{...e})}):y(e)}},5365:(e,t,s)=>{s.d(t,{R:()=>i,x:()=>l});var a=s(62340);const n={},o=a.createContext(n);function i(e){const t=a.useContext(o);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:i(e.components),a.createElement(o.Provider,{value:t},e.children)}}}]);