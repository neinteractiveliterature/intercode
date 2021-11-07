"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[22821],{75631:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return m}});var n=r(3289);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},p=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,a=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=u(r),m=i,f=d["".concat(s,".").concat(m)]||d[m]||c[m]||a;return r?n.createElement(f,o(o({ref:t},p),{},{components:r})):n.createElement(f,o({ref:t},p))}));function m(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=r.length,o=new Array(a);o[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var u=2;u<a;u++)o[u]=r[u];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},29399:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return u},toc:function(){return p},default:function(){return d}});var n=r(88078),i=r(65844),a=(r(3289),r(75631)),o=["components"],l={id:"email-routes-paginated",title:"email_routes_paginated"},s=void 0,u={unversionedId:"graphql/queries/email-routes-paginated",id:"graphql/queries/email-routes-paginated",isDocsHomePage:!1,title:"email_routes_paginated",description:"Returns a paginated list of the global email routes configured in Intercode.",source:"@site/docs/graphql/queries/email-routes-paginated.mdx",sourceDirName:"graphql/queries",slug:"/graphql/queries/email-routes-paginated",permalink:"/docs/graphql/queries/email-routes-paginated",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/queries/email-routes-paginated.mdx",tags:[],version:"current",frontMatter:{id:"email-routes-paginated",title:"email_routes_paginated"},sidebar:"sidebar",previous:{title:"currentUser",permalink:"/docs/graphql/queries/current-user"},next:{title:"myAuthorizedApplications",permalink:"/docs/graphql/queries/my-authorized-applications"}},p=[{value:"Arguments",id:"arguments",children:[{value:"<code>filters</code> (EmailRouteFiltersInput)",id:"filters-emailroutefiltersinput",children:[],level:4},{value:"<code>page</code> (Int)",id:"page-int",children:[],level:4},{value:"<code>per_page</code> (Int)",id:"per_page-int",children:[],level:4},{value:"<code>sort</code> ([SortInput!])",id:"sort-sortinput",children:[],level:4}],level:3},{value:"Type",id:"type",children:[{value:"EmailRoutesPagination",id:"emailroutespagination",children:[],level:4}],level:3}],c={toc:p};function d(e){var t=e.components,r=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Returns a paginated list of the ",(0,a.kt)("em",{parentName:"p"},"global")," email routes configured in Intercode.\n(Convention-specific email routing is controlled via that convention's StaffPositions.)"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"email_routes_paginated(\n  filters: EmailRouteFiltersInput\n  page: Int\n  per_page: Int\n  sort: [SortInput!]\n): EmailRoutesPagination!\n\n")),(0,a.kt)("h3",{id:"arguments"},"Arguments"),(0,a.kt)("h4",{id:"filters-emailroutefiltersinput"},(0,a.kt)("inlineCode",{parentName:"h4"},"filters")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/email-route-filters-input"},(0,a.kt)("inlineCode",{parentName:"a"},"EmailRouteFiltersInput")),")"),(0,a.kt)("p",null,"Filters to restrict what items will appear in the result set."),(0,a.kt)("h4",{id:"page-int"},(0,a.kt)("inlineCode",{parentName:"h4"},"page")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,a.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,a.kt)("p",null,"The page number to return from the result set. Page numbers start with 1."),(0,a.kt)("h4",{id:"per_page-int"},(0,a.kt)("inlineCode",{parentName:"h4"},"per_page")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,a.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,a.kt)("p",null,"The number of items to return per page. Defaults to 20, can go up to 200."),(0,a.kt)("h4",{id:"sort-sortinput"},(0,a.kt)("inlineCode",{parentName:"h4"},"sort")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/sort-input"},(0,a.kt)("inlineCode",{parentName:"a"},"[SortInput!]")),")"),(0,a.kt)("p",null,"A set of fields to use for ordering the result set. The second field is used as a\ntiebreaker for the first, the third field is used as a tiebreaker for the first two,\nand so on. If the sort argument is missing or empty, the order of items will be left\nup to the database (and may be unpredictable)."),(0,a.kt)("h3",{id:"type"},"Type"),(0,a.kt)("h4",{id:"emailroutespagination"},(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/email-routes-pagination"},(0,a.kt)("inlineCode",{parentName:"a"},"EmailRoutesPagination"))))}d.isMDXComponent=!0}}]);