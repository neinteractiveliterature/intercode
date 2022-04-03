"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[65899],{75631:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return f}});var r=n(3289);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},p=Object.keys(e);for(r=0;r<p.length;r++)n=p[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(r=0;r<p.length;r++)n=p[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,p=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),s=u(n),f=o,v=s["".concat(l,".").concat(f)]||s[f]||d[f]||p;return n?r.createElement(v,a(a({ref:t},c),{},{components:n})):r.createElement(v,a({ref:t},c))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var p=n.length,a=new Array(p);a[0]=s;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:o,a[1]=i;for(var u=2;u<p;u++)a[u]=n[u];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},50944:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return l},default:function(){return f},frontMatter:function(){return i},metadata:function(){return u},toc:function(){return d}});var r=n(35161),o=n(79675),p=(n(3289),n(75631)),a=["components"],i={id:"update-event-proposal-input",title:"UpdateEventProposalInput"},l=void 0,u={unversionedId:"graphql/inputs/update-event-proposal-input",id:"graphql/inputs/update-event-proposal-input",title:"UpdateEventProposalInput",description:"Autogenerated input type of UpdateEventProposal",source:"@site/docs/graphql/inputs/update-event-proposal-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/update-event-proposal-input",permalink:"/docs/graphql/inputs/update-event-proposal-input",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/update-event-proposal-input.mdx",tags:[],version:"current",frontMatter:{id:"update-event-proposal-input",title:"UpdateEventProposalInput"},sidebar:"sidebar",previous:{title:"UpdateEventProposalAdminNotesInput",permalink:"/docs/graphql/inputs/update-event-proposal-admin-notes-input"},next:{title:"UpdateFormInput",permalink:"/docs/graphql/inputs/update-form-input"}},c={},d=[{value:"Fields",id:"fields",level:3},{value:"<code>clientMutationId</code> (<code>String</code>)",id:"clientmutationid-string",level:4},{value:"<code>event_proposal</code> (<code>EventProposalInput</code>)",id:"event_proposal-eventproposalinput",level:4},{value:"<code>id</code> (<code>ID</code>)",id:"id-id",level:4}],s={toc:d};function f(e){var t=e.components,n=(0,o.Z)(e,a);return(0,p.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,p.kt)("p",null,"Autogenerated input type of UpdateEventProposal"),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-graphql"},"input UpdateEventProposalInput {\n  clientMutationId: String\n  event_proposal: EventProposalInput!\n  id: ID\n}\n")),(0,p.kt)("h3",{id:"fields"},"Fields"),(0,p.kt)("h4",{id:"clientmutationid-string"},(0,p.kt)("inlineCode",{parentName:"h4"},"clientMutationId")," (",(0,p.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,p.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,p.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,p.kt)("h4",{id:"event_proposal-eventproposalinput"},(0,p.kt)("inlineCode",{parentName:"h4"},"event_proposal")," (",(0,p.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/event-proposal-input"},(0,p.kt)("inlineCode",{parentName:"a"},"EventProposalInput")),")"),(0,p.kt)("h4",{id:"id-id"},(0,p.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,p.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,p.kt)("inlineCode",{parentName:"a"},"ID")),")"))}f.isMDXComponent=!0}}]);