"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[1557],{75631:(e,t,o)=>{o.d(t,{Zo:()=>c,kt:()=>v});var n=o(45721);function r(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function i(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,n)}return o}function d(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?i(Object(o),!0).forEach((function(t){r(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):i(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function l(e,t){if(null==e)return{};var o,n,r=function(e,t){if(null==e)return{};var o,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)o=i[n],t.indexOf(o)>=0||(r[o]=e[o]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)o=i[n],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}var a=n.createContext({}),p=function(e){var t=n.useContext(a),o=t;return e&&(o="function"==typeof e?e(t):d(d({},t),e)),o},c=function(e){var t=p(e.components);return n.createElement(a.Provider,{value:t},e.children)},s="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},h=n.forwardRef((function(e,t){var o=e.components,r=e.mdxType,i=e.originalType,a=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),s=p(o),h=r,v=s["".concat(a,".").concat(h)]||s[h]||u[h]||i;return o?n.createElement(v,d(d({ref:t},c),{},{components:o})):n.createElement(v,d({ref:t},c))}));function v(e,t){var o=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=o.length,d=new Array(i);d[0]=h;var l={};for(var a in t)hasOwnProperty.call(t,a)&&(l[a]=t[a]);l.originalType=e,l[s]="string"==typeof e?e:r,d[1]=l;for(var p=2;p<i;p++)d[p]=o[p];return n.createElement.apply(null,d)}return n.createElement.apply(null,o)}h.displayName="MDXCreateElement"},4081:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>a,contentTitle:()=>d,default:()=>u,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var n=o(9715),r=(o(45721),o(75631));const i={id:"event-proposal-drop",title:"EventProposalDrop"},d=void 0,l={unversionedId:"liquid/drops/event-proposal-drop",id:"liquid/drops/event-proposal-drop",title:"EventProposalDrop",description:"An event proposal which, if accepted, has an event associated with it",source:"@site/docs/liquid/drops/event-proposal-drop.mdx",sourceDirName:"liquid/drops",slug:"/liquid/drops/event-proposal-drop",permalink:"/docs/liquid/drops/event-proposal-drop",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/liquid/drops/event-proposal-drop.mdx",tags:[],version:"current",frontMatter:{id:"event-proposal-drop",title:"EventProposalDrop"},sidebar:"sidebar",previous:{title:"EventDrop",permalink:"/docs/liquid/drops/event-drop"},next:{title:"EventsCreatedSinceDrop",permalink:"/docs/liquid/drops/events-created-since-drop"}},a={},p=[{value:"Fields",id:"fields",level:3},{value:"<code>additional_info</code> (<code>String</code>)",id:"additional_info-string",level:4},{value:"<code>admin_url</code> (<code>String</code>)",id:"admin_url-string",level:4},{value:"<code>can_play_concurrently</code> (<code>Boolean</code>)",id:"can_play_concurrently-boolean",level:4},{value:'<code>convention</code> (<code><a href="/docs/liquid/drops/convention-drop">ConventionDrop</a></code>)',id:"convention-conventiondrop",level:4},{value:"<code>created_at</code> (<code>DateTime</code>)",id:"created_at-datetime",level:4},{value:"<code>description</code> (<code>String</code>)",id:"description-string",level:4},{value:"<code>edit_url</code> (<code>String</code>)",id:"edit_url-string",level:4},{value:"<code>email</code> (<code>String</code>)",id:"email-string",level:4},{value:'<code>event</code> (<code><a href="/docs/liquid/drops/event-drop">EventDrop</a></code>)',id:"event-eventdrop",level:4},{value:'<code>event_category</code> (<code><a href="/docs/liquid/drops/event-category-drop">EventCategoryDrop</a></code>)',id:"event_category-eventcategorydrop",level:4},{value:"<code>form_response</code> (<code>Hash</code>)",id:"form_response-hash",level:4},{value:"<code>history_url</code> (<code>String</code>)",id:"history_url-string",level:4},{value:"<code>id</code> (<code>Integer</code>)",id:"id-integer",level:4},{value:"<code>length_seconds</code> (<code>Integer</code>)",id:"length_seconds-integer",level:4},{value:'<code>owner</code> (<code><a href="/docs/liquid/drops/user-con-profile-drop">UserConProfileDrop</a></code>)',id:"owner-userconprofiledrop",level:4},{value:"<code>short_blurb</code> (<code>String</code>)",id:"short_blurb-string",level:4},{value:"<code>status</code> (<code>String</code>)",id:"status-string",level:4},{value:"<code>title</code> (<code>String</code>)",id:"title-string",level:4},{value:"<code>updated_at</code> (<code>DateTime</code>)",id:"updated_at-datetime",level:4}],c={toc:p},s="wrapper";function u(e){let{components:t,...o}=e;return(0,r.kt)(s,(0,n.Z)({},c,o,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"An event proposal which, if accepted, has an event associated with it"),(0,r.kt)("h3",{id:"fields"},"Fields"),(0,r.kt)("h4",{id:"additional_info-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"additional_info")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,"Additional information the proposer wanted to provide"),(0,r.kt)("h4",{id:"admin_url-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"admin_url")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,"The relative URL for linking admins to view the proposal"),(0,r.kt)("h4",{id:"can_play_concurrently-boolean"},(0,r.kt)("inlineCode",{parentName:"h4"},"can_play_concurrently")," (",(0,r.kt)("code",null,"Boolean"),")"),(0,r.kt)("p",null,"Whether or not the proposed event allows attendees to sign up for it\nalong with other events happening at the same time"),(0,r.kt)("h4",{id:"convention-conventiondrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"convention")," (",(0,r.kt)("code",null,(0,r.kt)("a",{href:"/docs/liquid/drops/convention-drop"},"ConventionDrop")),")"),(0,r.kt)("p",null,"The convention this event is proposed for"),(0,r.kt)("h4",{id:"created_at-datetime"},(0,r.kt)("inlineCode",{parentName:"h4"},"created_at")," (",(0,r.kt)("code",null,"DateTime"),")"),(0,r.kt)("p",null,"When the proposal was first started"),(0,r.kt)("h4",{id:"description-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"description")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,"The description of the proposed event"),(0,r.kt)("h4",{id:"edit_url-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"edit_url")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,"The relative URL for linking to edit the proposal"),(0,r.kt)("h4",{id:"email-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"email")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,"The contact email for the proposed event"),(0,r.kt)("h4",{id:"event-eventdrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"event")," (",(0,r.kt)("code",null,(0,r.kt)("a",{href:"/docs/liquid/drops/event-drop"},"EventDrop")),")"),(0,r.kt)("p",null,"The event created from this proposal, if this proposal has been accepted"),(0,r.kt)("h4",{id:"event_category-eventcategorydrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"event_category")," (",(0,r.kt)("code",null,(0,r.kt)("a",{href:"/docs/liquid/drops/event-category-drop"},"EventCategoryDrop")),")"),(0,r.kt)("p",null,"The category of event being proposed"),(0,r.kt)("h4",{id:"form_response-hash"},(0,r.kt)("inlineCode",{parentName:"h4"},"form_response")," (",(0,r.kt)("code",null,"Hash"),")"),(0,r.kt)("p",null,'This proposal, represented as a response to the proposal form set up for this\nevent category.  This only includes always-visible fields; fields not\nvisible to everyone who can see this proposal will be replaced with a\n"this is hidden" message.'),(0,r.kt)("h4",{id:"history_url-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"history_url")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,"The relative URL for linking admins to the change history of the proposal"),(0,r.kt)("h4",{id:"id-integer"},(0,r.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,r.kt)("code",null,"Integer"),")"),(0,r.kt)("p",null,"The numeric database ID of this event proposal"),(0,r.kt)("h4",{id:"length_seconds-integer"},(0,r.kt)("inlineCode",{parentName:"h4"},"length_seconds")," (",(0,r.kt)("code",null,"Integer"),")"),(0,r.kt)("p",null,"The length of the proposed event, in seconds"),(0,r.kt)("h4",{id:"owner-userconprofiledrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"owner")," (",(0,r.kt)("code",null,(0,r.kt)("a",{href:"/docs/liquid/drops/user-con-profile-drop"},"UserConProfileDrop")),")"),(0,r.kt)("p",null,"The profile of the person who submitted this event proposal"),(0,r.kt)("h4",{id:"short_blurb-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"short_blurb")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,"The short blurb for the proposed event"),(0,r.kt)("h4",{id:"status-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"status")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,"The status of this proposal (e.g. proposed, accepted, rejected, withdrawn)"),(0,r.kt)("h4",{id:"title-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"title")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,"The title of the proposed event"),(0,r.kt)("h4",{id:"updated_at-datetime"},(0,r.kt)("inlineCode",{parentName:"h4"},"updated_at")," (",(0,r.kt)("code",null,"DateTime"),")"),(0,r.kt)("p",null,"When the proposal was last modified"))}u.isMDXComponent=!0}}]);