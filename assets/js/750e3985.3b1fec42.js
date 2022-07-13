"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[19862],{75631:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>y});var r=n(3289);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var o=r.createContext({}),c=function(e){var t=r.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):u(u({},t),e)),n},l=function(e){var t=c(e.components);return r.createElement(o.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,o=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),s=c(n),y=a,h=s["".concat(o,".").concat(y)]||s[y]||d[y]||i;return n?r.createElement(h,u(u({ref:t},l),{},{components:n})):r.createElement(h,u({ref:t},l))}));function y(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,u=new Array(i);u[0]=s;var p={};for(var o in t)hasOwnProperty.call(t,o)&&(p[o]=t[o]);p.originalType=e,p.mdxType="string"==typeof e?e:a,u[1]=p;for(var c=2;c<i;c++)u[c]=n[c];return r.createElement.apply(null,u)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},75455:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>u,default:()=>d,frontMatter:()=>i,metadata:()=>p,toc:()=>c});var r=n(60953),a=(n(3289),n(75631));const i={id:"pricing-structure-input",title:"PricingStructureInput",hide_table_of_contents:!1},u=void 0,p={unversionedId:"graphql/inputs/pricing-structure-input",id:"graphql/inputs/pricing-structure-input",title:"PricingStructureInput",description:"No description",source:"@site/docs/graphql/inputs/pricing-structure-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/pricing-structure-input",permalink:"/docs/graphql/inputs/pricing-structure-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/pricing-structure-input.mdx",tags:[],version:"current",frontMatter:{id:"pricing-structure-input",title:"PricingStructureInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"PermissionInput",permalink:"/docs/graphql/inputs/permission-input"},next:{title:"ProductInput",permalink:"/docs/graphql/inputs/product-input"}},o={},c=[{value:"Fields",id:"fields",level:3},{value:"<code>fixed_value</code> (<code>MoneyInput</code>)",id:"fixed_value-moneyinput",level:4},{value:"<code>pay_what_you_want_value</code> (<code>PayWhatYouWantInput</code>)",id:"pay_what_you_want_value-paywhatyouwantinput",level:4},{value:"<code>pricing_strategy</code> (<code>PricingStrategy!</code>)",id:"pricing_strategy-pricingstrategy",level:4},{value:"<code>scheduled_value</code> (<code>ScheduledMoneyValueInput</code>)",id:"scheduled_value-scheduledmoneyvalueinput",level:4}],l={toc:c};function d(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"No description"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"input PricingStructureInput {\n  fixed_value: MoneyInput\n  pay_what_you_want_value: PayWhatYouWantInput\n  pricing_strategy: PricingStrategy!\n  scheduled_value: ScheduledMoneyValueInput\n}\n")),(0,a.kt)("h3",{id:"fields"},"Fields"),(0,a.kt)("h4",{id:"fixed_value-moneyinput"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"fixed_value"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/money-input"},(0,a.kt)("inlineCode",{parentName:"a"},"MoneyInput")),")"),(0,a.kt)("h4",{id:"pay_what_you_want_value-paywhatyouwantinput"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"pay_what_you_want_value"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/pay-what-you-want-input"},(0,a.kt)("inlineCode",{parentName:"a"},"PayWhatYouWantInput")),")"),(0,a.kt)("h4",{id:"pricing_strategy-pricingstrategy"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"pricing_strategy"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/enums/pricing-strategy"},(0,a.kt)("inlineCode",{parentName:"a"},"PricingStrategy!")),")"),(0,a.kt)("h4",{id:"scheduled_value-scheduledmoneyvalueinput"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"scheduled_value"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/scheduled-money-value-input"},(0,a.kt)("inlineCode",{parentName:"a"},"ScheduledMoneyValueInput")),")"))}d.isMDXComponent=!0}}]);