"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[86401],{75631:function(e,t,n){n.d(t,{Zo:function(){return l},kt:function(){return m}});var r=n(3289);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),d=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},l=function(e){var t=d(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),s=d(n),m=i,h=s["".concat(c,".").concat(m)]||s[m]||u[m]||a;return n?r.createElement(h,o(o({ref:t},l),{},{components:n})):r.createElement(h,o({ref:t},l))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=s;var p={};for(var c in t)hasOwnProperty.call(t,c)&&(p[c]=t[c]);p.originalType=e,p.mdxType="string"==typeof e?e:i,o[1]=p;for(var d=2;d<a;d++)o[d]=n[d];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},61258:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return p},contentTitle:function(){return c},metadata:function(){return d},toc:function(){return l},default:function(){return s}});var r=n(50753),i=n(61242),a=(n(3289),n(75631)),o=["components"],p={id:"product-input",title:"ProductInput"},c=void 0,d={unversionedId:"graphql/inputs/product-input",id:"graphql/inputs/product-input",isDocsHomePage:!1,title:"ProductInput",description:"No description",source:"@site/docs/graphql/inputs/product-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/product-input",permalink:"/docs/graphql/inputs/product-input",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/product-input.mdx",tags:[],version:"current",frontMatter:{id:"product-input",title:"ProductInput"},sidebar:"sidebar",previous:{title:"PricingStructureInput",permalink:"/docs/graphql/inputs/pricing-structure-input"},next:{title:"ProductVariantInput",permalink:"/docs/graphql/inputs/product-variant-input"}},l=[{value:"Fields",id:"fields",children:[{value:"<code>available</code> (Boolean)",id:"available-boolean",children:[],level:4},{value:"<code>deleteVariantIds</code> (ID)",id:"deletevariantids-id",children:[],level:4},{value:"<code>description</code> (String)",id:"description-string",children:[],level:4},{value:"<code>image</code> (Upload)",id:"image-upload",children:[],level:4},{value:"<code>name</code> (String)",id:"name-string",children:[],level:4},{value:"<code>payment_options</code> (String)",id:"payment_options-string",children:[],level:4},{value:"<code>pricing_structure</code> (PricingStructureInput)",id:"pricing_structure-pricingstructureinput",children:[],level:4},{value:"<code>product_variants</code> (ProductVariantInput)",id:"product_variants-productvariantinput",children:[],level:4},{value:"<code>providesTicketTypeId</code> (ID)",id:"providestickettypeid-id",children:[],level:4}],level:3}],u={toc:l};function s(e){var t=e.components,n=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"No description"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"type ProductInput {\n  available: Boolean\n  deleteVariantIds: [ID!]\n  description: String\n  image: Upload\n  name: String\n  payment_options: [String!]\n  pricing_structure: PricingStructureInput\n  product_variants: [ProductVariantInput!]\n  providesTicketTypeId: ID\n}\n")),(0,a.kt)("h3",{id:"fields"},"Fields"),(0,a.kt)("h4",{id:"available-boolean"},(0,a.kt)("inlineCode",{parentName:"h4"},"available")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,a.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,a.kt)("h4",{id:"deletevariantids-id"},(0,a.kt)("inlineCode",{parentName:"h4"},"deleteVariantIds")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,a.kt)("h4",{id:"description-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"description")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"image-upload"},(0,a.kt)("inlineCode",{parentName:"h4"},"image")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/upload"},(0,a.kt)("inlineCode",{parentName:"a"},"Upload")),")"),(0,a.kt)("h4",{id:"name-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"name")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"payment_options-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"payment_options")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("h4",{id:"pricing_structure-pricingstructureinput"},(0,a.kt)("inlineCode",{parentName:"h4"},"pricing_structure")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/pricing-structure-input"},(0,a.kt)("inlineCode",{parentName:"a"},"PricingStructureInput")),")"),(0,a.kt)("h4",{id:"product_variants-productvariantinput"},(0,a.kt)("inlineCode",{parentName:"h4"},"product_variants")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/product-variant-input"},(0,a.kt)("inlineCode",{parentName:"a"},"ProductVariantInput")),")"),(0,a.kt)("h4",{id:"providestickettypeid-id"},(0,a.kt)("inlineCode",{parentName:"h4"},"providesTicketTypeId")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"ID")),")"))}s.isMDXComponent=!0}}]);