"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[71378],{8075:(e,s,n)=>{n.r(s),n.d(s,{Badge:()=>g,Bullet:()=>l,Details:()=>u,SpecifiedBy:()=>h,assets:()=>o,contentTitle:()=>r,default:()=>x,frontMatter:()=>i,metadata:()=>t,toc:()=>p});var d=n(58040),c=n(1422),a=n(62340);const i={id:"signup-ranked-choice",title:"SignupRankedChoice"},r=void 0,t={id:"graphql/types/objects/signup-ranked-choice",title:"SignupRankedChoice",description:"In a ranked-choice signup convention, SignupRankedChoices are the items in a user's signup queue.  Users may have",source:"@site/docs/graphql/types/objects/signup-ranked-choice.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/signup-ranked-choice",permalink:"/docs/graphql/types/objects/signup-ranked-choice",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/signup-ranked-choice.mdx",tags:[],version:"current",frontMatter:{id:"signup-ranked-choice",title:"SignupRankedChoice"},sidebar:"sidebar",previous:{title:"SignupMoveResult",permalink:"/docs/graphql/types/objects/signup-move-result"},next:{title:"SignupRequest",permalink:"/docs/graphql/types/objects/signup-request"}},o={},l=()=>{const e={span:"span",...(0,c.R)()};return(0,d.jsx)(d.Fragment,{children:(0,d.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},h=e=>{const s={a:"a",...(0,c.R)()};return(0,d.jsxs)(d.Fragment,{children:["Specification",(0,d.jsx)(s.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},g=e=>{const s={span:"span",...(0,c.R)()};return(0,d.jsx)(d.Fragment,{children:(0,d.jsx)(s.span,{className:e.class,children:e.text})})},u=({dataOpen:e,dataClose:s,children:n,startOpen:i=!1})=>{const r={details:"details",summary:"summary",...(0,c.R)()},[t,o]=(0,a.useState)(i);return(0,d.jsxs)(r.details,{...t?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,d.jsx)(r.summary,{onClick:e=>{e.preventDefault(),o((e=>!e))},style:{listStyle:"none"},children:t?e:s}),t&&n]})},p=[{value:"Fields",id:"fields",level:3},{value:'<code>SignupRankedChoice.<b>created_at</b></code><Bullet></Bullet><code>Date!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuprankedchoicecreated_atdate--",level:4},{value:'<code>SignupRankedChoice.<b>id</b></code><Bullet></Bullet><code>ID!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuprankedchoiceidid--",level:4},{value:'<code>SignupRankedChoice.<b>priority</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuprankedchoicepriorityint--",level:4},{value:'<code>SignupRankedChoice.<b>requested_bucket_key</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"signuprankedchoicerequested_bucket_keystring-",level:4},{value:'<code>SignupRankedChoice.<b>result_signup</b></code><Bullet></Bullet><code>Signup</code> <Badge class="badge badge--secondary"></Badge>',id:"signuprankedchoiceresult_signupsignup-",level:4},{value:'<code>SignupRankedChoice.<b>result_signup_request</b></code><Bullet></Bullet><code>SignupRequest</code> <Badge class="badge badge--secondary"></Badge>',id:"signuprankedchoiceresult_signup_requestsignuprequest-",level:4},{value:'<code>SignupRankedChoice.<b>state</b></code><Bullet></Bullet><code>SignupRankedChoiceState!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuprankedchoicestatesignuprankedchoicestate--",level:4},{value:'<code>SignupRankedChoice.<b>target_run</b></code><Bullet></Bullet><code>Run!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuprankedchoicetarget_runrun--",level:4},{value:'<code>SignupRankedChoice.<b>updated_at</b></code><Bullet></Bullet><code>Date!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuprankedchoiceupdated_atdate--",level:4},{value:'<code>SignupRankedChoice.<b>updated_by</b></code><Bullet></Bullet><code>User!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuprankedchoiceupdated_byuser--",level:4},{value:'<code>SignupRankedChoice.<b>user_con_profile</b></code><Bullet></Bullet><code>UserConProfile!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuprankedchoiceuser_con_profileuserconprofile--",level:4},{value:"Member Of",id:"member-of",level:3}];function b(e){const s={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,c.R)(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(s.p,{children:"In a ranked-choice signup convention, SignupRankedChoices are the items in a user's signup queue.  Users may have\nas many of these as they like.  When SignupRounds open, Intercode will automatically attempt to sign users up for\nthe number of events they're allowed at this time based on their SignupRankedChoices."}),"\n",(0,d.jsx)(s.pre,{children:(0,d.jsx)(s.code,{className:"language-graphql",children:"type SignupRankedChoice {\n  created_at: Date!\n  id: ID!\n  priority: Int!\n  requested_bucket_key: String\n  result_signup: Signup\n  result_signup_request: SignupRequest\n  state: SignupRankedChoiceState!\n  target_run: Run!\n  updated_at: Date!\n  updated_by: User!\n  user_con_profile: UserConProfile!\n}\n"})}),"\n",(0,d.jsx)(s.h3,{id:"fields",children:"Fields"}),"\n",(0,d.jsxs)(s.h4,{id:"signuprankedchoicecreated_atdate--",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRankedChoice.",(0,d.jsx)("b",{children:"created_at"})]})}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/scalars/date",children:(0,d.jsx)(s.code,{children:"Date!"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,d.jsxs)(s.blockquote,{children:["\n",(0,d.jsx)(s.p,{children:"The time this choice was added to the user's queue"}),"\n"]}),"\n",(0,d.jsxs)(s.h4,{id:"signuprankedchoiceidid--",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRankedChoice.",(0,d.jsx)("b",{children:"id"})]})}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/scalars/id",children:(0,d.jsx)(s.code,{children:"ID!"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,d.jsxs)(s.blockquote,{children:["\n",(0,d.jsx)(s.p,{children:"The ID of this SignupRankedChoice"}),"\n"]}),"\n",(0,d.jsxs)(s.h4,{id:"signuprankedchoicepriorityint--",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRankedChoice.",(0,d.jsx)("b",{children:"priority"})]})}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/scalars/int",children:(0,d.jsx)(s.code,{children:"Int!"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,d.jsxs)(s.blockquote,{children:["\n",(0,d.jsx)(s.p,{children:"The priority of this choice (lower numbers are higher priority)"}),"\n"]}),"\n",(0,d.jsxs)(s.h4,{id:"signuprankedchoicerequested_bucket_keystring-",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRankedChoice.",(0,d.jsx)("b",{children:"requested_bucket_key"})]})}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/scalars/string",children:(0,d.jsx)(s.code,{children:"String"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,d.jsxs)(s.blockquote,{children:["\n",(0,d.jsx)(s.p,{children:"The bucket that this choice is trying to sign up in (or null, if it's a no-preference signup)"}),"\n"]}),"\n",(0,d.jsxs)(s.h4,{id:"signuprankedchoiceresult_signupsignup-",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRankedChoice.",(0,d.jsx)("b",{children:"result_signup"})]})}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/signup",children:(0,d.jsx)(s.code,{children:"Signup"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,d.jsxs)(s.blockquote,{children:["\n",(0,d.jsx)(s.p,{children:"The resulting Signup from processing this choice, if it has been processed"}),"\n"]}),"\n",(0,d.jsxs)(s.h4,{id:"signuprankedchoiceresult_signup_requestsignuprequest-",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRankedChoice.",(0,d.jsx)("b",{children:"result_signup_request"})]})}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/signup-request",children:(0,d.jsx)(s.code,{children:"SignupRequest"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,d.jsxs)(s.blockquote,{children:["\n",(0,d.jsx)(s.p,{children:"The resulting SignupRequest from processing this choice, if it has been processed (and is in a moderated-signup\nconvention)"}),"\n"]}),"\n",(0,d.jsxs)(s.h4,{id:"signuprankedchoicestatesignuprankedchoicestate--",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRankedChoice.",(0,d.jsx)("b",{children:"state"})]})}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/enums/signup-ranked-choice-state",children:(0,d.jsx)(s.code,{children:"SignupRankedChoiceState!"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"enum"})]}),"\n",(0,d.jsxs)(s.blockquote,{children:["\n",(0,d.jsx)(s.p,{children:"The current processing state of this choice (e.g. pending, accepted)"}),"\n"]}),"\n",(0,d.jsxs)(s.h4,{id:"signuprankedchoicetarget_runrun--",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRankedChoice.",(0,d.jsx)("b",{children:"target_run"})]})}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/run",children:(0,d.jsx)(s.code,{children:"Run!"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,d.jsxs)(s.blockquote,{children:["\n",(0,d.jsx)(s.p,{children:"The event run that this choice is trying to sign up for"}),"\n"]}),"\n",(0,d.jsxs)(s.h4,{id:"signuprankedchoiceupdated_atdate--",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRankedChoice.",(0,d.jsx)("b",{children:"updated_at"})]})}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/scalars/date",children:(0,d.jsx)(s.code,{children:"Date!"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,d.jsxs)(s.blockquote,{children:["\n",(0,d.jsx)(s.p,{children:"The last time this choice was modified"}),"\n"]}),"\n",(0,d.jsxs)(s.h4,{id:"signuprankedchoiceupdated_byuser--",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRankedChoice.",(0,d.jsx)("b",{children:"updated_by"})]})}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/user",children:(0,d.jsx)(s.code,{children:"User!"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,d.jsxs)(s.blockquote,{children:["\n",(0,d.jsx)(s.p,{children:"The user who last updated this choice"}),"\n"]}),"\n",(0,d.jsxs)(s.h4,{id:"signuprankedchoiceuser_con_profileuserconprofile--",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRankedChoice.",(0,d.jsx)("b",{children:"user_con_profile"})]})}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/user-con-profile",children:(0,d.jsx)(s.code,{children:"UserConProfile!"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,d.jsxs)(s.blockquote,{children:["\n",(0,d.jsx)(s.p,{children:"The user whose queue this choice is part of"}),"\n"]}),"\n",(0,d.jsx)(s.h3,{id:"member-of",children:"Member Of"}),"\n",(0,d.jsxs)(s.p,{children:[(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/convention",children:(0,d.jsx)(s.code,{children:"Convention"})}),"  ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/create-signup-ranked-choice-payload",children:(0,d.jsx)(s.code,{children:"CreateSignupRankedChoicePayload"})}),"  ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/delete-signup-ranked-choice-payload",children:(0,d.jsx)(s.code,{children:"DeleteSignupRankedChoicePayload"})}),"  ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/ranked-choice-decision",children:(0,d.jsx)(s.code,{children:"RankedChoiceDecision"})}),"  ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/run",children:(0,d.jsx)(s.code,{children:"Run"})}),"  ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/update-signup-ranked-choice-priority-payload",children:(0,d.jsx)(s.code,{children:"UpdateSignupRankedChoicePriorityPayload"})}),"  ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,d.jsx)(l,{}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/user-con-profile",children:(0,d.jsx)(s.code,{children:"UserConProfile"})}),"  ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"})]})]})}function x(e={}){const{wrapper:s}={...(0,c.R)(),...e.components};return s?(0,d.jsx)(s,{...e,children:(0,d.jsx)(b,{...e})}):b(e)}},1422:(e,s,n)=>{n.d(s,{R:()=>i,x:()=>r});var d=n(62340);const c={},a=d.createContext(c);function i(e){const s=d.useContext(a);return d.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function r(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:i(e.components),d.createElement(a.Provider,{value:s},e.children)}}}]);