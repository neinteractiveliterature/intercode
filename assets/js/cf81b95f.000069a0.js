"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[74633],{75631:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>f});var n=r(45721);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),p=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},c=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),u=p(r),m=a,f=u["".concat(s,".").concat(m)]||u[m]||d[m]||i;return r?n.createElement(f,l(l({ref:t},c),{},{components:r})):n.createElement(f,l({ref:t},c))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,l=new Array(i);l[0]=m;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o[u]="string"==typeof e?e:a,l[1]=o;for(var p=2;p<i;p++)l[p]=r[p];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},5655:(e,t,r)=>{r.r(t),r.d(t,{Badge:()=>m,Bullet:()=>u,SpecifiedBy:()=>d,assets:()=>p,contentTitle:()=>o,default:()=>y,frontMatter:()=>l,metadata:()=>s,toc:()=>c});var n=r(9715),a=r(45721),i=r(75631);const l={id:"email-route-input",title:"EmailRouteInput",hide_table_of_contents:!1},o=void 0,s={unversionedId:"graphql/inputs/email-route-input",id:"graphql/inputs/email-route-input",title:"EmailRouteInput",description:"No description",source:"@site/docs/graphql/inputs/email-route-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/email-route-input",permalink:"/docs/graphql/inputs/email-route-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/email-route-input.mdx",tags:[],version:"current",frontMatter:{id:"email-route-input",title:"EmailRouteInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"EmailRouteFiltersInput",permalink:"/docs/graphql/inputs/email-route-filters-input"},next:{title:"EventCategoryInput",permalink:"/docs/graphql/inputs/event-category-input"}},p={},c=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>EmailRouteInput.<b>forward_addresses</b></code><Bullet /><code>[String!]</code> <Badge class="secondary" text="list"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-emailrouteinputbforward_addressesbcodestring--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EmailRouteInput.<b>receiver_address</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-emailrouteinputbreceiver_addressbcodestring-",level:4},{value:"Member of",id:"member-of",level:3}],u=()=>(0,i.kt)(a.Fragment,null,(0,i.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),d=e=>(0,i.kt)(a.Fragment,null,"Specification",(0,i.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),m=e=>(0,i.kt)(a.Fragment,null,(0,i.kt)("span",{class:"badge badge--"+e.class},e.text)),f={toc:c,Bullet:u,SpecifiedBy:d,Badge:m},g="wrapper";function y(e){let{components:t,...r}=e;return(0,i.kt)(g,(0,n.Z)({},f,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"No description"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"input EmailRouteInput {\n  forward_addresses: [String!]\n  receiver_address: String\n}\n")),(0,i.kt)("h3",{id:"fields"},"Fields"),(0,i.kt)("h4",{id:"code-style-fontweight-normal-emailrouteinputbforward_addressesbcodestring--"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("code",{style:{fontWeight:"normal"}},"EmailRouteInput.",(0,i.kt)("b",null,"forward_addresses"))),(0,i.kt)(u,{mdxType:"Bullet"}),(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"[String!]"))," ",(0,i.kt)(m,{class:"secondary",text:"list",mdxType:"Badge"})," ",(0,i.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,i.kt)("blockquote",null),(0,i.kt)("h4",{id:"code-style-fontweight-normal-emailrouteinputbreceiver_addressbcodestring-"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("code",{style:{fontWeight:"normal"}},"EmailRouteInput.",(0,i.kt)("b",null,"receiver_address"))),(0,i.kt)(u,{mdxType:"Bullet"}),(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,i.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,i.kt)("blockquote",null),(0,i.kt)("h3",{id:"member-of"},"Member of"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/create-email-route-input"},(0,i.kt)("inlineCode",{parentName:"a"},"CreateEmailRouteInput")),"  ",(0,i.kt)(m,{class:"secondary",text:"input",mdxType:"Badge"}),(0,i.kt)(u,{mdxType:"Bullet"}),(0,i.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/update-email-route-input"},(0,i.kt)("inlineCode",{parentName:"a"},"UpdateEmailRouteInput")),"  ",(0,i.kt)(m,{class:"secondary",text:"input",mdxType:"Badge"})))}y.isMDXComponent=!0}}]);