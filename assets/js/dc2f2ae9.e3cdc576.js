"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[44712],{75631:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>f});var r=n(45721);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var u=r.createContext({}),o=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=o(e.components);return r.createElement(u.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},g=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,s=e.originalType,u=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),c=o(n),g=i,f=c["".concat(u,".").concat(g)]||c[g]||d[g]||s;return n?r.createElement(f,a(a({ref:t},p),{},{components:n})):r.createElement(f,a({ref:t},p))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var s=n.length,a=new Array(s);a[0]=g;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l[c]="string"==typeof e?e:i,a[1]=l;for(var o=2;o<s;o++)a[o]=n[o];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}g.displayName="MDXCreateElement"},51909:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>g,Bullet:()=>c,SpecifiedBy:()=>d,assets:()=>o,contentTitle:()=>l,default:()=>y,frontMatter:()=>a,metadata:()=>u,toc:()=>p});var r=n(9715),i=n(45721),s=n(75631);const a={id:"signup-request-filters-input",title:"SignupRequestFiltersInput",hide_table_of_contents:!1},l=void 0,u={unversionedId:"graphql/inputs/signup-request-filters-input",id:"graphql/inputs/signup-request-filters-input",title:"SignupRequestFiltersInput",description:"No description",source:"@site/docs/graphql/inputs/signup-request-filters-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/signup-request-filters-input",permalink:"/docs/graphql/inputs/signup-request-filters-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/signup-request-filters-input.mdx",tags:[],version:"current",frontMatter:{id:"signup-request-filters-input",title:"SignupRequestFiltersInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"SignupFiltersInput",permalink:"/docs/graphql/inputs/signup-filters-input"},next:{title:"SortCmsNavigationItemsInput",permalink:"/docs/graphql/inputs/sort-cms-navigation-items-input"}},o={},p=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>SignupRequestFiltersInput.<b>state</b></code><Bullet /><code>[SignupRequestState!]</code> <Badge class="secondary" text="list"/> <Badge class="secondary" text="enum"/>',id:"code-style-fontweight-normal-signuprequestfiltersinputbstatebcodesignuprequeststate--",level:4}],c=()=>(0,s.kt)(i.Fragment,null,(0,s.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),d=e=>(0,s.kt)(i.Fragment,null,"Specification",(0,s.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),g=e=>(0,s.kt)(i.Fragment,null,(0,s.kt)("span",{class:"badge badge--"+e.class},e.text)),f={toc:p,Bullet:c,SpecifiedBy:d,Badge:g},m="wrapper";function y(e){let{components:t,...n}=e;return(0,s.kt)(m,(0,r.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"No description"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-graphql"},"input SignupRequestFiltersInput {\n  state: [SignupRequestState!]\n}\n")),(0,s.kt)("h3",{id:"fields"},"Fields"),(0,s.kt)("h4",{id:"code-style-fontweight-normal-signuprequestfiltersinputbstatebcodesignuprequeststate--"},(0,s.kt)("a",{parentName:"h4",href:"#"},(0,s.kt)("code",{style:{fontWeight:"normal"}},"SignupRequestFiltersInput.",(0,s.kt)("b",null,"state"))),(0,s.kt)(c,{mdxType:"Bullet"}),(0,s.kt)("a",{parentName:"h4",href:"/docs/graphql/enums/signup-request-state"},(0,s.kt)("inlineCode",{parentName:"a"},"[SignupRequestState!]"))," ",(0,s.kt)(g,{class:"secondary",text:"list",mdxType:"Badge"})," ",(0,s.kt)(g,{class:"secondary",text:"enum",mdxType:"Badge"})),(0,s.kt)("blockquote",null))}y.isMDXComponent=!0}}]);