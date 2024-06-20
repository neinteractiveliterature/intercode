"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[86842],{74622:(e,n,t)=>{t.r(n),t.d(n,{Badge:()=>u,Bullet:()=>l,Details:()=>p,SpecifiedBy:()=>h,assets:()=>o,contentTitle:()=>c,default:()=>g,frontMatter:()=>r,metadata:()=>d,toc:()=>m});var s=t(58040),i=t(1422),a=t(62340);const r={id:"ranked-choice-user-constraint-input",title:"RankedChoiceUserConstraintInput"},c=void 0,d={id:"graphql/types/inputs/ranked-choice-user-constraint-input",title:"RankedChoiceUserConstraintInput",description:"A user-defined constraint on how many events the ranked choice algorithm should sign them up for.  This can be",source:"@site/docs/graphql/types/inputs/ranked-choice-user-constraint-input.mdx",sourceDirName:"graphql/types/inputs",slug:"/graphql/types/inputs/ranked-choice-user-constraint-input",permalink:"/docs/graphql/types/inputs/ranked-choice-user-constraint-input",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/inputs/ranked-choice-user-constraint-input.mdx",tags:[],version:"current",frontMatter:{id:"ranked-choice-user-constraint-input",title:"RankedChoiceUserConstraintInput"},sidebar:"sidebar",previous:{title:"RankedChoiceDecisionFiltersInput",permalink:"/docs/graphql/types/inputs/ranked-choice-decision-filters-input"},next:{title:"RateEventInput",permalink:"/docs/graphql/types/inputs/rate-event-input"}},o={},l=()=>{const e={span:"span",...(0,i.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},h=e=>{const n={a:"a",...(0,i.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const n={span:"span",...(0,i.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(n.span,{className:e.class,children:e.text})})},p=({dataOpen:e,dataClose:n,children:t,startOpen:r=!1})=>{const c={details:"details",summary:"summary",...(0,i.R)()},[d,o]=(0,a.useState)(r);return(0,s.jsxs)(c.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(c.summary,{onClick:e=>{e.preventDefault(),o((e=>!e))},style:{listStyle:"none"},children:d?e:n}),d&&t]})},m=[{value:"Fields",id:"fields",level:3},{value:'<code>RankedChoiceUserConstraintInput.<b>finish</b></code><Bullet></Bullet><code>Date</code> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoiceuserconstraintinputfinishdate-",level:4},{value:'<code>RankedChoiceUserConstraintInput.<b>maximumSignups</b></code><Bullet></Bullet><code>Int</code> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoiceuserconstraintinputmaximumsignupsint-",level:4},{value:'<code>RankedChoiceUserConstraintInput.<b>start</b></code><Bullet></Bullet><code>Date</code> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoiceuserconstraintinputstartdate-",level:4},{value:"Member Of",id:"member-of",level:3}];function x(e){const n={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"A user-defined constraint on how many events the ranked choice algorithm should sign them up for.  This can be\ntime-bounded, and a user can have as many or as few of these as they like."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-graphql",children:"input RankedChoiceUserConstraintInput {\n  finish: Date\n  maximumSignups: Int\n  start: Date\n}\n"})}),"\n",(0,s.jsx)(n.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(n.h4,{id:"rankedchoiceuserconstraintinputfinishdate-",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceUserConstraintInput.",(0,s.jsx)("b",{children:"finish"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/date",children:(0,s.jsx)(n.code,{children:"Date"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsx)(n.p,{children:"The time at which this constraint stops applying (non-inclusive).  If null, this constraint is unbounded on the\nfinish side."}),"\n"]}),"\n",(0,s.jsxs)(n.h4,{id:"rankedchoiceuserconstraintinputmaximumsignupsint-",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceUserConstraintInput.",(0,s.jsx)("b",{children:"maximumSignups"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(n.code,{children:"Int"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsx)(n.p,{children:"The maximum number of counted signups to be allowed in the timespan described by this constraint."}),"\n"]}),"\n",(0,s.jsxs)(n.h4,{id:"rankedchoiceuserconstraintinputstartdate-",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceUserConstraintInput.",(0,s.jsx)("b",{children:"start"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/date",children:(0,s.jsx)(n.code,{children:"Date"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsx)(n.p,{children:"The time at which this constraint starts applying (inclusive).  If null, this constraint is unbounded on the\nstart side."}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"/docs/graphql/types/inputs/create-ranked-choice-user-constraint-input",children:(0,s.jsx)(n.code,{children:"CreateRankedChoiceUserConstraintInput"})}),"  ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"input"}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/inputs/update-ranked-choice-user-constraint-input",children:(0,s.jsx)(n.code,{children:"UpdateRankedChoiceUserConstraintInput"})}),"  ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"input"})]})]})}function g(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(x,{...e})}):x(e)}},1422:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>c});var s=t(62340);const i={},a=s.createContext(i);function r(e){const n=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),s.createElement(a.Provider,{value:n},e.children)}}}]);