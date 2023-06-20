"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[6197],{75631:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>g});var r=n(45721);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),u=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},h="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),h=u(n),p=a,g=h["".concat(s,".").concat(p)]||h[p]||d[p]||i;return n?r.createElement(g,l(l({ref:t},c),{},{components:n})):r.createElement(g,l({ref:t},c))}));function g(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,l=new Array(i);l[0]=p;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o[h]="string"==typeof e?e:a,l[1]=o;for(var u=2;u<i;u++)l[u]=n[u];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},62449:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>d,frontMatter:()=>i,metadata:()=>o,toc:()=>u});var r=n(9715),a=(n(45721),n(75631));const i={title:"New Intercode Schedule Design",tags:["changelog"],authors:["marleighnorton","nbudin","dkapell"]},l=void 0,o={permalink:"/blog/2019/10/03/new-intercode-schedule-design",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/blog/blog/2019-10-03-new-intercode-schedule-design/index.md",source:"@site/blog/2019-10-03-new-intercode-schedule-design/index.md",title:"New Intercode Schedule Design",description:"We're rolling out some changes to how the schedule and run buckets display in Intercode 2. Here\u2019s the highlights:",date:"2019-10-03T00:00:00.000Z",formattedDate:"October 3, 2019",tags:[{label:"changelog",permalink:"/blog/tags/changelog"}],readingTime:1.59,hasTruncateMarker:!0,authors:[{name:"Marleigh Norton",url:"https://github.com/marleighnorton",imageURL:"https://github.com/marleighnorton.png",key:"marleighnorton"},{name:"Nat Budin",url:"https://github.com/nbudin",imageURL:"https://github.com/nbudin.png",key:"nbudin"},{name:"Dave Kapell",url:"https://github.com/dkapell",imageURL:"https://github.com/dkapell.png",key:"dkapell"}],frontMatter:{title:"New Intercode Schedule Design",tags:["changelog"],authors:["marleighnorton","nbudin","dkapell"]},prevItem:{title:"SMS Notifications",permalink:"/blog/2020/01/27/sms-notifications"}},s={authorsImageUrls:[void 0,void 0,void 0]},u=[{value:"Schedule",id:"schedule",level:2},{value:"Schedule Legend Example",id:"schedule-legend-example",level:3},{value:"Signup Buckets",id:"signup-buckets",level:2},{value:"Signup Bucket Examples",id:"signup-bucket-examples",level:3}],c={toc:u},h="wrapper";function d(e){let{components:t,...i}=e;return(0,a.kt)(h,(0,r.Z)({},c,i,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"We're rolling out some changes to how the schedule and run buckets display in Intercode 2. Here\u2019s the highlights:"),(0,a.kt)("h2",{id:"schedule"},"Schedule"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Instead of having a thin green bar that empties as people sign up for an event, the event will have rounded ends, and act as a progress bar that goes up as people sign up. Once the event is full, it will be lightened to show that it is full."),(0,a.kt)("li",{parentName:"ul"},"Events that have unlimited slots will remain rectangular, and have a gradient background to show that you can sign up for them."),(0,a.kt)("li",{parentName:"ul"},"Events that have no slots (i.e. consuite) will remain rectangular, and have a solid background."),(0,a.kt)("li",{parentName:"ul"},'The "you are signed up for this game" has changed to a user/head icon instead of the checkbox that looked like an interactive element.'),(0,a.kt)("li",{parentName:"ul"},'The concom only "Schedule With Counts" view has been updated to show the percentage of signups in the same style, as a background progress bar on each event.'),(0,a.kt)("li",{parentName:"ul"},"The sorting of events on the schedule has been updated to better group multiple runs of events together if they\u2019re sequential.")),(0,a.kt)("h3",{id:"schedule-legend-example"},"Schedule Legend Example"),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"The new schedule legend view, showing examples of types of event",src:n(8820).Z,width:"1107",height:"442"})),(0,a.kt)("h2",{id:"signup-buckets"},"Signup Buckets"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Instead of having a broken line that turns from colored segments to gray, we\u2019re displaying a set of empty circles that get replaced by the same user/head icon that we use on the schedule as people sign up. This should be easier to read at a glance."),(0,a.kt)("li",{parentName:"ul"},"When you click on a run in the schedule view, the same set of circles/heads are displayed there as well.")),(0,a.kt)("h3",{id:"signup-bucket-examples"},"Signup Bucket Examples"),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"The view of an event run from its event page, showing the lines of empty circles for open slots",src:n(16091).Z,width:"367",height:"558"})),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"The view of an event run from the schedule grid, showing the reorganized popup view with lines of empty circles",src:n(18482).Z,width:"534",height:"380"})))}d.isMDXComponent=!0},8820:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/news_20191003_legend-2f598cad972802e87d02e05e26981407.png"},18482:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/news_20191003_popup-f48d99a1d7e26e63d3e24539aebb6d17.png"},16091:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/news_20191003_run-48c1c9a3d28cadeb398270b2e4681424.png"}}]);