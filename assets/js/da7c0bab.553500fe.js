"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[15946],{75631:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return f}});var r=n(3289);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),d=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=d(e.components);return r.createElement(c.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,c=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),s=d(n),f=i,m=s["".concat(c,".").concat(f)]||s[f]||l[f]||o;return n?r.createElement(m,a(a({ref:t},u),{},{components:n})):r.createElement(m,a({ref:t},u))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=s;var p={};for(var c in t)hasOwnProperty.call(t,c)&&(p[c]=t[c]);p.originalType=e,p.mdxType="string"==typeof e?e:i,a[1]=p;for(var d=2;d<o;d++)a[d]=n[d];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},39595:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return c},default:function(){return f},frontMatter:function(){return p},metadata:function(){return d},toc:function(){return l}});var r=n(3149),i=n(97596),o=(n(3289),n(75631)),a=["components"],p={id:"order-entry-input",title:"OrderEntryInput",hide_table_of_contents:!1},c=void 0,d={unversionedId:"graphql/inputs/order-entry-input",id:"graphql/inputs/order-entry-input",title:"OrderEntryInput",description:"No description",source:"@site/docs/graphql/inputs/order-entry-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/order-entry-input",permalink:"/docs/graphql/inputs/order-entry-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/order-entry-input.mdx",tags:[],version:"current",frontMatter:{id:"order-entry-input",title:"OrderEntryInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"NotificationTemplateInput",permalink:"/docs/graphql/inputs/notification-template-input"},next:{title:"OrderFiltersInput",permalink:"/docs/graphql/inputs/order-filters-input"}},u={},l=[{value:"Fields",id:"fields",level:3},{value:"<code>price_per_item</code> (<code>MoneyInput</code>)",id:"price_per_item-moneyinput",level:4},{value:"<code>productId</code> (<code>ID</code>)",id:"productid-id",level:4},{value:"<code>productVariantId</code> (<code>ID</code>)",id:"productvariantid-id",level:4},{value:"<code>quantity</code> (<code>Int</code>)",id:"quantity-int",level:4},{value:"<code>ticketId</code> (<code>ID</code>)",id:"ticketid-id",level:4}],s={toc:l};function f(e){var t=e.components,n=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"No description"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"input OrderEntryInput {\n  price_per_item: MoneyInput\n  productId: ID\n  productVariantId: ID\n  quantity: Int\n  ticketId: ID\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"price_per_item-moneyinput"},(0,o.kt)("inlineCode",{parentName:"h4"},"price_per_item")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/money-input"},(0,o.kt)("inlineCode",{parentName:"a"},"MoneyInput")),")"),(0,o.kt)("h4",{id:"productid-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"productId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,o.kt)("h4",{id:"productvariantid-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"productVariantId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,o.kt)("h4",{id:"quantity-int"},(0,o.kt)("inlineCode",{parentName:"h4"},"quantity")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,o.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,o.kt)("h4",{id:"ticketid-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"ticketId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"))}f.isMDXComponent=!0}}]);