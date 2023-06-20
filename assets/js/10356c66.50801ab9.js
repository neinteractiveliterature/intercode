"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[47427],{75631:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>v});var r=n(45721);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},s=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),u=p(n),m=a,v=u["".concat(c,".").concat(m)]||u[m]||d[m]||o;return n?r.createElement(v,l(l({ref:t},s),{},{components:n})):r.createElement(v,l({ref:t},s))}));function v(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=m;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i[u]="string"==typeof e?e:a,l[1]=i;for(var p=2;p<o;p++)l[p]=n[p];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},1031:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>m,Bullet:()=>u,SpecifiedBy:()=>d,assets:()=>p,contentTitle:()=>i,default:()=>y,frontMatter:()=>l,metadata:()=>c,toc:()=>s});var r=n(9715),a=n(45721),o=n(75631);const l={id:"rate-event",title:"rateEvent",hide_table_of_contents:!1},i=void 0,c={unversionedId:"graphql/mutations/rate-event",id:"graphql/mutations/rate-event",title:"rateEvent",description:"No description",source:"@site/docs/graphql/mutations/rate-event.mdx",sourceDirName:"graphql/mutations",slug:"/graphql/mutations/rate-event",permalink:"/docs/graphql/mutations/rate-event",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/mutations/rate-event.mdx",tags:[],version:"current",frontMatter:{id:"rate-event",title:"rateEvent",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"provideEventTicket",permalink:"/docs/graphql/mutations/provide-event-ticket"},next:{title:"rejectSignupRequest",permalink:"/docs/graphql/mutations/reject-signup-request"}},p={},s=[{value:"Arguments",id:"arguments",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>rateEvent.<b>input</b></code><Bullet /><code>RateEventInput!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="input"/>',id:"code-style-fontweight-normal-rateeventbinputbcoderateeventinput--",level:4},{value:"Type",id:"type",level:3},{value:'<code>RateEventPayload</code> <Badge class="secondary" text="object"/>',id:"rateeventpayload-",level:4}],u=()=>(0,o.kt)(a.Fragment,null,(0,o.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),d=e=>(0,o.kt)(a.Fragment,null,"Specification",(0,o.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),m=e=>(0,o.kt)(a.Fragment,null,(0,o.kt)("span",{class:"badge badge--"+e.class},e.text)),v={toc:s,Bullet:u,SpecifiedBy:d,Badge:m},f="wrapper";function y(e){let{components:t,...n}=e;return(0,o.kt)(f,(0,r.Z)({},v,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"No description"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"rateEvent(\n  input: RateEventInput!\n): RateEventPayload!\n")),(0,o.kt)("h3",{id:"arguments"},"Arguments"),(0,o.kt)("h4",{id:"code-style-fontweight-normal-rateeventbinputbcoderateeventinput--"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("code",{style:{fontWeight:"normal"}},"rateEvent.",(0,o.kt)("b",null,"input"))),(0,o.kt)(u,{mdxType:"Bullet"}),(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/rate-event-input"},(0,o.kt)("inlineCode",{parentName:"a"},"RateEventInput!"))," ",(0,o.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,o.kt)(m,{class:"secondary",text:"input",mdxType:"Badge"})),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"Parameters for RateEvent")),(0,o.kt)("h3",{id:"type"},"Type"),(0,o.kt)("h4",{id:"rateeventpayload-"},(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/rate-event-payload"},(0,o.kt)("inlineCode",{parentName:"a"},"RateEventPayload"))," ",(0,o.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"})),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"Autogenerated return type of RateEvent.")))}y.isMDXComponent=!0}}]);