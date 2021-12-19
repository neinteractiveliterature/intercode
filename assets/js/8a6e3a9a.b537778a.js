"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[5387],{75631:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return h}});var n=r(3289);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var d=n.createContext({}),l=function(e){var t=n.useContext(d),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},u=function(e){var t=l(e.components);return n.createElement(d.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},s=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,a=e.originalType,d=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),s=l(r),h=i,g=s["".concat(d,".").concat(h)]||s[h]||p[h]||a;return r?n.createElement(g,o(o({ref:t},u),{},{components:r})):n.createElement(g,o({ref:t},u))}));function h(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=r.length,o=new Array(a);o[0]=s;var c={};for(var d in t)hasOwnProperty.call(t,d)&&(c[d]=t[d]);c.originalType=e,c.mdxType="string"==typeof e?e:i,o[1]=c;for(var l=2;l<a;l++)o[l]=r[l];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}s.displayName="MDXCreateElement"},5235:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return c},contentTitle:function(){return d},metadata:function(){return l},toc:function(){return u},default:function(){return s}});var n=r(69432),i=r(58703),a=(r(3289),r(75631)),o=["components"],c={id:"product-variant",title:"ProductVariant"},d=void 0,l={unversionedId:"graphql/objects/product-variant",id:"graphql/objects/product-variant",title:"ProductVariant",description:"No description",source:"@site/docs/graphql/objects/product-variant.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/product-variant",permalink:"/docs/graphql/objects/product-variant",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/product-variant.mdx",tags:[],version:"current",frontMatter:{id:"product-variant",title:"ProductVariant"},sidebar:"sidebar",previous:{title:"PricingStructure",permalink:"/docs/graphql/objects/pricing-structure"},next:{title:"Product",permalink:"/docs/graphql/objects/product"}},u=[{value:"Fields",id:"fields",children:[{value:"<code>description</code> (String)",id:"description-string",children:[],level:4},{value:"<code>description_html</code> (String)",id:"description_html-string",children:[],level:4},{value:"<code>id</code> (ID)",id:"id-id",children:[],level:4},{value:"<code>image_url</code> (String)",id:"image_url-string",children:[],level:4},{value:"<code>name</code> (String)",id:"name-string",children:[],level:4},{value:"<code>order_quantities_by_status</code> (OrderQuantityByStatus)",id:"order_quantities_by_status-orderquantitybystatus",children:[],level:4},{value:"<code>override_pricing_structure</code> (PricingStructure)",id:"override_pricing_structure-pricingstructure",children:[],level:4},{value:"<code>position</code> (Int)",id:"position-int",children:[],level:4},{value:"<code>product</code> (Product)",id:"product-product",children:[],level:4}],level:3}],p={toc:u};function s(e){var t=e.components,r=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"No description"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"type ProductVariant {\n  description: String\n  description_html: String\n  id: ID!\n  image_url: String\n  name: String!\n  order_quantities_by_status: [OrderQuantityByStatus!]!\n  override_pricing_structure: PricingStructure\n  position: Int\n  product: Product!\n}\n")),(0,a.kt)("h3",{id:"fields"},"Fields"),(0,a.kt)("h4",{id:"description-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"description")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"description_html-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"description_html")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"id-id"},(0,a.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,a.kt)("h4",{id:"image_url-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"image_url")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"name-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"name")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"order_quantities_by_status-orderquantitybystatus"},(0,a.kt)("inlineCode",{parentName:"h4"},"order_quantities_by_status")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/order-quantity-by-status"},(0,a.kt)("inlineCode",{parentName:"a"},"OrderQuantityByStatus")),")"),(0,a.kt)("h4",{id:"override_pricing_structure-pricingstructure"},(0,a.kt)("inlineCode",{parentName:"h4"},"override_pricing_structure")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/pricing-structure"},(0,a.kt)("inlineCode",{parentName:"a"},"PricingStructure")),")"),(0,a.kt)("h4",{id:"position-int"},(0,a.kt)("inlineCode",{parentName:"h4"},"position")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,a.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,a.kt)("h4",{id:"product-product"},(0,a.kt)("inlineCode",{parentName:"h4"},"product")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/product"},(0,a.kt)("inlineCode",{parentName:"a"},"Product")),")"))}s.isMDXComponent=!0}}]);