"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[84969],{64343:(e,a,n)=>{n.r(a),n.d(a,{Badge:()=>p,Bullet:()=>c,Details:()=>u,SpecifiedBy:()=>g,assets:()=>d,contentTitle:()=>r,default:()=>x,frontMatter:()=>o,metadata:()=>l,toc:()=>h});var t=n(58040),s=n(1422),i=n(62340);const o={id:"email-routes-pagination",title:"EmailRoutesPagination"},r=void 0,l={id:"graphql/types/objects/email-routes-pagination",title:"EmailRoutesPagination",description:"No description",source:"@site/docs/graphql/types/objects/email-routes-pagination.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/email-routes-pagination",permalink:"/docs/graphql/types/objects/email-routes-pagination",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/email-routes-pagination.mdx",tags:[],version:"current",frontMatter:{id:"email-routes-pagination",title:"EmailRoutesPagination"},sidebar:"sidebar",previous:{title:"EmailRoute",permalink:"/docs/graphql/types/objects/email-route"},next:{title:"EventCategory",permalink:"/docs/graphql/types/objects/event-category"}},d={},c=()=>{const e={span:"span",...(0,s.R)()};return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},g=e=>{const a={a:"a",...(0,s.R)()};return(0,t.jsxs)(t.Fragment,{children:["Specification",(0,t.jsx)(a.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const a={span:"span",...(0,s.R)()};return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(a.span,{className:e.class,children:e.text})})},u=({dataOpen:e,dataClose:a,children:n,startOpen:o=!1})=>{const r={details:"details",summary:"summary",...(0,s.R)()},[l,d]=(0,i.useState)(o);return(0,t.jsxs)(r.details,{...l?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,t.jsx)(r.summary,{onClick:e=>{e.preventDefault(),d((e=>!e))},style:{listStyle:"none"},children:l?e:a}),l&&n]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>EmailRoutesPagination.<b>current_page</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"emailroutespaginationcurrent_pageint--",level:4},{value:'<code>EmailRoutesPagination.<b>entries</b></code><Bullet></Bullet><code>[EmailRoute!]!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"emailroutespaginationentriesemailroute--",level:4},{value:'<code>EmailRoutesPagination.<b>per_page</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"emailroutespaginationper_pageint--",level:4},{value:'<code>EmailRoutesPagination.<b>total_entries</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"emailroutespaginationtotal_entriesint--",level:4},{value:'<code>EmailRoutesPagination.<b>total_pages</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"emailroutespaginationtotal_pagesint--",level:4},{value:"Interfaces",id:"interfaces",level:3},{value:'<code>PaginationInterface</code> <Badge class="badge badge--secondary"></Badge>',id:"paginationinterface-",level:4},{value:"Returned By",id:"returned-by",level:3}];function b(e){const a={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.p,{children:"No description"}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-graphql",children:"type EmailRoutesPagination implements PaginationInterface {\n  current_page: Int!\n  entries: [EmailRoute!]!\n  per_page: Int!\n  total_entries: Int!\n  total_pages: Int!\n}\n"})}),"\n",(0,t.jsx)(a.h3,{id:"fields",children:"Fields"}),"\n",(0,t.jsxs)(a.h4,{id:"emailroutespaginationcurrent_pageint--",children:[(0,t.jsx)(a.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["EmailRoutesPagination.",(0,t.jsx)("b",{children:"current_page"})]})}),(0,t.jsx)(c,{}),(0,t.jsx)(a.a,{href:"/docs/graphql/types/scalars/int",children:(0,t.jsx)(a.code,{children:"Int!"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsxs)(a.blockquote,{children:["\n",(0,t.jsx)(a.p,{children:"The number of the page currently being returned in this query"}),"\n"]}),"\n",(0,t.jsxs)(a.h4,{id:"emailroutespaginationentriesemailroute--",children:[(0,t.jsx)(a.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["EmailRoutesPagination.",(0,t.jsx)("b",{children:"entries"})]})}),(0,t.jsx)(c,{}),(0,t.jsx)(a.a,{href:"/docs/graphql/types/objects/email-route",children:(0,t.jsx)(a.code,{children:"[EmailRoute!]!"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,t.jsx)(a.blockquote,{children:"\n"}),"\n",(0,t.jsxs)(a.h4,{id:"emailroutespaginationper_pageint--",children:[(0,t.jsx)(a.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["EmailRoutesPagination.",(0,t.jsx)("b",{children:"per_page"})]})}),(0,t.jsx)(c,{}),(0,t.jsx)(a.a,{href:"/docs/graphql/types/scalars/int",children:(0,t.jsx)(a.code,{children:"Int!"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsxs)(a.blockquote,{children:["\n",(0,t.jsx)(a.p,{children:"The number of items per page currently being returned in this query"}),"\n"]}),"\n",(0,t.jsxs)(a.h4,{id:"emailroutespaginationtotal_entriesint--",children:[(0,t.jsx)(a.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["EmailRoutesPagination.",(0,t.jsx)("b",{children:"total_entries"})]})}),(0,t.jsx)(c,{}),(0,t.jsx)(a.a,{href:"/docs/graphql/types/scalars/int",children:(0,t.jsx)(a.code,{children:"Int!"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsxs)(a.blockquote,{children:["\n",(0,t.jsx)(a.p,{children:"The total number of items in the paginated list (across all pages)"}),"\n"]}),"\n",(0,t.jsxs)(a.h4,{id:"emailroutespaginationtotal_pagesint--",children:[(0,t.jsx)(a.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["EmailRoutesPagination.",(0,t.jsx)("b",{children:"total_pages"})]})}),(0,t.jsx)(c,{}),(0,t.jsx)(a.a,{href:"/docs/graphql/types/scalars/int",children:(0,t.jsx)(a.code,{children:"Int!"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsxs)(a.blockquote,{children:["\n",(0,t.jsx)(a.p,{children:"The total number of pages in the paginated list"}),"\n"]}),"\n",(0,t.jsx)(a.h3,{id:"interfaces",children:"Interfaces"}),"\n",(0,t.jsxs)(a.h4,{id:"paginationinterface-",children:[(0,t.jsx)(a.a,{href:"/docs/graphql/types/interfaces/pagination-interface",children:(0,t.jsx)(a.code,{children:"PaginationInterface"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"interface"})]}),"\n",(0,t.jsxs)(a.blockquote,{children:["\n",(0,t.jsx)(a.p,{children:"PaginationInterface provides a way to use offset-based pagination on a list of objects. This\nis useful for UIs such as Intercode's table views, which provide a way to jump between numbered\npages."}),"\n",(0,t.jsx)(a.p,{children:"Page numbers in PaginationInterface are 1-based (so, the first page is page 1, then page 2,\netc.) The number of items per page can be controlled via the per_page argument on paginated\nfields. It defaults to 20, and can go up to 200."}),"\n",(0,t.jsxs)(a.p,{children:["Offset-based pagination is different from\n",(0,t.jsx)(a.a,{href:"https://relay.dev/graphql/connections.htm",children:"Relay's cursor-based pagination"})," that is more\ncommonly used in GraphQL APIs. We chose to go with an offset-based approach due to our UI\nneeds, but if a cursor-based approach is desirable in the future, we may also implement Relay\nconnections alongside our existing pagination fields."]}),"\n"]}),"\n",(0,t.jsx)(a.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,t.jsxs)(a.p,{children:[(0,t.jsx)(a.a,{href:"/docs/graphql/api/queries/email-routes-paginated",children:(0,t.jsx)(a.code,{children:"email_routes_paginated"})}),"  ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"query"})]})]})}function x(e={}){const{wrapper:a}={...(0,s.R)(),...e.components};return a?(0,t.jsx)(a,{...e,children:(0,t.jsx)(b,{...e})}):b(e)}},1422:(e,a,n)=>{n.d(a,{R:()=>o,x:()=>r});var t=n(62340);const s={},i=t.createContext(s);function o(e){const a=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function r(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),t.createElement(i.Provider,{value:a},e.children)}}}]);