"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[26360],{75631:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>f});var r=n(45721);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=c(n),f=i,m=p["".concat(l,".").concat(f)]||p[f]||d[f]||a;return n?r.createElement(m,o(o({ref:t},u),{},{components:n})):r.createElement(m,o({ref:t},u))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var c=2;c<a;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},1296:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var r=n(81648),i=(n(45721),n(75631));const a={id:"to-sentence",title:"to_sentence"},o=void 0,s={unversionedId:"liquid/filters/to-sentence",id:"liquid/filters/to-sentence",title:"to_sentence",description:"Given an array of strings, outputs an English representation of that array.",source:"@site/docs/liquid/filters/to-sentence.mdx",sourceDirName:"liquid/filters",slug:"/liquid/filters/to-sentence",permalink:"/docs/liquid/filters/to-sentence",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/liquid/filters/to-sentence.mdx",tags:[],version:"current",frontMatter:{id:"to-sentence",title:"to_sentence"},sidebar:"sidebar",previous:{title:"titleize",permalink:"/docs/liquid/filters/titleize"},next:{title:"add_to_calendar_dropdown",permalink:"/docs/liquid/tags/add-to-calendar-dropdown"}},l={},c=[{value:"Parameters",id:"parameters",level:3},{value:"<code>input</code> (<code>Array&lt;String&gt;</code>)",id:"input-arraystring",level:4},{value:"Returns (<code>String</code>)",id:"returns-string",level:3},{value:"Examples",id:"examples",level:3}],u={toc:c};function d(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Given an array of strings, outputs an English representation of that array."),(0,i.kt)("h3",{id:"parameters"},"Parameters"),(0,i.kt)("h4",{id:"input-arraystring"},(0,i.kt)("inlineCode",{parentName:"h4"},"input")," (",(0,i.kt)("code",null,"Array","<","String",">"),")"),(0,i.kt)("p",null,"An array of strings"),(0,i.kt)("h3",{id:"returns-string"},"Returns (",(0,i.kt)("code",null,"String"),")"),(0,i.kt)("p",null,"The strings formatted as an English phrase"),(0,i.kt)("h3",{id:"examples"},"Examples"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-liquid",metastring:'title="One string"',title:'"One','string"':!0},'{{ ["one fish"] | to_sentence }} => one fish\n')),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-liquid",metastring:'title="Two strings"',title:'"Two','strings"':!0},'{{ ["one fish", "two fish"] | to_sentence }} => one fish and two fish\n')),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-liquid",metastring:'title="More than two strings"',title:'"More',than:!0,two:!0,'strings"':!0},'{{ ["one fish", "two fish", "red fish", "blue fish"] | to_sentence }}\n=> one fish, two fish, red fish, and blue fish\n')))}d.isMDXComponent=!0}}]);