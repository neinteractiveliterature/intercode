"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[17121],{75631:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var r=n(3289);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},u=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),m=l(n),d=a,f=m["".concat(c,".").concat(d)]||m[d]||s[d]||i;return n?r.createElement(f,p(p({ref:t},u),{},{components:n})):r.createElement(f,p({ref:t},u))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,p=new Array(i);p[0]=m;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o.mdxType="string"==typeof e?e:a,p[1]=o;for(var l=2;l<i;l++)p[l]=n[l];return r.createElement.apply(null,p)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},44876:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return o},contentTitle:function(){return c},metadata:function(){return l},toc:function(){return u},default:function(){return m}});var r=n(69432),a=n(58703),i=(n(3289),n(75631)),p=["components"],o={id:"create-cms-partial-input",title:"CreateCmsPartialInput"},c=void 0,l={unversionedId:"graphql/inputs/create-cms-partial-input",id:"graphql/inputs/create-cms-partial-input",title:"CreateCmsPartialInput",description:"Autogenerated input type of CreateCmsPartial",source:"@site/docs/graphql/inputs/create-cms-partial-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/create-cms-partial-input",permalink:"/docs/graphql/inputs/create-cms-partial-input",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/create-cms-partial-input.mdx",tags:[],version:"current",frontMatter:{id:"create-cms-partial-input",title:"CreateCmsPartialInput"},sidebar:"sidebar",previous:{title:"CreateCmsNavigationItemInput",permalink:"/docs/graphql/inputs/create-cms-navigation-item-input"},next:{title:"CreateConventionInput",permalink:"/docs/graphql/inputs/create-convention-input"}},u=[{value:"Fields",id:"fields",children:[{value:"<code>clientMutationId</code> (String)",id:"clientmutationid-string",children:[],level:4},{value:"<code>cms_partial</code> (CmsPartialInput)",id:"cms_partial-cmspartialinput",children:[],level:4}],level:3}],s={toc:u};function m(e){var t=e.components,n=(0,a.Z)(e,p);return(0,i.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Autogenerated input type of CreateCmsPartial"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"type CreateCmsPartialInput {\n  clientMutationId: String\n  cms_partial: CmsPartialInput!\n}\n")),(0,i.kt)("h3",{id:"fields"},"Fields"),(0,i.kt)("h4",{id:"clientmutationid-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"clientMutationId")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,i.kt)("h4",{id:"cms_partial-cmspartialinput"},(0,i.kt)("inlineCode",{parentName:"h4"},"cms_partial")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/cms-partial-input"},(0,i.kt)("inlineCode",{parentName:"a"},"CmsPartialInput")),")"))}m.isMDXComponent=!0}}]);