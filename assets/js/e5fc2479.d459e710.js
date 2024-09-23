"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[63314],{69675:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>u,Bullet:()=>c,Details:()=>g,SpecifiedBy:()=>p,assets:()=>o,contentTitle:()=>l,default:()=>x,frontMatter:()=>r,metadata:()=>d,toc:()=>h});var s=a(58040),i=a(1422),n=a(62340);const r={id:"email-routes-paginated",title:"email_routes_paginated"},l=void 0,d={id:"graphql/api/queries/email-routes-paginated",title:"email_routes_paginated",description:"Returns a paginated list of the global email routes configured in Intercode.",source:"@site/docs/graphql/api/queries/email-routes-paginated.mdx",sourceDirName:"graphql/api/queries",slug:"/graphql/api/queries/email-routes-paginated",permalink:"/docs/graphql/api/queries/email-routes-paginated",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/api/queries/email-routes-paginated.mdx",tags:[],version:"current",frontMatter:{id:"email-routes-paginated",title:"email_routes_paginated"},sidebar:"sidebar",previous:{title:"email_route",permalink:"/docs/graphql/api/queries/email-route"},next:{title:"hasOauthApplications",permalink:"/docs/graphql/api/queries/has-oauth-applications"}},o={},c=()=>{const e={span:"span",...(0,i.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,i.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const t={span:"span",...(0,i.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(t.span,{className:e.class,children:e.text})})},g=({dataOpen:e,dataClose:t,children:a,startOpen:r=!1})=>{const l={details:"details",summary:"summary",...(0,i.R)()},[d,o]=(0,n.useState)(r);return(0,s.jsxs)(l.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(l.summary,{onClick:e=>{e.preventDefault(),o((e=>!e))},style:{listStyle:"none"},children:d?e:t}),d&&a]})},h=[{value:"Arguments",id:"arguments",level:3},{value:'<code>email_routes_paginated.<b>filters</b></code><Bullet></Bullet><code>EmailRouteFiltersInput</code> <Badge class="badge badge--secondary"></Badge>',id:"email_routes_paginatedfiltersemailroutefiltersinput-",level:4},{value:'<code>email_routes_paginated.<b>page</b></code><Bullet></Bullet><code>Int</code> <Badge class="badge badge--secondary"></Badge>',id:"email_routes_paginatedpageint-",level:4},{value:'<code>email_routes_paginated.<b>per_page</b></code><Bullet></Bullet><code>Int</code> <Badge class="badge badge--secondary"></Badge>',id:"email_routes_paginatedper_pageint-",level:4},{value:'<code>email_routes_paginated.<b>sort</b></code><Bullet></Bullet><code>[SortInput!]</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"email_routes_paginatedsortsortinput--",level:4},{value:"Type",id:"type",level:3},{value:'<code>EmailRoutesPagination</code> <Badge class="badge badge--secondary"></Badge>',id:"emailroutespagination-",level:4}];function m(e){const t={a:"a",code:"code",em:"em",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(t.p,{children:["Returns a paginated list of the ",(0,s.jsx)(t.em,{children:"global"})," email routes configured in Intercode.\n(Convention-specific email routing is controlled via that convention's StaffPositions.)"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-graphql",children:"email_routes_paginated(\n  filters: EmailRouteFiltersInput\n  page: Int\n  per_page: Int\n  sort: [SortInput!]\n): EmailRoutesPagination!\n"})}),"\n",(0,s.jsx)(t.h3,{id:"arguments",children:"Arguments"}),"\n",(0,s.jsxs)(t.h4,{id:"email_routes_paginatedfiltersemailroutefiltersinput-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["email_routes_paginated.",(0,s.jsx)("b",{children:"filters"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/inputs/email-route-filters-input",children:(0,s.jsx)(t.code,{children:"EmailRouteFiltersInput"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,s.jsx)(t.p,{children:"Filters to restrict what items will appear in the result set."}),"\n",(0,s.jsxs)(t.h4,{id:"email_routes_paginatedpageint-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["email_routes_paginated.",(0,s.jsx)("b",{children:"page"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(t.code,{children:"Int"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(t.p,{children:"The page number to return from the result set.  Page numbers start with 1."}),"\n",(0,s.jsxs)(t.h4,{id:"email_routes_paginatedper_pageint-",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["email_routes_paginated.",(0,s.jsx)("b",{children:"per_page"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(t.code,{children:"Int"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(t.p,{children:"The number of items to return per page.  Defaults to 20, can go up to 200."}),"\n",(0,s.jsxs)(t.h4,{id:"email_routes_paginatedsortsortinput--",children:[(0,s.jsx)(t.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["email_routes_paginated.",(0,s.jsx)("b",{children:"sort"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(t.a,{href:"/docs/graphql/types/inputs/sort-input",children:(0,s.jsx)(t.code,{children:"[SortInput!]"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"list"})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,s.jsx)(t.p,{children:"A set of fields to use for ordering the result set. The second field is used as a\ntiebreaker for the first, the third field is used as a tiebreaker for the first two,\nand so on. If the sort argument is missing or empty, the order of items will be left\nup to the database (and may be unpredictable)."}),"\n",(0,s.jsx)(t.h3,{id:"type",children:"Type"}),"\n",(0,s.jsxs)(t.h4,{id:"emailroutespagination-",children:[(0,s.jsx)(t.a,{href:"/docs/graphql/types/objects/email-routes-pagination",children:(0,s.jsx)(t.code,{children:"EmailRoutesPagination"})})," ",(0,s.jsx)(u,{class:"badge badge--secondary",text:"object"})]})]})}function x(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(m,{...e})}):m(e)}},1422:(e,t,a)=>{a.d(t,{R:()=>r,x:()=>l});var s=a(62340);const i={},n=s.createContext(i);function r(e){const t=s.useContext(n);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),s.createElement(n.Provider,{value:t},e.children)}}}]);