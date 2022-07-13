"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[3317],{75631:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>f});var r=n(3289);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=r.createContext({}),l=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},u=function(e){var t=l(e.components);return r.createElement(p.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=l(n),f=o,y=d["".concat(p,".").concat(f)]||d[f]||s[f]||a;return n?r.createElement(y,c(c({ref:t},u),{},{components:n})):r.createElement(y,c({ref:t},u))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,c=new Array(a);c[0]=d;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:o,c[1]=i;for(var l=2;l<a;l++)c[l]=n[l];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},5329:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>c,default:()=>s,frontMatter:()=>a,metadata:()=>i,toc:()=>l});var r=n(60953),o=(n(3289),n(75631));const a={id:"create-convention-stripe-account-payload",title:"CreateConventionStripeAccountPayload",hide_table_of_contents:!1},c=void 0,i={unversionedId:"graphql/objects/create-convention-stripe-account-payload",id:"graphql/objects/create-convention-stripe-account-payload",title:"CreateConventionStripeAccountPayload",description:"Autogenerated return type of CreateConventionStripeAccount",source:"@site/docs/graphql/objects/create-convention-stripe-account-payload.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/create-convention-stripe-account-payload",permalink:"/docs/graphql/objects/create-convention-stripe-account-payload",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/create-convention-stripe-account-payload.mdx",tags:[],version:"current",frontMatter:{id:"create-convention-stripe-account-payload",title:"CreateConventionStripeAccountPayload",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"CreateConventionPayload",permalink:"/docs/graphql/objects/create-convention-payload"},next:{title:"CreateCouponApplicationPayload",permalink:"/docs/graphql/objects/create-coupon-application-payload"}},p={},l=[{value:"Fields",id:"fields",level:3},{value:"<code>clientMutationId</code> (<code>String</code>)",id:"clientmutationid-string",level:4},{value:"<code>stripe_account</code> (<code>StripeAccount!</code>)",id:"stripe_account-stripeaccount",level:4}],u={toc:l};function s(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Autogenerated return type of CreateConventionStripeAccount"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type CreateConventionStripeAccountPayload {\n  clientMutationId: String\n  stripe_account: StripeAccount!\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"clientmutationid-string"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("inlineCode",{parentName:"a"},"clientMutationId"))," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,o.kt)("h4",{id:"stripe_account-stripeaccount"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("inlineCode",{parentName:"a"},"stripe_account"))," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/stripe-account"},(0,o.kt)("inlineCode",{parentName:"a"},"StripeAccount!")),")"))}s.isMDXComponent=!0}}]);