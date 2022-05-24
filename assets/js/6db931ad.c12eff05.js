"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[43682],{75631:function(e,r,t){t.d(r,{Zo:function(){return l},kt:function(){return f}});var o=t(3289);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function d(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?d(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):d(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function c(e,r){if(null==e)return{};var t,o,n=function(e,r){if(null==e)return{};var t,o,n={},d=Object.keys(e);for(o=0;o<d.length;o++)t=d[o],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(e);for(o=0;o<d.length;o++)t=d[o],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var p=o.createContext({}),a=function(e){var r=o.useContext(p),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},l=function(e){var r=a(e.components);return o.createElement(p.Provider,{value:r},e.children)},u={inlineCode:"code",wrapper:function(e){var r=e.children;return o.createElement(o.Fragment,{},r)}},s=o.forwardRef((function(e,r){var t=e.components,n=e.mdxType,d=e.originalType,p=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),s=a(t),f=n,y=s["".concat(p,".").concat(f)]||s[f]||u[f]||d;return t?o.createElement(y,i(i({ref:r},l),{},{components:t})):o.createElement(y,i({ref:r},l))}));function f(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var d=t.length,i=new Array(d);i[0]=s;var c={};for(var p in r)hasOwnProperty.call(r,p)&&(c[p]=r[p]);c.originalType=e,c.mdxType="string"==typeof e?e:n,i[1]=c;for(var a=2;a<d;a++)i[a]=t[a];return o.createElement.apply(null,i)}return o.createElement.apply(null,t)}s.displayName="MDXCreateElement"},70675:function(e,r,t){t.r(r),t.d(r,{assets:function(){return l},contentTitle:function(){return p},default:function(){return f},frontMatter:function(){return c},metadata:function(){return a},toc:function(){return u}});var o=t(43830),n=t(32056),d=(t(3289),t(75631)),i=["components"],c={id:"order-entry-drop",title:"OrderEntryDrop"},p=void 0,a={unversionedId:"liquid/drops/order-entry-drop",id:"liquid/drops/order-entry-drop",title:"OrderEntryDrop",description:"An entry in an order",source:"@site/docs/liquid/drops/order-entry-drop.mdx",sourceDirName:"liquid/drops",slug:"/liquid/drops/order-entry-drop",permalink:"/docs/liquid/drops/order-entry-drop",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/liquid/drops/order-entry-drop.mdx",tags:[],version:"current",frontMatter:{id:"order-entry-drop",title:"OrderEntryDrop"},sidebar:"sidebar",previous:{title:"OrderDrop",permalink:"/docs/liquid/drops/order-drop"},next:{title:"OrganizationDrop",permalink:"/docs/liquid/drops/organization-drop"}},l={},u=[{value:"Fields",id:"fields",level:3},{value:"<code>describe_products</code> (<code>String</code>)",id:"describe_products-string",level:4},{value:"<code>id</code> (<code>Integer</code>)",id:"id-integer",level:4},{value:'<code>order</code> (<code><a href="/docs/liquid/drops/order-drop">OrderDrop</a></code>)',id:"order-orderdrop",level:4},{value:'<code>price</code> (<code><a href="/docs/liquid/drops/money-drop">MoneyDrop</a></code>)',id:"price-moneydrop",level:4},{value:'<code>price_per_item</code> (<code><a href="/docs/liquid/drops/money-drop">MoneyDrop</a></code>)',id:"price_per_item-moneydrop",level:4},{value:'<code>product</code> (<code><a href="/docs/liquid/drops/product-drop">ProductDrop</a></code>)',id:"product-productdrop",level:4},{value:'<code>product_variant</code> (<code><a href="/docs/liquid/drops/product-variant-drop">ProductVariantDrop</a></code>)',id:"product_variant-productvariantdrop",level:4},{value:"<code>quantity</code> (<code>Integer</code>)",id:"quantity-integer",level:4}],s={toc:u};function f(e){var r=e.components,t=(0,n.Z)(e,i);return(0,d.kt)("wrapper",(0,o.Z)({},s,t,{components:r,mdxType:"MDXLayout"}),(0,d.kt)("p",null,"An entry in an order"),(0,d.kt)("h3",{id:"fields"},"Fields"),(0,d.kt)("h4",{id:"describe_products-string"},(0,d.kt)("inlineCode",{parentName:"h4"},"describe_products")," (",(0,d.kt)("code",null,"String"),")"),(0,d.kt)("p",null,"A text description of the product(s) ordered in this entry"),(0,d.kt)("h4",{id:"id-integer"},(0,d.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,d.kt)("code",null,"Integer"),")"),(0,d.kt)("p",null,"The numeric database id of this order entry"),(0,d.kt)("h4",{id:"order-orderdrop"},(0,d.kt)("inlineCode",{parentName:"h4"},"order")," (",(0,d.kt)("code",null,(0,d.kt)("a",{href:"/docs/liquid/drops/order-drop"},"OrderDrop")),")"),(0,d.kt)("p",null,"The order this entry is part of"),(0,d.kt)("h4",{id:"price-moneydrop"},(0,d.kt)("inlineCode",{parentName:"h4"},"price")," (",(0,d.kt)("code",null,(0,d.kt)("a",{href:"/docs/liquid/drops/money-drop"},"MoneyDrop")),")"),(0,d.kt)("p",null,"The total price of this entry (price_per_item * quantity)"),(0,d.kt)("h4",{id:"price_per_item-moneydrop"},(0,d.kt)("inlineCode",{parentName:"h4"},"price_per_item")," (",(0,d.kt)("code",null,(0,d.kt)("a",{href:"/docs/liquid/drops/money-drop"},"MoneyDrop")),")"),(0,d.kt)("p",null,"The price per item of this entry"),(0,d.kt)("h4",{id:"product-productdrop"},(0,d.kt)("inlineCode",{parentName:"h4"},"product")," (",(0,d.kt)("code",null,(0,d.kt)("a",{href:"/docs/liquid/drops/product-drop"},"ProductDrop")),")"),(0,d.kt)("p",null,"The product that was ordered"),(0,d.kt)("h4",{id:"product_variant-productvariantdrop"},(0,d.kt)("inlineCode",{parentName:"h4"},"product_variant")," (",(0,d.kt)("code",null,(0,d.kt)("a",{href:"/docs/liquid/drops/product-variant-drop"},"ProductVariantDrop")),")"),(0,d.kt)("p",null,"The product variant that was ordered, if applicable"),(0,d.kt)("h4",{id:"quantity-integer"},(0,d.kt)("inlineCode",{parentName:"h4"},"quantity")," (",(0,d.kt)("code",null,"Integer"),")"),(0,d.kt)("p",null,"The quantity of the item that was ordered"))}f.isMDXComponent=!0}}]);