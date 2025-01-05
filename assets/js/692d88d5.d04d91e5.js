"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[86011],{4974:(e,s,a)=>{a.r(s),a.d(s,{Badge:()=>u,Bullet:()=>l,Details:()=>g,SpecifiedBy:()=>h,assets:()=>i,contentTitle:()=>o,default:()=>b,frontMatter:()=>c,metadata:()=>n,toc:()=>x});const n=JSON.parse('{"id":"graphql/types/objects/ranked-choice-user-constraint","title":"RankedChoiceUserConstraint","description":"A user-defined constraint on how many events the ranked choice algorithm should sign them up for.  This can be","source":"@site/docs/graphql/types/objects/ranked-choice-user-constraint.mdx","sourceDirName":"graphql/types/objects","slug":"/graphql/types/objects/ranked-choice-user-constraint","permalink":"/docs/graphql/types/objects/ranked-choice-user-constraint","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/ranked-choice-user-constraint.mdx","tags":[],"version":"current","frontMatter":{"id":"ranked-choice-user-constraint","title":"RankedChoiceUserConstraint"},"sidebar":"sidebar","previous":{"title":"RankedChoiceDecisionsPagination","permalink":"/docs/graphql/types/objects/ranked-choice-decisions-pagination"},"next":{"title":"RateEventPayload","permalink":"/docs/graphql/types/objects/rate-event-payload"}}');var t=a(58040),d=a(5365),r=a(62340);const c={id:"ranked-choice-user-constraint",title:"RankedChoiceUserConstraint"},o=void 0,i={},l=()=>{const e={span:"span",...(0,d.R)()};return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},h=e=>{const s={a:"a",...(0,d.R)()};return(0,t.jsxs)(t.Fragment,{children:["Specification",(0,t.jsx)(s.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const s={span:"span",...(0,d.R)()};return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(s.span,{className:e.class,children:e.text})})},g=({dataOpen:e,dataClose:s,children:a,startOpen:n=!1})=>{const c={details:"details",summary:"summary",...(0,d.R)()},[o,i]=(0,r.useState)(n);return(0,t.jsxs)(c.details,{...o?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,t.jsx)(c.summary,{onClick:e=>{e.preventDefault(),i((e=>!e))},style:{listStyle:"none"},children:o?e:s}),o&&a]})},x=[{value:"Fields",id:"fields",level:3},{value:'<code>RankedChoiceUserConstraint.<b>created_at</b></code><Bullet></Bullet><code>Date!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoiceuserconstraintcreated_atdate--",level:4},{value:'<code>RankedChoiceUserConstraint.<b>finish</b></code><Bullet></Bullet><code>Date</code> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoiceuserconstraintfinishdate-",level:4},{value:'<code>RankedChoiceUserConstraint.<b>id</b></code><Bullet></Bullet><code>ID!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoiceuserconstraintidid--",level:4},{value:'<code>RankedChoiceUserConstraint.<b>maximum_signups</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoiceuserconstraintmaximum_signupsint--",level:4},{value:'<code>RankedChoiceUserConstraint.<b>start</b></code><Bullet></Bullet><code>Date</code> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoiceuserconstraintstartdate-",level:4},{value:'<code>RankedChoiceUserConstraint.<b>updated_at</b></code><Bullet></Bullet><code>Date!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoiceuserconstraintupdated_atdate--",level:4},{value:'<code>RankedChoiceUserConstraint.<b>user_con_profile</b></code><Bullet></Bullet><code>UserConProfile!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoiceuserconstraintuser_con_profileuserconprofile--",level:4},{value:"Member Of",id:"member-of",level:3}];function p(e){const s={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,d.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.p,{children:"A user-defined constraint on how many events the ranked choice algorithm should sign them up for.  This can be\ntime-bounded, and a user can have as many or as few of these as they like."}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-graphql",children:"type RankedChoiceUserConstraint {\n  created_at: Date!\n  finish: Date\n  id: ID!\n  maximum_signups: Int!\n  start: Date\n  updated_at: Date!\n  user_con_profile: UserConProfile!\n}\n"})}),"\n",(0,t.jsx)(s.h3,{id:"fields",children:"Fields"}),"\n",(0,t.jsxs)(s.h4,{id:"rankedchoiceuserconstraintcreated_atdate--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceUserConstraint.",(0,t.jsx)("b",{children:"created_at"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/scalars/date",children:(0,t.jsx)(s.code,{children:"Date!"})})," ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsx)(s.p,{children:"When this constraint was created."}),"\n",(0,t.jsxs)(s.h4,{id:"rankedchoiceuserconstraintfinishdate-",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceUserConstraint.",(0,t.jsx)("b",{children:"finish"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/scalars/date",children:(0,t.jsx)(s.code,{children:"Date"})})," ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsx)(s.p,{children:"The time at which this constraint stops applying (non-inclusive).  If null, this constraint is unbounded on the\nfinish side."}),"\n",(0,t.jsxs)(s.h4,{id:"rankedchoiceuserconstraintidid--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceUserConstraint.",(0,t.jsx)("b",{children:"id"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/scalars/id",children:(0,t.jsx)(s.code,{children:"ID!"})})," ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsx)(s.p,{children:"The ID of this constraint."}),"\n",(0,t.jsxs)(s.h4,{id:"rankedchoiceuserconstraintmaximum_signupsint--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceUserConstraint.",(0,t.jsx)("b",{children:"maximum_signups"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/scalars/int",children:(0,t.jsx)(s.code,{children:"Int!"})})," ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsx)(s.p,{children:"The maximum number of counted signups to be allowed in the timespan described by this constraint."}),"\n",(0,t.jsxs)(s.h4,{id:"rankedchoiceuserconstraintstartdate-",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceUserConstraint.",(0,t.jsx)("b",{children:"start"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/scalars/date",children:(0,t.jsx)(s.code,{children:"Date"})})," ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsx)(s.p,{children:"The time at which this constraint starts applying (inclusive).  If null, this constraint is unbounded on the\nstart side."}),"\n",(0,t.jsxs)(s.h4,{id:"rankedchoiceuserconstraintupdated_atdate--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceUserConstraint.",(0,t.jsx)("b",{children:"updated_at"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/scalars/date",children:(0,t.jsx)(s.code,{children:"Date!"})})," ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsx)(s.p,{children:"The last time this constraint was modified."}),"\n",(0,t.jsxs)(s.h4,{id:"rankedchoiceuserconstraintuser_con_profileuserconprofile--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceUserConstraint.",(0,t.jsx)("b",{children:"user_con_profile"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/user-con-profile",children:(0,t.jsx)(s.code,{children:"UserConProfile!"})})," ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,t.jsx)(s.p,{children:"The user this constraint applies to."}),"\n",(0,t.jsx)(s.h3,{id:"member-of",children:"Member Of"}),"\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/create-ranked-choice-user-constraint-payload",children:(0,t.jsx)(s.code,{children:"CreateRankedChoiceUserConstraintPayload"})}),"  ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"object"}),(0,t.jsx)(l,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/delete-ranked-choice-user-constraint-payload",children:(0,t.jsx)(s.code,{children:"DeleteRankedChoiceUserConstraintPayload"})}),"  ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"object"}),(0,t.jsx)(l,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/update-ranked-choice-user-constraint-payload",children:(0,t.jsx)(s.code,{children:"UpdateRankedChoiceUserConstraintPayload"})}),"  ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"object"}),(0,t.jsx)(l,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/user-con-profile",children:(0,t.jsx)(s.code,{children:"UserConProfile"})}),"  ",(0,t.jsx)(u,{class:"badge badge--secondary",text:"object"})]})]})}function b(e={}){const{wrapper:s}={...(0,d.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(p,{...e})}):p(e)}},5365:(e,s,a)=>{a.d(s,{R:()=>r,x:()=>c});var n=a(62340);const t={},d=n.createContext(t);function r(e){const s=n.useContext(d);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function c(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),n.createElement(d.Provider,{value:s},e.children)}}}]);