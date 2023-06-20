"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[63814],{75631:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>f});var n=r(45721);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function d(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),p=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):d(d({},t),e)),r},u=function(e){var t=p(e.components);return n.createElement(i.Provider,{value:t},e.children)},c="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),c=p(r),m=a,f=c["".concat(i,".").concat(m)]||c[m]||s[m]||o;return r?n.createElement(f,d(d({ref:t},u),{},{components:r})):n.createElement(f,d({ref:t},u))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,d=new Array(o);d[0]=m;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l[c]="string"==typeof e?e:a,d[1]=l;for(var p=2;p<o;p++)d[p]=r[p];return n.createElement.apply(null,d)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},64695:(e,t,r)=>{r.r(t),r.d(t,{Badge:()=>m,Bullet:()=>c,SpecifiedBy:()=>s,assets:()=>p,contentTitle:()=>l,default:()=>y,frontMatter:()=>d,metadata:()=>i,toc:()=>u});var n=r(9715),a=r(45721),o=r(75631);const d={id:"update-order-input",title:"UpdateOrderInput",hide_table_of_contents:!1},l=void 0,i={unversionedId:"graphql/inputs/update-order-input",id:"graphql/inputs/update-order-input",title:"UpdateOrderInput",description:"Autogenerated input type of UpdateOrder",source:"@site/docs/graphql/inputs/update-order-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/update-order-input",permalink:"/docs/graphql/inputs/update-order-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/update-order-input.mdx",tags:[],version:"current",frontMatter:{id:"update-order-input",title:"UpdateOrderInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"UpdateOrderEntryInput",permalink:"/docs/graphql/inputs/update-order-entry-input"},next:{title:"UpdateOrganizationRoleInput",permalink:"/docs/graphql/inputs/update-organization-role-input"}},p={},u=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateOrderInput.<b>clientMutationId</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-updateorderinputbclientmutationidbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateOrderInput.<b>id</b></code><Bullet /><code>ID</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-updateorderinputbidbcodeid-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateOrderInput.<b>order</b></code><Bullet /><code>OrderInput!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="input"/>',id:"code-style-fontweight-normal-updateorderinputborderbcodeorderinput--",level:4},{value:"Member of",id:"member-of",level:3}],c=()=>(0,o.kt)(a.Fragment,null,(0,o.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),s=e=>(0,o.kt)(a.Fragment,null,"Specification",(0,o.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),m=e=>(0,o.kt)(a.Fragment,null,(0,o.kt)("span",{class:"badge badge--"+e.class},e.text)),f={toc:u,Bullet:c,SpecifiedBy:s,Badge:m},g="wrapper";function y(e){let{components:t,...r}=e;return(0,o.kt)(g,(0,n.Z)({},f,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Autogenerated input type of UpdateOrder"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"input UpdateOrderInput {\n  clientMutationId: String\n  id: ID\n  order: OrderInput!\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"code-style-fontweight-normal-updateorderinputbclientmutationidbcodestring-"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("code",{style:{fontWeight:"normal"}},"UpdateOrderInput.",(0,o.kt)("b",null,"clientMutationId"))),(0,o.kt)(c,{mdxType:"Bullet"}),(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,o.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"A unique identifier for the client performing the mutation.")),(0,o.kt)("h4",{id:"code-style-fontweight-normal-updateorderinputbidbcodeid-"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("code",{style:{fontWeight:"normal"}},"UpdateOrderInput.",(0,o.kt)("b",null,"id"))),(0,o.kt)(c,{mdxType:"Bullet"}),(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID"))," ",(0,o.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,o.kt)("blockquote",null),(0,o.kt)("h4",{id:"code-style-fontweight-normal-updateorderinputborderbcodeorderinput--"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("code",{style:{fontWeight:"normal"}},"UpdateOrderInput.",(0,o.kt)("b",null,"order"))),(0,o.kt)(c,{mdxType:"Bullet"}),(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/order-input"},(0,o.kt)("inlineCode",{parentName:"a"},"OrderInput!"))," ",(0,o.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,o.kt)(m,{class:"secondary",text:"input",mdxType:"Badge"})),(0,o.kt)("blockquote",null),(0,o.kt)("h3",{id:"member-of"},"Member of"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/docs/graphql/mutations/update-order"},(0,o.kt)("inlineCode",{parentName:"a"},"updateOrder")),"  ",(0,o.kt)(m,{class:"secondary",text:"mutation",mdxType:"Badge"})))}y.isMDXComponent=!0}}]);