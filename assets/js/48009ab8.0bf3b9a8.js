"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[99603],{92308:(e,n,a)=>{a.r(n),a.d(n,{Badge:()=>g,Bullet:()=>c,Details:()=>h,SpecifiedBy:()=>p,assets:()=>d,contentTitle:()=>i,default:()=>x,frontMatter:()=>r,metadata:()=>l,toc:()=>b});var s=a(58040),t=a(1422),o=a(62340);const r={id:"event-proposals-pagination",title:"EventProposalsPagination"},i=void 0,l={id:"graphql/types/objects/event-proposals-pagination",title:"EventProposalsPagination",description:"No description",source:"@site/docs/graphql/types/objects/event-proposals-pagination.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/event-proposals-pagination",permalink:"/docs/graphql/types/objects/event-proposals-pagination",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/event-proposals-pagination.mdx",tags:[],version:"current",frontMatter:{id:"event-proposals-pagination",title:"EventProposalsPagination"},sidebar:"sidebar",previous:{title:"EventProposal",permalink:"/docs/graphql/types/objects/event-proposal"},next:{title:"EventProvidedTicketList",permalink:"/docs/graphql/types/objects/event-provided-ticket-list"}},d={},c=()=>{const e={span:"span",...(0,t.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const n={a:"a",...(0,t.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},g=e=>{const n={span:"span",...(0,t.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(n.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:n,children:a,startOpen:r=!1})=>{const i={details:"details",summary:"summary",...(0,t.R)()},[l,d]=(0,o.useState)(r);return(0,s.jsxs)(i.details,{...l?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(i.summary,{onClick:e=>{e.preventDefault(),d((e=>!e))},style:{listStyle:"none"},children:l?e:n}),l&&a]})},b=[{value:"Fields",id:"fields",level:3},{value:'<code>EventProposalsPagination.<b>current_page</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"eventproposalspaginationcurrent_pageint--",level:4},{value:'<code>EventProposalsPagination.<b>entries</b></code><Bullet></Bullet><code>[EventProposal!]!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"eventproposalspaginationentrieseventproposal--",level:4},{value:'<code>EventProposalsPagination.<b>per_page</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"eventproposalspaginationper_pageint--",level:4},{value:'<code>EventProposalsPagination.<b>total_entries</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"eventproposalspaginationtotal_entriesint--",level:4},{value:'<code>EventProposalsPagination.<b>total_pages</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"eventproposalspaginationtotal_pagesint--",level:4},{value:"Interfaces",id:"interfaces",level:3},{value:'<code>PaginationInterface</code> <Badge class="badge badge--secondary"></Badge>',id:"paginationinterface-",level:4},{value:"Member Of",id:"member-of",level:3}];function u(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"No description"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-graphql",children:"type EventProposalsPagination implements PaginationInterface {\n  current_page: Int!\n  entries: [EventProposal!]!\n  per_page: Int!\n  total_entries: Int!\n  total_pages: Int!\n}\n"})}),"\n",(0,s.jsx)(n.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(n.h4,{id:"eventproposalspaginationcurrent_pageint--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["EventProposalsPagination.",(0,s.jsx)("b",{children:"current_page"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(n.code,{children:"Int!"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.p,{children:"The number of the page currently being returned in this query"}),"\n",(0,s.jsxs)(n.h4,{id:"eventproposalspaginationentrieseventproposal--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["EventProposalsPagination.",(0,s.jsx)("b",{children:"entries"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/objects/event-proposal",children:(0,s.jsx)(n.code,{children:"[EventProposal!]!"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsxs)(n.h4,{id:"eventproposalspaginationper_pageint--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["EventProposalsPagination.",(0,s.jsx)("b",{children:"per_page"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(n.code,{children:"Int!"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.p,{children:"The number of items per page currently being returned in this query"}),"\n",(0,s.jsxs)(n.h4,{id:"eventproposalspaginationtotal_entriesint--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["EventProposalsPagination.",(0,s.jsx)("b",{children:"total_entries"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(n.code,{children:"Int!"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.p,{children:"The total number of items in the paginated list (across all pages)"}),"\n",(0,s.jsxs)(n.h4,{id:"eventproposalspaginationtotal_pagesint--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["EventProposalsPagination.",(0,s.jsx)("b",{children:"total_pages"})]})}),(0,s.jsx)(c,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(n.code,{children:"Int!"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.p,{children:"The total number of pages in the paginated list"}),"\n",(0,s.jsx)(n.h3,{id:"interfaces",children:"Interfaces"}),"\n",(0,s.jsxs)(n.h4,{id:"paginationinterface-",children:[(0,s.jsx)(n.a,{href:"/docs/graphql/types/interfaces/pagination-interface",children:(0,s.jsx)(n.code,{children:"PaginationInterface"})})," ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"interface"})]}),"\n",(0,s.jsx)(n.p,{children:"PaginationInterface provides a way to use offset-based pagination on a list of objects. This\nis useful for UIs such as Intercode's table views, which provide a way to jump between numbered\npages."}),"\n",(0,s.jsx)(n.p,{children:"Page numbers in PaginationInterface are 1-based (so, the first page is page 1, then page 2,\netc.) The number of items per page can be controlled via the per_page argument on paginated\nfields. It defaults to 20, and can go up to 200."}),"\n",(0,s.jsxs)(n.p,{children:["Offset-based pagination is different from\n",(0,s.jsx)(n.a,{href:"https://relay.dev/graphql/connections.htm",children:"Relay's cursor-based pagination"})," that is more\ncommonly used in GraphQL APIs. We chose to go with an offset-based approach due to our UI\nneeds, but if a cursor-based approach is desirable in the future, we may also implement Relay\nconnections alongside our existing pagination fields."]}),"\n",(0,s.jsx)(n.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"/docs/graphql/types/objects/convention",children:(0,s.jsx)(n.code,{children:"Convention"})}),"  ",(0,s.jsx)(g,{class:"badge badge--secondary",text:"object"})]})]})}function x(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},1422:(e,n,a)=>{a.d(n,{R:()=>r,x:()=>i});var s=a(62340);const t={},o=s.createContext(t);function r(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);