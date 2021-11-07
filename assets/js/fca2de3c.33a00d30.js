"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[39553],{75631:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return v}});var i=n(3289);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function d(e,t){if(null==e)return{};var n,i,r=function(e,t){if(null==e)return{};var n,i,r={},o=Object.keys(e);for(i=0;i<o.length;i++)n=o[i],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(i=0;i<o.length;i++)n=o[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=i.createContext({}),c=function(e){var t=i.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=c(e.components);return i.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},s=i.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,p=d(e,["components","mdxType","originalType","parentName"]),s=c(n),v=r,f=s["".concat(l,".").concat(v)]||s[v]||u[v]||o;return n?i.createElement(f,a(a({ref:t},p),{},{components:n})):i.createElement(f,a({ref:t},p))}));function v(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,a=new Array(o);a[0]=s;var d={};for(var l in t)hasOwnProperty.call(t,l)&&(d[l]=t[l]);d.originalType=e,d.mdxType="string"==typeof e?e:r,a[1]=d;for(var c=2;c<o;c++)a[c]=n[c];return i.createElement.apply(null,a)}return i.createElement.apply(null,n)}s.displayName="MDXCreateElement"},83621:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return d},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return p},default:function(){return s}});var i=n(88078),r=n(65844),o=(n(3289),n(75631)),a=["components"],d={id:"convert-ticket-to-event-provided-input",title:"ConvertTicketToEventProvidedInput"},l=void 0,c={unversionedId:"graphql/inputs/convert-ticket-to-event-provided-input",id:"graphql/inputs/convert-ticket-to-event-provided-input",isDocsHomePage:!1,title:"ConvertTicketToEventProvidedInput",description:"Autogenerated input type of ConvertTicketToEventProvided",source:"@site/docs/graphql/inputs/convert-ticket-to-event-provided-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/convert-ticket-to-event-provided-input",permalink:"/docs/graphql/inputs/convert-ticket-to-event-provided-input",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/convert-ticket-to-event-provided-input.mdx",tags:[],version:"current",frontMatter:{id:"convert-ticket-to-event-provided-input",title:"ConvertTicketToEventProvidedInput"},sidebar:"sidebar",previous:{title:"ConventionInput",permalink:"/docs/graphql/inputs/convention-input"},next:{title:"CouponFiltersInput",permalink:"/docs/graphql/inputs/coupon-filters-input"}},p=[{value:"Fields",id:"fields",children:[{value:"<code>clientMutationId</code> (String)",id:"clientmutationid-string",children:[],level:4},{value:"<code>eventId</code> (ID)",id:"eventid-id",children:[],level:4},{value:"<code>ticketTypeId</code> (ID)",id:"tickettypeid-id",children:[],level:4},{value:"<code>transitionalEventId</code> (ID)",id:"transitionaleventid-id",children:[],level:4},{value:"<code>transitionalTicketTypeId</code> (ID)",id:"transitionaltickettypeid-id",children:[],level:4},{value:"<code>transitionalUserConProfileId</code> (ID)",id:"transitionaluserconprofileid-id",children:[],level:4},{value:"<code>userConProfileId</code> (ID)",id:"userconprofileid-id",children:[],level:4}],level:3}],u={toc:p};function s(e){var t=e.components,n=(0,r.Z)(e,a);return(0,o.kt)("wrapper",(0,i.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Autogenerated input type of ConvertTicketToEventProvided"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type ConvertTicketToEventProvidedInput {\n  clientMutationId: String\n  eventId: ID\n  ticketTypeId: ID\n  transitionalEventId: ID\n  transitionalTicketTypeId: ID\n  transitionalUserConProfileId: ID\n  userConProfileId: ID\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"clientmutationid-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"clientMutationId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,o.kt)("h4",{id:"eventid-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"eventId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,o.kt)("h4",{id:"tickettypeid-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"ticketTypeId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,o.kt)("h4",{id:"transitionaleventid-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"transitionalEventId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,o.kt)("h4",{id:"transitionaltickettypeid-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"transitionalTicketTypeId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,o.kt)("h4",{id:"transitionaluserconprofileid-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"transitionalUserConProfileId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,o.kt)("h4",{id:"userconprofileid-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"userConProfileId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"))}s.isMDXComponent=!0}}]);