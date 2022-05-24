"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[19830],{75631:function(e,t,r){r.d(t,{Zo:function(){return l},kt:function(){return f}});var n=r(3289);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var s=n.createContext({}),d=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},l=function(e){var t=d(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),u=d(r),f=i,v=u["".concat(s,".").concat(f)]||u[f]||p[f]||o;return r?n.createElement(v,c(c({ref:t},l),{},{components:r})):n.createElement(v,c({ref:t},l))}));function f(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=r.length,c=new Array(o);c[0]=u;var a={};for(var s in t)hasOwnProperty.call(t,s)&&(a[s]=t[s]);a.originalType=e,a.mdxType="string"==typeof e?e:i,c[1]=a;for(var d=2;d<o;d++)c[d]=r[d];return n.createElement.apply(null,c)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},71470:function(e,t,r){r.r(t),r.d(t,{assets:function(){return l},contentTitle:function(){return s},default:function(){return f},frontMatter:function(){return a},metadata:function(){return d},toc:function(){return p}});var n=r(43830),i=r(32056),o=(r(3289),r(75631)),c=["components"],a={id:"events-created-since-drop",title:"EventsCreatedSinceDrop"},s=void 0,d={unversionedId:"liquid/drops/events-created-since-drop",id:"liquid/drops/events-created-since-drop",title:"EventsCreatedSinceDrop",description:"A magical container for finding the events that were created since a certain date.",source:"@site/docs/liquid/drops/events-created-since-drop.mdx",sourceDirName:"liquid/drops",slug:"/liquid/drops/events-created-since-drop",permalink:"/docs/liquid/drops/events-created-since-drop",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/liquid/drops/events-created-since-drop.mdx",tags:[],version:"current",frontMatter:{id:"events-created-since-drop",title:"EventsCreatedSinceDrop"},sidebar:"sidebar",previous:{title:"EventProposalDrop",permalink:"/docs/liquid/drops/event-proposal-drop"},next:{title:"Money::CurrencyDrop",permalink:"/docs/liquid/drops/money-currency-drop"}},l={},p=[{value:"Examples",id:"examples",level:3},{value:"Fields",id:"fields",level:3}],u={toc:p};function f(e){var t=e.components,r=(0,i.Z)(e,c);return(0,o.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"A magical container for finding the events that were created since a certain date."),(0,o.kt)("h3",{id:"examples"},"Examples"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-liquid",metastring:'title="Retrieving the events created since a certain date"',title:'"Retrieving',the:!0,events:!0,created:!0,since:!0,a:!0,certain:!0,'date"':!0},'{{ convention.events_created_since["2018-11-03T00:00:00-05:00"] }}\n')),(0,o.kt)("h3",{id:"fields"},"Fields"))}f.isMDXComponent=!0}}]);