"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[12424],{75631:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>y});var r=n(3289);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var o=r.createContext({}),l=function(e){var t=r.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},u=function(e){var t=l(e.components);return r.createElement(o.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,o=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),s=l(n),y=i,f=s["".concat(o,".").concat(y)]||s[y]||d[y]||a;return n?r.createElement(f,p(p({ref:t},u),{},{components:n})):r.createElement(f,p({ref:t},u))}));function y(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,p=new Array(a);p[0]=s;var c={};for(var o in t)hasOwnProperty.call(t,o)&&(c[o]=t[o]);c.originalType=e,c.mdxType="string"==typeof e?e:i,p[1]=c;for(var l=2;l<a;l++)p[l]=n[l];return r.createElement.apply(null,p)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},1218:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>p,default:()=>d,frontMatter:()=>a,metadata:()=>c,toc:()=>l});var r=n(60953),i=(n(3289),n(75631));const a={id:"create-ticket-type-input",title:"CreateTicketTypeInput",hide_table_of_contents:!1},p=void 0,c={unversionedId:"graphql/inputs/create-ticket-type-input",id:"graphql/inputs/create-ticket-type-input",title:"CreateTicketTypeInput",description:"Autogenerated input type of CreateTicketType",source:"@site/docs/graphql/inputs/create-ticket-type-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/create-ticket-type-input",permalink:"/docs/graphql/inputs/create-ticket-type-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/create-ticket-type-input.mdx",tags:[],version:"current",frontMatter:{id:"create-ticket-type-input",title:"CreateTicketTypeInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"CreateTicketInput",permalink:"/docs/graphql/inputs/create-ticket-input"},next:{title:"CreateUserActivityAlertInput",permalink:"/docs/graphql/inputs/create-user-activity-alert-input"}},o={},l=[{value:"Fields",id:"fields",level:3},{value:"<code>clientMutationId</code> (<code>String</code>)",id:"clientmutationid-string",level:4},{value:"<code>eventId</code> (<code>ID</code>)",id:"eventid-id",level:4},{value:"<code>ticket_type</code> (<code>TicketTypeInput!</code>)",id:"ticket_type-tickettypeinput",level:4}],u={toc:l};function d(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Autogenerated input type of CreateTicketType"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"input CreateTicketTypeInput {\n  clientMutationId: String\n  eventId: ID\n  ticket_type: TicketTypeInput!\n}\n")),(0,i.kt)("h3",{id:"fields"},"Fields"),(0,i.kt)("h4",{id:"clientmutationid-string"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("inlineCode",{parentName:"a"},"clientMutationId"))," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,i.kt)("h4",{id:"eventid-id"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("inlineCode",{parentName:"a"},"eventId"))," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,i.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,i.kt)("h4",{id:"ticket_type-tickettypeinput"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("inlineCode",{parentName:"a"},"ticket_type"))," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/ticket-type-input"},(0,i.kt)("inlineCode",{parentName:"a"},"TicketTypeInput!")),")"))}d.isMDXComponent=!0}}]);