"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[71641],{75631:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var r=n(3289);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),m=p(n),d=i,f=m["".concat(c,".").concat(d)]||m[d]||s[d]||a;return n?r.createElement(f,l(l({ref:t},u),{},{components:n})):r.createElement(f,l({ref:t},u))}));function d(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,l=new Array(a);l[0]=m;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o.mdxType="string"==typeof e?e:i,l[1]=o;for(var p=2;p<a;p++)l[p]=n[p];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},80058:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>s,frontMatter:()=>a,metadata:()=>o,toc:()=>p});var r=n(60953),i=(n(3289),n(75631));const a={id:"receive-signup-email",title:"ReceiveSignupEmail",hide_table_of_contents:!1},l=void 0,o={unversionedId:"graphql/enums/receive-signup-email",id:"graphql/enums/receive-signup-email",title:"ReceiveSignupEmail",description:"No description",source:"@site/docs/graphql/enums/receive-signup-email.mdx",sourceDirName:"graphql/enums",slug:"/graphql/enums/receive-signup-email",permalink:"/docs/graphql/enums/receive-signup-email",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/enums/receive-signup-email.mdx",tags:[],version:"current",frontMatter:{id:"receive-signup-email",title:"ReceiveSignupEmail",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"PricingStrategy",permalink:"/docs/graphql/enums/pricing-strategy"},next:{title:"RefundStatus",permalink:"/docs/graphql/enums/refund-status"}},c={},p=[{value:"Values",id:"values",level:3},{value:"<code>ALL_SIGNUPS</code>",id:"all_signups",level:4},{value:"<code>NO</code>",id:"no",level:4},{value:"<code>NON_WAITLIST_SIGNUPS</code>",id:"non_waitlist_signups",level:4}],u={toc:p};function s(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"No description"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"enum ReceiveSignupEmail {\n  ALL_SIGNUPS\n  NO\n  NON_WAITLIST_SIGNUPS\n}\n")),(0,i.kt)("h3",{id:"values"},"Values"),(0,i.kt)("h4",{id:"all_signups"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("inlineCode",{parentName:"a"},"ALL_SIGNUPS"))),(0,i.kt)("p",null,"Receive email for all signup activity"),(0,i.kt)("h4",{id:"no"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("inlineCode",{parentName:"a"},"NO"))),(0,i.kt)("p",null,"Do not receive signup email"),(0,i.kt)("h4",{id:"non_waitlist_signups"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("inlineCode",{parentName:"a"},"NON_WAITLIST_SIGNUPS"))),(0,i.kt)("p",null,"Receive email for signup activity affecting confirmed signups"))}s.isMDXComponent=!0}}]);