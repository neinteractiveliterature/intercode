"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[27741],{12325:(e,n,a)=>{a.r(n),a.d(n,{Badge:()=>p,Bullet:()=>l,Details:()=>u,SpecifiedBy:()=>g,assets:()=>c,contentTitle:()=>o,default:()=>x,frontMatter:()=>d,metadata:()=>s,toc:()=>h});const s=JSON.parse('{"id":"graphql/types/objects/runs-pagination","title":"RunsPagination","description":"No description","source":"@site/docs/graphql/types/objects/runs-pagination.mdx","sourceDirName":"graphql/types/objects","slug":"/graphql/types/objects/runs-pagination","permalink":"/docs/graphql/types/objects/runs-pagination","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/runs-pagination.mdx","tags":[],"version":"current","frontMatter":{"id":"runs-pagination","title":"RunsPagination"},"sidebar":"sidebar","previous":{"title":"Run","permalink":"/docs/graphql/types/objects/run"},"next":{"title":"SalesCountByProductAndPaymentAmount","permalink":"/docs/graphql/types/objects/sales-count-by-product-and-payment-amount"}}');var t=a(58040),r=a(5365),i=a(62340);const d={id:"runs-pagination",title:"RunsPagination"},o=void 0,c={},l=()=>{const e={span:"span",...(0,r.R)()};return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},g=e=>{const n={a:"a",...(0,r.R)()};return(0,t.jsxs)(t.Fragment,{children:["Specification",(0,t.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const n={span:"span",...(0,r.R)()};return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(n.span,{className:e.class,children:e.text})})},u=({dataOpen:e,dataClose:n,children:a,startOpen:s=!1})=>{const d={details:"details",summary:"summary",...(0,r.R)()},[o,c]=(0,i.useState)(s);return(0,t.jsxs)(d.details,{...o?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,t.jsx)(d.summary,{onClick:e=>{e.preventDefault(),c((e=>!e))},style:{listStyle:"none"},children:o?e:n}),o&&a]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>RunsPagination.<b>current_page</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"runspaginationcurrent_pageint--",level:4},{value:'<code>RunsPagination.<b>entries</b></code><Bullet></Bullet><code>[Run!]!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"runspaginationentriesrun--",level:4},{value:'<code>RunsPagination.<b>per_page</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"runspaginationper_pageint--",level:4},{value:'<code>RunsPagination.<b>total_entries</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"runspaginationtotal_entriesint--",level:4},{value:'<code>RunsPagination.<b>total_pages</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"runspaginationtotal_pagesint--",level:4},{value:"Interfaces",id:"interfaces",level:3},{value:'<code>PaginationInterface</code> <Badge class="badge badge--secondary"></Badge>',id:"paginationinterface-",level:4},{value:"Member Of",id:"member-of",level:3}];function b(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"No description"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-graphql",children:"type RunsPagination implements PaginationInterface {\n  current_page: Int!\n  entries: [Run!]!\n  per_page: Int!\n  total_entries: Int!\n  total_pages: Int!\n}\n"})}),"\n",(0,t.jsx)(n.h3,{id:"fields",children:"Fields"}),"\n",(0,t.jsxs)(n.h4,{id:"runspaginationcurrent_pageint--",children:[(0,t.jsx)(n.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["RunsPagination.",(0,t.jsx)("b",{children:"current_page"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,t.jsx)(n.code,{children:"Int!"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsx)(n.p,{children:"The number of the page currently being returned in this query"}),"\n",(0,t.jsxs)(n.h4,{id:"runspaginationentriesrun--",children:[(0,t.jsx)(n.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["RunsPagination.",(0,t.jsx)("b",{children:"entries"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(n.a,{href:"/docs/graphql/types/objects/run",children:(0,t.jsx)(n.code,{children:"[Run!]!"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,t.jsxs)(n.h4,{id:"runspaginationper_pageint--",children:[(0,t.jsx)(n.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["RunsPagination.",(0,t.jsx)("b",{children:"per_page"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,t.jsx)(n.code,{children:"Int!"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsx)(n.p,{children:"The number of items per page currently being returned in this query"}),"\n",(0,t.jsxs)(n.h4,{id:"runspaginationtotal_entriesint--",children:[(0,t.jsx)(n.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["RunsPagination.",(0,t.jsx)("b",{children:"total_entries"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,t.jsx)(n.code,{children:"Int!"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsx)(n.p,{children:"The total number of items in the paginated list (across all pages)"}),"\n",(0,t.jsxs)(n.h4,{id:"runspaginationtotal_pagesint--",children:[(0,t.jsx)(n.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["RunsPagination.",(0,t.jsx)("b",{children:"total_pages"})]})}),(0,t.jsx)(l,{}),(0,t.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,t.jsx)(n.code,{children:"Int!"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsx)(n.p,{children:"The total number of pages in the paginated list"}),"\n",(0,t.jsx)(n.h3,{id:"interfaces",children:"Interfaces"}),"\n",(0,t.jsxs)(n.h4,{id:"paginationinterface-",children:[(0,t.jsx)(n.a,{href:"/docs/graphql/types/interfaces/pagination-interface",children:(0,t.jsx)(n.code,{children:"PaginationInterface"})})," ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"interface"})]}),"\n",(0,t.jsx)(n.p,{children:"PaginationInterface provides a way to use offset-based pagination on a list of objects. This\nis useful for UIs such as Intercode's table views, which provide a way to jump between numbered\npages."}),"\n",(0,t.jsx)(n.p,{children:"Page numbers in PaginationInterface are 1-based (so, the first page is page 1, then page 2,\netc.) The number of items per page can be controlled via the per_page argument on paginated\nfields. It defaults to 20, and can go up to 200."}),"\n",(0,t.jsxs)(n.p,{children:["Offset-based pagination is different from\n",(0,t.jsx)(n.a,{href:"https://relay.dev/graphql/connections.htm",children:"Relay's cursor-based pagination"})," that is more\ncommonly used in GraphQL APIs. We chose to go with an offset-based approach due to our UI\nneeds, but if a cursor-based approach is desirable in the future, we may also implement Relay\nconnections alongside our existing pagination fields."]}),"\n",(0,t.jsx)(n.h3,{id:"member-of",children:"Member Of"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"/docs/graphql/types/objects/convention",children:(0,t.jsx)(n.code,{children:"Convention"})}),"  ",(0,t.jsx)(p,{class:"badge badge--secondary",text:"object"})]})]})}function x(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(b,{...e})}):b(e)}},5365:(e,n,a)=>{a.d(n,{R:()=>i,x:()=>d});var s=a(62340);const t={},r=s.createContext(t);function i(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);