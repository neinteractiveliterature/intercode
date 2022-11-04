"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[19862],{75631:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>g});var r=n(45721);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var o=r.createContext({}),c=function(e){var t=r.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):u(u({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(o.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,o=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),s=c(n),g=a,y=s["".concat(o,".").concat(g)]||s[g]||d[g]||i;return n?r.createElement(y,u(u({ref:t},p),{},{components:n})):r.createElement(y,u({ref:t},p))}));function g(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,u=new Array(i);u[0]=s;var l={};for(var o in t)hasOwnProperty.call(t,o)&&(l[o]=t[o]);l.originalType=e,l.mdxType="string"==typeof e?e:a,u[1]=l;for(var c=2;c<i;c++)u[c]=n[c];return r.createElement.apply(null,u)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},99e3:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>g,Bullet:()=>d,SpecifiedBy:()=>s,assets:()=>c,contentTitle:()=>l,default:()=>m,frontMatter:()=>u,metadata:()=>o,toc:()=>p});var r=n(50524),a=n(45721),i=n(75631);const u={id:"pricing-structure-input",title:"PricingStructureInput",hide_table_of_contents:!1},l=void 0,o={unversionedId:"graphql/inputs/pricing-structure-input",id:"graphql/inputs/pricing-structure-input",title:"PricingStructureInput",description:"No description",source:"@site/docs/graphql/inputs/pricing-structure-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/pricing-structure-input",permalink:"/docs/graphql/inputs/pricing-structure-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/pricing-structure-input.mdx",tags:[],version:"current",frontMatter:{id:"pricing-structure-input",title:"PricingStructureInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"PermissionInput",permalink:"/docs/graphql/inputs/permission-input"},next:{title:"ProductInput",permalink:"/docs/graphql/inputs/product-input"}},c={},p=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>PricingStructureInput.<b>fixed_value</b></code><Bullet /><code>MoneyInput</code> <Badge class="secondary" text="input"/>',id:"code-style-fontweight-normal-pricingstructureinputbfixed_valuebcodemoneyinput-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>PricingStructureInput.<b>pay_what_you_want_value</b></code><Bullet /><code>PayWhatYouWantInput</code> <Badge class="secondary" text="input"/>',id:"code-style-fontweight-normal-pricingstructureinputbpay_what_you_want_valuebcodepaywhatyouwantinput-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>PricingStructureInput.<b>pricing_strategy</b></code><Bullet /><code>PricingStrategy!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="enum"/>',id:"code-style-fontweight-normal-pricingstructureinputbpricing_strategybcodepricingstrategy--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>PricingStructureInput.<b>scheduled_value</b></code><Bullet /><code>ScheduledMoneyValueInput</code> <Badge class="secondary" text="input"/>',id:"code-style-fontweight-normal-pricingstructureinputbscheduled_valuebcodescheduledmoneyvalueinput-",level:4},{value:"Member of",id:"member-of",level:3}],d=()=>(0,i.kt)(a.Fragment,null,(0,i.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),s=e=>(0,i.kt)(a.Fragment,null,"Specification",(0,i.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),g=e=>(0,i.kt)(a.Fragment,null,(0,i.kt)("span",{class:"badge badge--"+e.class},e.text)),y={toc:p,Bullet:d,SpecifiedBy:s,Badge:g};function m(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},y,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"No description"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"input PricingStructureInput {\n  fixed_value: MoneyInput\n  pay_what_you_want_value: PayWhatYouWantInput\n  pricing_strategy: PricingStrategy!\n  scheduled_value: ScheduledMoneyValueInput\n}\n")),(0,i.kt)("h3",{id:"fields"},"Fields"),(0,i.kt)("h4",{id:"code-style-fontweight-normal-pricingstructureinputbfixed_valuebcodemoneyinput-"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("code",{style:{fontWeight:"normal"}},"PricingStructureInput.",(0,i.kt)("b",null,"fixed_value"))),(0,i.kt)(d,{mdxType:"Bullet"}),(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/money-input"},(0,i.kt)("inlineCode",{parentName:"a"},"MoneyInput"))," ",(0,i.kt)(g,{class:"secondary",text:"input",mdxType:"Badge"})),(0,i.kt)("blockquote",null),(0,i.kt)("h4",{id:"code-style-fontweight-normal-pricingstructureinputbpay_what_you_want_valuebcodepaywhatyouwantinput-"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("code",{style:{fontWeight:"normal"}},"PricingStructureInput.",(0,i.kt)("b",null,"pay_what_you_want_value"))),(0,i.kt)(d,{mdxType:"Bullet"}),(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/pay-what-you-want-input"},(0,i.kt)("inlineCode",{parentName:"a"},"PayWhatYouWantInput"))," ",(0,i.kt)(g,{class:"secondary",text:"input",mdxType:"Badge"})),(0,i.kt)("blockquote",null),(0,i.kt)("h4",{id:"code-style-fontweight-normal-pricingstructureinputbpricing_strategybcodepricingstrategy--"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("code",{style:{fontWeight:"normal"}},"PricingStructureInput.",(0,i.kt)("b",null,"pricing_strategy"))),(0,i.kt)(d,{mdxType:"Bullet"}),(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/enums/pricing-strategy"},(0,i.kt)("inlineCode",{parentName:"a"},"PricingStrategy!"))," ",(0,i.kt)(g,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,i.kt)(g,{class:"secondary",text:"enum",mdxType:"Badge"})),(0,i.kt)("blockquote",null),(0,i.kt)("h4",{id:"code-style-fontweight-normal-pricingstructureinputbscheduled_valuebcodescheduledmoneyvalueinput-"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("code",{style:{fontWeight:"normal"}},"PricingStructureInput.",(0,i.kt)("b",null,"scheduled_value"))),(0,i.kt)(d,{mdxType:"Bullet"}),(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/scheduled-money-value-input"},(0,i.kt)("inlineCode",{parentName:"a"},"ScheduledMoneyValueInput"))," ",(0,i.kt)(g,{class:"secondary",text:"input",mdxType:"Badge"})),(0,i.kt)("blockquote",null),(0,i.kt)("h3",{id:"member-of"},"Member of"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/product-input"},(0,i.kt)("inlineCode",{parentName:"a"},"ProductInput")),"  ",(0,i.kt)(g,{class:"secondary",text:"input",mdxType:"Badge"}),(0,i.kt)(d,{mdxType:"Bullet"}),(0,i.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/product-variant-input"},(0,i.kt)("inlineCode",{parentName:"a"},"ProductVariantInput")),"  ",(0,i.kt)(g,{class:"secondary",text:"input",mdxType:"Badge"})))}m.isMDXComponent=!0}}]);