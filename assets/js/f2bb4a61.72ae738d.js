"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[56832],{75631:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>v});var r=n(45721);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=c(n),d=a,v=u["".concat(l,".").concat(d)]||u[d]||m[d]||o;return n?r.createElement(v,s(s({ref:t},p),{},{components:n})):r.createElement(v,s({ref:t},p))}));function v(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,s=new Array(o);s[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[u]="string"==typeof e?e:a,s[1]=i;for(var c=2;c<o;c++)s[c]=n[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},17107:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>m,frontMatter:()=>o,metadata:()=>i,toc:()=>c});var r=n(9715),a=(n(45721),n(75631));const o={sidebar_position:3},s="Events and runs",i={unversionedId:"concepts/events-and-runs",id:"concepts/events-and-runs",title:"Events and runs",description:"In Intercode, an event is a description of a session that takes place at a convention. All events",source:"@site/docs/concepts/events-and-runs.md",sourceDirName:"concepts",slug:"/concepts/events-and-runs",permalink:"/docs/concepts/events-and-runs",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/concepts/events-and-runs.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"sidebar",previous:{title:"Content management",permalink:"/docs/concepts/content-management"},next:{title:"Signups",permalink:"/docs/concepts/signups"}},l={},c=[{value:"Event categories",id:"event-categories",level:2},{value:"Event proposals",id:"event-proposals",level:2},{value:"Single-event mode",id:"single-event-mode",level:2}],p={toc:c},u="wrapper";function m(e){let{components:t,...n}=e;return(0,a.kt)(u,(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"events-and-runs"},"Events and runs"),(0,a.kt)("p",null,"In Intercode, an event is a description of a session that takes place at a convention. All events\nhave:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"a title"),(0,a.kt)("li",{parentName:"ul"},"a short description"),(0,a.kt)("li",{parentName:"ul"},"a long description"),(0,a.kt)("li",{parentName:"ul"},"an ",(0,a.kt)("a",{parentName:"li",href:"#event-categories"},"event category")),(0,a.kt)("li",{parentName:"ul"},"a length"),(0,a.kt)("li",{parentName:"ul"},"a set of team members"),(0,a.kt)("li",{parentName:"ul"},"a ",(0,a.kt)("a",{parentName:"li",href:"/docs/concepts/signups#registration-policies"},"registration policy"))),(0,a.kt)("p",null,"Events can have multiple runs over the course of the convention. Therefore, an event doesn't have\na start time. Instead, it has a set of runs, each of which has:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"a start time"),(0,a.kt)("li",{parentName:"ul"},"a set of signups"),(0,a.kt)("li",{parentName:"ul"},"a set of rooms"),(0,a.kt)("li",{parentName:"ul"},"(optionally) a title suffix and/or a schedule note")),(0,a.kt)("p",null,"It's possible for an event to have only a single run (indeed, this is probably the most common\ncase), or no runs (for example, if the con staff hasn't decided on the schedule yet)."),(0,a.kt)("h2",{id:"event-categories"},"Event categories"),(0,a.kt)("p",null,"Conventions can have multiple categories of event. For example, Intercon has larps, moderated\ndiscussions, workshops, parties, etc. An event category in Intercode has:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"a name"),(0,a.kt)("li",{parentName:"ul"},"a color"),(0,a.kt)("li",{parentName:"ul"},"variants of that color for users who are signed up, or if an event is full"),(0,a.kt)("li",{parentName:"ul"},"a ",(0,a.kt)("a",{parentName:"li",href:"/docs/concepts/forms"},"form")," containing all the properties of events in this category"),(0,a.kt)("li",{parentName:"ul"},"(optionally) a form for ",(0,a.kt)("a",{parentName:"li",href:"#event-proposals"},"event proposals")," in this category\n(if not present, users can't propose events in this category)"),(0,a.kt)("li",{parentName:"ul"},'(optionally) a name to use for team members, such as "GM" or "moderator"')),(0,a.kt)("h2",{id:"event-proposals"},"Event proposals"),(0,a.kt)("p",null,"Intercode can accept proposals for events. Con staff can create a proposal form for events in one or\nmore categories. If attendees fill out that form, the proposal goes into an inbox where staff\nmembers can review, accept, or reject it."),(0,a.kt)("p",null,"When a proposal is accepted, Intercode automatically creates an event for it and copies over all the\ninformation from the proposal form that has a matching field in the event form for that category.\nIt also links together the proposal with the event, and makes the proposer a team member in the\nnewly-created event."),(0,a.kt)("h2",{id:"single-event-mode"},"Single-event mode"),(0,a.kt)("p",null,'Conventions can be set up in "single-event" mode. This is useful for simpler web sites,\nwhere there\'s a single, standalone event scheduled at a particular time and place, but that event\nwould like its own web site.'),(0,a.kt)("p",null,"In this case, all the objects mentioned above actually still exist: there's a convention, it has\none event in it, and that event has one run. There's one event category in the convention, and\nthe single event is in it. In single-event mode, Intercode hides most of the details of runs,\nevents, and event categories from the admin user interface, but behind the scenes, they're still\npresent."))}m.isMDXComponent=!0}}]);