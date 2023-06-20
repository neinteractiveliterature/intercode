"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[57085],{75631:(t,e,a)=>{a.d(e,{Zo:()=>d,kt:()=>f});var n=a(45721);function o(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function i(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function r(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?i(Object(a),!0).forEach((function(e){o(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function l(t,e){if(null==t)return{};var a,n,o=function(t,e){if(null==t)return{};var a,n,o={},i=Object.keys(t);for(n=0;n<i.length;n++)a=i[n],e.indexOf(a)>=0||(o[a]=t[a]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(n=0;n<i.length;n++)a=i[n],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(o[a]=t[a])}return o}var p=n.createContext({}),c=function(t){var e=n.useContext(p),a=e;return t&&(a="function"==typeof t?t(e):r(r({},e),t)),a},d=function(t){var e=c(t.components);return n.createElement(p.Provider,{value:e},t.children)},u="mdxType",s={inlineCode:"code",wrapper:function(t){var e=t.children;return n.createElement(n.Fragment,{},e)}},m=n.forwardRef((function(t,e){var a=t.components,o=t.mdxType,i=t.originalType,p=t.parentName,d=l(t,["components","mdxType","originalType","parentName"]),u=c(a),m=o,f=u["".concat(p,".").concat(m)]||u[m]||s[m]||i;return a?n.createElement(f,r(r({ref:e},d),{},{components:a})):n.createElement(f,r({ref:e},d))}));function f(t,e){var a=arguments,o=e&&e.mdxType;if("string"==typeof t||o){var i=a.length,r=new Array(i);r[0]=m;var l={};for(var p in e)hasOwnProperty.call(e,p)&&(l[p]=e[p]);l.originalType=t,l[u]="string"==typeof t?t:o,r[1]=l;for(var c=2;c<i;c++)r[c]=a[c];return n.createElement.apply(null,r)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},41644:(t,e,a)=>{a.r(e),a.d(e,{Badge:()=>m,Bullet:()=>u,SpecifiedBy:()=>s,assets:()=>c,contentTitle:()=>l,default:()=>g,frontMatter:()=>r,metadata:()=>p,toc:()=>d});var n=a(9715),o=a(45721),i=a(75631);const r={id:"update-notification-template",title:"updateNotificationTemplate",hide_table_of_contents:!1},l=void 0,p={unversionedId:"graphql/mutations/update-notification-template",id:"graphql/mutations/update-notification-template",title:"updateNotificationTemplate",description:"No description",source:"@site/docs/graphql/mutations/update-notification-template.mdx",sourceDirName:"graphql/mutations",slug:"/graphql/mutations/update-notification-template",permalink:"/docs/graphql/mutations/update-notification-template",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/mutations/update-notification-template.mdx",tags:[],version:"current",frontMatter:{id:"update-notification-template",title:"updateNotificationTemplate",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"updateMaximumEventProvidedTicketsOverride",permalink:"/docs/graphql/mutations/update-maximum-event-provided-tickets-override"},next:{title:"updateOrderEntry",permalink:"/docs/graphql/mutations/update-order-entry"}},c={},d=[{value:"Arguments",id:"arguments",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>updateNotificationTemplate.<b>input</b></code><Bullet /><code>UpdateNotificationTemplateInput!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="input"/>',id:"code-style-fontweight-normal-updatenotificationtemplatebinputbcodeupdatenotificationtemplateinput--",level:4},{value:"Type",id:"type",level:3},{value:'<code>UpdateNotificationTemplatePayload</code> <Badge class="secondary" text="object"/>',id:"updatenotificationtemplatepayload-",level:4}],u=()=>(0,i.kt)(o.Fragment,null,(0,i.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),s=t=>(0,i.kt)(o.Fragment,null,"Specification",(0,i.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:t.url,title:"Specified by "+t.url},"\u2398")),m=t=>(0,i.kt)(o.Fragment,null,(0,i.kt)("span",{class:"badge badge--"+t.class},t.text)),f={toc:d,Bullet:u,SpecifiedBy:s,Badge:m},y="wrapper";function g(t){let{components:e,...a}=t;return(0,i.kt)(y,(0,n.Z)({},f,a,{components:e,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"No description"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"updateNotificationTemplate(\n  input: UpdateNotificationTemplateInput!\n): UpdateNotificationTemplatePayload!\n")),(0,i.kt)("h3",{id:"arguments"},"Arguments"),(0,i.kt)("h4",{id:"code-style-fontweight-normal-updatenotificationtemplatebinputbcodeupdatenotificationtemplateinput--"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("code",{style:{fontWeight:"normal"}},"updateNotificationTemplate.",(0,i.kt)("b",null,"input"))),(0,i.kt)(u,{mdxType:"Bullet"}),(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/update-notification-template-input"},(0,i.kt)("inlineCode",{parentName:"a"},"UpdateNotificationTemplateInput!"))," ",(0,i.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,i.kt)(m,{class:"secondary",text:"input",mdxType:"Badge"})),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Parameters for UpdateNotificationTemplate")),(0,i.kt)("h3",{id:"type"},"Type"),(0,i.kt)("h4",{id:"updatenotificationtemplatepayload-"},(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/update-notification-template-payload"},(0,i.kt)("inlineCode",{parentName:"a"},"UpdateNotificationTemplatePayload"))," ",(0,i.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"})),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Autogenerated return type of UpdateNotificationTemplate.")))}g.isMDXComponent=!0}}]);