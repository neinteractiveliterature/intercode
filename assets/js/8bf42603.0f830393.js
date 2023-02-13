"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[33276],{75631:(e,t,a)=>{a.d(t,{Zo:()=>s,kt:()=>y});var r=a(45721);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function p(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var d=r.createContext({}),c=function(e){var t=r.useContext(d),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},s=function(e){var t=c(e.components);return r.createElement(d.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},i=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,l=e.originalType,d=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),i=c(a),y=n,m=i["".concat(d,".").concat(y)]||i[y]||u[y]||l;return a?r.createElement(m,o(o({ref:t},s),{},{components:a})):r.createElement(m,o({ref:t},s))}));function y(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=a.length,o=new Array(l);o[0]=i;var p={};for(var d in t)hasOwnProperty.call(t,d)&&(p[d]=t[d]);p.originalType=e,p.mdxType="string"==typeof e?e:n,o[1]=p;for(var c=2;c<l;c++)o[c]=a[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,a)}i.displayName="MDXCreateElement"},7396:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>y,Bullet:()=>u,SpecifiedBy:()=>i,assets:()=>c,contentTitle:()=>p,default:()=>g,frontMatter:()=>o,metadata:()=>d,toc:()=>s});var r=a(81648),n=a(45721),l=a(75631);const o={id:"update-cms-graphql-query-payload",title:"UpdateCmsGraphqlQueryPayload",hide_table_of_contents:!1},p=void 0,d={unversionedId:"graphql/objects/update-cms-graphql-query-payload",id:"graphql/objects/update-cms-graphql-query-payload",title:"UpdateCmsGraphqlQueryPayload",description:"Autogenerated return type of UpdateCmsGraphqlQuery.",source:"@site/docs/graphql/objects/update-cms-graphql-query-payload.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/update-cms-graphql-query-payload",permalink:"/docs/graphql/objects/update-cms-graphql-query-payload",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/update-cms-graphql-query-payload.mdx",tags:[],version:"current",frontMatter:{id:"update-cms-graphql-query-payload",title:"UpdateCmsGraphqlQueryPayload",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"UpdateCmsContentGroupPayload",permalink:"/docs/graphql/objects/update-cms-content-group-payload"},next:{title:"UpdateCmsLayoutPayload",permalink:"/docs/graphql/objects/update-cms-layout-payload"}},c={},s=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateCmsGraphqlQueryPayload.<b>clientMutationId</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-updatecmsgraphqlquerypayloadbclientmutationidbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateCmsGraphqlQueryPayload.<b>query</b></code><Bullet /><code>CmsGraphqlQuery!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-updatecmsgraphqlquerypayloadbquerybcodecmsgraphqlquery--",level:4},{value:"Returned by",id:"returned-by",level:3}],u=()=>(0,l.kt)(n.Fragment,null,(0,l.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),i=e=>(0,l.kt)(n.Fragment,null,"Specification",(0,l.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),y=e=>(0,l.kt)(n.Fragment,null,(0,l.kt)("span",{class:"badge badge--"+e.class},e.text)),m={toc:s,Bullet:u,SpecifiedBy:i,Badge:y};function g(e){let{components:t,...a}=e;return(0,l.kt)("wrapper",(0,r.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Autogenerated return type of UpdateCmsGraphqlQuery."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-graphql"},"type UpdateCmsGraphqlQueryPayload {\n  clientMutationId: String\n  query: CmsGraphqlQuery!\n}\n")),(0,l.kt)("h3",{id:"fields"},"Fields"),(0,l.kt)("h4",{id:"code-style-fontweight-normal-updatecmsgraphqlquerypayloadbclientmutationidbcodestring-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"UpdateCmsGraphqlQueryPayload.",(0,l.kt)("b",null,"clientMutationId"))),(0,l.kt)(u,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,l.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,l.kt)(y,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"A unique identifier for the client performing the mutation.")),(0,l.kt)("h4",{id:"code-style-fontweight-normal-updatecmsgraphqlquerypayloadbquerybcodecmsgraphqlquery--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"UpdateCmsGraphqlQueryPayload.",(0,l.kt)("b",null,"query"))),(0,l.kt)(u,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/cms-graphql-query"},(0,l.kt)("inlineCode",{parentName:"a"},"CmsGraphqlQuery!"))," ",(0,l.kt)(y,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h3",{id:"returned-by"},"Returned by"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/mutations/update-cms-graphql-query"},(0,l.kt)("inlineCode",{parentName:"a"},"updateCmsGraphqlQuery")),"  ",(0,l.kt)(y,{class:"secondary",text:"mutation",mdxType:"Badge"})))}g.isMDXComponent=!0}}]);