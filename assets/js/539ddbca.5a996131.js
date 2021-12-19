"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[12324],{75631:function(e,r,n){n.d(r,{Zo:function(){return p},kt:function(){return m}});var t=n(3289);function i(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function a(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function o(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?a(Object(n),!0).forEach((function(r){i(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function l(e,r){if(null==e)return{};var n,t,i=function(e,r){if(null==e)return{};var n,t,i={},a=Object.keys(e);for(t=0;t<a.length;t++)n=a[t],r.indexOf(n)>=0||(i[n]=e[n]);return i}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)n=a[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=t.createContext({}),c=function(e){var r=t.useContext(s),n=r;return e&&(n="function"==typeof e?e(r):o(o({},r),e)),n},p=function(e){var r=c(e.components);return t.createElement(s.Provider,{value:r},e.children)},d={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},u=t.forwardRef((function(e,r){var n=e.components,i=e.mdxType,a=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(n),m=i,g=u["".concat(s,".").concat(m)]||u[m]||d[m]||a;return n?t.createElement(g,o(o({ref:r},p),{},{components:n})):t.createElement(g,o({ref:r},p))}));function m(e,r){var n=arguments,i=r&&r.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=u;var l={};for(var s in r)hasOwnProperty.call(r,s)&&(l[s]=r[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var c=2;c<a;c++)o[c]=n[c];return t.createElement.apply(null,o)}return t.createElement.apply(null,n)}u.displayName="MDXCreateElement"},79876:function(e,r,n){n.r(r),n.d(r,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return c},toc:function(){return p},default:function(){return u}});var t=n(69432),i=n(58703),a=(n(3289),n(75631)),o=["components"],l={id:"user",title:"User"},s=void 0,c={unversionedId:"graphql/objects/user",id:"graphql/objects/user",title:"User",description:"No description",source:"@site/docs/graphql/objects/user.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/user",permalink:"/docs/graphql/objects/user",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/user.mdx",tags:[],version:"current",frontMatter:{id:"user",title:"User"},sidebar:"sidebar",previous:{title:"UserConProfilesPagination",permalink:"/docs/graphql/objects/user-con-profiles-pagination"},next:{title:"UsersPagination",permalink:"/docs/graphql/objects/users-pagination"}},p=[{value:"Fields",id:"fields",children:[{value:"<code>email</code> (String)",id:"email-string",children:[],level:4},{value:"<code>event_proposals</code> (EventProposal)",id:"event_proposals-eventproposal",children:[],level:4},{value:"<code>first_name</code> (String)",id:"first_name-string",children:[],level:4},{value:"<code>id</code> (ID)",id:"id-id",children:[],level:4},{value:"<code>last_name</code> (String)",id:"last_name-string",children:[],level:4},{value:"<code>name</code> (String)",id:"name-string",children:[],level:4},{value:"<code>name_inverted</code> (String)",id:"name_inverted-string",children:[],level:4},{value:"<code>privileges</code> (String)",id:"privileges-string",children:[],level:4},{value:"<code>user_con_profiles</code> (UserConProfile)",id:"user_con_profiles-userconprofile",children:[],level:4}],level:3}],d={toc:p};function u(e){var r=e.components,n=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,t.Z)({},d,n,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"No description"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"type User {\n  email: String\n  event_proposals: [EventProposal!]!\n  first_name: String\n  id: ID!\n  last_name: String\n  name: String\n  name_inverted: String\n  privileges: [String!]\n  user_con_profiles: [UserConProfile!]!\n}\n")),(0,a.kt)("h3",{id:"fields"},"Fields"),(0,a.kt)("h4",{id:"email-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"email")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"event_proposals-eventproposal"},(0,a.kt)("inlineCode",{parentName:"h4"},"event_proposals")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/event-proposal"},(0,a.kt)("inlineCode",{parentName:"a"},"EventProposal")),")"),(0,a.kt)("h4",{id:"first_name-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"first_name")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"id-id"},(0,a.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,a.kt)("h4",{id:"last_name-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"last_name")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"name-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"name")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"name_inverted-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"name_inverted")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"privileges-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"privileges")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"user_con_profiles-userconprofile"},(0,a.kt)("inlineCode",{parentName:"h4"},"user_con_profiles")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/user-con-profile"},(0,a.kt)("inlineCode",{parentName:"a"},"UserConProfile")),")"))}u.isMDXComponent=!0}}]);