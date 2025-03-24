"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[13806],{50623:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>r,contentTitle:()=>t,default:()=>o,frontMatter:()=>c,metadata:()=>a,toc:()=>i});const a=JSON.parse('{"id":"graphql/types/objects/ranked-choice-user-constraint","title":"RankedChoiceUserConstraint","description":"A user-defined constraint on how many events the ranked choice algorithm should sign them up for.  This can be","source":"@site/docs/graphql/types/objects/ranked-choice-user-constraint.md","sourceDirName":"graphql/types/objects","slug":"/graphql/types/objects/ranked-choice-user-constraint","permalink":"/docs/graphql/types/objects/ranked-choice-user-constraint","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/ranked-choice-user-constraint.md","tags":[],"version":"current","frontMatter":{"id":"ranked-choice-user-constraint","title":"RankedChoiceUserConstraint"},"sidebar":"sidebar","previous":{"title":"RankedChoiceDecisionsPagination","permalink":"/docs/graphql/types/objects/ranked-choice-decisions-pagination"},"next":{"title":"RateEventPayload","permalink":"/docs/graphql/types/objects/rate-event-payload"}}');var d=n(58040),l=n(5365);const c={id:"ranked-choice-user-constraint",title:"RankedChoiceUserConstraint"},t=void 0,r={},i=[{value:"Fields",id:"fields",level:3},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">RankedChoiceUserConstraint</code>.<code class="gqlmd-mdx-entity-name">created_at</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Date!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"rankedchoiceuserconstraintcreated_atdate-non-null-scalar",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">RankedChoiceUserConstraint</code>.<code class="gqlmd-mdx-entity-name">finish</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Date</code></span> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"rankedchoiceuserconstraintfinishdate-scalar",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">RankedChoiceUserConstraint</code>.<code class="gqlmd-mdx-entity-name">id</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">ID!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"rankedchoiceuserconstraintidid-non-null-scalar",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">RankedChoiceUserConstraint</code>.<code class="gqlmd-mdx-entity-name">maximum_signups</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Int!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"rankedchoiceuserconstraintmaximum_signupsint-non-null-scalar",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">RankedChoiceUserConstraint</code>.<code class="gqlmd-mdx-entity-name">start</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Date</code></span> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"rankedchoiceuserconstraintstartdate-scalar",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">RankedChoiceUserConstraint</code>.<code class="gqlmd-mdx-entity-name">updated_at</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Date!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"rankedchoiceuserconstraintupdated_atdate-non-null-scalar",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">RankedChoiceUserConstraint</code>.<code class="gqlmd-mdx-entity-name">user_con_profile</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">UserConProfile!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">object</mark>',id:"rankedchoiceuserconstraintuser_con_profileuserconprofile-non-null-object",level:4},{value:"Member Of",id:"member-of",level:3}];function m(e){const s={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,l.R)(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(s.p,{children:"A user-defined constraint on how many events the ranked choice algorithm should sign them up for.  This can be\ntime-bounded, and a user can have as many or as few of these as they like."}),"\n",(0,d.jsx)(s.pre,{children:(0,d.jsx)(s.code,{className:"language-graphql",children:"type RankedChoiceUserConstraint {\n  created_at: Date!\n  finish: Date\n  id: ID!\n  maximum_signups: Int!\n  start: Date\n  updated_at: Date!\n  user_con_profile: UserConProfile!\n}\n"})}),"\n",(0,d.jsx)(s.h3,{id:"fields",children:"Fields"}),"\n",(0,d.jsxs)(s.h4,{id:"rankedchoiceuserconstraintcreated_atdate-non-null-scalar",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,d.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"RankedChoiceUserConstraint"}),".",(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"created_at"})]})}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/scalars/date",children:(0,d.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Date!"})})})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,d.jsx)(s.p,{children:"When this constraint was created."}),"\n",(0,d.jsxs)(s.h4,{id:"rankedchoiceuserconstraintfinishdate-scalar",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,d.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"RankedChoiceUserConstraint"}),".",(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"finish"})]})}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/scalars/date",children:(0,d.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Date"})})})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,d.jsx)(s.p,{children:"The time at which this constraint stops applying (non-inclusive).  If null, this constraint is unbounded on the\nfinish side."}),"\n",(0,d.jsxs)(s.h4,{id:"rankedchoiceuserconstraintidid-non-null-scalar",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,d.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"RankedChoiceUserConstraint"}),".",(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"id"})]})}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/scalars/id",children:(0,d.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"ID!"})})})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,d.jsx)(s.p,{children:"The ID of this constraint."}),"\n",(0,d.jsxs)(s.h4,{id:"rankedchoiceuserconstraintmaximum_signupsint-non-null-scalar",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,d.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"RankedChoiceUserConstraint"}),".",(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"maximum_signups"})]})}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/scalars/int",children:(0,d.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Int!"})})})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,d.jsx)(s.p,{children:"The maximum number of counted signups to be allowed in the timespan described by this constraint."}),"\n",(0,d.jsxs)(s.h4,{id:"rankedchoiceuserconstraintstartdate-scalar",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,d.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"RankedChoiceUserConstraint"}),".",(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"start"})]})}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/scalars/date",children:(0,d.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Date"})})})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,d.jsx)(s.p,{children:"The time at which this constraint starts applying (inclusive).  If null, this constraint is unbounded on the\nstart side."}),"\n",(0,d.jsxs)(s.h4,{id:"rankedchoiceuserconstraintupdated_atdate-non-null-scalar",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,d.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"RankedChoiceUserConstraint"}),".",(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"updated_at"})]})}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/scalars/date",children:(0,d.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Date!"})})})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,d.jsx)(s.p,{children:"The last time this constraint was modified."}),"\n",(0,d.jsxs)(s.h4,{id:"rankedchoiceuserconstraintuser_con_profileuserconprofile-non-null-object",children:[(0,d.jsx)(s.a,{href:"#",children:(0,d.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,d.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"RankedChoiceUserConstraint"}),".",(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"user_con_profile"})]})}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/user-con-profile",children:(0,d.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"UserConProfile!"})})})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]}),"\n",(0,d.jsx)(s.p,{children:"The user this constraint applies to."}),"\n",(0,d.jsx)(s.h3,{id:"member-of",children:"Member Of"}),"\n",(0,d.jsxs)(s.p,{children:[(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/create-ranked-choice-user-constraint-payload",children:(0,d.jsx)(s.code,{children:"CreateRankedChoiceUserConstraintPayload"})}),"  ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/delete-ranked-choice-user-constraint-payload",children:(0,d.jsx)(s.code,{children:"DeleteRankedChoiceUserConstraintPayload"})}),"  ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/update-ranked-choice-user-constraint-payload",children:(0,d.jsx)(s.code,{children:"UpdateRankedChoiceUserConstraintPayload"})}),"  ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(s.a,{href:"/docs/graphql/types/objects/user-con-profile",children:(0,d.jsx)(s.code,{children:"UserConProfile"})}),"  ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]})]})}function o(e={}){const{wrapper:s}={...(0,l.R)(),...e.components};return s?(0,d.jsx)(s,{...e,children:(0,d.jsx)(m,{...e})}):m(e)}},5365:(e,s,n)=>{n.d(s,{R:()=>c,x:()=>t});var a=n(62340);const d={},l=a.createContext(d);function c(e){const s=a.useContext(l);return a.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function t(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:c(e.components),a.createElement(l.Provider,{value:s},e.children)}}}]);