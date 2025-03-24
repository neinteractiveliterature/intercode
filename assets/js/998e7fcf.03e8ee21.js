"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[48032],{39674:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>m,frontMatter:()=>d,metadata:()=>s,toc:()=>r});const s=JSON.parse('{"id":"graphql/types/interfaces/pagination-interface","title":"PaginationInterface","description":"PaginationInterface provides a way to use offset-based pagination on a list of objects. This","source":"@site/docs/graphql/types/interfaces/pagination-interface.md","sourceDirName":"graphql/types/interfaces","slug":"/graphql/types/interfaces/pagination-interface","permalink":"/docs/graphql/types/interfaces/pagination-interface","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/interfaces/pagination-interface.md","tags":[],"version":"current","frontMatter":{"id":"pagination-interface","title":"PaginationInterface"},"sidebar":"sidebar","previous":{"title":"CmsParent","permalink":"/docs/graphql/types/interfaces/cms-parent"},"next":{"title":"Ability","permalink":"/docs/graphql/types/objects/ability"}}');var l=a(58040),t=a(5365);const d={id:"pagination-interface",title:"PaginationInterface"},i=void 0,c={},r=[{value:"Fields",id:"fields",level:3},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">PaginationInterface</code>.<code class="gqlmd-mdx-entity-name">current_page</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Int!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"paginationinterfacecurrent_pageint-non-null-scalar",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">PaginationInterface</code>.<code class="gqlmd-mdx-entity-name">per_page</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Int!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"paginationinterfaceper_pageint-non-null-scalar",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">PaginationInterface</code>.<code class="gqlmd-mdx-entity-name">total_entries</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Int!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"paginationinterfacetotal_entriesint-non-null-scalar",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">PaginationInterface</code>.<code class="gqlmd-mdx-entity-name">total_pages</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Int!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"paginationinterfacetotal_pagesint-non-null-scalar",level:4},{value:"Implemented By",id:"implemented-by",level:3}];function o(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.p,{children:"PaginationInterface provides a way to use offset-based pagination on a list of objects. This\nis useful for UIs such as Intercode's table views, which provide a way to jump between numbered\npages."}),"\n",(0,l.jsx)(n.p,{children:"Page numbers in PaginationInterface are 1-based (so, the first page is page 1, then page 2,\netc.) The number of items per page can be controlled via the per_page argument on paginated\nfields. It defaults to 20, and can go up to 200."}),"\n",(0,l.jsxs)(n.p,{children:["Offset-based pagination is different from\n",(0,l.jsx)(n.a,{href:"https://relay.dev/graphql/connections.htm",children:"Relay's cursor-based pagination"})," that is more\ncommonly used in GraphQL APIs. We chose to go with an offset-based approach due to our UI\nneeds, but if a cursor-based approach is desirable in the future, we may also implement Relay\nconnections alongside our existing pagination fields."]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-graphql",children:"interface PaginationInterface {\n  current_page: Int!\n  per_page: Int!\n  total_entries: Int!\n  total_pages: Int!\n}\n"})}),"\n",(0,l.jsx)(n.h3,{id:"fields",children:"Fields"}),"\n",(0,l.jsxs)(n.h4,{id:"paginationinterfacecurrent_pageint-non-null-scalar",children:[(0,l.jsx)(n.a,{href:"#",children:(0,l.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,l.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"PaginationInterface"}),".",(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"current_page"})]})}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,l.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Int!"})})})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,l.jsx)(n.p,{children:"The number of the page currently being returned in this query"}),"\n",(0,l.jsxs)(n.h4,{id:"paginationinterfaceper_pageint-non-null-scalar",children:[(0,l.jsx)(n.a,{href:"#",children:(0,l.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,l.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"PaginationInterface"}),".",(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"per_page"})]})}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,l.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Int!"})})})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,l.jsx)(n.p,{children:"The number of items per page currently being returned in this query"}),"\n",(0,l.jsxs)(n.h4,{id:"paginationinterfacetotal_entriesint-non-null-scalar",children:[(0,l.jsx)(n.a,{href:"#",children:(0,l.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,l.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"PaginationInterface"}),".",(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"total_entries"})]})}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,l.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Int!"})})})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,l.jsx)(n.p,{children:"The total number of items in the paginated list (across all pages)"}),"\n",(0,l.jsxs)(n.h4,{id:"paginationinterfacetotal_pagesint-non-null-scalar",children:[(0,l.jsx)(n.a,{href:"#",children:(0,l.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,l.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"PaginationInterface"}),".",(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"total_pages"})]})}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,l.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Int!"})})})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,l.jsx)(n.p,{children:"The total number of pages in the paginated list"}),"\n",(0,l.jsx)(n.h3,{id:"implemented-by",children:"Implemented By"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.a,{href:"/docs/graphql/types/objects/conventions-pagination",children:(0,l.jsx)(n.code,{children:"ConventionsPagination"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/objects/coupons-pagination",children:(0,l.jsx)(n.code,{children:"CouponsPagination"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/objects/email-routes-pagination",children:(0,l.jsx)(n.code,{children:"EmailRoutesPagination"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/objects/event-proposals-pagination",children:(0,l.jsx)(n.code,{children:"EventProposalsPagination"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/objects/events-pagination",children:(0,l.jsx)(n.code,{children:"EventsPagination"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/objects/orders-pagination",children:(0,l.jsx)(n.code,{children:"OrdersPagination"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/objects/ranked-choice-decisions-pagination",children:(0,l.jsx)(n.code,{children:"RankedChoiceDecisionsPagination"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/objects/runs-pagination",children:(0,l.jsx)(n.code,{children:"RunsPagination"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/objects/signup-changes-pagination",children:(0,l.jsx)(n.code,{children:"SignupChangesPagination"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/objects/signup-requests-pagination",children:(0,l.jsx)(n.code,{children:"SignupRequestsPagination"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/objects/signups-pagination",children:(0,l.jsx)(n.code,{children:"SignupsPagination"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/objects/user-con-profiles-pagination",children:(0,l.jsx)(n.code,{children:"UserConProfilesPagination"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(n.a,{href:"/docs/graphql/types/objects/users-pagination",children:(0,l.jsx)(n.code,{children:"UsersPagination"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]})]})}function m(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(o,{...e})}):o(e)}},5365:(e,n,a)=>{a.d(n,{R:()=>d,x:()=>i});var s=a(62340);const l={},t=s.createContext(l);function d(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:d(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);