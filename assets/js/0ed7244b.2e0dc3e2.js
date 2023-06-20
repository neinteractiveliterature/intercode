"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[18917],{75631:(t,e,n)=>{n.d(e,{Zo:()=>d,kt:()=>f});var a=n(45721);function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function r(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){i(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function l(t,e){if(null==t)return{};var n,a,i=function(t,e){if(null==t)return{};var n,a,i={},o=Object.keys(t);for(a=0;a<o.length;a++)n=o[a],e.indexOf(n)>=0||(i[n]=t[n]);return i}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(a=0;a<o.length;a++)n=o[a],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(i[n]=t[n])}return i}var p=a.createContext({}),c=function(t){var e=a.useContext(p),n=e;return t&&(n="function"==typeof t?t(e):r(r({},e),t)),n},d=function(t){var e=c(t.components);return a.createElement(p.Provider,{value:e},t.children)},u="mdxType",s={inlineCode:"code",wrapper:function(t){var e=t.children;return a.createElement(a.Fragment,{},e)}},m=a.forwardRef((function(t,e){var n=t.components,i=t.mdxType,o=t.originalType,p=t.parentName,d=l(t,["components","mdxType","originalType","parentName"]),u=c(n),m=i,f=u["".concat(p,".").concat(m)]||u[m]||s[m]||o;return n?a.createElement(f,r(r({ref:e},d),{},{components:n})):a.createElement(f,r({ref:e},d))}));function f(t,e){var n=arguments,i=e&&e.mdxType;if("string"==typeof t||i){var o=n.length,r=new Array(o);r[0]=m;var l={};for(var p in e)hasOwnProperty.call(e,p)&&(l[p]=e[p]);l.originalType=t,l[u]="string"==typeof t?t:i,r[1]=l;for(var c=2;c<o;c++)r[c]=n[c];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},59018:(t,e,n)=>{n.r(e),n.d(e,{Badge:()=>m,Bullet:()=>u,SpecifiedBy:()=>s,assets:()=>c,contentTitle:()=>l,default:()=>y,frontMatter:()=>r,metadata:()=>p,toc:()=>d});var a=n(9715),i=n(45721),o=n(75631);const r={id:"update-notification-template-input",title:"UpdateNotificationTemplateInput",hide_table_of_contents:!1},l=void 0,p={unversionedId:"graphql/inputs/update-notification-template-input",id:"graphql/inputs/update-notification-template-input",title:"UpdateNotificationTemplateInput",description:"Autogenerated input type of UpdateNotificationTemplate",source:"@site/docs/graphql/inputs/update-notification-template-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/update-notification-template-input",permalink:"/docs/graphql/inputs/update-notification-template-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/update-notification-template-input.mdx",tags:[],version:"current",frontMatter:{id:"update-notification-template-input",title:"UpdateNotificationTemplateInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"UpdateMaximumEventProvidedTicketsOverrideInput",permalink:"/docs/graphql/inputs/update-maximum-event-provided-tickets-override-input"},next:{title:"UpdateOrderEntryInput",permalink:"/docs/graphql/inputs/update-order-entry-input"}},c={},d=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateNotificationTemplateInput.<b>clientMutationId</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-updatenotificationtemplateinputbclientmutationidbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateNotificationTemplateInput.<b>event_key</b></code><Bullet /><code>String!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-updatenotificationtemplateinputbevent_keybcodestring--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateNotificationTemplateInput.<b>notification_template</b></code><Bullet /><code>NotificationTemplateInput!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="input"/>',id:"code-style-fontweight-normal-updatenotificationtemplateinputbnotification_templatebcodenotificationtemplateinput--",level:4},{value:"Member of",id:"member-of",level:3}],u=()=>(0,o.kt)(i.Fragment,null,(0,o.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),s=t=>(0,o.kt)(i.Fragment,null,"Specification",(0,o.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:t.url,title:"Specified by "+t.url},"\u2398")),m=t=>(0,o.kt)(i.Fragment,null,(0,o.kt)("span",{class:"badge badge--"+t.class},t.text)),f={toc:d,Bullet:u,SpecifiedBy:s,Badge:m},g="wrapper";function y(t){let{components:e,...n}=t;return(0,o.kt)(g,(0,a.Z)({},f,n,{components:e,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Autogenerated input type of UpdateNotificationTemplate"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"input UpdateNotificationTemplateInput {\n  clientMutationId: String\n  event_key: String!\n  notification_template: NotificationTemplateInput!\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"code-style-fontweight-normal-updatenotificationtemplateinputbclientmutationidbcodestring-"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("code",{style:{fontWeight:"normal"}},"UpdateNotificationTemplateInput.",(0,o.kt)("b",null,"clientMutationId"))),(0,o.kt)(u,{mdxType:"Bullet"}),(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,o.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"A unique identifier for the client performing the mutation.")),(0,o.kt)("h4",{id:"code-style-fontweight-normal-updatenotificationtemplateinputbevent_keybcodestring--"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("code",{style:{fontWeight:"normal"}},"UpdateNotificationTemplateInput.",(0,o.kt)("b",null,"event_key"))),(0,o.kt)(u,{mdxType:"Bullet"}),(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String!"))," ",(0,o.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,o.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,o.kt)("blockquote",null),(0,o.kt)("h4",{id:"code-style-fontweight-normal-updatenotificationtemplateinputbnotification_templatebcodenotificationtemplateinput--"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("code",{style:{fontWeight:"normal"}},"UpdateNotificationTemplateInput.",(0,o.kt)("b",null,"notification_template"))),(0,o.kt)(u,{mdxType:"Bullet"}),(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/notification-template-input"},(0,o.kt)("inlineCode",{parentName:"a"},"NotificationTemplateInput!"))," ",(0,o.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,o.kt)(m,{class:"secondary",text:"input",mdxType:"Badge"})),(0,o.kt)("blockquote",null),(0,o.kt)("h3",{id:"member-of"},"Member of"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/docs/graphql/mutations/update-notification-template"},(0,o.kt)("inlineCode",{parentName:"a"},"updateNotificationTemplate")),"  ",(0,o.kt)(m,{class:"secondary",text:"mutation",mdxType:"Badge"})))}y.isMDXComponent=!0}}]);