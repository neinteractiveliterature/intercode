"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[44635],{75631:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>f});var a=r(45721);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,a,o=function(e,t){if(null==e)return{};var r,a,o={},n=Object.keys(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var d=a.createContext({}),c=function(e){var t=a.useContext(d),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},p=function(e){var t=c(e.components);return a.createElement(d.Provider,{value:t},e.children)},s="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var r=e.components,o=e.mdxType,n=e.originalType,d=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),s=c(r),m=o,f=s["".concat(d,".").concat(m)]||s[m]||u[m]||n;return r?a.createElement(f,l(l({ref:t},p),{},{components:r})):a.createElement(f,l({ref:t},p))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var n=r.length,l=new Array(n);l[0]=m;var i={};for(var d in t)hasOwnProperty.call(t,d)&&(i[d]=t[d]);i.originalType=e,i[s]="string"==typeof e?e:o,l[1]=i;for(var c=2;c<n;c++)l[c]=r[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},18913:(e,t,r)=>{r.r(t),r.d(t,{Badge:()=>m,Bullet:()=>s,SpecifiedBy:()=>u,assets:()=>c,contentTitle:()=>i,default:()=>h,frontMatter:()=>l,metadata:()=>d,toc:()=>p});var a=r(11330),o=r(45721),n=r(75631);const l={id:"update-form-with-jsonpayload",title:"UpdateFormWithJSONPayload",hide_table_of_contents:!1},i=void 0,d={unversionedId:"graphql/objects/update-form-with-jsonpayload",id:"graphql/objects/update-form-with-jsonpayload",title:"UpdateFormWithJSONPayload",description:"Autogenerated return type of UpdateFormWithJSON.",source:"@site/docs/graphql/objects/update-form-with-jsonpayload.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/update-form-with-jsonpayload",permalink:"/docs/graphql/objects/update-form-with-jsonpayload",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/update-form-with-jsonpayload.mdx",tags:[],version:"current",frontMatter:{id:"update-form-with-jsonpayload",title:"UpdateFormWithJSONPayload",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"UpdateFormSectionPayload",permalink:"/docs/graphql/objects/update-form-section-payload"},next:{title:"UpdateMaximumEventProvidedTicketsOverridePayload",permalink:"/docs/graphql/objects/update-maximum-event-provided-tickets-override-payload"}},c={},p=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateFormWithJSONPayload.<b>clientMutationId</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-updateformwithjsonpayloadbclientmutationidbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateFormWithJSONPayload.<b>form</b></code><Bullet /><code>Form!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-updateformwithjsonpayloadbformbcodeform--",level:4},{value:"Returned by",id:"returned-by",level:3}],s=()=>(0,n.kt)(o.Fragment,null,(0,n.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),u=e=>(0,n.kt)(o.Fragment,null,"Specification",(0,n.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),m=e=>(0,n.kt)(o.Fragment,null,(0,n.kt)("span",{class:"badge badge--"+e.class},e.text)),f={toc:p,Bullet:s,SpecifiedBy:u,Badge:m},y="wrapper";function h(e){let{components:t,...r}=e;return(0,n.kt)(y,(0,a.Z)({},f,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Autogenerated return type of UpdateFormWithJSON."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-graphql"},"type UpdateFormWithJSONPayload {\n  clientMutationId: String\n  form: Form!\n}\n")),(0,n.kt)("h3",{id:"fields"},"Fields"),(0,n.kt)("h4",{id:"code-style-fontweight-normal-updateformwithjsonpayloadbclientmutationidbcodestring-"},(0,n.kt)("a",{parentName:"h4",href:"#"},(0,n.kt)("code",{style:{fontWeight:"normal"}},"UpdateFormWithJSONPayload.",(0,n.kt)("b",null,"clientMutationId"))),(0,n.kt)(s,{mdxType:"Bullet"}),(0,n.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,n.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,n.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"A unique identifier for the client performing the mutation.")),(0,n.kt)("h4",{id:"code-style-fontweight-normal-updateformwithjsonpayloadbformbcodeform--"},(0,n.kt)("a",{parentName:"h4",href:"#"},(0,n.kt)("code",{style:{fontWeight:"normal"}},"UpdateFormWithJSONPayload.",(0,n.kt)("b",null,"form"))),(0,n.kt)(s,{mdxType:"Bullet"}),(0,n.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/form"},(0,n.kt)("inlineCode",{parentName:"a"},"Form!"))," ",(0,n.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,n.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"})),(0,n.kt)("blockquote",null),(0,n.kt)("h3",{id:"returned-by"},"Returned by"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"/docs/graphql/mutations/update-form-with-json"},(0,n.kt)("inlineCode",{parentName:"a"},"updateFormWithJSON")),"  ",(0,n.kt)(m,{class:"secondary",text:"mutation",mdxType:"Badge"})))}h.isMDXComponent=!0}}]);