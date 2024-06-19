"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[21260],{30971:(e,a,n)=>{n.r(a),n.d(a,{Badge:()=>p,Bullet:()=>l,Details:()=>h,SpecifiedBy:()=>g,assets:()=>d,contentTitle:()=>c,default:()=>b,frontMatter:()=>r,metadata:()=>o,toc:()=>x});var s=n(58040),t=n(1422),i=n(62340);const r={id:"pagination-interface",title:"PaginationInterface"},c=void 0,o={id:"graphql/types/interfaces/pagination-interface",title:"PaginationInterface",description:"PaginationInterface provides a way to use offset-based pagination on a list of objects. This",source:"@site/docs/graphql/types/interfaces/pagination-interface.mdx",sourceDirName:"graphql/types/interfaces",slug:"/graphql/types/interfaces/pagination-interface",permalink:"/docs/graphql/types/interfaces/pagination-interface",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/interfaces/pagination-interface.mdx",tags:[],version:"current",frontMatter:{id:"pagination-interface",title:"PaginationInterface"},sidebar:"sidebar",previous:{title:"CmsParent",permalink:"/docs/graphql/types/interfaces/cms-parent"},next:{title:"Ability",permalink:"/docs/graphql/types/objects/ability"}},d={},l=()=>{const e={span:"span",...(0,t.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},g=e=>{const a={a:"a",...(0,t.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(a.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},p=e=>{const a={span:"span",...(0,t.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(a.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:a,children:n,startOpen:r=!1})=>{const c={details:"details",summary:"summary",...(0,t.R)()},[o,d]=(0,i.useState)(r);return(0,s.jsxs)(c.details,{...o?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(c.summary,{onClick:e=>{e.preventDefault(),d((e=>!e))},style:{listStyle:"none"},children:o?e:a}),o&&n]})},x=[{value:"Fields",id:"fields",level:3},{value:'<code>PaginationInterface.<b>current_page</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"paginationinterfacecurrent_pageint--",level:4},{value:'<code>PaginationInterface.<b>per_page</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"paginationinterfaceper_pageint--",level:4},{value:'<code>PaginationInterface.<b>total_entries</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"paginationinterfacetotal_entriesint--",level:4},{value:'<code>PaginationInterface.<b>total_pages</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"paginationinterfacetotal_pagesint--",level:4},{value:"Implemented By",id:"implemented-by",level:3}];function j(e){const a={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(a.p,{children:"PaginationInterface provides a way to use offset-based pagination on a list of objects. This\nis useful for UIs such as Intercode's table views, which provide a way to jump between numbered\npages."}),"\n",(0,s.jsx)(a.p,{children:"Page numbers in PaginationInterface are 1-based (so, the first page is page 1, then page 2,\netc.) The number of items per page can be controlled via the per_page argument on paginated\nfields. It defaults to 20, and can go up to 200."}),"\n",(0,s.jsxs)(a.p,{children:["Offset-based pagination is different from\n",(0,s.jsx)(a.a,{href:"https://relay.dev/graphql/connections.htm",children:"Relay's cursor-based pagination"})," that is more\ncommonly used in GraphQL APIs. We chose to go with an offset-based approach due to our UI\nneeds, but if a cursor-based approach is desirable in the future, we may also implement Relay\nconnections alongside our existing pagination fields."]}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{className:"language-graphql",children:"interface PaginationInterface {\n  current_page: Int!\n  per_page: Int!\n  total_entries: Int!\n  total_pages: Int!\n}\n"})}),"\n",(0,s.jsx)(a.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(a.h4,{id:"paginationinterfacecurrent_pageint--",children:[(0,s.jsx)(a.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["PaginationInterface.",(0,s.jsx)("b",{children:"current_page"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(a.code,{children:"Int!"})})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(a.blockquote,{children:["\n",(0,s.jsx)(a.p,{children:"The number of the page currently being returned in this query"}),"\n"]}),"\n",(0,s.jsxs)(a.h4,{id:"paginationinterfaceper_pageint--",children:[(0,s.jsx)(a.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["PaginationInterface.",(0,s.jsx)("b",{children:"per_page"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(a.code,{children:"Int!"})})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(a.blockquote,{children:["\n",(0,s.jsx)(a.p,{children:"The number of items per page currently being returned in this query"}),"\n"]}),"\n",(0,s.jsxs)(a.h4,{id:"paginationinterfacetotal_entriesint--",children:[(0,s.jsx)(a.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["PaginationInterface.",(0,s.jsx)("b",{children:"total_entries"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(a.code,{children:"Int!"})})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(a.blockquote,{children:["\n",(0,s.jsx)(a.p,{children:"The total number of items in the paginated list (across all pages)"}),"\n"]}),"\n",(0,s.jsxs)(a.h4,{id:"paginationinterfacetotal_pagesint--",children:[(0,s.jsx)(a.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["PaginationInterface.",(0,s.jsx)("b",{children:"total_pages"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/scalars/int",children:(0,s.jsx)(a.code,{children:"Int!"})})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(a.blockquote,{children:["\n",(0,s.jsx)(a.p,{children:"The total number of pages in the paginated list"}),"\n"]}),"\n",(0,s.jsx)(a.h3,{id:"implemented-by",children:"Implemented By"}),"\n",(0,s.jsxs)(a.p,{children:[(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/conventions-pagination",children:(0,s.jsx)(a.code,{children:"ConventionsPagination"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/coupons-pagination",children:(0,s.jsx)(a.code,{children:"CouponsPagination"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/email-routes-pagination",children:(0,s.jsx)(a.code,{children:"EmailRoutesPagination"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/event-proposals-pagination",children:(0,s.jsx)(a.code,{children:"EventProposalsPagination"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/events-pagination",children:(0,s.jsx)(a.code,{children:"EventsPagination"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/orders-pagination",children:(0,s.jsx)(a.code,{children:"OrdersPagination"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/runs-pagination",children:(0,s.jsx)(a.code,{children:"RunsPagination"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/signup-changes-pagination",children:(0,s.jsx)(a.code,{children:"SignupChangesPagination"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/signup-requests-pagination",children:(0,s.jsx)(a.code,{children:"SignupRequestsPagination"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/signups-pagination",children:(0,s.jsx)(a.code,{children:"SignupsPagination"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/user-con-profiles-pagination",children:(0,s.jsx)(a.code,{children:"UserConProfilesPagination"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(l,{}),(0,s.jsx)(a.a,{href:"/docs/graphql/types/objects/users-pagination",children:(0,s.jsx)(a.code,{children:"UsersPagination"})}),"  ",(0,s.jsx)(p,{class:"badge badge--secondary",text:"object"})]})]})}function b(e={}){const{wrapper:a}={...(0,t.R)(),...e.components};return a?(0,s.jsx)(a,{...e,children:(0,s.jsx)(j,{...e})}):j(e)}},1422:(e,a,n)=>{n.d(a,{R:()=>r,x:()=>c});var s=n(62340);const t={},i=s.createContext(t);function r(e){const a=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function c(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),s.createElement(i.Provider,{value:a},e.children)}}}]);