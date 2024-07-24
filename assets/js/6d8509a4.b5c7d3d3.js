"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[59778],{95309:(e,n,s)=>{s.r(n),s.d(n,{Badge:()=>g,Bullet:()=>t,Details:()=>u,SpecifiedBy:()=>h,assets:()=>l,contentTitle:()=>o,default:()=>j,frontMatter:()=>a,metadata:()=>r,toc:()=>p});var d=s(58040),c=s(1422),i=s(62340);const a={id:"ranked-choice-decision",title:"RankedChoiceDecision"},o=void 0,r={id:"graphql/types/objects/ranked-choice-decision",title:"RankedChoiceDecision",description:"A record of a decision the ranked choice automation made while processing a signup round.",source:"@site/docs/graphql/types/objects/ranked-choice-decision.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/ranked-choice-decision",permalink:"/docs/graphql/types/objects/ranked-choice-decision",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/ranked-choice-decision.mdx",tags:[],version:"current",frontMatter:{id:"ranked-choice-decision",title:"RankedChoiceDecision"},sidebar:"sidebar",previous:{title:"ProvideEventTicketPayload",permalink:"/docs/graphql/types/objects/provide-event-ticket-payload"},next:{title:"RankedChoiceDecisionsPagination",permalink:"/docs/graphql/types/objects/ranked-choice-decisions-pagination"}},l={},t=()=>{const e={span:"span",...(0,c.R)()};return(0,d.jsx)(d.Fragment,{children:(0,d.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},h=e=>{const n={a:"a",...(0,c.R)()};return(0,d.jsxs)(d.Fragment,{children:["Specification",(0,d.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},g=e=>{const n={span:"span",...(0,c.R)()};return(0,d.jsx)(d.Fragment,{children:(0,d.jsx)(n.span,{className:e.class,children:e.text})})},u=({dataOpen:e,dataClose:n,children:s,startOpen:a=!1})=>{const o={details:"details",summary:"summary",...(0,c.R)()},[r,l]=(0,i.useState)(a);return(0,d.jsxs)(o.details,{...r?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,d.jsx)(o.summary,{onClick:e=>{e.preventDefault(),l((e=>!e))},style:{listStyle:"none"},children:r?e:n}),r&&s]})},p=[{value:"Fields",id:"fields",level:3},{value:'<code>RankedChoiceDecision.<b>created_at</b></code><Bullet></Bullet><code>Date!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisioncreated_atdate--",level:4},{value:'<code>RankedChoiceDecision.<b>decision</b></code><Bullet></Bullet><code>RankedChoiceDecisionValue!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisiondecisionrankedchoicedecisionvalue--",level:4},{value:'<code>RankedChoiceDecision.<b>extra</b></code><Bullet></Bullet><code>JSON</code> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisionextrajson-",level:4},{value:'<code>RankedChoiceDecision.<b>id</b></code><Bullet></Bullet><code>ID!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisionidid--",level:4},{value:'<code>RankedChoiceDecision.<b>reason</b></code><Bullet></Bullet><code>RankedChoiceDecisionReason</code> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisionreasonrankedchoicedecisionreason-",level:4},{value:'<code>RankedChoiceDecision.<b>signup</b></code><Bullet></Bullet><code>Signup</code> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisionsignupsignup-",level:4},{value:'<code>RankedChoiceDecision.<b>signup_ranked_choice</b></code><Bullet></Bullet><code>SignupRankedChoice</code> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisionsignup_ranked_choicesignuprankedchoice-",level:4},{value:'<code>RankedChoiceDecision.<b>signup_request</b></code><Bullet></Bullet><code>SignupRequest</code> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisionsignup_requestsignuprequest-",level:4},{value:'<code>RankedChoiceDecision.<b>signup_round</b></code><Bullet></Bullet><code>SignupRound!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisionsignup_roundsignupround--",level:4},{value:'<code>RankedChoiceDecision.<b>updated_at</b></code><Bullet></Bullet><code>Date!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisionupdated_atdate--",level:4},{value:'<code>RankedChoiceDecision.<b>user_con_profile</b></code><Bullet></Bullet><code>UserConProfile</code> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisionuser_con_profileuserconprofile-",level:4},{value:"Member Of",id:"member-of",level:3}];function x(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,c.R)(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(n.p,{children:"A record of a decision the ranked choice automation made while processing a signup round."}),"\n",(0,d.jsx)(n.pre,{children:(0,d.jsx)(n.code,{className:"language-graphql",children:"type RankedChoiceDecision {\n  created_at: Date!\n  decision: RankedChoiceDecisionValue!\n  extra: JSON\n  id: ID!\n  reason: RankedChoiceDecisionReason\n  signup: Signup\n  signup_ranked_choice: SignupRankedChoice\n  signup_request: SignupRequest\n  signup_round: SignupRound!\n  updated_at: Date!\n  user_con_profile: UserConProfile\n}\n"})}),"\n",(0,d.jsx)(n.h3,{id:"fields",children:"Fields"}),"\n",(0,d.jsxs)(n.h4,{id:"rankedchoicedecisioncreated_atdate--",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecision.",(0,d.jsx)("b",{children:"created_at"})]})}),(0,d.jsx)(t,{}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/scalars/date",children:(0,d.jsx)(n.code,{children:"Date!"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,d.jsx)(n.p,{children:"The time this RankedChoiceDecision was created."}),"\n",(0,d.jsxs)(n.h4,{id:"rankedchoicedecisiondecisionrankedchoicedecisionvalue--",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecision.",(0,d.jsx)("b",{children:"decision"})]})}),(0,d.jsx)(t,{}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/enums/ranked-choice-decision-value",children:(0,d.jsx)(n.code,{children:"RankedChoiceDecisionValue!"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"enum"})]}),"\n",(0,d.jsx)(n.p,{children:"The decision the algorithm made."}),"\n",(0,d.jsxs)(n.h4,{id:"rankedchoicedecisionextrajson-",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecision.",(0,d.jsx)("b",{children:"extra"})]})}),(0,d.jsx)(t,{}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/scalars/json",children:(0,d.jsx)(n.code,{children:"JSON"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,d.jsx)(n.p,{children:"Any additional data the algorithm attached to this decision record."}),"\n",(0,d.jsxs)(n.h4,{id:"rankedchoicedecisionidid--",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecision.",(0,d.jsx)("b",{children:"id"})]})}),(0,d.jsx)(t,{}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/scalars/id",children:(0,d.jsx)(n.code,{children:"ID!"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,d.jsx)(n.p,{children:"The ID of this decision record."}),"\n",(0,d.jsxs)(n.h4,{id:"rankedchoicedecisionreasonrankedchoicedecisionreason-",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecision.",(0,d.jsx)("b",{children:"reason"})]})}),(0,d.jsx)(t,{}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/enums/ranked-choice-decision-reason",children:(0,d.jsx)(n.code,{children:"RankedChoiceDecisionReason"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"enum"})]}),"\n",(0,d.jsx)(n.p,{children:"The reason for this decision, if any."}),"\n",(0,d.jsxs)(n.h4,{id:"rankedchoicedecisionsignupsignup-",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecision.",(0,d.jsx)("b",{children:"signup"})]})}),(0,d.jsx)(t,{}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/objects/signup",children:(0,d.jsx)(n.code,{children:"Signup"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,d.jsx)(n.p,{children:"The signup that resulted from this decision, if any."}),"\n",(0,d.jsxs)(n.h4,{id:"rankedchoicedecisionsignup_ranked_choicesignuprankedchoice-",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecision.",(0,d.jsx)("b",{children:"signup_ranked_choice"})]})}),(0,d.jsx)(t,{}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/objects/signup-ranked-choice",children:(0,d.jsx)(n.code,{children:"SignupRankedChoice"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,d.jsx)(n.p,{children:"The choice that was being processed when this decision was made, if any."}),"\n",(0,d.jsxs)(n.h4,{id:"rankedchoicedecisionsignup_requestsignuprequest-",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecision.",(0,d.jsx)("b",{children:"signup_request"})]})}),(0,d.jsx)(t,{}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/objects/signup-request",children:(0,d.jsx)(n.code,{children:"SignupRequest"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,d.jsx)(n.p,{children:"The signup request that resulted from this decision, if any."}),"\n",(0,d.jsxs)(n.h4,{id:"rankedchoicedecisionsignup_roundsignupround--",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecision.",(0,d.jsx)("b",{children:"signup_round"})]})}),(0,d.jsx)(t,{}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/objects/signup-round",children:(0,d.jsx)(n.code,{children:"SignupRound!"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,d.jsx)(n.p,{children:"The signup round in which this decision was made."}),"\n",(0,d.jsxs)(n.h4,{id:"rankedchoicedecisionupdated_atdate--",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecision.",(0,d.jsx)("b",{children:"updated_at"})]})}),(0,d.jsx)(t,{}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/scalars/date",children:(0,d.jsx)(n.code,{children:"Date!"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,d.jsx)(n.p,{children:"The time this RankedChoiceDecision was last modified."}),"\n",(0,d.jsxs)(n.h4,{id:"rankedchoicedecisionuser_con_profileuserconprofile-",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecision.",(0,d.jsx)("b",{children:"user_con_profile"})]})}),(0,d.jsx)(t,{}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/objects/user-con-profile",children:(0,d.jsx)(n.code,{children:"UserConProfile"})})," ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,d.jsx)(n.p,{children:"The user profile this decision pertains to, if any."}),"\n",(0,d.jsx)(n.h3,{id:"member-of",children:"Member Of"}),"\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.a,{href:"/docs/graphql/types/objects/ranked-choice-decisions-pagination",children:(0,d.jsx)(n.code,{children:"RankedChoiceDecisionsPagination"})}),"  ",(0,d.jsx)(g,{class:"badge badge--secondary",text:"object"})]})]})}function j(e={}){const{wrapper:n}={...(0,c.R)(),...e.components};return n?(0,d.jsx)(n,{...e,children:(0,d.jsx)(x,{...e})}):x(e)}},1422:(e,n,s)=>{s.d(n,{R:()=>a,x:()=>o});var d=s(62340);const c={},i=d.createContext(c);function a(e){const n=d.useContext(i);return d.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:a(e.components),d.createElement(i.Provider,{value:n},e.children)}}}]);