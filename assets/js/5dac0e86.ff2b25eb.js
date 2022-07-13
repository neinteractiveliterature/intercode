"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[86401],{75631:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>m});var n=r(3289);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),d=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},l=function(e){var t=d(e.components);return n.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},s=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),s=d(r),m=a,h=s["".concat(c,".").concat(m)]||s[m]||u[m]||i;return r?n.createElement(h,o(o({ref:t},l),{},{components:r})):n.createElement(h,o({ref:t},l))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=s;var p={};for(var c in t)hasOwnProperty.call(t,c)&&(p[c]=t[c]);p.originalType=e,p.mdxType="string"==typeof e?e:a,o[1]=p;for(var d=2;d<i;d++)o[d]=r[d];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}s.displayName="MDXCreateElement"},21018:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>p,toc:()=>d});var n=r(60953),a=(r(3289),r(75631));const i={id:"product-input",title:"ProductInput",hide_table_of_contents:!1},o=void 0,p={unversionedId:"graphql/inputs/product-input",id:"graphql/inputs/product-input",title:"ProductInput",description:"No description",source:"@site/docs/graphql/inputs/product-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/product-input",permalink:"/docs/graphql/inputs/product-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/product-input.mdx",tags:[],version:"current",frontMatter:{id:"product-input",title:"ProductInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"PricingStructureInput",permalink:"/docs/graphql/inputs/pricing-structure-input"},next:{title:"ProductVariantInput",permalink:"/docs/graphql/inputs/product-variant-input"}},c={},d=[{value:"Fields",id:"fields",level:3},{value:"<code>available</code> (<code>Boolean</code>)",id:"available-boolean",level:4},{value:"<code>deleteVariantIds</code> (<code>[ID!]</code>)",id:"deletevariantids-id",level:4},{value:"<code>description</code> (<code>String</code>)",id:"description-string",level:4},{value:"<code>image</code> (<code>Upload</code>)",id:"image-upload",level:4},{value:"<code>name</code> (<code>String</code>)",id:"name-string",level:4},{value:"<code>payment_options</code> (<code>[String!]</code>)",id:"payment_options-string",level:4},{value:"<code>pricing_structure</code> (<code>PricingStructureInput</code>)",id:"pricing_structure-pricingstructureinput",level:4},{value:"<code>product_variants</code> (<code>[ProductVariantInput!]</code>)",id:"product_variants-productvariantinput",level:4},{value:"<code>providesTicketTypeId</code> (<code>ID</code>)",id:"providestickettypeid-id",level:4}],l={toc:d};function u(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"No description"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"input ProductInput {\n  available: Boolean\n  deleteVariantIds: [ID!]\n  description: String\n  image: Upload\n  name: String\n  payment_options: [String!]\n  pricing_structure: PricingStructureInput\n  product_variants: [ProductVariantInput!]\n  providesTicketTypeId: ID\n}\n")),(0,a.kt)("h3",{id:"fields"},"Fields"),(0,a.kt)("h4",{id:"available-boolean"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"available"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,a.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,a.kt)("h4",{id:"deletevariantids-id"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"deleteVariantIds"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"[ID!]")),")"),(0,a.kt)("h4",{id:"description-string"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"description"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"image-upload"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"image"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/upload"},(0,a.kt)("inlineCode",{parentName:"a"},"Upload")),")"),(0,a.kt)("h4",{id:"name-string"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"name"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"payment_options-string"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"payment_options"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"[String!]")),")"),(0,a.kt)("h4",{id:"pricing_structure-pricingstructureinput"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"pricing_structure"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/pricing-structure-input"},(0,a.kt)("inlineCode",{parentName:"a"},"PricingStructureInput")),")"),(0,a.kt)("h4",{id:"product_variants-productvariantinput"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"product_variants"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/product-variant-input"},(0,a.kt)("inlineCode",{parentName:"a"},"[ProductVariantInput!]")),")"),(0,a.kt)("h4",{id:"providestickettypeid-id"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("inlineCode",{parentName:"a"},"providesTicketTypeId"))," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"ID")),")"))}u.isMDXComponent=!0}}]);