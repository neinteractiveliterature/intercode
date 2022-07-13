"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[24611],{75631:(e,r,t)=>{t.d(r,{Zo:()=>d,kt:()=>u});var n=t(3289);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function i(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?i(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function s(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var l=n.createContext({}),c=function(e){var r=n.useContext(l),t=r;return e&&(t="function"==typeof e?e(r):a(a({},r),e)),t},d=function(e){var r=c(e.components);return n.createElement(l.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),m=c(t),u=o,f=m["".concat(l,".").concat(u)]||m[u]||p[u]||i;return t?n.createElement(f,a(a({ref:r},d),{},{components:t})):n.createElement(f,a({ref:r},d))}));function u(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var i=t.length,a=new Array(i);a[0]=m;var s={};for(var l in r)hasOwnProperty.call(r,l)&&(s[l]=r[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var c=2;c<i;c++)a[c]=t[c];return n.createElement.apply(null,a)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},88836:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>l,contentTitle:()=>a,default:()=>p,frontMatter:()=>i,metadata:()=>s,toc:()=>c});var n=t(60953),o=(t(3289),t(75631));const i={id:"permission",title:"Permission",hide_table_of_contents:!1},a=void 0,s={unversionedId:"graphql/objects/permission",id:"graphql/objects/permission",title:"Permission",description:"No description",source:"@site/docs/graphql/objects/permission.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/permission",permalink:"/docs/graphql/objects/permission",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/permission.mdx",tags:[],version:"current",frontMatter:{id:"permission",title:"Permission",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"PayWhatYouWantValue",permalink:"/docs/graphql/objects/pay-what-you-want-value"},next:{title:"PricingStructure",permalink:"/docs/graphql/objects/pricing-structure"}},l={},c=[{value:"Fields",id:"fields",level:3},{value:"<code>id</code> (<code>ID!</code>)",id:"id-id",level:4},{value:"<code>model</code> (<code>PermissionedModel!</code>)",id:"model-permissionedmodel",level:4},{value:"<code>permission</code> (<code>String!</code>)",id:"permission-string",level:4},{value:"<code>role</code> (<code>PermissionedRole!</code>)",id:"role-permissionedrole",level:4}],d={toc:c};function p(e){let{components:r,...t}=e;return(0,o.kt)("wrapper",(0,n.Z)({},d,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"No description"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type Permission {\n  id: ID!\n  model: PermissionedModel!\n  permission: String!\n  role: PermissionedRole!\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"id-id"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("inlineCode",{parentName:"a"},"id"))," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID!")),")"),(0,o.kt)("h4",{id:"model-permissionedmodel"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("inlineCode",{parentName:"a"},"model"))," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/unions/permissioned-model"},(0,o.kt)("inlineCode",{parentName:"a"},"PermissionedModel!")),")"),(0,o.kt)("h4",{id:"permission-string"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("inlineCode",{parentName:"a"},"permission"))," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String!")),")"),(0,o.kt)("h4",{id:"role-permissionedrole"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("inlineCode",{parentName:"a"},"role"))," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/unions/permissioned-role"},(0,o.kt)("inlineCode",{parentName:"a"},"PermissionedRole!")),")"))}p.isMDXComponent=!0}}]);