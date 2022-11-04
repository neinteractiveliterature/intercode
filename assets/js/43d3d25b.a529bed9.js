"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[62176],{75631:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>d});var n=r(45721);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=c(r),d=o,h=m["".concat(l,".").concat(d)]||m[d]||p[d]||a;return r?n.createElement(h,i(i({ref:t},u),{},{components:r})):n.createElement(h,i({ref:t},u))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},3734:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var n=r(50524),o=(r(45721),r(75631));const a={title:"GraphQL Cross-Domain Security Issue Disclosure",tags:["security"],authors:["marleighnorton","nbudin","dkapell","jaelen"]},i=void 0,s={permalink:"/blog/2022/01/18/graphql-cross-domain-security-issue-disclosure",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/blog/blog/2022-01-18-graphql-cross-domain-security-issue-disclosure.md",source:"@site/blog/2022-01-18-graphql-cross-domain-security-issue-disclosure.md",title:"GraphQL Cross-Domain Security Issue Disclosure",description:"Hey all. This thing happened we should tell you about.",date:"2022-01-18T00:00:00.000Z",formattedDate:"January 18, 2022",tags:[{label:"security",permalink:"/blog/tags/security"}],readingTime:2.285,hasTruncateMarker:!0,authors:[{name:"Marleigh Norton",url:"https://github.com/marleighnorton",imageURL:"https://github.com/marleighnorton.png",key:"marleighnorton"},{name:"Nat Budin",url:"https://github.com/nbudin",imageURL:"https://github.com/nbudin.png",key:"nbudin"},{name:"Dave Kapell",url:"https://github.com/dkapell",imageURL:"https://github.com/dkapell.png",key:"dkapell"},{name:"Jae Hartwin",url:"https://github.com/jhartwin",imageURL:"https://github.com/jhartwin.png",key:"jaelen"}],frontMatter:{title:"GraphQL Cross-Domain Security Issue Disclosure",tags:["security"],authors:["marleighnorton","nbudin","dkapell","jaelen"]},nextItem:{title:"Email forwarding",permalink:"/blog/2020/03/15/email-forwarding"}},l={authorsImageUrls:[void 0,void 0,void 0,void 0]},c=[],u={toc:c};function p(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Hey all. This thing happened we should tell you about."),(0,o.kt)("p",null,"While performing platform upgrades, we found a bug in Intercode, the website code used by conventions such as Intercon. It has since been fixed."),(0,o.kt)("p",null,"This bug created an exploit where people with leadership access to one Intercode convention could use certain permissions on any convention. As a reminder, not even admins have access to your passwords or financial information."),(0,o.kt)("p",null,"Due to the technical complexity of accessing the exploit and the small number of people who had the permissions required to take advantage of this, we don\u2019t think it was used, but can\u2019t prove it."))}p.isMDXComponent=!0}}]);