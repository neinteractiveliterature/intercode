"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[89682],{72799:(e,n,i)=>{i.r(n),i.d(n,{Badge:()=>u,Bullet:()=>l,Details:()=>p,SpecifiedBy:()=>h,assets:()=>t,contentTitle:()=>d,default:()=>k,frontMatter:()=>r,metadata:()=>s,toc:()=>m});const s=JSON.parse('{"id":"graphql/types/enums/ranked-choice-decision-reason","title":"RankedChoiceDecisionReason","description":"The reason the ranked choice automation algorithm made the decision it did when evaluating a particular choice.","source":"@site/docs/graphql/types/enums/ranked-choice-decision-reason.mdx","sourceDirName":"graphql/types/enums","slug":"/graphql/types/enums/ranked-choice-decision-reason","permalink":"/docs/graphql/types/enums/ranked-choice-decision-reason","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/enums/ranked-choice-decision-reason.mdx","tags":[],"version":"current","frontMatter":{"id":"ranked-choice-decision-reason","title":"RankedChoiceDecisionReason"},"sidebar":"sidebar","previous":{"title":"PricingStrategy","permalink":"/docs/graphql/types/enums/pricing-strategy"},"next":{"title":"RankedChoiceDecisionValue","permalink":"/docs/graphql/types/enums/ranked-choice-decision-value"}}');var c=i(58040),o=i(5365),a=i(62340);const r={id:"ranked-choice-decision-reason",title:"RankedChoiceDecisionReason"},d=void 0,t={},l=()=>{const e={span:"span",...(0,o.R)()};return(0,c.jsx)(c.Fragment,{children:(0,c.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},h=e=>{const n={a:"a",...(0,o.R)()};return(0,c.jsxs)(c.Fragment,{children:["Specification",(0,c.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const n={span:"span",...(0,o.R)()};return(0,c.jsx)(c.Fragment,{children:(0,c.jsx)(n.span,{className:e.class,children:e.text})})},p=({dataOpen:e,dataClose:n,children:i,startOpen:s=!1})=>{const r={details:"details",summary:"summary",...(0,o.R)()},[d,t]=(0,a.useState)(s);return(0,c.jsxs)(r.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,c.jsx)(r.summary,{onClick:e=>{e.preventDefault(),t((e=>!e))},style:{listStyle:"none"},children:d?e:n}),d&&i]})},m=[{value:"Values",id:"values",level:3},{value:"<code>RankedChoiceDecisionReason.<b>CONFLICT</b></code>",id:"rankedchoicedecisionreasonconflict",level:4},{value:"<code>RankedChoiceDecisionReason.<b>FULL</b></code>",id:"rankedchoicedecisionreasonfull",level:4},{value:"<code>RankedChoiceDecisionReason.<b>MISSING_TICKET</b></code>",id:"rankedchoicedecisionreasonmissing_ticket",level:4},{value:"<code>RankedChoiceDecisionReason.<b>NO_MORE_SIGNUPS_ALLOWED</b></code>",id:"rankedchoicedecisionreasonno_more_signups_allowed",level:4},{value:"<code>RankedChoiceDecisionReason.<b>NO_PENDING_CHOICES</b></code>",id:"rankedchoicedecisionreasonno_pending_choices",level:4},{value:"<code>RankedChoiceDecisionReason.<b>RANKED_CHOICE_USER_CONSTRAINTS</b></code>",id:"rankedchoicedecisionreasonranked_choice_user_constraints",level:4},{value:"Member Of",id:"member-of",level:3}];function x(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n.p,{children:"The reason the ranked choice automation algorithm made the decision it did when evaluating a particular choice."}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-graphql",children:"enum RankedChoiceDecisionReason {\n  CONFLICT\n  FULL\n  MISSING_TICKET\n  NO_MORE_SIGNUPS_ALLOWED\n  NO_PENDING_CHOICES\n  RANKED_CHOICE_USER_CONSTRAINTS\n}\n"})}),"\n",(0,c.jsx)(n.h3,{id:"values",children:"Values"}),"\n",(0,c.jsx)(n.h4,{id:"rankedchoicedecisionreasonconflict",children:(0,c.jsx)(n.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecisionReason.",(0,c.jsx)("b",{children:"CONFLICT"})]})})}),"\n",(0,c.jsx)(n.p,{children:"This choice would conflict with an existing signup this user has"}),"\n",(0,c.jsx)(n.h4,{id:"rankedchoicedecisionreasonfull",children:(0,c.jsx)(n.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecisionReason.",(0,c.jsx)("b",{children:"FULL"})]})})}),"\n",(0,c.jsx)(n.p,{children:"This event is full"}),"\n",(0,c.jsx)(n.h4,{id:"rankedchoicedecisionreasonmissing_ticket",children:(0,c.jsx)(n.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecisionReason.",(0,c.jsx)("b",{children:"MISSING_TICKET"})]})})}),"\n",(0,c.jsx)(n.p,{children:"Tickets are required in this convention and this user doesn't have one"}),"\n",(0,c.jsx)(n.h4,{id:"rankedchoicedecisionreasonno_more_signups_allowed",children:(0,c.jsx)(n.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecisionReason.",(0,c.jsx)("b",{children:"NO_MORE_SIGNUPS_ALLOWED"})]})})}),"\n",(0,c.jsx)(n.p,{children:"This user already has the maximum number of allowed signups at this time"}),"\n",(0,c.jsx)(n.h4,{id:"rankedchoicedecisionreasonno_pending_choices",children:(0,c.jsx)(n.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecisionReason.",(0,c.jsx)("b",{children:"NO_PENDING_CHOICES"})]})})}),"\n",(0,c.jsx)(n.p,{children:"This user has no more pending ranked choices in their queue"}),"\n",(0,c.jsx)(n.h4,{id:"rankedchoicedecisionreasonranked_choice_user_constraints",children:(0,c.jsx)(n.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecisionReason.",(0,c.jsx)("b",{children:"RANKED_CHOICE_USER_CONSTRAINTS"})]})})}),"\n",(0,c.jsx)(n.p,{children:"The user's personal constraints prohibit signing up for this event (in conjunction with their existing signups)"}),"\n",(0,c.jsx)(n.h3,{id:"member-of",children:"Member Of"}),"\n",(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.a,{href:"/docs/graphql/types/objects/ranked-choice-decision",children:(0,c.jsx)(n.code,{children:"RankedChoiceDecision"})}),"  ",(0,c.jsx)(u,{class:"badge badge--secondary",text:"object"}),(0,c.jsx)(l,{}),(0,c.jsx)(n.a,{href:"/docs/graphql/types/inputs/ranked-choice-decision-filters-input",children:(0,c.jsx)(n.code,{children:"RankedChoiceDecisionFiltersInput"})}),"  ",(0,c.jsx)(u,{class:"badge badge--secondary",text:"input"})]})]})}function k(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,c.jsx)(n,{...e,children:(0,c.jsx)(x,{...e})}):x(e)}},5365:(e,n,i)=>{i.d(n,{R:()=>a,x:()=>r});var s=i(62340);const c={},o=s.createContext(c);function a(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:a(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);