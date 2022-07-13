"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[13301],{75631:(t,e,n)=>{n.d(e,{Zo:()=>u,kt:()=>f});var i=n(3289);function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function a(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?a(Object(n),!0).forEach((function(e){r(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function c(t,e){if(null==t)return{};var n,i,r=function(t,e){if(null==t)return{};var n,i,r={},a=Object.keys(t);for(i=0;i<a.length;i++)n=a[i],e.indexOf(n)>=0||(r[n]=t[n]);return r}(t,e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);for(i=0;i<a.length;i++)n=a[i],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(r[n]=t[n])}return r}var l=i.createContext({}),p=function(t){var e=i.useContext(l),n=e;return t&&(n="function"==typeof t?t(e):o(o({},e),t)),n},u=function(t){var e=p(t.components);return i.createElement(l.Provider,{value:e},t.children)},s={inlineCode:"code",wrapper:function(t){var e=t.children;return i.createElement(i.Fragment,{},e)}},d=i.forwardRef((function(t,e){var n=t.components,r=t.mdxType,a=t.originalType,l=t.parentName,u=c(t,["components","mdxType","originalType","parentName"]),d=p(n),f=r,y=d["".concat(l,".").concat(f)]||d[f]||s[f]||a;return n?i.createElement(y,o(o({ref:e},u),{},{components:n})):i.createElement(y,o({ref:e},u))}));function f(t,e){var n=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var a=n.length,o=new Array(a);o[0]=d;var c={};for(var l in e)hasOwnProperty.call(e,l)&&(c[l]=e[l]);c.originalType=t,c.mdxType="string"==typeof t?t:r,o[1]=c;for(var p=2;p<a;p++)o[p]=n[p];return i.createElement.apply(null,o)}return i.createElement.apply(null,n)}d.displayName="MDXCreateElement"},26162:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>l,contentTitle:()=>o,default:()=>s,frontMatter:()=>a,metadata:()=>c,toc:()=>p});var i=n(60953),r=(n(3289),n(75631));const a={id:"create-user-activity-alert-input",title:"CreateUserActivityAlertInput",hide_table_of_contents:!1},o=void 0,c={unversionedId:"graphql/inputs/create-user-activity-alert-input",id:"graphql/inputs/create-user-activity-alert-input",title:"CreateUserActivityAlertInput",description:"Autogenerated input type of CreateUserActivityAlert",source:"@site/docs/graphql/inputs/create-user-activity-alert-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/create-user-activity-alert-input",permalink:"/docs/graphql/inputs/create-user-activity-alert-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/create-user-activity-alert-input.mdx",tags:[],version:"current",frontMatter:{id:"create-user-activity-alert-input",title:"CreateUserActivityAlertInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"CreateTicketTypeInput",permalink:"/docs/graphql/inputs/create-ticket-type-input"},next:{title:"CreateUserConProfileInput",permalink:"/docs/graphql/inputs/create-user-con-profile-input"}},l={},p=[{value:"Fields",id:"fields",level:3},{value:"<code>clientMutationId</code> (<code>String</code>)",id:"clientmutationid-string",level:4},{value:"<code>notification_destinations</code> (<code>[NotificationDestinationInput!]!</code>)",id:"notification_destinations-notificationdestinationinput",level:4},{value:"<code>user_activity_alert</code> (<code>UserActivityAlertInput!</code>)",id:"user_activity_alert-useractivityalertinput",level:4}],u={toc:p};function s(t){let{components:e,...n}=t;return(0,r.kt)("wrapper",(0,i.Z)({},u,n,{components:e,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Autogenerated input type of CreateUserActivityAlert"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-graphql"},"input CreateUserActivityAlertInput {\n  clientMutationId: String\n  notification_destinations: [NotificationDestinationInput!]!\n  user_activity_alert: UserActivityAlertInput!\n}\n")),(0,r.kt)("h3",{id:"fields"},"Fields"),(0,r.kt)("h4",{id:"clientmutationid-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"clientMutationId"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,r.kt)("h4",{id:"notification_destinations-notificationdestinationinput"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"notification_destinations"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/notification-destination-input"},(0,r.kt)("inlineCode",{parentName:"a"},"[NotificationDestinationInput!]!")),")"),(0,r.kt)("h4",{id:"user_activity_alert-useractivityalertinput"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"user_activity_alert"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/user-activity-alert-input"},(0,r.kt)("inlineCode",{parentName:"a"},"UserActivityAlertInput!")),")"))}s.isMDXComponent=!0}}]);