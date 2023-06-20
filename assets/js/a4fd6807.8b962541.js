"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[39549],{75631:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>y});var r=n(45721);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=l(n),f=o,y=p["".concat(c,".").concat(f)]||p[f]||d[f]||i;return n?r.createElement(y,a(a({ref:t},u),{},{components:n})):r.createElement(y,a({ref:t},u))}));function y(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=f;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[p]="string"==typeof e?e:o,a[1]=s;for(var l=2;l<i;l++)a[l]=n[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},72535:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>f,Bullet:()=>p,SpecifiedBy:()=>d,assets:()=>l,contentTitle:()=>s,default:()=>m,frontMatter:()=>a,metadata:()=>c,toc:()=>u});var r=n(9715),o=n(45721),i=n(75631);const a={id:"convention-by-request-host",title:"conventionByRequestHost",hide_table_of_contents:!1},s=void 0,c={unversionedId:"graphql/queries/convention-by-request-host",id:"graphql/queries/convention-by-request-host",title:"conventionByRequestHost",description:"Returns the convention associated with the domain name of this HTTP request. If one is not",source:"@site/docs/graphql/queries/convention-by-request-host.mdx",sourceDirName:"graphql/queries",slug:"/graphql/queries/convention-by-request-host",permalink:"/docs/graphql/queries/convention-by-request-host",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/queries/convention-by-request-host.mdx",tags:[],version:"current",frontMatter:{id:"convention-by-request-host",title:"conventionByRequestHost",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"conventionByRequestHostIfPresent",permalink:"/docs/graphql/queries/convention-by-request-host-if-present"},next:{title:"conventions_paginated",permalink:"/docs/graphql/queries/conventions-paginated"}},l={},u=[{value:"Type",id:"type",level:3},{value:'<code>Convention</code> <Badge class="secondary" text="object"/>',id:"convention-",level:4}],p=()=>(0,i.kt)(o.Fragment,null,(0,i.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),d=e=>(0,i.kt)(o.Fragment,null,"Specification",(0,i.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),f=e=>(0,i.kt)(o.Fragment,null,(0,i.kt)("span",{class:"badge badge--"+e.class},e.text)),y={toc:u,Bullet:p,SpecifiedBy:d,Badge:f},v="wrapper";function m(e){let{components:t,...n}=e;return(0,i.kt)(v,(0,r.Z)({},y,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Returns the convention associated with the domain name of this HTTP request. If one is not\npresent, the request will error out. (For a version that will return null instead of\nerroring out, use ",(0,i.kt)("inlineCode",{parentName:"p"},"conventionByRequestHostIfPresent"),".)"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"conventionByRequestHost: Convention!\n")),(0,i.kt)("h3",{id:"type"},"Type"),(0,i.kt)("h4",{id:"convention-"},(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/convention"},(0,i.kt)("inlineCode",{parentName:"a"},"Convention"))," ",(0,i.kt)(f,{class:"secondary",text:"object",mdxType:"Badge"})),(0,i.kt)("blockquote",null))}m.isMDXComponent=!0}}]);