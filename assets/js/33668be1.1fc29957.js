"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[73564],{75631:function(e,t,r){r.d(t,{Zo:function(){return d},kt:function(){return f}});var n=r(3289);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),p=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},d=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},s=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,d=c(e,["components","mdxType","originalType","parentName"]),s=p(r),f=a,m=s["".concat(l,".").concat(f)]||s[f]||u[f]||o;return r?n.createElement(m,i(i({ref:t},d),{},{components:r})):n.createElement(m,i({ref:t},d))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=s;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var p=2;p<o;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}s.displayName="MDXCreateElement"},27002:function(e,t,r){r.r(t),r.d(t,{assets:function(){return d},contentTitle:function(){return l},default:function(){return f},frontMatter:function(){return c},metadata:function(){return p},toc:function(){return u}});var n=r(3149),a=r(97596),o=(r(3289),r(75631)),i=["components"],c={id:"create-ticket-payload",title:"CreateTicketPayload",hide_table_of_contents:!1},l=void 0,p={unversionedId:"graphql/objects/create-ticket-payload",id:"graphql/objects/create-ticket-payload",title:"CreateTicketPayload",description:"Autogenerated return type of CreateTicket",source:"@site/docs/graphql/objects/create-ticket-payload.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/create-ticket-payload",permalink:"/docs/graphql/objects/create-ticket-payload",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/create-ticket-payload.mdx",tags:[],version:"current",frontMatter:{id:"create-ticket-payload",title:"CreateTicketPayload",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"CreateTeamMemberPayload",permalink:"/docs/graphql/objects/create-team-member-payload"},next:{title:"CreateTicketTypePayload",permalink:"/docs/graphql/objects/create-ticket-type-payload"}},d={},u=[{value:"Fields",id:"fields",level:3},{value:"<code>clientMutationId</code> (<code>String</code>)",id:"clientmutationid-string",level:4},{value:"<code>ticket</code> (<code>Ticket</code>)",id:"ticket-ticket",level:4}],s={toc:u};function f(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Autogenerated return type of CreateTicket"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type CreateTicketPayload {\n  clientMutationId: String\n  ticket: Ticket!\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"clientmutationid-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"clientMutationId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,o.kt)("h4",{id:"ticket-ticket"},(0,o.kt)("inlineCode",{parentName:"h4"},"ticket")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/ticket"},(0,o.kt)("inlineCode",{parentName:"a"},"Ticket")),")"))}f.isMDXComponent=!0}}]);