"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[81192],{75631:(e,t,o)=>{o.d(t,{Zo:()=>u,kt:()=>k});var n=o(45721);function r(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function i(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,n)}return o}function d(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?i(Object(o),!0).forEach((function(t){r(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):i(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function l(e,t){if(null==e)return{};var o,n,r=function(e,t){if(null==e)return{};var o,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)o=i[n],t.indexOf(o)>=0||(r[o]=e[o]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)o=i[n],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}var c=n.createContext({}),p=function(e){var t=n.useContext(c),o=t;return e&&(o="function"==typeof e?e(t):d(d({},t),e)),o},u=function(e){var t=p(e.components);return n.createElement(c.Provider,{value:t},e.children)},a="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},h=n.forwardRef((function(e,t){var o=e.components,r=e.mdxType,i=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),a=p(o),h=r,k=a["".concat(c,".").concat(h)]||a[h]||s[h]||i;return o?n.createElement(k,d(d({ref:t},u),{},{components:o})):n.createElement(k,d({ref:t},u))}));function k(e,t){var o=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=o.length,d=new Array(i);d[0]=h;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l[a]="string"==typeof e?e:r,d[1]=l;for(var p=2;p<i;p++)d[p]=o[p];return n.createElement.apply(null,d)}return n.createElement.apply(null,o)}h.displayName="MDXCreateElement"},8083:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>c,contentTitle:()=>d,default:()=>s,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var n=o(91487),r=(o(45721),o(75631));const i={id:"signup-drop",title:"SignupDrop"},d=void 0,l={unversionedId:"liquid/drops/signup-drop",id:"liquid/drops/signup-drop",title:"SignupDrop",description:"A signup for a run of an event",source:"@site/docs/liquid/drops/signup-drop.mdx",sourceDirName:"liquid/drops",slug:"/liquid/drops/signup-drop",permalink:"/docs/liquid/drops/signup-drop",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/liquid/drops/signup-drop.mdx",tags:[],version:"current",frontMatter:{id:"signup-drop",title:"SignupDrop"},sidebar:"sidebar",previous:{title:"ScheduledValue::TimespanDrop",permalink:"/docs/liquid/drops/scheduled-value-timespan-drop"},next:{title:"SignupMoveResultDrop",permalink:"/docs/liquid/drops/signup-move-result-drop"}},c={},p=[{value:"Fields",id:"fields",level:3},{value:'<code>bucket</code> (<code><a href="/docs/liquid/drops/registration-policy-bucket-drop">RegistrationPolicy::BucketDrop</a></code>)',id:"bucket-registrationpolicybucketdrop",level:4},{value:"<code>counted</code> (<code>Boolean</code>)",id:"counted-boolean",level:4},{value:"<code>ends_at</code> (<code>ActiveSupport::TimeWithZone</code>)",id:"ends_at-activesupporttimewithzone",level:4},{value:'<code>event</code> (<code><a href="/docs/liquid/drops/event-drop">EventDrop</a></code>)',id:"event-eventdrop",level:4},{value:"<code>event_url</code> (<code>String</code>)",id:"event_url-string",level:4},{value:"<code>expires_at</code> (<code>DateTime</code>)",id:"expires_at-datetime",level:4},{value:"<code>id</code> (<code>Integer</code>)",id:"id-integer",level:4},{value:"<code>length_seconds</code> (<code>Integer</code>)",id:"length_seconds-integer",level:4},{value:'<code>requested_bucket</code> (<code><a href="/docs/liquid/drops/registration-policy-bucket-drop">RegistrationPolicy::BucketDrop</a></code>)',id:"requested_bucket-registrationpolicybucketdrop",level:4},{value:'<code>run</code> (<code><a href="/docs/liquid/drops/run-drop">RunDrop</a></code>)',id:"run-rundrop",level:4},{value:"<code>starts_at</code> (<code>ActiveSupport::TimeWithZone</code>)",id:"starts_at-activesupporttimewithzone",level:4},{value:"<code>state</code> (<code>String</code>)",id:"state-string",level:4},{value:"<code>team_member</code> (<code>Boolean</code>)",id:"team_member-boolean",level:4},{value:'<code>user_con_profile</code> (<code><a href="/docs/liquid/drops/user-con-profile-drop">UserConProfileDrop</a></code>)',id:"user_con_profile-userconprofiledrop",level:4}],u={toc:p},a="wrapper";function s(e){let{components:t,...o}=e;return(0,r.kt)(a,(0,n.Z)({},u,o,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"A signup for a run of an event"),(0,r.kt)("h3",{id:"fields"},"Fields"),(0,r.kt)("h4",{id:"bucket-registrationpolicybucketdrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"bucket")," (",(0,r.kt)("code",null,(0,r.kt)("a",{href:"/docs/liquid/drops/registration-policy-bucket-drop"},"RegistrationPolicy",":",":","BucketDrop")),")"),(0,r.kt)("p",null,"The bucket assigned to this signup"),(0,r.kt)("h4",{id:"counted-boolean"},(0,r.kt)("inlineCode",{parentName:"h4"},"counted")," (",(0,r.kt)("code",null,"Boolean"),")"),(0,r.kt)("p",null,"Whether or not the signup is counted (for the purposes of maximum signups\nallowed, and counting totals for the event)"),(0,r.kt)("h4",{id:"ends_at-activesupporttimewithzone"},(0,r.kt)("inlineCode",{parentName:"h4"},"ends_at")," (",(0,r.kt)("code",null,"ActiveSupport::TimeWithZone"),")"),(0,r.kt)("p",null,"When the run ends"),(0,r.kt)("h4",{id:"event-eventdrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"event")," (",(0,r.kt)("code",null,(0,r.kt)("a",{href:"/docs/liquid/drops/event-drop"},"EventDrop")),")"),(0,r.kt)("p",null,"The event the signup is for"),(0,r.kt)("h4",{id:"event_url-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"event_url")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,"The relative URL of the event's page on the convention site"),(0,r.kt)("h4",{id:"expires_at-datetime"},(0,r.kt)("inlineCode",{parentName:"h4"},"expires_at")," (",(0,r.kt)("code",null,"DateTime"),")"),(0,r.kt)("p",null,"When this signup will expire, if it's being held tempoarily"),(0,r.kt)("h4",{id:"id-integer"},(0,r.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,r.kt)("code",null,"Integer"),")"),(0,r.kt)("p",null,"The numeric database id of this signup"),(0,r.kt)("h4",{id:"length_seconds-integer"},(0,r.kt)("inlineCode",{parentName:"h4"},"length_seconds")," (",(0,r.kt)("code",null,"Integer"),")"),(0,r.kt)("p",null,"The length of the run in seconds"),(0,r.kt)("h4",{id:"requested_bucket-registrationpolicybucketdrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"requested_bucket")," (",(0,r.kt)("code",null,(0,r.kt)("a",{href:"/docs/liquid/drops/registration-policy-bucket-drop"},"RegistrationPolicy",":",":","BucketDrop")),")"),(0,r.kt)("p",null,"The bucket the user requested to sign up in, if any"),(0,r.kt)("h4",{id:"run-rundrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"run")," (",(0,r.kt)("code",null,(0,r.kt)("a",{href:"/docs/liquid/drops/run-drop"},"RunDrop")),")"),(0,r.kt)("p",null,"The run the signup is for"),(0,r.kt)("h4",{id:"starts_at-activesupporttimewithzone"},(0,r.kt)("inlineCode",{parentName:"h4"},"starts_at")," (",(0,r.kt)("code",null,"ActiveSupport::TimeWithZone"),")"),(0,r.kt)("p",null,"When the run starts"),(0,r.kt)("h4",{id:"state-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"state")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,"The state of this signup (e.g. confirmed, waitlisted, withdrawn)"),(0,r.kt)("h4",{id:"team_member-boolean"},(0,r.kt)("inlineCode",{parentName:"h4"},"team_member")," (",(0,r.kt)("code",null,"Boolean"),")"),(0,r.kt)("p",null,"Whether or not this signup is for an event team member"),(0,r.kt)("h4",{id:"user_con_profile-userconprofiledrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"user_con_profile")," (",(0,r.kt)("code",null,(0,r.kt)("a",{href:"/docs/liquid/drops/user-con-profile-drop"},"UserConProfileDrop")),")"),(0,r.kt)("p",null,"The profile of the person who is signed up"))}s.isMDXComponent=!0}}]);