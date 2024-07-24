"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[6616],{87040:(e,n,d)=>{d.r(n),d.d(n,{Badge:()=>u,Bullet:()=>l,Details:()=>h,SpecifiedBy:()=>g,assets:()=>r,contentTitle:()=>t,default:()=>b,frontMatter:()=>c,metadata:()=>o,toc:()=>p});var s=d(58040),a=d(1422),i=d(62340);const c={id:"signup-round",title:"SignupRound"},t=void 0,o={id:"graphql/types/objects/signup-round",title:"SignupRound",description:"A round of signups in a particular convention.  This represents a range of time in which a certain number of",source:"@site/docs/graphql/types/objects/signup-round.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/signup-round",permalink:"/docs/graphql/types/objects/signup-round",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/signup-round.mdx",tags:[],version:"current",frontMatter:{id:"signup-round",title:"SignupRound"},sidebar:"sidebar",previous:{title:"SignupRequestsPagination",permalink:"/docs/graphql/types/objects/signup-requests-pagination"},next:{title:"Signup",permalink:"/docs/graphql/types/objects/signup"}},r={},l=()=>{const e={span:"span",...(0,a.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},g=e=>{const n={a:"a",...(0,a.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const n={span:"span",...(0,a.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(n.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:n,children:d,startOpen:c=!1})=>{const t={details:"details",summary:"summary",...(0,a.R)()},[o,r]=(0,i.useState)(c);return(0,s.jsxs)(t.details,{...o?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(t.summary,{onClick:e=>{e.preventDefault(),r((e=>!e))},style:{listStyle:"none"},children:o?e:n}),o&&d]})},p=[{value:"Fields",id:"fields",level:3},{value:'<code>SignupRound.<b>convention</b></code><Bullet></Bullet><code>Convention!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuproundconventionconvention--",level:4},{value:'<code>SignupRound.<b>created_at</b></code><Bullet></Bullet><code>Date!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuproundcreated_atdate--",level:4},{value:'<code>SignupRound.<b>executed_at</b></code><Bullet></Bullet><code>Date</code> <Badge class="badge badge--secondary"></Badge>',id:"signuproundexecuted_atdate-",level:4},{value:'<code>SignupRound.<b>id</b></code><Bullet></Bullet><code>ID!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuproundidid--",level:4},{value:'<code>SignupRound.<b>maximum_event_signups</b></code><Bullet></Bullet><code>String!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuproundmaximum_event_signupsstring--",level:4},{value:'<code>SignupRound.<b>ranked_choice_decisions_paginated</b></code><Bullet></Bullet><code>RankedChoiceDecisionsPagination!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuproundranked_choice_decisions_paginatedrankedchoicedecisionspagination--",level:4},{value:'<code>SignupRound.ranked_choice_decisions_paginated.<b>filters</b></code><Bullet></Bullet><code>RankedChoiceDecisionFiltersInput</code> <Badge class="badge badge--secondary"></Badge>',id:"signuproundranked_choice_decisions_paginatedfiltersrankedchoicedecisionfiltersinput-",level:5},{value:'<code>SignupRound.ranked_choice_decisions_paginated.<b>page</b></code><Bullet></Bullet><code>Int</code> <Badge class="badge badge--secondary"></Badge>',id:"signuproundranked_choice_decisions_paginatedpageint-",level:5},{value:'<code>SignupRound.ranked_choice_decisions_paginated.<b>per_page</b></code><Bullet></Bullet><code>Int</code> <Badge class="badge badge--secondary"></Badge>',id:"signuproundranked_choice_decisions_paginatedper_pageint-",level:5},{value:'<code>SignupRound.ranked_choice_decisions_paginated.<b>sort</b></code><Bullet></Bullet><code>[SortInput!]</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuproundranked_choice_decisions_paginatedsortsortinput--",level:5},{value:'<code>SignupRound.<b>ranked_choice_order</b></code><Bullet></Bullet><code>RankedChoiceOrder</code> <Badge class="badge badge--secondary"></Badge>',id:"signuproundranked_choice_orderrankedchoiceorder-",level:4},{value:'<code>SignupRound.<b>start</b></code><Bullet></Bullet><code>Date</code> <Badge class="badge badge--secondary"></Badge>',id:"signuproundstartdate-",level:4},{value:'<code>SignupRound.<b>updated_at</b></code><Bullet></Bullet><code>Date!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuproundupdated_atdate--",level:4},{value:"Member Of",id:"member-of",level:3}];function x(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",h5:"h5",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"A round of signups in a particular convention.  This represents a range of time in which a certain number of\nsignups is allowed."}),"\n",(0,s.jsx)(n.p,{children:"In conventions that use automated signups (e.g. ranked-choice signups), signup rounds are used as triggers for\nsignup automation."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-graphql",children:"type SignupRound {\n  convention: Convention!\n  created_at: Date!\n  executed_at: Date\n  id: ID!\n  maximum_event_signups: String!\n  ranked_choice_decisions_paginated(\n    filters: RankedChoiceDecisionFiltersInput\n    page: Int\n    per_page: Int\n    sort: [SortInput!]\n  ): RankedChoiceDecisionsPagination!\n  ranked_choice_order: RankedChoiceOrder\n  start: Date\n  updated_at: Date!\n}\n"})}),"\n",(0,s.jsx)(n.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(n.h4,{id:"signuproundconventionconvention--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRound.",(0,s.jsx)("b",{children:"convention"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/objects/convention",children:(0,s.jsx)(n.code,{children:"Convention!"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsx)(n.p,{children:"The convention this SignupRound is in."}),"\n",(0,s.jsxs)(n.h4,{id:"signuproundcreated_atdate--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRound.",(0,s.jsx)("b",{children:"created_at"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/date",children:(0,s.jsx)(n.code,{children:"Date!"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.p,{children:"When this SignupRound was first created."}),"\n",(0,s.jsxs)(n.h4,{id:"signuproundexecuted_atdate-",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRound.",(0,s.jsx)("b",{children:"executed_at"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/date",children:(0,s.jsx)(n.code,{children:"Date"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.p,{children:"In conventions that use automated signups, when this SignupRound was executed.  If it has not been executed yet,\nthis will be null."}),"\n",(0,s.jsxs)(n.h4,{id:"signuproundidid--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRound.",(0,s.jsx)("b",{children:"id"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/id",children:(0,s.jsx)(n.code,{children:"ID!"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.p,{children:"The ID of this SignupRound."}),"\n",(0,s.jsxs)(n.h4,{id:"signuproundmaximum_event_signupsstring--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRound.",(0,s.jsx)("b",{children:"maximum_event_signups"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(n.code,{children:"String!"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.p,{children:'Either "not_yet", "not_now", "unlimited", or a string representation of a number.  This is the maximum number of\nsignups allowed during this SignupRound.'}),"\n",(0,s.jsxs)(n.h4,{id:"signuproundranked_choice_decisions_paginatedrankedchoicedecisionspagination--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRound.",(0,s.jsx)("b",{children:"ranked_choice_decisions_paginated"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/objects/ranked-choice-decisions-pagination",children:(0,s.jsx)(n.code,{children:"RankedChoiceDecisionsPagination!"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsxs)(n.h5,{id:"signuproundranked_choice_decisions_paginatedfiltersrankedchoicedecisionfiltersinput-",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRound.ranked_choice_decisions_paginated.",(0,s.jsx)("b",{children:"filters"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/inputs/ranked-choice-decision-filters-input",children:(0,s.jsx)(n.code,{children:"RankedChoiceDecisionFiltersInput"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,s.jsx)(n.p,{children:"Filters to restrict what items will appear in the result set."}),"\n",(0,s.jsxs)(n.h5,{id:"signuproundranked_choice_decisions_paginatedpageint-",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRound.ranked_choice_decisions_paginated.",(0,s.jsx)("b",{children:"page"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(n.code,{children:"Int"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.p,{children:"The page number to return from the result set.  Page numbers start with 1."}),"\n",(0,s.jsxs)(n.h5,{id:"signuproundranked_choice_decisions_paginatedper_pageint-",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRound.ranked_choice_decisions_paginated.",(0,s.jsx)("b",{children:"per_page"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(n.code,{children:"Int"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.p,{children:"The number of items to return per page.  Defaults to 20, can go up to 200."}),"\n",(0,s.jsxs)(n.h5,{id:"signuproundranked_choice_decisions_paginatedsortsortinput--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRound.ranked_choice_decisions_paginated.",(0,s.jsx)("b",{children:"sort"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/inputs/sort-input",children:(0,s.jsx)(n.code,{children:"[SortInput!]"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"list"})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,s.jsx)(n.p,{children:"A set of fields to use for ordering the result set. The second field is used as a\ntiebreaker for the first, the third field is used as a tiebreaker for the first two,\nand so on. If the sort argument is missing or empty, the order of items will be left\nup to the database (and may be unpredictable)."}),"\n",(0,s.jsxs)(n.h4,{id:"signuproundranked_choice_orderrankedchoiceorder-",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRound.",(0,s.jsx)("b",{children:"ranked_choice_order"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/enums/ranked-choice-order",children:(0,s.jsx)(n.code,{children:"RankedChoiceOrder"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"enum"})]}),"\n",(0,s.jsx)(n.p,{children:"In ranked-choice signup conventions, the order to use for executing users' ranked choices in this round."}),"\n",(0,s.jsxs)(n.h4,{id:"signuproundstartdate-",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRound.",(0,s.jsx)("b",{children:"start"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/date",children:(0,s.jsx)(n.code,{children:"Date"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.p,{children:"When this SignupRound starts."}),"\n",(0,s.jsxs)(n.h4,{id:"signuproundupdated_atdate--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRound.",(0,s.jsx)("b",{children:"updated_at"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/date",children:(0,s.jsx)(n.code,{children:"Date!"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.p,{children:"When this SignupRound was last modified."}),"\n",(0,s.jsx)(n.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"/docs/graphql/types/objects/convention",children:(0,s.jsx)(n.code,{children:"Convention"})}),"  ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/objects/create-signup-round-payload",children:(0,s.jsx)(n.code,{children:"CreateSignupRoundPayload"})}),"  ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/objects/delete-signup-round-payload",children:(0,s.jsx)(n.code,{children:"DeleteSignupRoundPayload"})}),"  ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/objects/ranked-choice-decision",children:(0,s.jsx)(n.code,{children:"RankedChoiceDecision"})}),"  ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/objects/update-signup-round-payload",children:(0,s.jsx)(n.code,{children:"UpdateSignupRoundPayload"})}),"  ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"object"})]})]})}function b(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(x,{...e})}):x(e)}},1422:(e,n,d)=>{d.d(n,{R:()=>c,x:()=>t});var s=d(62340);const a={},i=s.createContext(a);function c(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:c(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);