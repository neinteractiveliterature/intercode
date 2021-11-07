"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[2167],{75631:function(e,n,r){r.d(n,{Zo:function(){return p},kt:function(){return g}});var t=r(3289);function i(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function a(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function o(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?a(Object(r),!0).forEach((function(n){i(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function s(e,n){if(null==e)return{};var r,t,i=function(e,n){if(null==e)return{};var r,t,i={},a=Object.keys(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||(i[r]=e[r]);return i}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var l=t.createContext({}),u=function(e){var n=t.useContext(l),r=n;return e&&(r="function"==typeof e?e(n):o(o({},n),e)),r},p=function(e){var n=u(e.components);return t.createElement(l.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},c=t.forwardRef((function(e,n){var r=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),c=u(r),g=i,f=c["".concat(l,".").concat(g)]||c[g]||d[g]||a;return r?t.createElement(f,o(o({ref:n},p),{},{components:r})):t.createElement(f,o({ref:n},p))}));function g(e,n){var r=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var a=r.length,o=new Array(a);o[0]=c;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var u=2;u<a;u++)o[u]=r[u];return t.createElement.apply(null,o)}return t.createElement.apply(null,r)}c.displayName="MDXCreateElement"},22192:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return u},toc:function(){return p},default:function(){return c}});var t=r(88078),i=r(65844),a=(r(3289),r(75631)),o=["components"],s={id:"merge-users-input",title:"MergeUsersInput"},l=void 0,u={unversionedId:"graphql/inputs/merge-users-input",id:"graphql/inputs/merge-users-input",isDocsHomePage:!1,title:"MergeUsersInput",description:"Autogenerated input type of MergeUsers",source:"@site/docs/graphql/inputs/merge-users-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/merge-users-input",permalink:"/docs/graphql/inputs/merge-users-input",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/merge-users-input.mdx",tags:[],version:"current",frontMatter:{id:"merge-users-input",title:"MergeUsersInput"},sidebar:"sidebar",previous:{title:"MarkOrderPaidInput",permalink:"/docs/graphql/inputs/mark-order-paid-input"},next:{title:"MoneyInput",permalink:"/docs/graphql/inputs/money-input"}},p=[{value:"Fields",id:"fields",children:[{value:"<code>clientMutationId</code> (String)",id:"clientmutationid-string",children:[],level:4},{value:"<code>transitionalUserIds</code> ([ID!])",id:"transitionaluserids-id",children:[],level:4},{value:"<code>transitionalWinningUserId</code> (ID)",id:"transitionalwinninguserid-id",children:[],level:4},{value:"<code>userIds</code> ([ID!])",id:"userids-id",children:[],level:4},{value:"<code>winningUserConProfiles</code> ([WinningUserConProfileInput!]!)",id:"winninguserconprofiles-winninguserconprofileinput",children:[],level:4},{value:"<code>winningUserId</code> (ID)",id:"winninguserid-id",children:[],level:4}],level:3}],d={toc:p};function c(e){var n=e.components,r=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,t.Z)({},d,r,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Autogenerated input type of MergeUsers"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"type MergeUsersInput {\n  clientMutationId: String\n  transitionalUserIds: [ID!]\n  transitionalWinningUserId: ID\n  userIds: [ID!]\n  winningUserConProfiles: [WinningUserConProfileInput!]!\n  winningUserId: ID\n}\n")),(0,a.kt)("h3",{id:"fields"},"Fields"),(0,a.kt)("h4",{id:"clientmutationid-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"clientMutationId")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,a.kt)("h4",{id:"transitionaluserids-id"},(0,a.kt)("inlineCode",{parentName:"h4"},"transitionalUserIds")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"[ID!]")),")"),(0,a.kt)("h4",{id:"transitionalwinninguserid-id"},(0,a.kt)("inlineCode",{parentName:"h4"},"transitionalWinningUserId")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,a.kt)("h4",{id:"userids-id"},(0,a.kt)("inlineCode",{parentName:"h4"},"userIds")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"[ID!]")),")"),(0,a.kt)("p",null,"The user IDs to merge."),(0,a.kt)("h4",{id:"winninguserconprofiles-winninguserconprofileinput"},(0,a.kt)("inlineCode",{parentName:"h4"},"winningUserConProfiles")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/winning-user-con-profile-input"},(0,a.kt)("inlineCode",{parentName:"a"},"[WinningUserConProfileInput!]!")),")"),(0,a.kt)("h4",{id:"winninguserid-id"},(0,a.kt)("inlineCode",{parentName:"h4"},"winningUserId")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"ID")),")"))}c.isMDXComponent=!0}}]);