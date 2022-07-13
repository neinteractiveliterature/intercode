"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[39704],{75631:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var a=n(3289);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(n),m=r,g=u["".concat(s,".").concat(m)]||u[m]||d[m]||i;return n?a.createElement(g,o(o({ref:t},c),{},{components:n})):a.createElement(g,o({ref:t},c))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var p=2;p<i;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},15279:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var a=n(60953),r=(n(3289),n(75631));const i={id:"email-routes-pagination",title:"EmailRoutesPagination",hide_table_of_contents:!1},o=void 0,l={unversionedId:"graphql/objects/email-routes-pagination",id:"graphql/objects/email-routes-pagination",title:"EmailRoutesPagination",description:"No description",source:"@site/docs/graphql/objects/email-routes-pagination.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/email-routes-pagination",permalink:"/docs/graphql/objects/email-routes-pagination",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/email-routes-pagination.mdx",tags:[],version:"current",frontMatter:{id:"email-routes-pagination",title:"EmailRoutesPagination",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"EmailRoute",permalink:"/docs/graphql/objects/email-route"},next:{title:"EventCategory",permalink:"/docs/graphql/objects/event-category"}},s={},p=[{value:"Fields",id:"fields",level:3},{value:"<code>current_page</code> (<code>Int!</code>)",id:"current_page-int",level:4},{value:"<code>entries</code> (<code>[EmailRoute!]!</code>)",id:"entries-emailroute",level:4},{value:"<code>per_page</code> (<code>Int!</code>)",id:"per_page-int",level:4},{value:"<code>total_entries</code> (<code>Int!</code>)",id:"total_entries-int",level:4},{value:"<code>total_pages</code> (<code>Int!</code>)",id:"total_pages-int",level:4},{value:"Interfaces",id:"interfaces",level:3},{value:"<code>PaginationInterface</code>",id:"paginationinterface",level:4}],c={toc:p};function d(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"No description"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-graphql"},"type EmailRoutesPagination implements PaginationInterface {\n  current_page: Int!\n  entries: [EmailRoute!]!\n  per_page: Int!\n  total_entries: Int!\n  total_pages: Int!\n}\n")),(0,r.kt)("h3",{id:"fields"},"Fields"),(0,r.kt)("h4",{id:"current_page-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"current_page"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int!")),")"),(0,r.kt)("p",null,"The number of the page currently being returned in this query"),(0,r.kt)("h4",{id:"entries-emailroute"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"entries"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/email-route"},(0,r.kt)("inlineCode",{parentName:"a"},"[EmailRoute!]!")),")"),(0,r.kt)("h4",{id:"per_page-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"per_page"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int!")),")"),(0,r.kt)("p",null,"The number of items per page currently being returned in this query"),(0,r.kt)("h4",{id:"total_entries-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"total_entries"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int!")),")"),(0,r.kt)("p",null,"The total number of items in the paginated list (across all pages)"),(0,r.kt)("h4",{id:"total_pages-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"total_pages"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int!")),")"),(0,r.kt)("p",null,"The total number of pages in the paginated list"),(0,r.kt)("h3",{id:"interfaces"},"Interfaces"),(0,r.kt)("h4",{id:"paginationinterface"},(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/interfaces/pagination-interface"},(0,r.kt)("inlineCode",{parentName:"a"},"PaginationInterface"))),(0,r.kt)("p",null,"PaginationInterface provides a way to use offset-based pagination on a list of objects. This\nis useful for UIs such as Intercode's table views, which provide a way to jump between numbered\npages."),(0,r.kt)("p",null,"Page numbers in PaginationInterface are 1-based (so, the first page is page 1, then page 2,\netc.) The number of items per page can be controlled via the per_page argument on paginated\nfields. It defaults to 20, and can go up to 200."),(0,r.kt)("p",null,"Offset-based pagination is different from\n",(0,r.kt)("a",{parentName:"p",href:"https://relay.dev/graphql/connections.htm"},"Relay's cursor-based pagination")," that is more\ncommonly used in GraphQL APIs. We chose to go with an offset-based approach due to our UI\nneeds, but if a cursor-based approach is desirable in the future, we may also implement Relay\nconnections alongside our existing pagination fields."))}d.isMDXComponent=!0}}]);