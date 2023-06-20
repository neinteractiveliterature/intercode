"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[65926],{75631:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>m});var a=r(45721);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},c=Object.keys(e);for(a=0;a<c.length;a++)r=c[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(a=0;a<c.length;a++)r=c[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var l=a.createContext({}),p=function(e){var t=a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},s=function(e){var t=p(e.components);return a.createElement(l.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},k=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,c=e.originalType,l=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),u=p(r),k=n,m=u["".concat(l,".").concat(k)]||u[k]||d[k]||c;return r?a.createElement(m,i(i({ref:t},s),{},{components:r})):a.createElement(m,i({ref:t},s))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var c=r.length,i=new Array(c);i[0]=k;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o[u]="string"==typeof e?e:n,i[1]=o;for(var p=2;p<c;p++)i[p]=r[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}k.displayName="MDXCreateElement"},33610:(e,t,r)=>{r.r(t),r.d(t,{Badge:()=>k,Bullet:()=>u,SpecifiedBy:()=>d,assets:()=>p,contentTitle:()=>o,default:()=>f,frontMatter:()=>i,metadata:()=>l,toc:()=>s});var a=r(9715),n=r(45721),c=r(75631);const i={id:"create-ticket",title:"createTicket",hide_table_of_contents:!1},o=void 0,l={unversionedId:"graphql/mutations/create-ticket",id:"graphql/mutations/create-ticket",title:"createTicket",description:"No description",source:"@site/docs/graphql/mutations/create-ticket.mdx",sourceDirName:"graphql/mutations",slug:"/graphql/mutations/create-ticket",permalink:"/docs/graphql/mutations/create-ticket",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/mutations/create-ticket.mdx",tags:[],version:"current",frontMatter:{id:"create-ticket",title:"createTicket",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"createTicketType",permalink:"/docs/graphql/mutations/create-ticket-type"},next:{title:"createUserActivityAlert",permalink:"/docs/graphql/mutations/create-user-activity-alert"}},p={},s=[{value:"Arguments",id:"arguments",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>createTicket.<b>input</b></code><Bullet /><code>CreateTicketInput!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="input"/>',id:"code-style-fontweight-normal-createticketbinputbcodecreateticketinput--",level:4},{value:"Type",id:"type",level:3},{value:'<code>CreateTicketPayload</code> <Badge class="secondary" text="object"/>',id:"createticketpayload-",level:4}],u=()=>(0,c.kt)(n.Fragment,null,(0,c.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),d=e=>(0,c.kt)(n.Fragment,null,"Specification",(0,c.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),k=e=>(0,c.kt)(n.Fragment,null,(0,c.kt)("span",{class:"badge badge--"+e.class},e.text)),m={toc:s,Bullet:u,SpecifiedBy:d,Badge:k},y="wrapper";function f(e){let{components:t,...r}=e;return(0,c.kt)(y,(0,a.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,c.kt)("p",null,"No description"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-graphql"},"createTicket(\n  input: CreateTicketInput!\n): CreateTicketPayload!\n")),(0,c.kt)("h3",{id:"arguments"},"Arguments"),(0,c.kt)("h4",{id:"code-style-fontweight-normal-createticketbinputbcodecreateticketinput--"},(0,c.kt)("a",{parentName:"h4",href:"#"},(0,c.kt)("code",{style:{fontWeight:"normal"}},"createTicket.",(0,c.kt)("b",null,"input"))),(0,c.kt)(u,{mdxType:"Bullet"}),(0,c.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/create-ticket-input"},(0,c.kt)("inlineCode",{parentName:"a"},"CreateTicketInput!"))," ",(0,c.kt)(k,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,c.kt)(k,{class:"secondary",text:"input",mdxType:"Badge"})),(0,c.kt)("blockquote",null,(0,c.kt)("p",{parentName:"blockquote"},"Parameters for CreateTicket")),(0,c.kt)("h3",{id:"type"},"Type"),(0,c.kt)("h4",{id:"createticketpayload-"},(0,c.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/create-ticket-payload"},(0,c.kt)("inlineCode",{parentName:"a"},"CreateTicketPayload"))," ",(0,c.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"})),(0,c.kt)("blockquote",null,(0,c.kt)("p",{parentName:"blockquote"},"Autogenerated return type of CreateTicket.")))}f.isMDXComponent=!0}}]);