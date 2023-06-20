"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[97382],{75631:(e,t,i)=>{i.d(t,{Zo:()=>u,kt:()=>h});var o=i(45721);function n(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function l(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,o)}return i}function a(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?l(Object(i),!0).forEach((function(t){n(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):l(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}function r(e,t){if(null==e)return{};var i,o,n=function(e,t){if(null==e)return{};var i,o,n={},l=Object.keys(e);for(o=0;o<l.length;o++)i=l[o],t.indexOf(i)>=0||(n[i]=e[i]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(o=0;o<l.length;o++)i=l[o],t.indexOf(i)>=0||Object.prototype.propertyIsEnumerable.call(e,i)&&(n[i]=e[i])}return n}var d=o.createContext({}),c=function(e){var t=o.useContext(d),i=t;return e&&(i="function"==typeof e?e(t):a(a({},t),e)),i},u=function(e){var t=c(e.components);return o.createElement(d.Provider,{value:t},e.children)},s="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},v=o.forwardRef((function(e,t){var i=e.components,n=e.mdxType,l=e.originalType,d=e.parentName,u=r(e,["components","mdxType","originalType","parentName"]),s=c(i),v=n,h=s["".concat(d,".").concat(v)]||s[v]||p[v]||l;return i?o.createElement(h,a(a({ref:t},u),{},{components:i})):o.createElement(h,a({ref:t},u))}));function h(e,t){var i=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=i.length,a=new Array(l);a[0]=v;var r={};for(var d in t)hasOwnProperty.call(t,d)&&(r[d]=t[d]);r.originalType=e,r[s]="string"==typeof e?e:n,a[1]=r;for(var c=2;c<l;c++)a[c]=i[c];return o.createElement.apply(null,a)}return o.createElement.apply(null,i)}v.displayName="MDXCreateElement"},7991:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>d,contentTitle:()=>a,default:()=>p,frontMatter:()=>l,metadata:()=>r,toc:()=>c});var o=i(9715),n=(i(45721),i(75631));const l={id:"run-availability-drop",title:"RunAvailabilityDrop"},a=void 0,r={unversionedId:"liquid/drops/run-availability-drop",id:"liquid/drops/run-availability-drop",title:"RunAvailabilityDrop",description:"The available slots for an event run",source:"@site/docs/liquid/drops/run-availability-drop.mdx",sourceDirName:"liquid/drops",slug:"/liquid/drops/run-availability-drop",permalink:"/docs/liquid/drops/run-availability-drop",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/liquid/drops/run-availability-drop.mdx",tags:[],version:"current",frontMatter:{id:"run-availability-drop",title:"RunAvailabilityDrop"},sidebar:"sidebar",previous:{title:"RegistrationPolicy::BucketDrop",permalink:"/docs/liquid/drops/registration-policy-bucket-drop"},next:{title:"RunDrop",permalink:"/docs/liquid/drops/run-drop"}},d={},c=[{value:"Fields",id:"fields",level:3},{value:'<code>bucket_availabilities_with_any_slots</code> (<code><a href="/docs/liquid/drops/bucket-availability-drop">BucketAvailabilityDrop</a></code>)',id:"bucket_availabilities_with_any_slots-bucketavailabilitydrop",level:4},{value:'<code>bucket_availabilities_with_counted_slots</code> (<code><a href="/docs/liquid/drops/bucket-availability-drop">BucketAvailabilityDrop</a></code>)',id:"bucket_availabilities_with_counted_slots-bucketavailabilitydrop",level:4},{value:'<code>buckets_with_not_counted_slots</code> (<code><a href="/docs/liquid/drops/bucket-availability-drop">BucketAvailabilityDrop</a></code>)',id:"buckets_with_not_counted_slots-bucketavailabilitydrop",level:4},{value:"<code>ends_at</code> (<code>ActiveSupport::TimeWithZone</code>)",id:"ends_at-activesupporttimewithzone",level:4},{value:'<code>event</code> (<code><a href="/docs/liquid/drops/event-drop">EventDrop</a></code>)',id:"event-eventdrop",level:4},{value:"<code>event_category_name</code> (<code>String</code>)",id:"event_category_name-string",level:4},{value:"<code>full</code> (<code>Boolean</code>)",id:"full-boolean",level:4},{value:"<code>has_any_slots</code> (<code>Boolean</code>)",id:"has_any_slots-boolean",level:4},{value:"<code>has_counted_slots</code> (<code>Boolean</code>)",id:"has_counted_slots-boolean",level:4},{value:"<code>has_not_counted_slots</code> (<code>Boolean</code>)",id:"has_not_counted_slots-boolean",level:4},{value:'<code>run</code> (<code><a href="/docs/liquid/drops/run-drop">RunDrop</a></code>)',id:"run-rundrop",level:4},{value:"<code>starts_at</code> (<code>ActiveSupport::TimeWithZone</code>)",id:"starts_at-activesupporttimewithzone",level:4},{value:"<code>title</code> (<code>String</code>)",id:"title-string",level:4}],u={toc:c},s="wrapper";function p(e){let{components:t,...i}=e;return(0,n.kt)(s,(0,o.Z)({},u,i,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"The available slots for an event run"),(0,n.kt)("h3",{id:"fields"},"Fields"),(0,n.kt)("h4",{id:"bucket_availabilities_with_any_slots-bucketavailabilitydrop"},(0,n.kt)("inlineCode",{parentName:"h4"},"bucket_availabilities_with_any_slots")," (",(0,n.kt)("code",null,(0,n.kt)("a",{href:"/docs/liquid/drops/bucket-availability-drop"},"BucketAvailabilityDrop")),")"),(0,n.kt)("p",null,"The bucket availabilites in this run that have any available\nslots (both counted and not-counted)"),(0,n.kt)("h4",{id:"bucket_availabilities_with_counted_slots-bucketavailabilitydrop"},(0,n.kt)("inlineCode",{parentName:"h4"},"bucket_availabilities_with_counted_slots")," (",(0,n.kt)("code",null,(0,n.kt)("a",{href:"/docs/liquid/drops/bucket-availability-drop"},"BucketAvailabilityDrop")),")"),(0,n.kt)("p",null,"The bucket availabilites in this run with available counted\nslots"),(0,n.kt)("h4",{id:"buckets_with_not_counted_slots-bucketavailabilitydrop"},(0,n.kt)("inlineCode",{parentName:"h4"},"buckets_with_not_counted_slots")," (",(0,n.kt)("code",null,(0,n.kt)("a",{href:"/docs/liquid/drops/bucket-availability-drop"},"BucketAvailabilityDrop")),")"),(0,n.kt)("p",null,"The bucket availabilites in this run with available\nnot-counted slots"),(0,n.kt)("h4",{id:"ends_at-activesupporttimewithzone"},(0,n.kt)("inlineCode",{parentName:"h4"},"ends_at")," (",(0,n.kt)("code",null,"ActiveSupport::TimeWithZone"),")"),(0,n.kt)("p",null,"The time at which this run ends"),(0,n.kt)("h4",{id:"event-eventdrop"},(0,n.kt)("inlineCode",{parentName:"h4"},"event")," (",(0,n.kt)("code",null,(0,n.kt)("a",{href:"/docs/liquid/drops/event-drop"},"EventDrop")),")"),(0,n.kt)("p",null,"The event this is a run of"),(0,n.kt)("h4",{id:"event_category_name-string"},(0,n.kt)("inlineCode",{parentName:"h4"},"event_category_name")," (",(0,n.kt)("code",null,"String"),")"),(0,n.kt)("p",null,'The name of the event category for this event.  Useful for passing to the\nLiquid "where" filter.'),(0,n.kt)("h4",{id:"full-boolean"},(0,n.kt)("inlineCode",{parentName:"h4"},"full")," (",(0,n.kt)("code",null,"Boolean"),")"),(0,n.kt)("p",null,"Are all buckets (both counted and non-counted) full?"),(0,n.kt)("h4",{id:"has_any_slots-boolean"},(0,n.kt)("inlineCode",{parentName:"h4"},"has_any_slots")," (",(0,n.kt)("code",null,"Boolean"),")"),(0,n.kt)("p",null,"Are there any buckets (either counted or non-counted) with availability?"),(0,n.kt)("h4",{id:"has_counted_slots-boolean"},(0,n.kt)("inlineCode",{parentName:"h4"},"has_counted_slots")," (",(0,n.kt)("code",null,"Boolean"),")"),(0,n.kt)("p",null,"Are there any counted buckets with availability?"),(0,n.kt)("h4",{id:"has_not_counted_slots-boolean"},(0,n.kt)("inlineCode",{parentName:"h4"},"has_not_counted_slots")," (",(0,n.kt)("code",null,"Boolean"),")"),(0,n.kt)("p",null,"Are there any not-counted buckets with availability?"),(0,n.kt)("h4",{id:"run-rundrop"},(0,n.kt)("inlineCode",{parentName:"h4"},"run")," (",(0,n.kt)("code",null,(0,n.kt)("a",{href:"/docs/liquid/drops/run-drop"},"RunDrop")),")"),(0,n.kt)("p",null,"The run itself"),(0,n.kt)("h4",{id:"starts_at-activesupporttimewithzone"},(0,n.kt)("inlineCode",{parentName:"h4"},"starts_at")," (",(0,n.kt)("code",null,"ActiveSupport::TimeWithZone"),")"),(0,n.kt)("p",null,"The time at which this run starts"),(0,n.kt)("h4",{id:"title-string"},(0,n.kt)("inlineCode",{parentName:"h4"},"title")," (",(0,n.kt)("code",null,"String"),")"),(0,n.kt)("p",null,"The title of the event"))}p.isMDXComponent=!0}}]);