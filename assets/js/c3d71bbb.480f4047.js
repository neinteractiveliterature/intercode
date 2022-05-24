"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[97414],{75631:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return g}});var a=t(3289);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,i=function(e,n){if(null==e)return{};var t,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var l=a.createContext({}),d=function(e){var n=a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},p=function(e){var n=d(e.components);return a.createElement(l.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},c=a.forwardRef((function(e,n){var t=e.components,i=e.mdxType,r=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),c=d(t),g=i,m=c["".concat(l,".").concat(g)]||c[g]||u[g]||r;return t?a.createElement(m,o(o({ref:n},p),{},{components:t})):a.createElement(m,o({ref:n},p))}));function g(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var r=t.length,o=new Array(r);o[0]=c;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var d=2;d<r;d++)o[d]=t[d];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}c.displayName="MDXCreateElement"},78364:function(e,n,t){t.r(n),t.d(n,{assets:function(){return p},contentTitle:function(){return l},default:function(){return g},frontMatter:function(){return s},metadata:function(){return d},toc:function(){return u}});var a=t(3149),i=t(97596),r=(t(3289),t(75631)),o=["components"],s={id:"run",title:"Run",hide_table_of_contents:!1},l=void 0,d={unversionedId:"graphql/objects/run",id:"graphql/objects/run",title:"Run",description:"No description",source:"@site/docs/graphql/objects/run.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/run",permalink:"/docs/graphql/objects/run",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/run.mdx",tags:[],version:"current",frontMatter:{id:"run",title:"Run",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"RootSite",permalink:"/docs/graphql/objects/root-site"},next:{title:"ScheduledMoneyValue",permalink:"/docs/graphql/objects/scheduled-money-value"}},p={},u=[{value:"Fields",id:"fields",level:3},{value:"<code>confirmed_limited_signup_count</code> (<code>Int</code>)",id:"confirmed_limited_signup_count-int",level:4},{value:"<code>confirmed_signup_count</code> (<code>Int</code>)",id:"confirmed_signup_count-int",level:4},{value:"<code>current_ability_can_signup_summary_run</code> (<code>Boolean</code>)",id:"current_ability_can_signup_summary_run-boolean",level:4},{value:"<code>ends_at</code> (<code>Date</code>)",id:"ends_at-date",level:4},{value:"<code>event</code> (<code>Event</code>)",id:"event-event",level:4},{value:"<code>id</code> (<code>ID</code>)",id:"id-id",level:4},{value:"<code>my_signup_requests</code> (<code>SignupRequest</code>)",id:"my_signup_requests-signuprequest",level:4},{value:"<code>my_signups</code> (<code>Signup</code>)",id:"my_signups-signup",level:4},{value:"<code>not_counted_confirmed_signup_count</code> (<code>Int</code>)",id:"not_counted_confirmed_signup_count-int",level:4},{value:"<code>not_counted_signup_count</code> (<code>Int</code>)",id:"not_counted_signup_count-int",level:4},{value:"<code>room_names</code> (<code>String</code>)",id:"room_names-string",level:4},{value:"<code>rooms</code> (<code>Room</code>)",id:"rooms-room",level:4},{value:"<code>schedule_note</code> (<code>String</code>)",id:"schedule_note-string",level:4},{value:"<code>signup_changes_paginated</code> (<code>SignupChangesPagination</code>)",id:"signup_changes_paginated-signupchangespagination",level:4},{value:"<code>signup_count_by_state_and_bucket_key_and_counted</code> (<code>Json</code>)",id:"signup_count_by_state_and_bucket_key_and_counted-json",level:4},{value:"<code>signups_paginated</code> (<code>SignupsPagination</code>)",id:"signups_paginated-signupspagination",level:4},{value:"<code>starts_at</code> (<code>Date</code>)",id:"starts_at-date",level:4},{value:"<code>title_suffix</code> (<code>String</code>)",id:"title_suffix-string",level:4},{value:"<code>waitlisted_signup_count</code> (<code>Int</code>)",id:"waitlisted_signup_count-int",level:4}],c={toc:u};function g(e){var n=e.components,t=(0,i.Z)(e,o);return(0,r.kt)("wrapper",(0,a.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"No description"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-graphql"},"type Run {\n  confirmed_limited_signup_count: Int!\n  confirmed_signup_count: Int!\n  current_ability_can_signup_summary_run: Boolean!\n  ends_at: Date!\n  event: Event!\n  id: ID!\n  my_signup_requests: [SignupRequest!]!\n  my_signups: [Signup!]!\n  not_counted_confirmed_signup_count: Int!\n  not_counted_signup_count: Int!\n  room_names: [String!]!\n  rooms: [Room!]!\n  schedule_note: String\n  signup_changes_paginated(\n  filters: SignupChangeFiltersInput\n  page: Int\n  per_page: Int\n  sort: [SortInput!]\n): SignupChangesPagination!\n  signup_count_by_state_and_bucket_key_and_counted: Json!\n  signups_paginated(\n  filters: SignupFiltersInput\n  page: Int\n  per_page: Int\n  sort: [SortInput]\n): SignupsPagination!\n  starts_at: Date!\n  title_suffix: String\n  waitlisted_signup_count: Int!\n}\n")),(0,r.kt)("h3",{id:"fields"},"Fields"),(0,r.kt)("h4",{id:"confirmed_limited_signup_count-int"},(0,r.kt)("inlineCode",{parentName:"h4"},"confirmed_limited_signup_count")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,r.kt)("h4",{id:"confirmed_signup_count-int"},(0,r.kt)("inlineCode",{parentName:"h4"},"confirmed_signup_count")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,r.kt)("h4",{id:"current_ability_can_signup_summary_run-boolean"},(0,r.kt)("inlineCode",{parentName:"h4"},"current_ability_can_signup_summary_run")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,r.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,r.kt)("h4",{id:"ends_at-date"},(0,r.kt)("inlineCode",{parentName:"h4"},"ends_at")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/date"},(0,r.kt)("inlineCode",{parentName:"a"},"Date")),")"),(0,r.kt)("h4",{id:"event-event"},(0,r.kt)("inlineCode",{parentName:"h4"},"event")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/event"},(0,r.kt)("inlineCode",{parentName:"a"},"Event")),")"),(0,r.kt)("h4",{id:"id-id"},(0,r.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,r.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,r.kt)("h4",{id:"my_signup_requests-signuprequest"},(0,r.kt)("inlineCode",{parentName:"h4"},"my_signup_requests")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/signup-request"},(0,r.kt)("inlineCode",{parentName:"a"},"SignupRequest")),")"),(0,r.kt)("h4",{id:"my_signups-signup"},(0,r.kt)("inlineCode",{parentName:"h4"},"my_signups")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/signup"},(0,r.kt)("inlineCode",{parentName:"a"},"Signup")),")"),(0,r.kt)("h4",{id:"not_counted_confirmed_signup_count-int"},(0,r.kt)("inlineCode",{parentName:"h4"},"not_counted_confirmed_signup_count")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,r.kt)("h4",{id:"not_counted_signup_count-int"},(0,r.kt)("inlineCode",{parentName:"h4"},"not_counted_signup_count")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,r.kt)("h4",{id:"room_names-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"room_names")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"rooms-room"},(0,r.kt)("inlineCode",{parentName:"h4"},"rooms")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/room"},(0,r.kt)("inlineCode",{parentName:"a"},"Room")),")"),(0,r.kt)("h4",{id:"schedule_note-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"schedule_note")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"signup_changes_paginated-signupchangespagination"},(0,r.kt)("inlineCode",{parentName:"h4"},"signup_changes_paginated")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/signup-changes-pagination"},(0,r.kt)("inlineCode",{parentName:"a"},"SignupChangesPagination")),")"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"filters-signupchangefiltersinput"},(0,r.kt)("inlineCode",{parentName:"h5"},"filters")," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/inputs/signup-change-filters-input"},(0,r.kt)("inlineCode",{parentName:"a"},"SignupChangeFiltersInput")),")"))),(0,r.kt)("p",null,"Filters to restrict what items will appear in the result set."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"page-int"},(0,r.kt)("inlineCode",{parentName:"h5"},"page")," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,r.kt)("p",null,"The page number to return from the result set.  Page numbers start with 1."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"per_page-int"},(0,r.kt)("inlineCode",{parentName:"h5"},"per_page")," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,r.kt)("p",null,"The number of items to return per page.  Defaults to 20, can go up to 200."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"sort-sortinput"},(0,r.kt)("inlineCode",{parentName:"h5"},"sort")," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/inputs/sort-input"},(0,r.kt)("inlineCode",{parentName:"a"},"SortInput")),")"))),(0,r.kt)("p",null,"A set of fields to use for ordering the result set. The second field is used as a\ntiebreaker for the first, the third field is used as a tiebreaker for the first two,\nand so on. If the sort argument is missing or empty, the order of items will be left\nup to the database (and may be unpredictable)."),(0,r.kt)("h4",{id:"signup_count_by_state_and_bucket_key_and_counted-json"},(0,r.kt)("inlineCode",{parentName:"h4"},"signup_count_by_state_and_bucket_key_and_counted")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/json"},(0,r.kt)("inlineCode",{parentName:"a"},"Json")),")"),(0,r.kt)("h4",{id:"signups_paginated-signupspagination"},(0,r.kt)("inlineCode",{parentName:"h4"},"signups_paginated")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/signups-pagination"},(0,r.kt)("inlineCode",{parentName:"a"},"SignupsPagination")),")"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"filters-signupfiltersinput"},(0,r.kt)("inlineCode",{parentName:"h5"},"filters")," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/inputs/signup-filters-input"},(0,r.kt)("inlineCode",{parentName:"a"},"SignupFiltersInput")),")"))),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"page-int-1"},(0,r.kt)("inlineCode",{parentName:"h5"},"page")," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"per_page-int-1"},(0,r.kt)("inlineCode",{parentName:"h5"},"per_page")," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"sort-sortinput-1"},(0,r.kt)("inlineCode",{parentName:"h5"},"sort")," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/inputs/sort-input"},(0,r.kt)("inlineCode",{parentName:"a"},"SortInput")),")"))),(0,r.kt)("h4",{id:"starts_at-date"},(0,r.kt)("inlineCode",{parentName:"h4"},"starts_at")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/date"},(0,r.kt)("inlineCode",{parentName:"a"},"Date")),")"),(0,r.kt)("h4",{id:"title_suffix-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"title_suffix")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"waitlisted_signup_count-int"},(0,r.kt)("inlineCode",{parentName:"h4"},"waitlisted_signup_count")," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"))}g.isMDXComponent=!0}}]);