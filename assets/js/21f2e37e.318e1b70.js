"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[78948],{75631:function(t,e,i){i.d(e,{Zo:function(){return p},kt:function(){return f}});var n=i(3289);function r(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function a(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,n)}return i}function o(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?a(Object(i),!0).forEach((function(e){r(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):a(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}function d(t,e){if(null==t)return{};var i,n,r=function(t,e){if(null==t)return{};var i,n,r={},a=Object.keys(t);for(n=0;n<a.length;n++)i=a[n],e.indexOf(i)>=0||(r[i]=t[i]);return r}(t,e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);for(n=0;n<a.length;n++)i=a[n],e.indexOf(i)>=0||Object.prototype.propertyIsEnumerable.call(t,i)&&(r[i]=t[i])}return r}var l=n.createContext({}),c=function(t){var e=n.useContext(l),i=e;return t&&(i="function"==typeof t?t(e):o(o({},e),t)),i},p=function(t){var e=c(t.components);return n.createElement(l.Provider,{value:e},t.children)},s={inlineCode:"code",wrapper:function(t){var e=t.children;return n.createElement(n.Fragment,{},e)}},u=n.forwardRef((function(t,e){var i=t.components,r=t.mdxType,a=t.originalType,l=t.parentName,p=d(t,["components","mdxType","originalType","parentName"]),u=c(i),f=r,v=u["".concat(l,".").concat(f)]||u[f]||s[f]||a;return i?n.createElement(v,o(o({ref:e},p),{},{components:i})):n.createElement(v,o({ref:e},p))}));function f(t,e){var i=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var a=i.length,o=new Array(a);o[0]=u;var d={};for(var l in e)hasOwnProperty.call(e,l)&&(d[l]=e[l]);d.originalType=t,d.mdxType="string"==typeof t?t:r,o[1]=d;for(var c=2;c<a;c++)o[c]=i[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,i)}u.displayName="MDXCreateElement"},25858:function(t,e,i){i.r(e),i.d(e,{frontMatter:function(){return d},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return p},default:function(){return u}});var n=i(88078),r=i(65844),a=(i(3289),i(75631)),o=["components"],d={id:"update-user-activity-alert-input",title:"UpdateUserActivityAlertInput"},l=void 0,c={unversionedId:"graphql/inputs/update-user-activity-alert-input",id:"graphql/inputs/update-user-activity-alert-input",isDocsHomePage:!1,title:"UpdateUserActivityAlertInput",description:"Autogenerated input type of UpdateUserActivityAlert",source:"@site/docs/graphql/inputs/update-user-activity-alert-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/update-user-activity-alert-input",permalink:"/docs/graphql/inputs/update-user-activity-alert-input",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/update-user-activity-alert-input.mdx",tags:[],version:"current",frontMatter:{id:"update-user-activity-alert-input",title:"UpdateUserActivityAlertInput"},sidebar:"sidebar",previous:{title:"UpdateTicketTypeInput",permalink:"/docs/graphql/inputs/update-ticket-type-input"},next:{title:"UpdateUserConProfileInput",permalink:"/docs/graphql/inputs/update-user-con-profile-input"}},p=[{value:"Fields",id:"fields",children:[{value:"<code>add_notification_destinations</code> ([NotificationDestinationInput!]!)",id:"add_notification_destinations-notificationdestinationinput",children:[],level:4},{value:"<code>clientMutationId</code> (String)",id:"clientmutationid-string",children:[],level:4},{value:"<code>id</code> (ID)",id:"id-id",children:[],level:4},{value:"<code>removeNotificationDestinationIds</code> ([ID!])",id:"removenotificationdestinationids-id",children:[],level:4},{value:"<code>transitionalId</code> (ID)",id:"transitionalid-id",children:[],level:4},{value:"<code>transitionalRemoveNotificationDestinationIds</code> ([ID!])",id:"transitionalremovenotificationdestinationids-id",children:[],level:4},{value:"<code>user_activity_alert</code> (UserActivityAlertInput!)",id:"user_activity_alert-useractivityalertinput",children:[],level:4}],level:3}],s={toc:p};function u(t){var e=t.components,i=(0,r.Z)(t,o);return(0,a.kt)("wrapper",(0,n.Z)({},s,i,{components:e,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Autogenerated input type of UpdateUserActivityAlert"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"type UpdateUserActivityAlertInput {\n  add_notification_destinations: [NotificationDestinationInput!]!\n  clientMutationId: String\n  id: ID\n  removeNotificationDestinationIds: [ID!]\n  transitionalId: ID\n  transitionalRemoveNotificationDestinationIds: [ID!]\n  user_activity_alert: UserActivityAlertInput!\n}\n")),(0,a.kt)("h3",{id:"fields"},"Fields"),(0,a.kt)("h4",{id:"add_notification_destinations-notificationdestinationinput"},(0,a.kt)("inlineCode",{parentName:"h4"},"add_notification_destinations")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/notification-destination-input"},(0,a.kt)("inlineCode",{parentName:"a"},"[NotificationDestinationInput!]!")),")"),(0,a.kt)("h4",{id:"clientmutationid-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"clientMutationId")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,a.kt)("h4",{id:"id-id"},(0,a.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,a.kt)("h4",{id:"removenotificationdestinationids-id"},(0,a.kt)("inlineCode",{parentName:"h4"},"removeNotificationDestinationIds")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"[ID!]")),")"),(0,a.kt)("h4",{id:"transitionalid-id"},(0,a.kt)("inlineCode",{parentName:"h4"},"transitionalId")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,a.kt)("h4",{id:"transitionalremovenotificationdestinationids-id"},(0,a.kt)("inlineCode",{parentName:"h4"},"transitionalRemoveNotificationDestinationIds")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"[ID!]")),")"),(0,a.kt)("h4",{id:"user_activity_alert-useractivityalertinput"},(0,a.kt)("inlineCode",{parentName:"h4"},"user_activity_alert")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/user-activity-alert-input"},(0,a.kt)("inlineCode",{parentName:"a"},"UserActivityAlertInput!")),")"))}u.isMDXComponent=!0}}]);