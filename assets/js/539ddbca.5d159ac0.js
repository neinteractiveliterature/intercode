"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[12324],{75631:(e,r,t)=>{t.d(r,{Zo:()=>p,kt:()=>g});var n=t(3289);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function i(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function o(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?i(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=n.createContext({}),c=function(e){var r=n.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):o(o({},r),e)),t},p=function(e){var r=c(e.components);return n.createElement(s.Provider,{value:r},e.children)},d={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=c(t),g=a,u=m["".concat(s,".").concat(g)]||m[g]||d[g]||i;return t?n.createElement(u,o(o({ref:r},p),{},{components:t})):n.createElement(u,o({ref:r},p))}));function g(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var i=t.length,o=new Array(i);o[0]=m;var l={};for(var s in r)hasOwnProperty.call(r,s)&&(l[s]=r[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var c=2;c<i;c++)o[c]=t[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},74711:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>l,toc:()=>c});var n=t(60953),a=(t(3289),t(75631));const i={id:"user",title:"User",hide_table_of_contents:!1},o=void 0,l={unversionedId:"graphql/objects/user",id:"graphql/objects/user",title:"User",description:"No description",source:"@site/docs/graphql/objects/user.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/user",permalink:"/docs/graphql/objects/user",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/user.mdx",tags:[],version:"current",frontMatter:{id:"user",title:"User",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"UserConProfilesPagination",permalink:"/docs/graphql/objects/user-con-profiles-pagination"},next:{title:"UsersPagination",permalink:"/docs/graphql/objects/users-pagination"}},s={},c=[{value:"Fields",id:"fields",level:3},{value:"<code>email</code> (<code>String</code>)",id:"email-string",level:4},{value:"<code>event_proposals</code> (<code>[EventProposal!]!</code>)",id:"event_proposals-eventproposal",level:4},{value:"<code>first_name</code> (<code>String</code>)",id:"first_name-string",level:4},{value:"<code>id</code> (<code>ID!</code>)",id:"id-id",level:4},{value:"<code>last_name</code> (<code>String</code>)",id:"last_name-string",level:4},{value:"<code>name</code> (<code>String</code>)",id:"name-string",level:4},{value:"<code>name_inverted</code> (<code>String</code>)",id:"name_inverted-string",level:4},{value:"<code>privileges</code> (<code>[String!]</code>)",id:"privileges-string",level:4},{value:"<code>user_con_profiles</code> (<code>[UserConProfile!]!</code>)",id:"user_con_profiles-userconprofile",level:4}],p={toc:c};function d(e){let{components:r,...t}=e;return(0,a.kt)("wrapper",(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"No description"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"type User {\n  email: String\n  event_proposals: [EventProposal!]!\n  first_name: String\n  id: ID!\n  last_name: String\n  name: String\n  name_inverted: String\n  privileges: [String!]\n  user_con_profiles: [UserConProfile!]!\n}\n")),(0,a.kt)("h3",{id:"fields"},"Fields"),(0,a.kt)("h4",{id:"email-string"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"email"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"event_proposals-eventproposal"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"event_proposals"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/event-proposal"},(0,a.kt)("inlineCode",{parentName:"a"},"[EventProposal!]!")),")"),(0,a.kt)("h4",{id:"first_name-string"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"first_name"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"id-id"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"id"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"ID!")),")"),(0,a.kt)("h4",{id:"last_name-string"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"last_name"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"name-string"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"name"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"name_inverted-string"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"name_inverted"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"privileges-string"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"privileges"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"[String!]")),")"),(0,a.kt)("h4",{id:"user_con_profiles-userconprofile"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"user_con_profiles"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/user-con-profile"},(0,a.kt)("inlineCode",{parentName:"a"},"[UserConProfile!]!")),")"))}d.isMDXComponent=!0}}]);