"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[77549],{75631:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>m});var o=n(3289);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=o.createContext({}),s=function(e){var t=o.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=s(e.components);return o.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},u=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,c=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),u=s(n),m=r,_=u["".concat(c,".").concat(m)]||u[m]||p[m]||a;return n?o.createElement(_,i(i({ref:t},d),{},{components:n})):o.createElement(_,i({ref:t},d))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=u;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var s=2;s<a;s++)i[s]=n[s];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}u.displayName="MDXCreateElement"},55683:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>l,toc:()=>s});var o=n(60953),r=(n(3289),n(75631));const a={id:"registration-policy",title:"RegistrationPolicy",hide_table_of_contents:!1},i=void 0,l={unversionedId:"graphql/objects/registration-policy",id:"graphql/objects/registration-policy",title:"RegistrationPolicy",description:"No description",source:"@site/docs/graphql/objects/registration-policy.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/registration-policy",permalink:"/docs/graphql/objects/registration-policy",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/registration-policy.mdx",tags:[],version:"current",frontMatter:{id:"registration-policy",title:"RegistrationPolicy",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"RegistrationPolicyBucket",permalink:"/docs/graphql/objects/registration-policy-bucket"},next:{title:"RejectSignupRequestPayload",permalink:"/docs/graphql/objects/reject-signup-request-payload"}},c={},s=[{value:"Fields",id:"fields",level:3},{value:"<code>buckets</code> (<code>[RegistrationPolicyBucket!]!</code>)",id:"buckets-registrationpolicybucket",level:4},{value:"<code>minimum_slots</code> (<code>Int</code>)",id:"minimum_slots-int",level:4},{value:"<code>minimum_slots_including_not_counted</code> (<code>Int</code>)",id:"minimum_slots_including_not_counted-int",level:4},{value:"<code>only_uncounted</code> (<code>Boolean</code>)",id:"only_uncounted-boolean",level:4},{value:"<code>preferred_slots</code> (<code>Int</code>)",id:"preferred_slots-int",level:4},{value:"<code>preferred_slots_including_not_counted</code> (<code>Int</code>)",id:"preferred_slots_including_not_counted-int",level:4},{value:"<code>prevent_no_preference_signups</code> (<code>Boolean!</code>)",id:"prevent_no_preference_signups-boolean",level:4},{value:"<code>slots_limited</code> (<code>Boolean</code>)",id:"slots_limited-boolean",level:4},{value:"<code>total_slots</code> (<code>Int</code>)",id:"total_slots-int",level:4},{value:"<code>total_slots_including_not_counted</code> (<code>Int</code>)",id:"total_slots_including_not_counted-int",level:4}],d={toc:s};function p(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,o.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"No description"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-graphql"},"type RegistrationPolicy {\n  buckets: [RegistrationPolicyBucket!]!\n  minimum_slots: Int\n  minimum_slots_including_not_counted: Int\n  only_uncounted: Boolean\n  preferred_slots: Int\n  preferred_slots_including_not_counted: Int\n  prevent_no_preference_signups: Boolean!\n  slots_limited: Boolean\n  total_slots: Int\n  total_slots_including_not_counted: Int\n}\n")),(0,r.kt)("h3",{id:"fields"},"Fields"),(0,r.kt)("h4",{id:"buckets-registrationpolicybucket"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"buckets"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/registration-policy-bucket"},(0,r.kt)("inlineCode",{parentName:"a"},"[RegistrationPolicyBucket!]!")),")"),(0,r.kt)("h4",{id:"minimum_slots-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"minimum_slots"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,r.kt)("h4",{id:"minimum_slots_including_not_counted-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"minimum_slots_including_not_counted"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,r.kt)("h4",{id:"only_uncounted-boolean"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"only_uncounted"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,r.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,r.kt)("h4",{id:"preferred_slots-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"preferred_slots"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,r.kt)("h4",{id:"preferred_slots_including_not_counted-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"preferred_slots_including_not_counted"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,r.kt)("h4",{id:"prevent_no_preference_signups-boolean"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"prevent_no_preference_signups"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,r.kt)("inlineCode",{parentName:"a"},"Boolean!")),")"),(0,r.kt)("h4",{id:"slots_limited-boolean"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"slots_limited"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,r.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,r.kt)("h4",{id:"total_slots-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"total_slots"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,r.kt)("h4",{id:"total_slots_including_not_counted-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"total_slots_including_not_counted"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"))}p.isMDXComponent=!0}}]);