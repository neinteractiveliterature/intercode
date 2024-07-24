"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[74695],{90218:(e,n,t)=>{t.r(n),t.d(n,{Badge:()=>g,Bullet:()=>l,Details:()=>h,SpecifiedBy:()=>p,assets:()=>c,contentTitle:()=>r,default:()=>f,frontMatter:()=>o,metadata:()=>d,toc:()=>u});var s=t(58040),a=t(1422),i=t(62340);const o={id:"conventions-paginated",title:"conventions_paginated"},r=void 0,d={id:"graphql/api/queries/conventions-paginated",title:"conventions_paginated",description:"Returns a paginated list of conventions. See PaginationInterface for details on how to use",source:"@site/docs/graphql/api/queries/conventions-paginated.mdx",sourceDirName:"graphql/api/queries",slug:"/graphql/api/queries/conventions-paginated",permalink:"/docs/graphql/api/queries/conventions-paginated",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/api/queries/conventions-paginated.mdx",tags:[],version:"current",frontMatter:{id:"conventions-paginated",title:"conventions_paginated"},sidebar:"sidebar",previous:{title:"conventionByRequestHost",permalink:"/docs/graphql/api/queries/convention-by-request-host"},next:{title:"currentAbility",permalink:"/docs/graphql/api/queries/current-ability"}},c={},l=()=>{const e={span:"span",...(0,a.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const n={a:"a",...(0,a.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},g=e=>{const n={span:"span",...(0,a.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(n.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:n,children:t,startOpen:o=!1})=>{const r={details:"details",summary:"summary",...(0,a.R)()},[d,c]=(0,i.useState)(o);return(0,s.jsxs)(r.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(r.summary,{onClick:e=>{e.preventDefault(),c((e=>!e))},style:{listStyle:"none"},children:d?e:n}),d&&t]})},u=[{value:"Arguments",id:"arguments",level:3},{value:'<code>conventions_paginated.<b>filters</b></code><Bullet></Bullet><code>ConventionFiltersInput</code> <Badge class="badge badge--secondary"></Badge>',id:"conventions_paginatedfiltersconventionfiltersinput-",level:4},{value:'<code>conventions_paginated.<b>page</b></code><Bullet></Bullet><code>Int</code> <Badge class="badge badge--secondary"></Badge>',id:"conventions_paginatedpageint-",level:4},{value:'<code>conventions_paginated.<b>per_page</b></code><Bullet></Bullet><code>Int</code> <Badge class="badge badge--secondary"></Badge>',id:"conventions_paginatedper_pageint-",level:4},{value:'<code>conventions_paginated.<b>sort</b></code><Bullet></Bullet><code>[SortInput!]</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"conventions_paginatedsortsortinput--",level:4},{value:"Type",id:"type",level:3},{value:'<code>ConventionsPagination</code> <Badge class="badge badge--secondary"></Badge>',id:"conventionspagination-",level:4}];function x(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"Returns a paginated list of conventions. See PaginationInterface for details on how to use\npaginated lists, and ConventionFiltersInput for filters you can use here."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-graphql",children:"conventions_paginated(\n  filters: ConventionFiltersInput\n  page: Int\n  per_page: Int\n  sort: [SortInput!]\n): ConventionsPagination!\n"})}),"\n",(0,s.jsx)(n.h3,{id:"arguments",children:"Arguments"}),"\n",(0,s.jsxs)(n.h4,{id:"conventions_paginatedfiltersconventionfiltersinput-",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["conventions_paginated.",(0,s.jsx)("b",{children:"filters"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/inputs/convention-filters-input",children:(0,s.jsx)(n.code,{children:"ConventionFiltersInput"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,s.jsx)(n.p,{children:"Filters to restrict what items will appear in the result set."}),"\n",(0,s.jsxs)(n.h4,{id:"conventions_paginatedpageint-",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["conventions_paginated.",(0,s.jsx)("b",{children:"page"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(n.code,{children:"Int"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.p,{children:"The page number to return from the result set.  Page numbers start with 1."}),"\n",(0,s.jsxs)(n.h4,{id:"conventions_paginatedper_pageint-",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["conventions_paginated.",(0,s.jsx)("b",{children:"per_page"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(n.code,{children:"Int"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.p,{children:"The number of items to return per page.  Defaults to 20, can go up to 200."}),"\n",(0,s.jsxs)(n.h4,{id:"conventions_paginatedsortsortinput--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["conventions_paginated.",(0,s.jsx)("b",{children:"sort"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/inputs/sort-input",children:(0,s.jsx)(n.code,{children:"[SortInput!]"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"list"})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,s.jsx)(n.p,{children:"A set of fields to use for ordering the result set. The second field is used as a\ntiebreaker for the first, the third field is used as a tiebreaker for the first two,\nand so on. If the sort argument is missing or empty, the order of items will be left\nup to the database (and may be unpredictable)."}),"\n",(0,s.jsx)(n.h3,{id:"type",children:"Type"}),"\n",(0,s.jsxs)(n.h4,{id:"conventionspagination-",children:[(0,s.jsx)(n.a,{href:"/docs/graphql/types/objects/conventions-pagination",children:(0,s.jsx)(n.code,{children:"ConventionsPagination"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"object"})]})]})}function f(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(x,{...e})}):x(e)}},1422:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>r});var s=t(62340);const a={},i=s.createContext(a);function o(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);