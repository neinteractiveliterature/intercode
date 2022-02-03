"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[4821],{75631:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return f}});var n=r(3289);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var c=n.createContext({}),p=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},u=function(e){var t=p(e.components);return n.createElement(c.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=p(r),f=i,g=d["".concat(c,".").concat(f)]||d[f]||s[f]||a;return r?n.createElement(g,o(o({ref:t},u),{},{components:r})):n.createElement(g,o({ref:t},u))}));function f(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=r.length,o=new Array(a);o[0]=d;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var p=2;p<a;p++)o[p]=r[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},15471:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return u},default:function(){return d}});var n=r(236),i=r(86460),a=(r(3289),r(75631)),o=["components"],l={id:"user-activity-alert-input",title:"UserActivityAlertInput"},c=void 0,p={unversionedId:"graphql/inputs/user-activity-alert-input",id:"graphql/inputs/user-activity-alert-input",title:"UserActivityAlertInput",description:"No description",source:"@site/docs/graphql/inputs/user-activity-alert-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/user-activity-alert-input",permalink:"/docs/graphql/inputs/user-activity-alert-input",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/user-activity-alert-input.mdx",tags:[],version:"current",frontMatter:{id:"user-activity-alert-input",title:"UserActivityAlertInput"},sidebar:"sidebar",previous:{title:"UpdateUserConProfileInput",permalink:"/docs/graphql/inputs/update-user-con-profile-input"},next:{title:"UserConProfileFiltersInput",permalink:"/docs/graphql/inputs/user-con-profile-filters-input"}},u=[{value:"Fields",id:"fields",children:[{value:"<code>email</code> (String)",id:"email-string",children:[],level:4},{value:"<code>partial_name</code> (String)",id:"partial_name-string",children:[],level:4},{value:"<code>trigger_on_ticket_create</code> (Boolean)",id:"trigger_on_ticket_create-boolean",children:[],level:4},{value:"<code>trigger_on_user_con_profile_create</code> (Boolean)",id:"trigger_on_user_con_profile_create-boolean",children:[],level:4},{value:"<code>userId</code> (ID)",id:"userid-id",children:[],level:4}],level:3}],s={toc:u};function d(e){var t=e.components,r=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"No description"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"type UserActivityAlertInput {\n  email: String\n  partial_name: String\n  trigger_on_ticket_create: Boolean\n  trigger_on_user_con_profile_create: Boolean\n  userId: ID\n}\n")),(0,a.kt)("h3",{id:"fields"},"Fields"),(0,a.kt)("h4",{id:"email-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"email")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"partial_name-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"partial_name")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"trigger_on_ticket_create-boolean"},(0,a.kt)("inlineCode",{parentName:"h4"},"trigger_on_ticket_create")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,a.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,a.kt)("h4",{id:"trigger_on_user_con_profile_create-boolean"},(0,a.kt)("inlineCode",{parentName:"h4"},"trigger_on_user_con_profile_create")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,a.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,a.kt)("h4",{id:"userid-id"},(0,a.kt)("inlineCode",{parentName:"h4"},"userId")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"ID")),")"))}d.isMDXComponent=!0}}]);