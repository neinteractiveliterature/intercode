"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[96464],{29458:(e,t,o)=>{o.r(t),o.d(t,{Badge:()=>m,Bullet:()=>i,Details:()=>u,SpecifiedBy:()=>p,assets:()=>c,contentTitle:()=>d,default:()=>g,frontMatter:()=>s,metadata:()=>l,toc:()=>h});var a=o(58040),r=o(1422),n=o(62340);const s={id:"create-room-payload",title:"CreateRoomPayload"},d=void 0,l={id:"graphql/types/objects/create-room-payload",title:"CreateRoomPayload",description:"Autogenerated return type of CreateRoom.",source:"@site/docs/graphql/types/objects/create-room-payload.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/create-room-payload",permalink:"/docs/graphql/types/objects/create-room-payload",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/create-room-payload.mdx",tags:[],version:"current",frontMatter:{id:"create-room-payload",title:"CreateRoomPayload"},sidebar:"sidebar",previous:{title:"CreateRankedChoiceUserConstraintPayload",permalink:"/docs/graphql/types/objects/create-ranked-choice-user-constraint-payload"},next:{title:"CreateRunPayload",permalink:"/docs/graphql/types/objects/create-run-payload"}},c={},i=()=>{const e={span:"span",...(0,r.R)()};return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,r.R)()};return(0,a.jsxs)(a.Fragment,{children:["Specification",(0,a.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},m=e=>{const t={span:"span",...(0,r.R)()};return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(t.span,{className:e.class,children:e.text})})},u=({dataOpen:e,dataClose:t,children:o,startOpen:s=!1})=>{const d={details:"details",summary:"summary",...(0,r.R)()},[l,c]=(0,n.useState)(s);return(0,a.jsxs)(d.details,{...l?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,a.jsx)(d.summary,{onClick:e=>{e.preventDefault(),c((e=>!e))},style:{listStyle:"none"},children:l?e:t}),l&&o]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>CreateRoomPayload.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"createroompayloadclientmutationidstring-",level:4},{value:'<code>CreateRoomPayload.<b>room</b></code><Bullet></Bullet><code>Room!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"createroompayloadroomroom--",level:4},{value:"Returned By",id:"returned-by",level:3}];function y(e){const t={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.p,{children:"Autogenerated return type of CreateRoom."}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-graphql",children:"type CreateRoomPayload {\n  clientMutationId: String\n  room: Room!\n}\n"})}),"\n",(0,a.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,a.jsxs)(t.h4,{id:"createroompayloadclientmutationidstring-",children:[(0,a.jsx)(t.a,{href:"#",children:(0,a.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateRoomPayload.",(0,a.jsx)("b",{children:"clientMutationId"})]})}),(0,a.jsx)(i,{}),(0,a.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,a.jsx)(t.code,{children:"String"})})," ",(0,a.jsx)(m,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,a.jsxs)(t.blockquote,{children:["\n",(0,a.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n"]}),"\n",(0,a.jsxs)(t.h4,{id:"createroompayloadroomroom--",children:[(0,a.jsx)(t.a,{href:"#",children:(0,a.jsxs)("code",{style:{fontWeight:"normal"},children:["CreateRoomPayload.",(0,a.jsx)("b",{children:"room"})]})}),(0,a.jsx)(i,{}),(0,a.jsx)(t.a,{href:"/docs/graphql/types/objects/room",children:(0,a.jsx)(t.code,{children:"Room!"})})," ",(0,a.jsx)(m,{class:"badge badge--secondary",text:"non-null"})," ",(0,a.jsx)(m,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,a.jsx)(t.blockquote,{children:"\n"}),"\n",(0,a.jsx)(t.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.a,{href:"/docs/graphql/api/mutations/create-room",children:(0,a.jsx)(t.code,{children:"createRoom"})}),"  ",(0,a.jsx)(m,{class:"badge badge--secondary",text:"mutation"})]})]})}function g(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(y,{...e})}):y(e)}},1422:(e,t,o)=>{o.d(t,{R:()=>s,x:()=>d});var a=o(62340);const r={},n=a.createContext(r);function s(e){const t=a.useContext(n);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),a.createElement(n.Provider,{value:t},e.children)}}}]);