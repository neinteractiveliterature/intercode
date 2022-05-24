"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[79168],{75631:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return f}});var r=n(3289);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(n),f=i,m=u["".concat(l,".").concat(f)]||u[f]||d[f]||a;return n?r.createElement(m,o(o({ref:t},p),{},{components:n})):r.createElement(m,o({ref:t},p))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var c=2;c<a;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},41773:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return f},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return d}});var r=n(3149),i=n(97596),a=(n(3289),n(75631)),o=["components"],s={id:"staff-position-input",title:"StaffPositionInput",hide_table_of_contents:!1},l=void 0,c={unversionedId:"graphql/inputs/staff-position-input",id:"graphql/inputs/staff-position-input",title:"StaffPositionInput",description:"No description",source:"@site/docs/graphql/inputs/staff-position-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/staff-position-input",permalink:"/docs/graphql/inputs/staff-position-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/staff-position-input.mdx",tags:[],version:"current",frontMatter:{id:"staff-position-input",title:"StaffPositionInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"SortInput",permalink:"/docs/graphql/inputs/sort-input"},next:{title:"SubmitEventProposalInput",permalink:"/docs/graphql/inputs/submit-event-proposal-input"}},p={},d=[{value:"Fields",id:"fields",level:3},{value:"<code>cc_addresses</code> (<code>String</code>)",id:"cc_addresses-string",level:4},{value:"<code>email</code> (<code>String</code>)",id:"email-string",level:4},{value:"<code>email_aliases</code> (<code>String</code>)",id:"email_aliases-string",level:4},{value:"<code>name</code> (<code>String</code>)",id:"name-string",level:4},{value:"<code>userConProfileIds</code> (<code>ID</code>)",id:"userconprofileids-id",level:4},{value:"<code>visible</code> (<code>Boolean</code>)",id:"visible-boolean",level:4}],u={toc:d};function f(e){var t=e.components,n=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"No description"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"input StaffPositionInput {\n  cc_addresses: [String!]\n  email: String\n  email_aliases: [String!]\n  name: String\n  userConProfileIds: [ID!]\n  visible: Boolean\n}\n")),(0,a.kt)("h3",{id:"fields"},"Fields"),(0,a.kt)("h4",{id:"cc_addresses-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"cc_addresses")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"email-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"email")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"email_aliases-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"email_aliases")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"name-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"name")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"userconprofileids-id"},(0,a.kt)("inlineCode",{parentName:"h4"},"userConProfileIds")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,a.kt)("h4",{id:"visible-boolean"},(0,a.kt)("inlineCode",{parentName:"h4"},"visible")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,a.kt)("inlineCode",{parentName:"a"},"Boolean")),")"))}f.isMDXComponent=!0}}]);