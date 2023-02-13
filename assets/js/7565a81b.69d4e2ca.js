"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[10465],{75631:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>m});var n=r(45721);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),d=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},p=function(e){var t=d(e.components);return n.createElement(i.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=d(r),m=a,f=u["".concat(i,".").concat(m)]||u[m]||s[m]||o;return r?n.createElement(f,c(c({ref:t},p),{},{components:r})):n.createElement(f,c({ref:t},p))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,c=new Array(o);c[0]=u;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:a,c[1]=l;for(var d=2;d<o;d++)c[d]=r[d];return n.createElement.apply(null,c)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},5886:(e,t,r)=>{r.r(t),r.d(t,{Badge:()=>m,Bullet:()=>s,SpecifiedBy:()=>u,assets:()=>d,contentTitle:()=>l,default:()=>y,frontMatter:()=>c,metadata:()=>i,toc:()=>p});var n=r(81648),a=r(45721),o=r(75631);const c={id:"cancel-order",title:"cancelOrder",hide_table_of_contents:!1},l=void 0,i={unversionedId:"graphql/mutations/cancel-order",id:"graphql/mutations/cancel-order",title:"cancelOrder",description:"No description",source:"@site/docs/graphql/mutations/cancel-order.mdx",sourceDirName:"graphql/mutations",slug:"/graphql/mutations/cancel-order",permalink:"/docs/graphql/mutations/cancel-order",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/mutations/cancel-order.mdx",tags:[],version:"current",frontMatter:{id:"cancel-order",title:"cancelOrder",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"attachImageToEvent",permalink:"/docs/graphql/mutations/attach-image-to-event"},next:{title:"convertTicketToEventProvided",permalink:"/docs/graphql/mutations/convert-ticket-to-event-provided"}},d={},p=[{value:"Arguments",id:"arguments",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>cancelOrder.<b>input</b></code><Bullet /><code>CancelOrderInput!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="input"/>',id:"code-style-fontweight-normal-cancelorderbinputbcodecancelorderinput--",level:4},{value:"Type",id:"type",level:3},{value:'<code>CancelOrderPayload</code> <Badge class="secondary" text="object"/>',id:"cancelorderpayload-",level:4}],s=()=>(0,o.kt)(a.Fragment,null,(0,o.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),u=e=>(0,o.kt)(a.Fragment,null,"Specification",(0,o.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),m=e=>(0,o.kt)(a.Fragment,null,(0,o.kt)("span",{class:"badge badge--"+e.class},e.text)),f={toc:p,Bullet:s,SpecifiedBy:u,Badge:m};function y(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},f,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"No description"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"cancelOrder(\n  input: CancelOrderInput!\n): CancelOrderPayload!\n")),(0,o.kt)("h3",{id:"arguments"},"Arguments"),(0,o.kt)("h4",{id:"code-style-fontweight-normal-cancelorderbinputbcodecancelorderinput--"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("code",{style:{fontWeight:"normal"}},"cancelOrder.",(0,o.kt)("b",null,"input"))),(0,o.kt)(s,{mdxType:"Bullet"}),(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/cancel-order-input"},(0,o.kt)("inlineCode",{parentName:"a"},"CancelOrderInput!"))," ",(0,o.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,o.kt)(m,{class:"secondary",text:"input",mdxType:"Badge"})),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"Parameters for CancelOrder")),(0,o.kt)("h3",{id:"type"},"Type"),(0,o.kt)("h4",{id:"cancelorderpayload-"},(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/cancel-order-payload"},(0,o.kt)("inlineCode",{parentName:"a"},"CancelOrderPayload"))," ",(0,o.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"})),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"Autogenerated return type of CancelOrder.")))}y.isMDXComponent=!0}}]);