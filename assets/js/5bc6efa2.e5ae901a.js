"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[22821],{75631:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return m}});var n=r(3289);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),s=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},p=function(e){var t=s(e.components);return n.createElement(u.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,u=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=s(r),m=a,f=d["".concat(u,".").concat(m)]||d[m]||c[m]||i;return r?n.createElement(f,o(o({ref:t},p),{},{components:r})):n.createElement(f,o({ref:t},p))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=d;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var s=2;s<i;s++)o[s]=r[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},1978:function(e,t,r){r.r(t),r.d(t,{assets:function(){return p},contentTitle:function(){return u},default:function(){return m},frontMatter:function(){return l},metadata:function(){return s},toc:function(){return c}});var n=r(35161),a=r(79675),i=(r(3289),r(75631)),o=["components"],l={id:"email-routes-paginated",title:"email_routes_paginated"},u=void 0,s={unversionedId:"graphql/queries/email-routes-paginated",id:"graphql/queries/email-routes-paginated",title:"email_routes_paginated",description:"Returns a paginated list of the global email routes configured in Intercode.",source:"@site/docs/graphql/queries/email-routes-paginated.mdx",sourceDirName:"graphql/queries",slug:"/graphql/queries/email-routes-paginated",permalink:"/docs/graphql/queries/email-routes-paginated",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/queries/email-routes-paginated.mdx",tags:[],version:"current",frontMatter:{id:"email-routes-paginated",title:"email_routes_paginated"},sidebar:"sidebar",previous:{title:"currentUser",permalink:"/docs/graphql/queries/current-user"},next:{title:"myAuthorizedApplications",permalink:"/docs/graphql/queries/my-authorized-applications"}},p={},c=[{value:"Arguments",id:"arguments",level:3},{value:"<code>filters</code> (<code>EmailRouteFiltersInput</code>)",id:"filters-emailroutefiltersinput",level:4},{value:"<code>page</code> (<code>Int</code>)",id:"page-int",level:4},{value:"<code>per_page</code> (<code>Int</code>)",id:"per_page-int",level:4},{value:"<code>sort</code> (<code>SortInput</code>)",id:"sort-sortinput",level:4},{value:"Type",id:"type",level:3},{value:"<code>EmailRoutesPagination</code>",id:"emailroutespagination",level:4}],d={toc:c};function m(e){var t=e.components,r=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Returns a paginated list of the ",(0,i.kt)("em",{parentName:"p"},"global")," email routes configured in Intercode.\n(Convention-specific email routing is controlled via that convention's StaffPositions.)"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"email_routes_paginated(\n  filters: EmailRouteFiltersInput\n  page: Int\n  per_page: Int\n  sort: [SortInput!]\n): EmailRoutesPagination!\n\n")),(0,i.kt)("h3",{id:"arguments"},"Arguments"),(0,i.kt)("h4",{id:"filters-emailroutefiltersinput"},(0,i.kt)("inlineCode",{parentName:"h4"},"filters")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/email-route-filters-input"},(0,i.kt)("inlineCode",{parentName:"a"},"EmailRouteFiltersInput")),")"),(0,i.kt)("p",null,"Filters to restrict what items will appear in the result set."),(0,i.kt)("h4",{id:"page-int"},(0,i.kt)("inlineCode",{parentName:"h4"},"page")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,i.kt)("p",null,"The page number to return from the result set.  Page numbers start with 1."),(0,i.kt)("h4",{id:"per_page-int"},(0,i.kt)("inlineCode",{parentName:"h4"},"per_page")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,i.kt)("p",null,"The number of items to return per page.  Defaults to 20, can go up to 200."),(0,i.kt)("h4",{id:"sort-sortinput"},(0,i.kt)("inlineCode",{parentName:"h4"},"sort")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/sort-input"},(0,i.kt)("inlineCode",{parentName:"a"},"SortInput")),")"),(0,i.kt)("p",null,"A set of fields to use for ordering the result set. The second field is used as a\ntiebreaker for the first, the third field is used as a tiebreaker for the first two,\nand so on. If the sort argument is missing or empty, the order of items will be left\nup to the database (and may be unpredictable)."),(0,i.kt)("h3",{id:"type"},"Type"),(0,i.kt)("h4",{id:"emailroutespagination"},(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/email-routes-pagination"},(0,i.kt)("inlineCode",{parentName:"a"},"EmailRoutesPagination"))))}m.isMDXComponent=!0}}]);