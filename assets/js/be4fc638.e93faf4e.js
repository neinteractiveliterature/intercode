"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[5672],{43206:(e,s,t)=>{t.r(s),t.d(s,{Badge:()=>p,Bullet:()=>c,Details:()=>g,SpecifiedBy:()=>u,assets:()=>o,contentTitle:()=>d,default:()=>f,frontMatter:()=>i,metadata:()=>l,toc:()=>h});var a=t(58040),n=t(1422),r=t(62340);const i={id:"users-paginated",title:"users_paginated"},d=void 0,l={id:"graphql/api/queries/users-paginated",title:"users_paginated",description:"Returns a paginated list of users. See PaginationInterface for details on how to use",source:"@site/docs/graphql/api/queries/users-paginated.mdx",sourceDirName:"graphql/api/queries",slug:"/graphql/api/queries/users-paginated",permalink:"/docs/graphql/api/queries/users-paginated",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/api/queries/users-paginated.mdx",tags:[],version:"current",frontMatter:{id:"users-paginated",title:"users_paginated"},sidebar:"sidebar",previous:{title:"user",permalink:"/docs/graphql/api/queries/user"},next:{title:"users",permalink:"/docs/graphql/api/queries/users"}},o={},c=()=>{const e={span:"span",...(0,n.R)()};return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},u=e=>{const s={a:"a",...(0,n.R)()};return(0,a.jsxs)(a.Fragment,{children:["Specification",(0,a.jsx)(s.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const s={span:"span",...(0,n.R)()};return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(s.span,{className:e.class,children:e.text})})},g=({dataOpen:e,dataClose:s,children:t,startOpen:i=!1})=>{const d={details:"details",summary:"summary",...(0,n.R)()},[l,o]=(0,r.useState)(i);return(0,a.jsxs)(d.details,{...l?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,a.jsx)(d.summary,{onClick:e=>{e.preventDefault(),o((e=>!e))},style:{listStyle:"none"},children:l?e:s}),l&&t]})},h=[{value:"Arguments",id:"arguments",level:3},{value:'<code>users_paginated.<b>filters</b></code><Bullet></Bullet><code>UserFiltersInput</code> <Badge class="badge badge--secondary"></Badge>',id:"users_paginatedfiltersuserfiltersinput-",level:4},{value:'<code>users_paginated.<b>page</b></code><Bullet></Bullet><code>Int</code> <Badge class="badge badge--secondary"></Badge>',id:"users_paginatedpageint-",level:4},{value:'<code>users_paginated.<b>per_page</b></code><Bullet></Bullet><code>Int</code> <Badge class="badge badge--secondary"></Badge>',id:"users_paginatedper_pageint-",level:4},{value:'<code>users_paginated.<b>sort</b></code><Bullet></Bullet><code>[SortInput!]</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"users_paginatedsortsortinput--",level:4},{value:"Type",id:"type",level:3},{value:'<code>UsersPagination</code> <Badge class="badge badge--secondary"></Badge>',id:"userspagination-",level:4}];function x(e){const s={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,n.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(s.p,{children:"Returns a paginated list of users. See PaginationInterface for details on how to use\npaginated lists, and UserFiltersInput for filters you can use here."}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{className:"language-graphql",children:"users_paginated(\n  filters: UserFiltersInput\n  page: Int\n  per_page: Int\n  sort: [SortInput!]\n): UsersPagination!\n"})}),"\n",(0,a.jsx)(s.h3,{id:"arguments",children:"Arguments"}),"\n",(0,a.jsxs)(s.h4,{id:"users_paginatedfiltersuserfiltersinput-",children:[(0,a.jsx)(s.a,{href:"#",children:(0,a.jsxs)("code",{style:{fontWeight:"normal"},children:["users_paginated.",(0,a.jsx)("b",{children:"filters"})]})}),(0,a.jsx)(c,{}),(0,a.jsx)(s.a,{href:"/docs/graphql/types/inputs/user-filters-input",children:(0,a.jsx)(s.code,{children:"UserFiltersInput"})})," ",(0,a.jsx)(p,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,a.jsxs)(s.blockquote,{children:["\n",(0,a.jsx)(s.p,{children:"Filters to restrict what items will appear in the result set."}),"\n"]}),"\n",(0,a.jsxs)(s.h4,{id:"users_paginatedpageint-",children:[(0,a.jsx)(s.a,{href:"#",children:(0,a.jsxs)("code",{style:{fontWeight:"normal"},children:["users_paginated.",(0,a.jsx)("b",{children:"page"})]})}),(0,a.jsx)(c,{}),(0,a.jsx)(s.a,{href:"/docs/graphql/types/scalars/int",children:(0,a.jsx)(s.code,{children:"Int"})})," ",(0,a.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,a.jsxs)(s.blockquote,{children:["\n",(0,a.jsx)(s.p,{children:"The page number to return from the result set.  Page numbers start with 1."}),"\n"]}),"\n",(0,a.jsxs)(s.h4,{id:"users_paginatedper_pageint-",children:[(0,a.jsx)(s.a,{href:"#",children:(0,a.jsxs)("code",{style:{fontWeight:"normal"},children:["users_paginated.",(0,a.jsx)("b",{children:"per_page"})]})}),(0,a.jsx)(c,{}),(0,a.jsx)(s.a,{href:"/docs/graphql/types/scalars/int",children:(0,a.jsx)(s.code,{children:"Int"})})," ",(0,a.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,a.jsxs)(s.blockquote,{children:["\n",(0,a.jsx)(s.p,{children:"The number of items to return per page.  Defaults to 20, can go up to 200."}),"\n"]}),"\n",(0,a.jsxs)(s.h4,{id:"users_paginatedsortsortinput--",children:[(0,a.jsx)(s.a,{href:"#",children:(0,a.jsxs)("code",{style:{fontWeight:"normal"},children:["users_paginated.",(0,a.jsx)("b",{children:"sort"})]})}),(0,a.jsx)(c,{}),(0,a.jsx)(s.a,{href:"/docs/graphql/types/inputs/sort-input",children:(0,a.jsx)(s.code,{children:"[SortInput!]"})})," ",(0,a.jsx)(p,{class:"badge badge--secondary",text:"list"})," ",(0,a.jsx)(p,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,a.jsxs)(s.blockquote,{children:["\n",(0,a.jsx)(s.p,{children:"A set of fields to use for ordering the result set. The second field is used as a\ntiebreaker for the first, the third field is used as a tiebreaker for the first two,\nand so on. If the sort argument is missing or empty, the order of items will be left\nup to the database (and may be unpredictable)."}),"\n"]}),"\n",(0,a.jsx)(s.h3,{id:"type",children:"Type"}),"\n",(0,a.jsxs)(s.h4,{id:"userspagination-",children:[(0,a.jsx)(s.a,{href:"/docs/graphql/types/objects/users-pagination",children:(0,a.jsx)(s.code,{children:"UsersPagination"})})," ",(0,a.jsx)(p,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,a.jsx)(s.blockquote,{children:"\n"})]})}function f(e={}){const{wrapper:s}={...(0,n.R)(),...e.components};return s?(0,a.jsx)(s,{...e,children:(0,a.jsx)(x,{...e})}):x(e)}},1422:(e,s,t)=>{t.d(s,{R:()=>i,x:()=>d});var a=t(62340);const n={},r=a.createContext(n);function i(e){const s=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function d(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:i(e.components),a.createElement(r.Provider,{value:s},e.children)}}}]);