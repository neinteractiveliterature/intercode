"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[88228],{75631:function(e,t,a){a.d(t,{Zo:function(){return s},kt:function(){return m}});var n=a(3289);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function c(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=n.createContext({}),p=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},s=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),u=p(a),m=r,h=u["".concat(l,".").concat(m)]||u[m]||d[m]||o;return a?n.createElement(h,i(i({ref:t},s),{},{components:a})):n.createElement(h,i({ref:t},s))}));function m(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,i=new Array(o);i[0]=u;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var p=2;p<o;p++)i[p]=a[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},80329:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return c},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return s},default:function(){return u}});var n=a(14002),r=a(89922),o=(a(3289),a(75631)),i=["components"],c={id:"attach-image-to-event-proposal-payload",title:"AttachImageToEventProposalPayload"},l=void 0,p={unversionedId:"graphql/objects/attach-image-to-event-proposal-payload",id:"graphql/objects/attach-image-to-event-proposal-payload",title:"AttachImageToEventProposalPayload",description:"Autogenerated return type of AttachImageToEventProposal",source:"@site/docs/graphql/objects/attach-image-to-event-proposal-payload.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/attach-image-to-event-proposal-payload",permalink:"/docs/graphql/objects/attach-image-to-event-proposal-payload",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/attach-image-to-event-proposal-payload.mdx",tags:[],version:"current",frontMatter:{id:"attach-image-to-event-proposal-payload",title:"AttachImageToEventProposalPayload"},sidebar:"sidebar",previous:{title:"AttachImageToEventPayload",permalink:"/docs/graphql/objects/attach-image-to-event-payload"},next:{title:"AuthorizedApplication",permalink:"/docs/graphql/objects/authorized-application"}},s=[{value:"Fields",id:"fields",children:[{value:"<code>attachment</code> (ActiveStorageAttachment)",id:"attachment-activestorageattachment",children:[],level:4},{value:"<code>clientMutationId</code> (String)",id:"clientmutationid-string",children:[],level:4},{value:"<code>event_proposal</code> (EventProposal)",id:"event_proposal-eventproposal",children:[],level:4}],level:3}],d={toc:s};function u(e){var t=e.components,a=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Autogenerated return type of AttachImageToEventProposal"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type AttachImageToEventProposalPayload {\n  attachment: ActiveStorageAttachment!\n  clientMutationId: String\n  event_proposal: EventProposal!\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"attachment-activestorageattachment"},(0,o.kt)("inlineCode",{parentName:"h4"},"attachment")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/active-storage-attachment"},(0,o.kt)("inlineCode",{parentName:"a"},"ActiveStorageAttachment")),")"),(0,o.kt)("h4",{id:"clientmutationid-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"clientMutationId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,o.kt)("h4",{id:"event_proposal-eventproposal"},(0,o.kt)("inlineCode",{parentName:"h4"},"event_proposal")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/event-proposal"},(0,o.kt)("inlineCode",{parentName:"a"},"EventProposal")),")"))}u.isMDXComponent=!0}}]);