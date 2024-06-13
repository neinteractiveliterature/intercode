"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[62390],{88727:(e,s,t)=>{t.r(s),t.d(s,{Badge:()=>u,Bullet:()=>o,SpecifiedBy:()=>c,assets:()=>l,contentTitle:()=>i,default:()=>g,frontMatter:()=>a,metadata:()=>d,toc:()=>p});var n=t(58040),r=t(1422);const a={id:"users-paginated",title:"users_paginated",hide_table_of_contents:!1},i=void 0,d={id:"graphql/queries/users-paginated",title:"users_paginated",description:"Returns a paginated list of users. See PaginationInterface for details on how to use",source:"@site/docs/graphql/queries/users-paginated.mdx",sourceDirName:"graphql/queries",slug:"/graphql/queries/users-paginated",permalink:"/docs/graphql/queries/users-paginated",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/queries/users-paginated.mdx",tags:[],version:"current",frontMatter:{id:"users-paginated",title:"users_paginated",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"user",permalink:"/docs/graphql/queries/user"},next:{title:"users",permalink:"/docs/graphql/queries/users"}},l={},o=()=>{const e={span:"span",...(0,r.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},c=e=>{const s={a:"a",...(0,r.R)()};return(0,n.jsxs)(n.Fragment,{children:["Specification",(0,n.jsx)(s.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const s={span:"span",...(0,r.R)()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(s.span,{class:"badge badge--"+e.class,children:e.text})})},p=[{value:"Arguments",id:"arguments",level:3},{value:'<code>users_paginated.<b>filters</b></code><Bullet></Bullet><code>UserFiltersInput</code> <Badge class="secondary"></Badge>',id:"users_paginatedfiltersuserfiltersinput-",level:4},{value:'<code>users_paginated.<b>page</b></code><Bullet></Bullet><code>Int</code> <Badge class="secondary"></Badge>',id:"users_paginatedpageint-",level:4},{value:'<code>users_paginated.<b>per_page</b></code><Bullet></Bullet><code>Int</code> <Badge class="secondary"></Badge>',id:"users_paginatedper_pageint-",level:4},{value:'<code>users_paginated.<b>sort</b></code><Bullet></Bullet><code>[SortInput!]</code> <Badge class="secondary"></Badge> <Badge class="secondary"></Badge>',id:"users_paginatedsortsortinput--",level:4},{value:"Type",id:"type",level:3},{value:'<code>UsersPagination</code> <Badge class="secondary"></Badge>',id:"userspagination-",level:4}];function h(e){const s={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.p,{children:"Returns a paginated list of users. See PaginationInterface for details on how to use\npaginated lists, and UserFiltersInput for filters you can use here."}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-graphql",children:"users_paginated(\n  filters: UserFiltersInput\n  page: Int\n  per_page: Int\n  sort: [SortInput!]\n): UsersPagination!\n"})}),"\n",(0,n.jsx)(s.h3,{id:"arguments",children:"Arguments"}),"\n",(0,n.jsxs)(s.h4,{id:"users_paginatedfiltersuserfiltersinput-",children:[(0,n.jsx)(s.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["users_paginated.",(0,n.jsx)("b",{children:"filters"})]})}),(0,n.jsx)(o,{}),(0,n.jsx)(s.a,{href:"/docs/graphql/inputs/user-filters-input",children:(0,n.jsx)(s.code,{children:"UserFiltersInput"})})," ",(0,n.jsx)(u,{class:"secondary",text:"input"})]}),"\n",(0,n.jsxs)(s.blockquote,{children:["\n",(0,n.jsx)(s.p,{children:"Filters to restrict what items will appear in the result set."}),"\n"]}),"\n",(0,n.jsxs)(s.h4,{id:"users_paginatedpageint-",children:[(0,n.jsx)(s.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["users_paginated.",(0,n.jsx)("b",{children:"page"})]})}),(0,n.jsx)(o,{}),(0,n.jsx)(s.a,{href:"/docs/graphql/scalars/int",children:(0,n.jsx)(s.code,{children:"Int"})})," ",(0,n.jsx)(u,{class:"secondary",text:"scalar"})]}),"\n",(0,n.jsxs)(s.blockquote,{children:["\n",(0,n.jsx)(s.p,{children:"The page number to return from the result set.  Page numbers start with 1."}),"\n"]}),"\n",(0,n.jsxs)(s.h4,{id:"users_paginatedper_pageint-",children:[(0,n.jsx)(s.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["users_paginated.",(0,n.jsx)("b",{children:"per_page"})]})}),(0,n.jsx)(o,{}),(0,n.jsx)(s.a,{href:"/docs/graphql/scalars/int",children:(0,n.jsx)(s.code,{children:"Int"})})," ",(0,n.jsx)(u,{class:"secondary",text:"scalar"})]}),"\n",(0,n.jsxs)(s.blockquote,{children:["\n",(0,n.jsx)(s.p,{children:"The number of items to return per page.  Defaults to 20, can go up to 200."}),"\n"]}),"\n",(0,n.jsxs)(s.h4,{id:"users_paginatedsortsortinput--",children:[(0,n.jsx)(s.a,{href:"#",children:(0,n.jsxs)("code",{style:{fontWeight:"normal"},children:["users_paginated.",(0,n.jsx)("b",{children:"sort"})]})}),(0,n.jsx)(o,{}),(0,n.jsx)(s.a,{href:"/docs/graphql/inputs/sort-input",children:(0,n.jsx)(s.code,{children:"[SortInput!]"})})," ",(0,n.jsx)(u,{class:"secondary",text:"list"})," ",(0,n.jsx)(u,{class:"secondary",text:"input"})]}),"\n",(0,n.jsxs)(s.blockquote,{children:["\n",(0,n.jsx)(s.p,{children:"A set of fields to use for ordering the result set. The second field is used as a\ntiebreaker for the first, the third field is used as a tiebreaker for the first two,\nand so on. If the sort argument is missing or empty, the order of items will be left\nup to the database (and may be unpredictable)."}),"\n"]}),"\n",(0,n.jsx)(s.h3,{id:"type",children:"Type"}),"\n",(0,n.jsxs)(s.h4,{id:"userspagination-",children:[(0,n.jsx)(s.a,{href:"/docs/graphql/objects/users-pagination",children:(0,n.jsx)(s.code,{children:"UsersPagination"})})," ",(0,n.jsx)(u,{class:"secondary",text:"object"})]}),"\n",(0,n.jsx)(s.blockquote,{children:"\n"})]})}function g(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},1422:(e,s,t)=>{t.d(s,{R:()=>i,x:()=>d});var n=t(62340);const r={},a=n.createContext(r);function i(e){const s=n.useContext(a);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function d(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),n.createElement(a.Provider,{value:s},e.children)}}}]);