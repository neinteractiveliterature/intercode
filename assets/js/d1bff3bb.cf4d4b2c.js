"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[73954],{75631:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return m}});var r=n(3289);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),s=l(n),m=a,f=s["".concat(c,".").concat(m)]||s[m]||d[m]||o;return n?r.createElement(f,i(i({ref:t},u),{},{components:n})):r.createElement(f,i({ref:t},u))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=s;var p={};for(var c in t)hasOwnProperty.call(t,c)&&(p[c]=t[c]);p.originalType=e,p.mdxType="string"==typeof e?e:a,i[1]=p;for(var l=2;l<o;l++)i[l]=n[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},95469:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return c},default:function(){return m},frontMatter:function(){return p},metadata:function(){return l},toc:function(){return d}});var r=n(3149),a=n(97596),o=(n(3289),n(75631)),i=["components"],p={id:"attach-image-to-event-proposal-input",title:"AttachImageToEventProposalInput",hide_table_of_contents:!1},c=void 0,l={unversionedId:"graphql/inputs/attach-image-to-event-proposal-input",id:"graphql/inputs/attach-image-to-event-proposal-input",title:"AttachImageToEventProposalInput",description:"Autogenerated input type of AttachImageToEventProposal",source:"@site/docs/graphql/inputs/attach-image-to-event-proposal-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/attach-image-to-event-proposal-input",permalink:"/docs/graphql/inputs/attach-image-to-event-proposal-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/attach-image-to-event-proposal-input.mdx",tags:[],version:"current",frontMatter:{id:"attach-image-to-event-proposal-input",title:"AttachImageToEventProposalInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"AttachImageToEventInput",permalink:"/docs/graphql/inputs/attach-image-to-event-input"},next:{title:"CancelOrderInput",permalink:"/docs/graphql/inputs/cancel-order-input"}},u={},d=[{value:"Fields",id:"fields",level:3},{value:"<code>clientMutationId</code> (<code>String</code>)",id:"clientmutationid-string",level:4},{value:"<code>id</code> (<code>ID</code>)",id:"id-id",level:4},{value:"<code>signedBlobId</code> (<code>ID</code>)",id:"signedblobid-id",level:4}],s={toc:d};function m(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Autogenerated input type of AttachImageToEventProposal"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"input AttachImageToEventProposalInput {\n  clientMutationId: String\n  id: ID\n  signedBlobId: ID!\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"clientmutationid-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"clientMutationId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,o.kt)("h4",{id:"id-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,o.kt)("h4",{id:"signedblobid-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"signedBlobId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"))}m.isMDXComponent=!0}}]);