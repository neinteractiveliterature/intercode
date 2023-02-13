"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[43682],{75631:(e,r,t)=>{t.d(r,{Zo:()=>l,kt:()=>y});var o=t(45721);function d(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function n(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?n(Object(t),!0).forEach((function(r){d(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):n(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function p(e,r){if(null==e)return{};var t,o,d=function(e,r){if(null==e)return{};var t,o,d={},n=Object.keys(e);for(o=0;o<n.length;o++)t=n[o],r.indexOf(t)>=0||(d[t]=e[t]);return d}(e,r);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(o=0;o<n.length;o++)t=n[o],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(d[t]=e[t])}return d}var c=o.createContext({}),a=function(e){var r=o.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},l=function(e){var r=a(e.components);return o.createElement(c.Provider,{value:r},e.children)},u={inlineCode:"code",wrapper:function(e){var r=e.children;return o.createElement(o.Fragment,{},r)}},s=o.forwardRef((function(e,r){var t=e.components,d=e.mdxType,n=e.originalType,c=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),s=a(t),y=d,f=s["".concat(c,".").concat(y)]||s[y]||u[y]||n;return t?o.createElement(f,i(i({ref:r},l),{},{components:t})):o.createElement(f,i({ref:r},l))}));function y(e,r){var t=arguments,d=r&&r.mdxType;if("string"==typeof e||d){var n=t.length,i=new Array(n);i[0]=s;var p={};for(var c in r)hasOwnProperty.call(r,c)&&(p[c]=r[c]);p.originalType=e,p.mdxType="string"==typeof e?e:d,i[1]=p;for(var a=2;a<n;a++)i[a]=t[a];return o.createElement.apply(null,i)}return o.createElement.apply(null,t)}s.displayName="MDXCreateElement"},4153:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>c,contentTitle:()=>i,default:()=>u,frontMatter:()=>n,metadata:()=>p,toc:()=>a});var o=t(81648),d=(t(45721),t(75631));const n={id:"order-entry-drop",title:"OrderEntryDrop"},i=void 0,p={unversionedId:"liquid/drops/order-entry-drop",id:"liquid/drops/order-entry-drop",title:"OrderEntryDrop",description:"An entry in an order",source:"@site/docs/liquid/drops/order-entry-drop.mdx",sourceDirName:"liquid/drops",slug:"/liquid/drops/order-entry-drop",permalink:"/docs/liquid/drops/order-entry-drop",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/liquid/drops/order-entry-drop.mdx",tags:[],version:"current",frontMatter:{id:"order-entry-drop",title:"OrderEntryDrop"},sidebar:"sidebar",previous:{title:"OrderDrop",permalink:"/docs/liquid/drops/order-drop"},next:{title:"OrganizationDrop",permalink:"/docs/liquid/drops/organization-drop"}},c={},a=[{value:"Fields",id:"fields",level:3},{value:"<code>describe_products</code> (<code>String</code>)",id:"describe_products-string",level:4},{value:"<code>id</code> (<code>Integer</code>)",id:"id-integer",level:4},{value:'<code>order</code> (<code><a href="/docs/liquid/drops/order-drop">OrderDrop</a></code>)',id:"order-orderdrop",level:4},{value:'<code>price</code> (<code><a href="/docs/liquid/drops/money-drop">MoneyDrop</a></code>)',id:"price-moneydrop",level:4},{value:'<code>price_per_item</code> (<code><a href="/docs/liquid/drops/money-drop">MoneyDrop</a></code>)',id:"price_per_item-moneydrop",level:4},{value:'<code>product</code> (<code><a href="/docs/liquid/drops/product-drop">ProductDrop</a></code>)',id:"product-productdrop",level:4},{value:'<code>product_variant</code> (<code><a href="/docs/liquid/drops/product-variant-drop">ProductVariantDrop</a></code>)',id:"product_variant-productvariantdrop",level:4},{value:"<code>quantity</code> (<code>Integer</code>)",id:"quantity-integer",level:4}],l={toc:a};function u(e){let{components:r,...t}=e;return(0,d.kt)("wrapper",(0,o.Z)({},l,t,{components:r,mdxType:"MDXLayout"}),(0,d.kt)("p",null,"An entry in an order"),(0,d.kt)("h3",{id:"fields"},"Fields"),(0,d.kt)("h4",{id:"describe_products-string"},(0,d.kt)("inlineCode",{parentName:"h4"},"describe_products")," (",(0,d.kt)("code",null,"String"),")"),(0,d.kt)("p",null,"A text description of the product(s) ordered in this entry"),(0,d.kt)("h4",{id:"id-integer"},(0,d.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,d.kt)("code",null,"Integer"),")"),(0,d.kt)("p",null,"The numeric database id of this order entry"),(0,d.kt)("h4",{id:"order-orderdrop"},(0,d.kt)("inlineCode",{parentName:"h4"},"order")," (",(0,d.kt)("code",null,(0,d.kt)("a",{href:"/docs/liquid/drops/order-drop"},"OrderDrop")),")"),(0,d.kt)("p",null,"The order this entry is part of"),(0,d.kt)("h4",{id:"price-moneydrop"},(0,d.kt)("inlineCode",{parentName:"h4"},"price")," (",(0,d.kt)("code",null,(0,d.kt)("a",{href:"/docs/liquid/drops/money-drop"},"MoneyDrop")),")"),(0,d.kt)("p",null,"The total price of this entry (price_per_item * quantity)"),(0,d.kt)("h4",{id:"price_per_item-moneydrop"},(0,d.kt)("inlineCode",{parentName:"h4"},"price_per_item")," (",(0,d.kt)("code",null,(0,d.kt)("a",{href:"/docs/liquid/drops/money-drop"},"MoneyDrop")),")"),(0,d.kt)("p",null,"The price per item of this entry"),(0,d.kt)("h4",{id:"product-productdrop"},(0,d.kt)("inlineCode",{parentName:"h4"},"product")," (",(0,d.kt)("code",null,(0,d.kt)("a",{href:"/docs/liquid/drops/product-drop"},"ProductDrop")),")"),(0,d.kt)("p",null,"The product that was ordered"),(0,d.kt)("h4",{id:"product_variant-productvariantdrop"},(0,d.kt)("inlineCode",{parentName:"h4"},"product_variant")," (",(0,d.kt)("code",null,(0,d.kt)("a",{href:"/docs/liquid/drops/product-variant-drop"},"ProductVariantDrop")),")"),(0,d.kt)("p",null,"The product variant that was ordered, if applicable"),(0,d.kt)("h4",{id:"quantity-integer"},(0,d.kt)("inlineCode",{parentName:"h4"},"quantity")," (",(0,d.kt)("code",null,"Integer"),")"),(0,d.kt)("p",null,"The quantity of the item that was ordered"))}u.isMDXComponent=!0}}]);