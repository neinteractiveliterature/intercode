"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[42606],{16568:(e,n,i)=>{i.r(n),i.d(n,{Badge:()=>u,Bullet:()=>l,Details:()=>p,SpecifiedBy:()=>h,assets:()=>d,contentTitle:()=>t,default:()=>x,frontMatter:()=>r,metadata:()=>c,toc:()=>m});const c=JSON.parse('{"id":"graphql/types/enums/ranked-choice-decision-value","title":"RankedChoiceDecisionValue","description":"The decision the ranked choice automation algorithm made when evaluating a particular choice.","source":"@site/docs/graphql/types/enums/ranked-choice-decision-value.mdx","sourceDirName":"graphql/types/enums","slug":"/graphql/types/enums/ranked-choice-decision-value","permalink":"/docs/graphql/types/enums/ranked-choice-decision-value","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/enums/ranked-choice-decision-value.mdx","tags":[],"version":"current","frontMatter":{"id":"ranked-choice-decision-value","title":"RankedChoiceDecisionValue"},"sidebar":"sidebar","previous":{"title":"RankedChoiceDecisionReason","permalink":"/docs/graphql/types/enums/ranked-choice-decision-reason"},"next":{"title":"RankedChoiceOrder","permalink":"/docs/graphql/types/enums/ranked-choice-order"}}');var s=i(58040),a=i(5365),o=i(62340);const r={id:"ranked-choice-decision-value",title:"RankedChoiceDecisionValue"},t=void 0,d={},l=()=>{const e={span:"span",...(0,a.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},h=e=>{const n={a:"a",...(0,a.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const n={span:"span",...(0,a.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(n.span,{className:e.class,children:e.text})})},p=({dataOpen:e,dataClose:n,children:i,startOpen:c=!1})=>{const r={details:"details",summary:"summary",...(0,a.R)()},[t,d]=(0,o.useState)(c);return(0,s.jsxs)(r.details,{...t?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(r.summary,{onClick:e=>{e.preventDefault(),d((e=>!e))},style:{listStyle:"none"},children:t?e:n}),t&&i]})},m=[{value:"Values",id:"values",level:3},{value:"<code>RankedChoiceDecisionValue.<b>SIGNUP</b></code>",id:"rankedchoicedecisionvaluesignup",level:4},{value:"<code>RankedChoiceDecisionValue.<b>SKIP_CHOICE</b></code>",id:"rankedchoicedecisionvalueskip_choice",level:4},{value:"<code>RankedChoiceDecisionValue.<b>SKIP_USER</b></code>",id:"rankedchoicedecisionvalueskip_user",level:4},{value:"<code>RankedChoiceDecisionValue.<b>WAITLIST</b></code>",id:"rankedchoicedecisionvaluewaitlist",level:4},{value:"Member Of",id:"member-of",level:3}];function k(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"The decision the ranked choice automation algorithm made when evaluating a particular choice."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-graphql",children:"enum RankedChoiceDecisionValue {\n  SIGNUP\n  SKIP_CHOICE\n  SKIP_USER\n  WAITLIST\n}\n"})}),"\n",(0,s.jsx)(n.h3,{id:"values",children:"Values"}),"\n",(0,s.jsx)(n.h4,{id:"rankedchoicedecisionvaluesignup",children:(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecisionValue.",(0,s.jsx)("b",{children:"SIGNUP"})]})})}),"\n",(0,s.jsx)(n.p,{children:"Sign the user up for the chosen event"}),"\n",(0,s.jsx)(n.h4,{id:"rankedchoicedecisionvalueskip_choice",children:(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecisionValue.",(0,s.jsx)("b",{children:"SKIP_CHOICE"})]})})}),"\n",(0,s.jsx)(n.p,{children:"Skip this choice but continue evaluating this user's ranked choices"}),"\n",(0,s.jsx)(n.h4,{id:"rankedchoicedecisionvalueskip_user",children:(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecisionValue.",(0,s.jsx)("b",{children:"SKIP_USER"})]})})}),"\n",(0,s.jsx)(n.p,{children:"Skip all remaining choices for this user"}),"\n",(0,s.jsx)(n.h4,{id:"rankedchoicedecisionvaluewaitlist",children:(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecisionValue.",(0,s.jsx)("b",{children:"WAITLIST"})]})})}),"\n",(0,s.jsx)(n.p,{children:"Sign the user up in the waitlist for the chosen event"}),"\n",(0,s.jsx)(n.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"/docs/graphql/types/objects/ranked-choice-decision",children:(0,s.jsx)(n.code,{children:"RankedChoiceDecision"})}),"  ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/inputs/ranked-choice-decision-filters-input",children:(0,s.jsx)(n.code,{children:"RankedChoiceDecisionFiltersInput"})}),"  ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"input"})]})]})}function x(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(k,{...e})}):k(e)}},5365:(e,n,i)=>{i.d(n,{R:()=>o,x:()=>r});var c=i(62340);const s={},a=c.createContext(s);function o(e){const n=c.useContext(a);return c.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),c.createElement(a.Provider,{value:n},e.children)}}}]);