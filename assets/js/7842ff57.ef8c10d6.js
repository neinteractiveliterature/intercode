"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[88894],{75631:function(t,e,n){n.d(e,{Zo:function(){return c},kt:function(){return m}});var r=n(3289);function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function i(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?i(Object(n),!0).forEach((function(e){a(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function u(t,e){if(null==t)return{};var n,r,a=function(t,e){if(null==t)return{};var n,r,a={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(a[n]=t[n]);return a}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(a[n]=t[n])}return a}var p=r.createContext({}),l=function(t){var e=r.useContext(p),n=e;return t&&(n="function"==typeof t?t(e):o(o({},e),t)),n},c=function(t){var e=l(t.components);return r.createElement(p.Provider,{value:e},t.children)},d={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},s=r.forwardRef((function(t,e){var n=t.components,a=t.mdxType,i=t.originalType,p=t.parentName,c=u(t,["components","mdxType","originalType","parentName"]),s=l(n),m=a,y=s["".concat(p,".").concat(m)]||s[m]||d[m]||i;return n?r.createElement(y,o(o({ref:e},c),{},{components:n})):r.createElement(y,o({ref:e},c))}));function m(t,e){var n=arguments,a=e&&e.mdxType;if("string"==typeof t||a){var i=n.length,o=new Array(i);o[0]=s;var u={};for(var p in e)hasOwnProperty.call(e,p)&&(u[p]=e[p]);u.originalType=t,u.mdxType="string"==typeof t?t:a,o[1]=u;for(var l=2;l<i;l++)o[l]=n[l];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},34050:function(t,e,n){n.r(e),n.d(e,{frontMatter:function(){return u},contentTitle:function(){return p},metadata:function(){return l},toc:function(){return c},default:function(){return s}});var r=n(236),a=n(86460),i=(n(3289),n(75631)),o=["components"],u={id:"update-cms-layout-input",title:"UpdateCmsLayoutInput"},p=void 0,l={unversionedId:"graphql/inputs/update-cms-layout-input",id:"graphql/inputs/update-cms-layout-input",title:"UpdateCmsLayoutInput",description:"Autogenerated input type of UpdateCmsLayout",source:"@site/docs/graphql/inputs/update-cms-layout-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/update-cms-layout-input",permalink:"/docs/graphql/inputs/update-cms-layout-input",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/update-cms-layout-input.mdx",tags:[],version:"current",frontMatter:{id:"update-cms-layout-input",title:"UpdateCmsLayoutInput"},sidebar:"sidebar",previous:{title:"UpdateCmsGraphqlQueryInput",permalink:"/docs/graphql/inputs/update-cms-graphql-query-input"},next:{title:"UpdateCmsNavigationItemInput",permalink:"/docs/graphql/inputs/update-cms-navigation-item-input"}},c=[{value:"Fields",id:"fields",children:[{value:"<code>clientMutationId</code> (String)",id:"clientmutationid-string",children:[],level:4},{value:"<code>cms_layout</code> (CmsLayoutInput)",id:"cms_layout-cmslayoutinput",children:[],level:4},{value:"<code>id</code> (ID)",id:"id-id",children:[],level:4}],level:3}],d={toc:c};function s(t){var e=t.components,n=(0,a.Z)(t,o);return(0,i.kt)("wrapper",(0,r.Z)({},d,n,{components:e,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Autogenerated input type of UpdateCmsLayout"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"type UpdateCmsLayoutInput {\n  clientMutationId: String\n  cms_layout: CmsLayoutInput!\n  id: ID\n}\n")),(0,i.kt)("h3",{id:"fields"},"Fields"),(0,i.kt)("h4",{id:"clientmutationid-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"clientMutationId")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,i.kt)("h4",{id:"cms_layout-cmslayoutinput"},(0,i.kt)("inlineCode",{parentName:"h4"},"cms_layout")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/cms-layout-input"},(0,i.kt)("inlineCode",{parentName:"a"},"CmsLayoutInput")),")"),(0,i.kt)("h4",{id:"id-id"},(0,i.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,i.kt)("inlineCode",{parentName:"a"},"ID")),")"))}s.isMDXComponent=!0}}]);