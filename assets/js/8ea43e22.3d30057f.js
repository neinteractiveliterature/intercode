"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[70977],{75631:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>y});var r=n(45721);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),u=p(n),y=o,f=u["".concat(l,".").concat(y)]||u[y]||d[y]||a;return n?r.createElement(f,i(i({ref:t},s),{},{components:n})):r.createElement(f,i({ref:t},s))}));function y(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=u;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var p=2;p<a;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},73723:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>y,Bullet:()=>d,SpecifiedBy:()=>u,assets:()=>p,contentTitle:()=>c,default:()=>m,frontMatter:()=>i,metadata:()=>l,toc:()=>s});var r=n(50524),o=n(45721),a=n(75631);const i={id:"ticket-type-parent",title:"TicketTypeParent",hide_table_of_contents:!1},c=void 0,l={unversionedId:"graphql/unions/ticket-type-parent",id:"graphql/unions/ticket-type-parent",title:"TicketTypeParent",description:"No description",source:"@site/docs/graphql/unions/ticket-type-parent.mdx",sourceDirName:"graphql/unions",slug:"/graphql/unions/ticket-type-parent",permalink:"/docs/graphql/unions/ticket-type-parent",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/unions/ticket-type-parent.mdx",tags:[],version:"current",frontMatter:{id:"ticket-type-parent",title:"TicketTypeParent",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"SearchableModel",permalink:"/docs/graphql/unions/searchable-model"},next:{title:"Introduction",permalink:"/docs/liquid"}},p={},s=[{value:"Possible types",id:"possible-types",level:3},{value:'<code>Convention</code> <Badge class="secondary" text="object"/>',id:"convention-",level:4},{value:'<code>Event</code> <Badge class="secondary" text="object"/>',id:"event-",level:4},{value:"Member of",id:"member-of",level:3}],d=()=>(0,a.kt)(o.Fragment,null,(0,a.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),u=e=>(0,a.kt)(o.Fragment,null,"Specification",(0,a.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),y=e=>(0,a.kt)(o.Fragment,null,(0,a.kt)("span",{class:"badge badge--"+e.class},e.text)),f={toc:s,Bullet:d,SpecifiedBy:u,Badge:y};function m(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"No description"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"union TicketTypeParent = Convention | Event\n")),(0,a.kt)("h3",{id:"possible-types"},"Possible types"),(0,a.kt)("h4",{id:"convention-"},(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/convention"},(0,a.kt)("inlineCode",{parentName:"a"},"Convention"))," ",(0,a.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"})),(0,a.kt)("blockquote",null),(0,a.kt)("h4",{id:"event-"},(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/event"},(0,a.kt)("inlineCode",{parentName:"a"},"Event"))," ",(0,a.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"})),(0,a.kt)("blockquote",null),(0,a.kt)("h3",{id:"member-of"},"Member of"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/docs/graphql/objects/ticket-type"},(0,a.kt)("inlineCode",{parentName:"a"},"TicketType")),"  ",(0,a.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"})))}m.isMDXComponent=!0}}]);