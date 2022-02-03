"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[79569],{75631:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return f}});var r=n(3289);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=r.createContext({}),s=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},c=function(e){var t=s(e.components);return r.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=s(n),f=i,g=d["".concat(p,".").concat(f)]||d[f]||u[f]||o;return n?r.createElement(g,a(a({ref:t},c),{},{components:n})):r.createElement(g,a({ref:t},c))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=d;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:i,a[1]=l;for(var s=2;s<o;s++)a[s]=n[s];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},57567:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return p},metadata:function(){return s},toc:function(){return c},default:function(){return d}});var r=n(236),i=n(86460),o=(n(3289),n(75631)),a=["components"],l={id:"event-proposal-filters-input",title:"EventProposalFiltersInput"},p=void 0,s={unversionedId:"graphql/inputs/event-proposal-filters-input",id:"graphql/inputs/event-proposal-filters-input",title:"EventProposalFiltersInput",description:"No description",source:"@site/docs/graphql/inputs/event-proposal-filters-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/event-proposal-filters-input",permalink:"/docs/graphql/inputs/event-proposal-filters-input",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/event-proposal-filters-input.mdx",tags:[],version:"current",frontMatter:{id:"event-proposal-filters-input",title:"EventProposalFiltersInput"},sidebar:"sidebar",previous:{title:"EventInput",permalink:"/docs/graphql/inputs/event-input"},next:{title:"EventProposalInput",permalink:"/docs/graphql/inputs/event-proposal-input"}},c=[{value:"Fields",id:"fields",children:[{value:"<code>event_category</code> (Int)",id:"event_category-int",children:[],level:4},{value:"<code>owner</code> (String)",id:"owner-string",children:[],level:4},{value:"<code>status</code> (String)",id:"status-string",children:[],level:4},{value:"<code>title</code> (String)",id:"title-string",children:[],level:4}],level:3}],u={toc:c};function d(e){var t=e.components,n=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"No description"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type EventProposalFiltersInput {\n  event_category: [Int]\n  owner: String\n  status: [String]\n  title: String\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"event_category-int"},(0,o.kt)("inlineCode",{parentName:"h4"},"event_category")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,o.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,o.kt)("h4",{id:"owner-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"owner")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("h4",{id:"status-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"status")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("h4",{id:"title-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"title")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"))}d.isMDXComponent=!0}}]);