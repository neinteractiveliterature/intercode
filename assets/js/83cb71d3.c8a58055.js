"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[92344],{69477:(e,n,a)=>{a.r(n),a.d(n,{Badge:()=>g,Bullet:()=>l,Details:()=>p,SpecifiedBy:()=>h,assets:()=>r,contentTitle:()=>o,default:()=>x,frontMatter:()=>c,metadata:()=>d,toc:()=>b});var s=a(58040),i=a(1422),t=a(62340);const c={id:"ranked-choice-decisions-pagination",title:"RankedChoiceDecisionsPagination"},o=void 0,d={id:"graphql/types/objects/ranked-choice-decisions-pagination",title:"RankedChoiceDecisionsPagination",description:"A paginated table of RankedChoiceDecisions.",source:"@site/docs/graphql/types/objects/ranked-choice-decisions-pagination.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/ranked-choice-decisions-pagination",permalink:"/docs/graphql/types/objects/ranked-choice-decisions-pagination",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/ranked-choice-decisions-pagination.mdx",tags:[],version:"current",frontMatter:{id:"ranked-choice-decisions-pagination",title:"RankedChoiceDecisionsPagination"},sidebar:"sidebar",previous:{title:"RankedChoiceDecision",permalink:"/docs/graphql/types/objects/ranked-choice-decision"},next:{title:"RankedChoiceUserConstraint",permalink:"/docs/graphql/types/objects/ranked-choice-user-constraint"}},r={},l=()=>{const e={span:"span",...(0,i.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},h=e=>{const n={a:"a",...(0,i.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},g=e=>{const n={span:"span",...(0,i.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(n.span,{className:e.class,children:e.text})})},p=({dataOpen:e,dataClose:n,children:a,startOpen:c=!1})=>{const o={details:"details",summary:"summary",...(0,i.R)()},[d,r]=(0,t.useState)(c);return(0,s.jsxs)(o.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(o.summary,{onClick:e=>{e.preventDefault(),r((e=>!e))},style:{listStyle:"none"},children:d?e:n}),d&&a]})},b=[{value:"Fields",id:"fields",level:3},{value:'<code>RankedChoiceDecisionsPagination.<b>current_page</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisionspaginationcurrent_pageint--",level:4},{value:'<code>RankedChoiceDecisionsPagination.<b>entries</b></code><Bullet></Bullet><code>[RankedChoiceDecision!]!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisionspaginationentriesrankedchoicedecision--",level:4},{value:'<code>RankedChoiceDecisionsPagination.<b>per_page</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisionspaginationper_pageint--",level:4},{value:'<code>RankedChoiceDecisionsPagination.<b>total_entries</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisionspaginationtotal_entriesint--",level:4},{value:'<code>RankedChoiceDecisionsPagination.<b>total_pages</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"rankedchoicedecisionspaginationtotal_pagesint--",level:4},{value:"Interfaces",id:"interfaces",level:3},{value:'<code>PaginationInterface</code> <Badge class="badge badge--secondary"></Badge>',id:"paginationinterface-",level:4},{value:"Member Of",id:"member-of",level:3}];function u(e){const n={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"A paginated table of RankedChoiceDecisions."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-graphql",children:"type RankedChoiceDecisionsPagination implements PaginationInterface {\n  current_page: Int!\n  entries: [RankedChoiceDecision!]!\n  per_page: Int!\n  total_entries: Int!\n  total_pages: Int!\n}\n"})}),"\n",(0,s.jsx)(n.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(n.h4,{id:"rankedchoicedecisionspaginationcurrent_pageint--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecisionsPagination.",(0,s.jsx)("b",{children:"current_page"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(n.code,{children:"Int!"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsx)(n.p,{children:"The number of the page currently being returned in this query"}),"\n"]}),"\n",(0,s.jsxs)(n.h4,{id:"rankedchoicedecisionspaginationentriesrankedchoicedecision--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecisionsPagination.",(0,s.jsx)("b",{children:"entries"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/objects/ranked-choice-decision",children:(0,s.jsx)(n.code,{children:"[RankedChoiceDecision!]!"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsx)(n.blockquote,{children:"\n"}),"\n",(0,s.jsxs)(n.h4,{id:"rankedchoicedecisionspaginationper_pageint--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecisionsPagination.",(0,s.jsx)("b",{children:"per_page"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(n.code,{children:"Int!"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsx)(n.p,{children:"The number of items per page currently being returned in this query"}),"\n"]}),"\n",(0,s.jsxs)(n.h4,{id:"rankedchoicedecisionspaginationtotal_entriesint--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecisionsPagination.",(0,s.jsx)("b",{children:"total_entries"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(n.code,{children:"Int!"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsx)(n.p,{children:"The total number of items in the paginated list (across all pages)"}),"\n"]}),"\n",(0,s.jsxs)(n.h4,{id:"rankedchoicedecisionspaginationtotal_pagesint--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["RankedChoiceDecisionsPagination.",(0,s.jsx)("b",{children:"total_pages"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(n.code,{children:"Int!"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsx)(n.p,{children:"The total number of pages in the paginated list"}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"interfaces",children:"Interfaces"}),"\n",(0,s.jsxs)(n.h4,{id:"paginationinterface-",children:[(0,s.jsx)(n.a,{href:"/docs/graphql/types/interfaces/pagination-interface",children:(0,s.jsx)(n.code,{children:"PaginationInterface"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"interface"})]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsx)(n.p,{children:"PaginationInterface provides a way to use offset-based pagination on a list of objects. This\nis useful for UIs such as Intercode's table views, which provide a way to jump between numbered\npages."}),"\n",(0,s.jsx)(n.p,{children:"Page numbers in PaginationInterface are 1-based (so, the first page is page 1, then page 2,\netc.) The number of items per page can be controlled via the per_page argument on paginated\nfields. It defaults to 20, and can go up to 200."}),"\n",(0,s.jsxs)(n.p,{children:["Offset-based pagination is different from\n",(0,s.jsx)(n.a,{href:"https://relay.dev/graphql/connections.htm",children:"Relay's cursor-based pagination"})," that is more\ncommonly used in GraphQL APIs. We chose to go with an offset-based approach due to our UI\nneeds, but if a cursor-based approach is desirable in the future, we may also implement Relay\nconnections alongside our existing pagination fields."]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"/docs/graphql/types/objects/signup-round",children:(0,s.jsx)(n.code,{children:"SignupRound"})}),"  ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"object"})]})]})}function x(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},1422:(e,n,a)=>{a.d(n,{R:()=>c,x:()=>o});var s=a(62340);const i={},t=s.createContext(i);function c(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:c(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);