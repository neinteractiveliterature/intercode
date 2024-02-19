"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[33345],{18887:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>p,Bullet:()=>l,SpecifiedBy:()=>o,assets:()=>d,contentTitle:()=>c,default:()=>g,frontMatter:()=>i,metadata:()=>a,toc:()=>u});var s=n(35091),r=n(1422);const i={id:"signup-request-state",title:"SignupRequestState",hide_table_of_contents:!1},c=void 0,a={id:"graphql/enums/signup-request-state",title:"SignupRequestState",description:"No description",source:"@site/docs/graphql/enums/signup-request-state.mdx",sourceDirName:"graphql/enums",slug:"/graphql/enums/signup-request-state",permalink:"/docs/graphql/enums/signup-request-state",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/enums/signup-request-state.mdx",tags:[],version:"current",frontMatter:{id:"signup-request-state",title:"SignupRequestState",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"SignupMode",permalink:"/docs/graphql/enums/signup-mode"},next:{title:"SignupState",permalink:"/docs/graphql/enums/signup-state"}},d={},u=[{value:"Values",id:"values",level:3},{value:"<code>SignupRequestState.<b>accepted</b></code>",id:"signuprequeststateaccepted",level:4},{value:"<code>SignupRequestState.<b>pending</b></code>",id:"signuprequeststatepending",level:4},{value:"<code>SignupRequestState.<b>rejected</b></code>",id:"signuprequeststaterejected",level:4},{value:"<code>SignupRequestState.<b>withdrawn</b></code>",id:"signuprequeststatewithdrawn",level:4},{value:"Member of",id:"member-of",level:3}],l=()=>{const e={span:"span",...(0,r.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},o=e=>{const t={a:"a",...(0,r.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const t={span:"span",...(0,r.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(t.span,{class:"badge badge--"+e.class,children:e.text})})};function h(e){const t={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:"No description"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-graphql",children:"enum SignupRequestState {\n  accepted\n  pending\n  rejected\n  withdrawn\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"values",children:"Values"}),"\n",(0,s.jsx)(t.h4,{id:"signuprequeststateaccepted",children:(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRequestState.",(0,s.jsx)("b",{children:"accepted"})]})})}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsx)(t.p,{children:"The request has been accepted and the requester has been signed up (see the result_signup field for the actual signup)"}),"\n"]}),"\n",(0,s.jsx)(t.h4,{id:"signuprequeststatepending",children:(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRequestState.",(0,s.jsx)("b",{children:"pending"})]})})}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsx)(t.p,{children:"The request has not yet been reviewed by a moderator"}),"\n"]}),"\n",(0,s.jsx)(t.h4,{id:"signuprequeststaterejected",children:(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRequestState.",(0,s.jsx)("b",{children:"rejected"})]})})}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsx)(t.p,{children:"The request has been rejected and the requester has not been signed up"}),"\n"]}),"\n",(0,s.jsx)(t.h4,{id:"signuprequeststatewithdrawn",children:(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRequestState.",(0,s.jsx)("b",{children:"withdrawn"})]})})}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsx)(t.p,{children:"The requester withdrew their request before it was accepted or rejected"}),"\n"]}),"\n",(0,s.jsx)(t.h3,{id:"member-of",children:"Member of"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"/docs/graphql/objects/signup-request",children:(0,s.jsx)(t.code,{children:"SignupRequest"})}),"  ",(0,s.jsx)(p,{class:"secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/inputs/signup-request-filters-input",children:(0,s.jsx)(t.code,{children:"SignupRequestFiltersInput"})}),"  ",(0,s.jsx)(p,{class:"secondary",text:"input"})]})]})}function g(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},1422:(e,t,n)=>{n.d(t,{R:()=>c,x:()=>a});var s=n(7731);const r={},i=s.createContext(r);function c(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:c(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);