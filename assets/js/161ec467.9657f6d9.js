"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[60475],{75631:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>u});var a=n(3289);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),c=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},l=function(e){var t=c(e.components);return a.createElement(s.Provider,{value:t},e.children)},g={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),d=c(n),u=r,h=d["".concat(s,".").concat(u)]||d[u]||g[u]||i;return n?a.createElement(h,o(o({ref:t},l),{},{components:n})):a.createElement(h,o({ref:t},l))}));function u(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=d;var p={};for(var s in t)hasOwnProperty.call(t,s)&&(p[s]=t[s]);p.originalType=e,p.mdxType="string"==typeof e?e:r,o[1]=p;for(var c=2;c<i;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},75516:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>g,frontMatter:()=>i,metadata:()=>p,toc:()=>c});var a=n(60953),r=(n(3289),n(75631));const i={id:"signup-changes-pagination",title:"SignupChangesPagination",hide_table_of_contents:!1},o=void 0,p={unversionedId:"graphql/objects/signup-changes-pagination",id:"graphql/objects/signup-changes-pagination",title:"SignupChangesPagination",description:"No description",source:"@site/docs/graphql/objects/signup-changes-pagination.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/signup-changes-pagination",permalink:"/docs/graphql/objects/signup-changes-pagination",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/signup-changes-pagination.mdx",tags:[],version:"current",frontMatter:{id:"signup-changes-pagination",title:"SignupChangesPagination",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"SignupChange",permalink:"/docs/graphql/objects/signup-change"},next:{title:"SignupCountByState",permalink:"/docs/graphql/objects/signup-count-by-state"}},s={},c=[{value:"Fields",id:"fields",level:3},{value:"<code>current_page</code> (<code>Int!</code>)",id:"current_page-int",level:4},{value:"<code>entries</code> (<code>[SignupChange!]!</code>)",id:"entries-signupchange",level:4},{value:"<code>per_page</code> (<code>Int!</code>)",id:"per_page-int",level:4},{value:"<code>total_entries</code> (<code>Int!</code>)",id:"total_entries-int",level:4},{value:"<code>total_pages</code> (<code>Int!</code>)",id:"total_pages-int",level:4},{value:"Interfaces",id:"interfaces",level:3},{value:"<code>PaginationInterface</code>",id:"paginationinterface",level:4}],l={toc:c};function g(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"No description"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-graphql"},"type SignupChangesPagination implements PaginationInterface {\n  current_page: Int!\n  entries: [SignupChange!]!\n  per_page: Int!\n  total_entries: Int!\n  total_pages: Int!\n}\n")),(0,r.kt)("h3",{id:"fields"},"Fields"),(0,r.kt)("h4",{id:"current_page-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"current_page"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int!")),")"),(0,r.kt)("p",null,"The number of the page currently being returned in this query"),(0,r.kt)("h4",{id:"entries-signupchange"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"entries"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/signup-change"},(0,r.kt)("inlineCode",{parentName:"a"},"[SignupChange!]!")),")"),(0,r.kt)("h4",{id:"per_page-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"per_page"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int!")),")"),(0,r.kt)("p",null,"The number of items per page currently being returned in this query"),(0,r.kt)("h4",{id:"total_entries-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"total_entries"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int!")),")"),(0,r.kt)("p",null,"The total number of items in the paginated list (across all pages)"),(0,r.kt)("h4",{id:"total_pages-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"total_pages"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int!")),")"),(0,r.kt)("p",null,"The total number of pages in the paginated list"),(0,r.kt)("h3",{id:"interfaces"},"Interfaces"),(0,r.kt)("h4",{id:"paginationinterface"},(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/interfaces/pagination-interface"},(0,r.kt)("inlineCode",{parentName:"a"},"PaginationInterface"))),(0,r.kt)("p",null,"PaginationInterface provides a way to use offset-based pagination on a list of objects. This\nis useful for UIs such as Intercode's table views, which provide a way to jump between numbered\npages."),(0,r.kt)("p",null,"Page numbers in PaginationInterface are 1-based (so, the first page is page 1, then page 2,\netc.) The number of items per page can be controlled via the per_page argument on paginated\nfields. It defaults to 20, and can go up to 200."),(0,r.kt)("p",null,"Offset-based pagination is different from\n",(0,r.kt)("a",{parentName:"p",href:"https://relay.dev/graphql/connections.htm"},"Relay's cursor-based pagination")," that is more\ncommonly used in GraphQL APIs. We chose to go with an offset-based approach due to our UI\nneeds, but if a cursor-based approach is desirable in the future, we may also implement Relay\nconnections alongside our existing pagination fields."))}g.isMDXComponent=!0}}]);