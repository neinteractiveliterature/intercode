"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[3127],{75631:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>y});var n=r(45721);function l(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){l(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,l=function(e,t){if(null==e)return{};var r,n,l={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(l[r]=e[r]);return l}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(l[r]=e[r])}return l}var p=n.createContext({}),c=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(p.Provider,{value:t},e.children)},s="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,l=e.mdxType,a=e.originalType,p=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),s=c(r),m=l,y=s["".concat(p,".").concat(m)]||s[m]||d[m]||a;return r?n.createElement(y,i(i({ref:t},u),{},{components:r})):n.createElement(y,i({ref:t},u))}));function y(e,t){var r=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var a=r.length,i=new Array(a);i[0]=m;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o[s]="string"==typeof e?e:l,i[1]=o;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},79980:(e,t,r)=>{r.r(t),r.d(t,{Badge:()=>m,Bullet:()=>s,SpecifiedBy:()=>d,assets:()=>c,contentTitle:()=>o,default:()=>g,frontMatter:()=>i,metadata:()=>p,toc:()=>u});var n=r(9715),l=r(45721),a=r(75631);const i={id:"delete-cms-graphql-query-input",title:"DeleteCmsGraphqlQueryInput",hide_table_of_contents:!1},o=void 0,p={unversionedId:"graphql/inputs/delete-cms-graphql-query-input",id:"graphql/inputs/delete-cms-graphql-query-input",title:"DeleteCmsGraphqlQueryInput",description:"Autogenerated input type of DeleteCmsGraphqlQuery",source:"@site/docs/graphql/inputs/delete-cms-graphql-query-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/delete-cms-graphql-query-input",permalink:"/docs/graphql/inputs/delete-cms-graphql-query-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/delete-cms-graphql-query-input.mdx",tags:[],version:"current",frontMatter:{id:"delete-cms-graphql-query-input",title:"DeleteCmsGraphqlQueryInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"DeleteCmsFileInput",permalink:"/docs/graphql/inputs/delete-cms-file-input"},next:{title:"DeleteCmsLayoutInput",permalink:"/docs/graphql/inputs/delete-cms-layout-input"}},c={},u=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>DeleteCmsGraphqlQueryInput.<b>clientMutationId</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-deletecmsgraphqlqueryinputbclientmutationidbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>DeleteCmsGraphqlQueryInput.<b>id</b></code><Bullet /><code>ID</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-deletecmsgraphqlqueryinputbidbcodeid-",level:4},{value:"Member of",id:"member-of",level:3}],s=()=>(0,a.kt)(l.Fragment,null,(0,a.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),d=e=>(0,a.kt)(l.Fragment,null,"Specification",(0,a.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),m=e=>(0,a.kt)(l.Fragment,null,(0,a.kt)("span",{class:"badge badge--"+e.class},e.text)),y={toc:u,Bullet:s,SpecifiedBy:d,Badge:m},f="wrapper";function g(e){let{components:t,...r}=e;return(0,a.kt)(f,(0,n.Z)({},y,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Autogenerated input type of DeleteCmsGraphqlQuery"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"input DeleteCmsGraphqlQueryInput {\n  clientMutationId: String\n  id: ID\n}\n")),(0,a.kt)("h3",{id:"fields"},"Fields"),(0,a.kt)("h4",{id:"code-style-fontweight-normal-deletecmsgraphqlqueryinputbclientmutationidbcodestring-"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("code",{style:{fontWeight:"normal"}},"DeleteCmsGraphqlQueryInput.",(0,a.kt)("b",null,"clientMutationId"))),(0,a.kt)(s,{mdxType:"Bullet"}),(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,a.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"A unique identifier for the client performing the mutation.")),(0,a.kt)("h4",{id:"code-style-fontweight-normal-deletecmsgraphqlqueryinputbidbcodeid-"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("code",{style:{fontWeight:"normal"}},"DeleteCmsGraphqlQueryInput.",(0,a.kt)("b",null,"id"))),(0,a.kt)(s,{mdxType:"Bullet"}),(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"ID"))," ",(0,a.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,a.kt)("blockquote",null),(0,a.kt)("h3",{id:"member-of"},"Member of"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/docs/graphql/mutations/delete-cms-graphql-query"},(0,a.kt)("inlineCode",{parentName:"a"},"deleteCmsGraphqlQuery")),"  ",(0,a.kt)(m,{class:"secondary",text:"mutation",mdxType:"Badge"})))}g.isMDXComponent=!0}}]);