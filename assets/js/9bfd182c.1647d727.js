"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[84546],{11670:(e,n,a)=>{a.r(n),a.d(n,{Badge:()=>p,Bullet:()=>l,Details:()=>h,SpecifiedBy:()=>g,assets:()=>r,contentTitle:()=>c,default:()=>x,frontMatter:()=>i,metadata:()=>d,toc:()=>u});var t=a(58040),s=a(1422),o=a(62340);const i={id:"conventions-pagination",title:"ConventionsPagination"},c=void 0,d={id:"graphql/types/objects/conventions-pagination",title:"ConventionsPagination",description:"No description",source:"@site/docs/graphql/types/objects/conventions-pagination.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/conventions-pagination",permalink:"/docs/graphql/types/objects/conventions-pagination",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/conventions-pagination.mdx",tags:[],version:"current",frontMatter:{id:"conventions-pagination",title:"ConventionsPagination"},sidebar:"sidebar",previous:{title:"Convention",permalink:"/docs/graphql/types/objects/convention"},next:{title:"ConvertTicketToEventProvidedPayload",permalink:"/docs/graphql/types/objects/convert-ticket-to-event-provided-payload"}},r={},l=()=>{const e={span:"span",...(0,s.R)()};return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},g=e=>{const n={a:"a",...(0,s.R)()};return(0,t.jsxs)(t.Fragment,{children:["Specification",(0,t.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const n={span:"span",...(0,s.R)()};return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:n,children:a,startOpen:i=!1})=>{const c={details:"details",summary:"summary",...(0,s.R)()},[d,r]=(0,o.useState)(i);return(0,t.jsxs)(c.details,{...d?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,t.jsx)(c.summary,{onClick:e=>{e.preventDefault(),r((e=>!e))},style:{listStyle:"none"},children:d?e:n}),d&&a]})},u=[{value:"Fields",id:"fields",level:3},{value:'<code>ConventionsPagination.<b>current_page</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"conventionspaginationcurrent_pageint--",level:4},{value:'<code>ConventionsPagination.<b>entries</b></code><Bullet></Bullet><code>[Convention!]!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"conventionspaginationentriesconvention--",level:4},{value:'<code>ConventionsPagination.<b>per_page</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"conventionspaginationper_pageint--",level:4},{value:'<code>ConventionsPagination.<b>total_entries</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"conventionspaginationtotal_entriesint--",level:4},{value:'<code>ConventionsPagination.<b>total_pages</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"conventionspaginationtotal_pagesint--",level:4},{value:"Interfaces",id:"interfaces",level:3},{value:'<code>PaginationInterface</code> <Badge class="badge badge--secondary"></Badge>',id:"paginationinterface-",level:4},{value:"Returned By",id:"returned-by",level:3}];function b(e){const n={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"No description"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-graphql",children:"type ConventionsPagination implements PaginationInterface {\n  current_page: Int!\n  entries: [Convention!]!\n  per_page: Int!\n  total_entries: Int!\n  total_pages: Int!\n}\n"})}),"\n",(0,t.jsx)(n.h3,{id:"fields",children:"Fields"}),"\n",(0,t.jsxs)(n.h4,{id:"conventionspaginationcurrent_pageint--",children:[(0,t.jsx)(n.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["ConventionsPagination.",(0,t.jsx)("b",{children:"current_page"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,t.jsx)(n.code,{children:"Int!"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsx)(n.p,{children:"The number of the page currently being returned in this query"}),"\n"]}),"\n",(0,t.jsxs)(n.h4,{id:"conventionspaginationentriesconvention--",children:[(0,t.jsx)(n.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["ConventionsPagination.",(0,t.jsx)("b",{children:"entries"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(n.a,{href:"/docs/graphql/types/objects/convention",children:(0,t.jsx)(n.code,{children:"[Convention!]!"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,t.jsx)(n.blockquote,{children:"\n"}),"\n",(0,t.jsxs)(n.h4,{id:"conventionspaginationper_pageint--",children:[(0,t.jsx)(n.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["ConventionsPagination.",(0,t.jsx)("b",{children:"per_page"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,t.jsx)(n.code,{children:"Int!"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsx)(n.p,{children:"The number of items per page currently being returned in this query"}),"\n"]}),"\n",(0,t.jsxs)(n.h4,{id:"conventionspaginationtotal_entriesint--",children:[(0,t.jsx)(n.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["ConventionsPagination.",(0,t.jsx)("b",{children:"total_entries"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,t.jsx)(n.code,{children:"Int!"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsx)(n.p,{children:"The total number of items in the paginated list (across all pages)"}),"\n"]}),"\n",(0,t.jsxs)(n.h4,{id:"conventionspaginationtotal_pagesint--",children:[(0,t.jsx)(n.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["ConventionsPagination.",(0,t.jsx)("b",{children:"total_pages"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,t.jsx)(n.code,{children:"Int!"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsx)(n.p,{children:"The total number of pages in the paginated list"}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"interfaces",children:"Interfaces"}),"\n",(0,t.jsxs)(n.h4,{id:"paginationinterface-",children:[(0,t.jsx)(n.a,{href:"/docs/graphql/types/interfaces/pagination-interface",children:(0,t.jsx)(n.code,{children:"PaginationInterface"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"interface"})]}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsx)(n.p,{children:"PaginationInterface provides a way to use offset-based pagination on a list of objects. This\nis useful for UIs such as Intercode's table views, which provide a way to jump between numbered\npages."}),"\n",(0,t.jsx)(n.p,{children:"Page numbers in PaginationInterface are 1-based (so, the first page is page 1, then page 2,\netc.) The number of items per page can be controlled via the per_page argument on paginated\nfields. It defaults to 20, and can go up to 200."}),"\n",(0,t.jsxs)(n.p,{children:["Offset-based pagination is different from\n",(0,t.jsx)(n.a,{href:"https://relay.dev/graphql/connections.htm",children:"Relay's cursor-based pagination"})," that is more\ncommonly used in GraphQL APIs. We chose to go with an offset-based approach due to our UI\nneeds, but if a cursor-based approach is desirable in the future, we may also implement Relay\nconnections alongside our existing pagination fields."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"returned-by",children:"Returned By"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"/docs/graphql/api/queries/conventions-paginated",children:(0,t.jsx)(n.code,{children:"conventions_paginated"})}),"  ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"query"})]})]})}function x(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(b,{...e})}):b(e)}},1422:(e,n,a)=>{a.d(n,{R:()=>i,x:()=>c});var t=a(62340);const s={},o=t.createContext(s);function i(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);