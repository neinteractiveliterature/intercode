"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[26528],{75631:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>v});var o=n(3289);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=o.createContext({}),d=function(e){var t=o.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},l=function(e){var t=d(e.components);return o.createElement(p.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},u=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,p=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),u=d(n),v=r,m=u["".concat(p,".").concat(v)]||u[v]||s[v]||i;return n?o.createElement(m,a(a({ref:t},l),{},{components:n})):o.createElement(m,a({ref:t},l))}));function v(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=u;var c={};for(var p in t)hasOwnProperty.call(t,p)&&(c[p]=t[p]);c.originalType=e,c.mdxType="string"==typeof e?e:r,a[1]=c;for(var d=2;d<i;d++)a[d]=n[d];return o.createElement.apply(null,a)}return o.createElement.apply(null,n)}u.displayName="MDXCreateElement"},49554:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>a,default:()=>s,frontMatter:()=>i,metadata:()=>c,toc:()=>d});var o=n(60953),r=(n(3289),n(75631));const i={id:"convention-reports",title:"ConventionReports",hide_table_of_contents:!1},a=void 0,c={unversionedId:"graphql/objects/convention-reports",id:"graphql/objects/convention-reports",title:"ConventionReports",description:"No description",source:"@site/docs/graphql/objects/convention-reports.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/convention-reports",permalink:"/docs/graphql/objects/convention-reports",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/convention-reports.mdx",tags:[],version:"current",frontMatter:{id:"convention-reports",title:"ConventionReports",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"ContactEmail",permalink:"/docs/graphql/objects/contact-email"},next:{title:"Convention",permalink:"/docs/graphql/objects/convention"}},p={},d=[{value:"Fields",id:"fields",level:3},{value:"<code>event_provided_tickets</code> (<code>[EventProvidedTicketList!]!</code>)",id:"event_provided_tickets-eventprovidedticketlist",level:4},{value:"<code>events_by_choice</code> (<code>[EventWithChoiceCounts!]!</code>)",id:"events_by_choice-eventwithchoicecounts",level:4},{value:"<code>ticket_count_by_type_and_payment_amount</code> (<code>[TicketCountByTypeAndPaymentAmount!]!</code>)",id:"ticket_count_by_type_and_payment_amount-ticketcountbytypeandpaymentamount",level:4},{value:"<code>total_revenue</code> (<code>Money!</code>)",id:"total_revenue-money",level:4}],l={toc:d};function s(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,o.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"No description"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-graphql"},"type ConventionReports {\n  event_provided_tickets: [EventProvidedTicketList!]!\n  events_by_choice: [EventWithChoiceCounts!]!\n  ticket_count_by_type_and_payment_amount: [TicketCountByTypeAndPaymentAmount!]!\n  total_revenue: Money!\n}\n")),(0,r.kt)("h3",{id:"fields"},"Fields"),(0,r.kt)("h4",{id:"event_provided_tickets-eventprovidedticketlist"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"event_provided_tickets"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/event-provided-ticket-list"},(0,r.kt)("inlineCode",{parentName:"a"},"[EventProvidedTicketList!]!")),")"),(0,r.kt)("h4",{id:"events_by_choice-eventwithchoicecounts"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"events_by_choice"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/event-with-choice-counts"},(0,r.kt)("inlineCode",{parentName:"a"},"[EventWithChoiceCounts!]!")),")"),(0,r.kt)("h4",{id:"ticket_count_by_type_and_payment_amount-ticketcountbytypeandpaymentamount"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"ticket_count_by_type_and_payment_amount"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/ticket-count-by-type-and-payment-amount"},(0,r.kt)("inlineCode",{parentName:"a"},"[TicketCountByTypeAndPaymentAmount!]!")),")"),(0,r.kt)("h4",{id:"total_revenue-money"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"total_revenue"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/money"},(0,r.kt)("inlineCode",{parentName:"a"},"Money!")),")"))}s.isMDXComponent=!0}}]);