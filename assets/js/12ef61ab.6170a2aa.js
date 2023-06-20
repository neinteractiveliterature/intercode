"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[17273],{75631:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>f});var a=n(45721);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},p=Object.keys(e);for(a=0;a<p.length;a++)n=p[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(a=0;a<p.length;a++)n=p[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),d=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=d(e.components);return a.createElement(i.Provider,{value:t},e.children)},c="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,p=e.originalType,i=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),c=d(n),m=r,f=c["".concat(i,".").concat(m)]||c[m]||s[m]||p;return n?a.createElement(f,o(o({ref:t},u),{},{components:n})):a.createElement(f,o({ref:t},u))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var p=n.length,o=new Array(p);o[0]=m;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l[c]="string"==typeof e?e:r,o[1]=l;for(var d=2;d<p;d++)o[d]=n[d];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},57938:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>m,Bullet:()=>c,SpecifiedBy:()=>s,assets:()=>d,contentTitle:()=>l,default:()=>y,frontMatter:()=>o,metadata:()=>i,toc:()=>u});var a=n(9715),r=n(45721),p=n(75631);const o={id:"update-department-input",title:"UpdateDepartmentInput",hide_table_of_contents:!1},l=void 0,i={unversionedId:"graphql/inputs/update-department-input",id:"graphql/inputs/update-department-input",title:"UpdateDepartmentInput",description:"Autogenerated input type of UpdateDepartment",source:"@site/docs/graphql/inputs/update-department-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/update-department-input",permalink:"/docs/graphql/inputs/update-department-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/update-department-input.mdx",tags:[],version:"current",frontMatter:{id:"update-department-input",title:"UpdateDepartmentInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"UpdateCouponInput",permalink:"/docs/graphql/inputs/update-coupon-input"},next:{title:"UpdateEmailRouteInput",permalink:"/docs/graphql/inputs/update-email-route-input"}},d={},u=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateDepartmentInput.<b>clientMutationId</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-updatedepartmentinputbclientmutationidbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateDepartmentInput.<b>department</b></code><Bullet /><code>DepartmentInput!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="input"/>',id:"code-style-fontweight-normal-updatedepartmentinputbdepartmentbcodedepartmentinput--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateDepartmentInput.<b>id</b></code><Bullet /><code>ID</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-updatedepartmentinputbidbcodeid-",level:4},{value:"Member of",id:"member-of",level:3}],c=()=>(0,p.kt)(r.Fragment,null,(0,p.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),s=e=>(0,p.kt)(r.Fragment,null,"Specification",(0,p.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),m=e=>(0,p.kt)(r.Fragment,null,(0,p.kt)("span",{class:"badge badge--"+e.class},e.text)),f={toc:u,Bullet:c,SpecifiedBy:s,Badge:m},g="wrapper";function y(e){let{components:t,...n}=e;return(0,p.kt)(g,(0,a.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,p.kt)("p",null,"Autogenerated input type of UpdateDepartment"),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-graphql"},"input UpdateDepartmentInput {\n  clientMutationId: String\n  department: DepartmentInput!\n  id: ID\n}\n")),(0,p.kt)("h3",{id:"fields"},"Fields"),(0,p.kt)("h4",{id:"code-style-fontweight-normal-updatedepartmentinputbclientmutationidbcodestring-"},(0,p.kt)("a",{parentName:"h4",href:"#"},(0,p.kt)("code",{style:{fontWeight:"normal"}},"UpdateDepartmentInput.",(0,p.kt)("b",null,"clientMutationId"))),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,p.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,p.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,p.kt)("blockquote",null,(0,p.kt)("p",{parentName:"blockquote"},"A unique identifier for the client performing the mutation.")),(0,p.kt)("h4",{id:"code-style-fontweight-normal-updatedepartmentinputbdepartmentbcodedepartmentinput--"},(0,p.kt)("a",{parentName:"h4",href:"#"},(0,p.kt)("code",{style:{fontWeight:"normal"}},"UpdateDepartmentInput.",(0,p.kt)("b",null,"department"))),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/department-input"},(0,p.kt)("inlineCode",{parentName:"a"},"DepartmentInput!"))," ",(0,p.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,p.kt)(m,{class:"secondary",text:"input",mdxType:"Badge"})),(0,p.kt)("blockquote",null),(0,p.kt)("h4",{id:"code-style-fontweight-normal-updatedepartmentinputbidbcodeid-"},(0,p.kt)("a",{parentName:"h4",href:"#"},(0,p.kt)("code",{style:{fontWeight:"normal"}},"UpdateDepartmentInput.",(0,p.kt)("b",null,"id"))),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,p.kt)("inlineCode",{parentName:"a"},"ID"))," ",(0,p.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,p.kt)("blockquote",null),(0,p.kt)("h3",{id:"member-of"},"Member of"),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/mutations/update-department"},(0,p.kt)("inlineCode",{parentName:"a"},"updateDepartment")),"  ",(0,p.kt)(m,{class:"secondary",text:"mutation",mdxType:"Badge"})))}y.isMDXComponent=!0}}]);