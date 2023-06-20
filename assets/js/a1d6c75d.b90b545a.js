"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[28190],{75631:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>f});var o=n(45721);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=o.createContext({}),i=function(e){var t=o.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},c=function(e){var t=i(e.components);return o.createElement(u.Provider,{value:t},e.children)},d="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,u=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=i(n),m=a,f=d["".concat(u,".").concat(m)]||d[m]||s[m]||r;return n?o.createElement(f,p(p({ref:t},c),{},{components:n})):o.createElement(f,p({ref:t},c))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,p=new Array(r);p[0]=m;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l[d]="string"==typeof e?e:a,p[1]=l;for(var i=2;i<r;i++)p[i]=n[i];return o.createElement.apply(null,p)}return o.createElement.apply(null,n)}m.displayName="MDXCreateElement"},64489:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>m,Bullet:()=>d,SpecifiedBy:()=>s,assets:()=>i,contentTitle:()=>l,default:()=>y,frontMatter:()=>p,metadata:()=>u,toc:()=>c});var o=n(9715),a=n(45721),r=n(75631);const p={id:"update-coupon-input",title:"UpdateCouponInput",hide_table_of_contents:!1},l=void 0,u={unversionedId:"graphql/inputs/update-coupon-input",id:"graphql/inputs/update-coupon-input",title:"UpdateCouponInput",description:"Autogenerated input type of UpdateCoupon",source:"@site/docs/graphql/inputs/update-coupon-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/update-coupon-input",permalink:"/docs/graphql/inputs/update-coupon-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/update-coupon-input.mdx",tags:[],version:"current",frontMatter:{id:"update-coupon-input",title:"UpdateCouponInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"UpdateConventionInput",permalink:"/docs/graphql/inputs/update-convention-input"},next:{title:"UpdateDepartmentInput",permalink:"/docs/graphql/inputs/update-department-input"}},i={},c=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateCouponInput.<b>clientMutationId</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-updatecouponinputbclientmutationidbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateCouponInput.<b>coupon</b></code><Bullet /><code>CouponInput!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="input"/>',id:"code-style-fontweight-normal-updatecouponinputbcouponbcodecouponinput--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateCouponInput.<b>id</b></code><Bullet /><code>ID</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-updatecouponinputbidbcodeid-",level:4},{value:"Member of",id:"member-of",level:3}],d=()=>(0,r.kt)(a.Fragment,null,(0,r.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),s=e=>(0,r.kt)(a.Fragment,null,"Specification",(0,r.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),m=e=>(0,r.kt)(a.Fragment,null,(0,r.kt)("span",{class:"badge badge--"+e.class},e.text)),f={toc:c,Bullet:d,SpecifiedBy:s,Badge:m},g="wrapper";function y(e){let{components:t,...n}=e;return(0,r.kt)(g,(0,o.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Autogenerated input type of UpdateCoupon"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-graphql"},"input UpdateCouponInput {\n  clientMutationId: String\n  coupon: CouponInput!\n  id: ID\n}\n")),(0,r.kt)("h3",{id:"fields"},"Fields"),(0,r.kt)("h4",{id:"code-style-fontweight-normal-updatecouponinputbclientmutationidbcodestring-"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("code",{style:{fontWeight:"normal"}},"UpdateCouponInput.",(0,r.kt)("b",null,"clientMutationId"))),(0,r.kt)(d,{mdxType:"Bullet"}),(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,r.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"A unique identifier for the client performing the mutation.")),(0,r.kt)("h4",{id:"code-style-fontweight-normal-updatecouponinputbcouponbcodecouponinput--"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("code",{style:{fontWeight:"normal"}},"UpdateCouponInput.",(0,r.kt)("b",null,"coupon"))),(0,r.kt)(d,{mdxType:"Bullet"}),(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/coupon-input"},(0,r.kt)("inlineCode",{parentName:"a"},"CouponInput!"))," ",(0,r.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,r.kt)(m,{class:"secondary",text:"input",mdxType:"Badge"})),(0,r.kt)("blockquote",null),(0,r.kt)("h4",{id:"code-style-fontweight-normal-updatecouponinputbidbcodeid-"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("code",{style:{fontWeight:"normal"}},"UpdateCouponInput.",(0,r.kt)("b",null,"id"))),(0,r.kt)(d,{mdxType:"Bullet"}),(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,r.kt)("inlineCode",{parentName:"a"},"ID"))," ",(0,r.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,r.kt)("blockquote",null),(0,r.kt)("h3",{id:"member-of"},"Member of"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"/docs/graphql/mutations/update-coupon"},(0,r.kt)("inlineCode",{parentName:"a"},"updateCoupon")),"  ",(0,r.kt)(m,{class:"secondary",text:"mutation",mdxType:"Badge"})))}y.isMDXComponent=!0}}]);