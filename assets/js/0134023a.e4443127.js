"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[19099],{75631:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return v}});var i=n(3289);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,i,o=function(e,t){if(null==e)return{};var n,i,o={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var d=i.createContext({}),s=function(e){var t=i.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},c=function(e){var t=s(e.components);return i.createElement(d.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},p=i.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,d=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=s(n),v=o,h=p["".concat(d,".").concat(v)]||p[v]||u[v]||r;return n?i.createElement(h,a(a({ref:t},c),{},{components:n})):i.createElement(h,a({ref:t},c))}));function v(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,a=new Array(r);a[0]=p;var l={};for(var d in t)hasOwnProperty.call(t,d)&&(l[d]=t[d]);l.originalType=e,l.mdxType="string"==typeof e?e:o,a[1]=l;for(var s=2;s<r;s++)a[s]=n[s];return i.createElement.apply(null,a)}return i.createElement.apply(null,n)}p.displayName="MDXCreateElement"},94464:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return d},default:function(){return v},frontMatter:function(){return l},metadata:function(){return s},toc:function(){return u}});var i=n(43830),o=n(32056),r=(n(3289),n(75631)),a=["components"],l={id:"convention-drop",title:"ConventionDrop"},d=void 0,s={unversionedId:"liquid/drops/convention-drop",id:"liquid/drops/convention-drop",title:"ConventionDrop",description:"The convention itself",source:"@site/docs/liquid/drops/convention-drop.mdx",sourceDirName:"liquid/drops",slug:"/liquid/drops/convention-drop",permalink:"/docs/liquid/drops/convention-drop",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/liquid/drops/convention-drop.mdx",tags:[],version:"current",frontMatter:{id:"convention-drop",title:"ConventionDrop"},sidebar:"sidebar",previous:{title:"BucketAvailabilityDrop",permalink:"/docs/liquid/drops/bucket-availability-drop"},next:{title:"EventCategoryDrop",permalink:"/docs/liquid/drops/event-category-drop"}},c={},u=[{value:"Fields",id:"fields",level:3},{value:"<code>accepting_proposals</code> (<code>Boolean</code>)",id:"accepting_proposals-boolean",level:4},{value:'<code>available_products</code> (<code>Array&lt;<a href="/docs/liquid/drops/product-drop">ProductDrop</a>&gt;</code>)',id:"available_products-arrayproductdrop",level:4},{value:'<code>bio_eligible_user_con_profiles</code> (<code>Array&lt;<a href="/docs/liquid/drops/user-con-profile-drop">UserConProfileDrop</a>&gt;</code>)',id:"bio_eligible_user_con_profiles-arrayuserconprofiledrop",level:4},{value:"<code>canceled</code> (<code>Boolean</code>)",id:"canceled-boolean",level:4},{value:"<code>ended</code> (<code>Boolean</code>)",id:"ended-boolean",level:4},{value:"<code>ends_at</code> (<code>ActiveSupport::TimeWithZone</code>)",id:"ends_at-activesupporttimewithzone",level:4},{value:'<code>event_categories</code> (<code>Array&lt;<a href="/docs/liquid/drops/event-category-drop">EventCategoryDrop</a>&gt;</code>)',id:"event_categories-arrayeventcategorydrop",level:4},{value:"<code>event_mailing_list_domain</code> (<code>String</code>)",id:"event_mailing_list_domain-string",level:4},{value:'<code>events</code> (<code>Array&lt;<a href="/docs/liquid/drops/event-drop">EventDrop</a>&gt;</code>)',id:"events-arrayeventdrop",level:4},{value:'<code>events_created_since</code> (<code><a href="/docs/liquid/drops/events-created-since-drop">EventsCreatedSinceDrop</a></code>)',id:"events_created_since-eventscreatedsincedrop",level:4},{value:"<code>id</code> (<code>Integer</code>)",id:"id-integer",level:4},{value:"<code>location</code> (<code>Hash</code>)",id:"location-hash",level:4},{value:'<code>maximum_event_signups</code> (<code><a href="/docs/liquid/drops/scheduled-value-drop">ScheduledValueDrop</a></code>)',id:"maximum_event_signups-scheduledvaluedrop",level:4},{value:"<code>name</code> (<code>String</code>)",id:"name-string",level:4},{value:'<code>non_volunteer_runs_with_openings</code> (<code>Array&lt;<a href="/docs/liquid/drops/run-drop">RunDrop</a>&gt;</code>)',id:"non_volunteer_runs_with_openings-arrayrundrop",level:4},{value:'<code>organization</code> (<code><a href="/docs/liquid/drops/organization-drop">OrganizationDrop</a></code>)',id:"organization-organizationdrop",level:4},{value:'<code>products</code> (<code>Array&lt;<a href="/docs/liquid/drops/product-drop">ProductDrop</a>&gt;</code>)',id:"products-arrayproductdrop",level:4},{value:'<code>run_availabilities</code> (<code>Array&lt;<a href="/docs/liquid/drops/run-availability-drop">RunAvailabilityDrop</a>&gt;</code>)',id:"run_availabilities-arrayrunavailabilitydrop",level:4},{value:'<code>run_availabilities_with_any_slots</code> (<code>Array&lt;<a href="/docs/liquid/drops/run-availability-drop">RunAvailabilityDrop</a>&gt;</code>)',id:"run_availabilities_with_any_slots-arrayrunavailabilitydrop",level:4},{value:'<code>run_availabilities_with_counted_slots</code> (<code>Array&lt;<a href="/docs/liquid/drops/run-availability-drop">RunAvailabilityDrop</a>&gt;</code>)',id:"run_availabilities_with_counted_slots-arrayrunavailabilitydrop",level:4},{value:'<code>run_availabilities_with_not_counted_slots</code> (<code>Array&lt;<a href="/docs/liquid/drops/run-availability-drop">RunAvailabilityDrop</a>&gt;</code>)',id:"run_availabilities_with_not_counted_slots-arrayrunavailabilitydrop",level:4},{value:'<code>runs</code> (<code>Array&lt;<a href="/docs/liquid/drops/run-drop">RunDrop</a>&gt;</code>)',id:"runs-arrayrundrop",level:4},{value:'<code>runs_with_openings</code> (<code>Array&lt;<a href="/docs/liquid/drops/run-drop">RunDrop</a>&gt;</code>)',id:"runs_with_openings-arrayrundrop",level:4},{value:"<code>show_event_list</code> (<code>String</code>)",id:"show_event_list-string",level:4},{value:"<code>show_schedule</code> (<code>String</code>)",id:"show_schedule-string",level:4},{value:'<code>staff_positions</code> (<code>Array&lt;<a href="/docs/liquid/drops/staff-position-drop">StaffPositionDrop</a>&gt;</code>)',id:"staff_positions-arraystaffpositiondrop",level:4},{value:"<code>staff_positions_by_name</code> (<code>Hash&lt;String, StaffPositionDrop&gt;</code>)",id:"staff_positions_by_name-hashstring-staffpositiondrop",level:4},{value:"<code>started</code> (<code>Boolean</code>)",id:"started-boolean",level:4},{value:"<code>starts_at</code> (<code>ActiveSupport::TimeWithZone</code>)",id:"starts_at-activesupporttimewithzone",level:4},{value:"<code>ticket_counts_by_type</code> (<code>Hash&lt;String, Integer&gt;</code>)",id:"ticket_counts_by_type-hashstring-integer",level:4},{value:"<code>ticket_mode</code> (<code>String</code>)",id:"ticket_mode-string",level:4},{value:"<code>ticket_name</code> (<code>String</code>)",id:"ticket_name-string",level:4},{value:'<code>ticket_types</code> (<code>Array&lt;<a href="/docs/liquid/drops/ticket-type-drop">TicketTypeDrop</a>&gt;</code>)',id:"ticket_types-arraytickettypedrop",level:4},{value:'<code>timespan</code> (<code><a href="/docs/liquid/drops/scheduled-value-timespan-drop">ScheduledValue::TimespanDrop</a></code>)',id:"timespan-scheduledvaluetimespandrop",level:4},{value:"<code>url</code>",id:"url",level:4}],p={toc:u};function v(e){var t=e.components,n=(0,o.Z)(e,a);return(0,r.kt)("wrapper",(0,i.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"The convention itself"),(0,r.kt)("h3",{id:"fields"},"Fields"),(0,r.kt)("h4",{id:"accepting_proposals-boolean"},(0,r.kt)("inlineCode",{parentName:"h4"},"accepting_proposals")," (",(0,r.kt)("code",null,"Boolean"),")"),(0,r.kt)("p",null,"Whether or not the convention is currently accepting event proposals"),(0,r.kt)("h4",{id:"available_products-arrayproductdrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"available_products")," (",(0,r.kt)("code",null,"Array","<",(0,r.kt)("a",{href:"/docs/liquid/drops/product-drop"},"ProductDrop"),">"),")"),(0,r.kt)("p",null,"Products in this convention that are available for purchase"),(0,r.kt)("h4",{id:"bio_eligible_user_con_profiles-arrayuserconprofiledrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"bio_eligible_user_con_profiles")," (",(0,r.kt)("code",null,"Array","<",(0,r.kt)("a",{href:"/docs/liquid/drops/user-con-profile-drop"},"UserConProfileDrop"),">"),")"),(0,r.kt)("p",null,"UserConProfiles in this convention that can have a bio"),(0,r.kt)("h4",{id:"canceled-boolean"},(0,r.kt)("inlineCode",{parentName:"h4"},"canceled")," (",(0,r.kt)("code",null,"Boolean"),")"),(0,r.kt)("p",null,"Whether or not the convention is canceled"),(0,r.kt)("h4",{id:"ended-boolean"},(0,r.kt)("inlineCode",{parentName:"h4"},"ended")," (",(0,r.kt)("code",null,"Boolean"),")"),(0,r.kt)("p",null,"Whether or not the convention has already ended"),(0,r.kt)("h4",{id:"ends_at-activesupporttimewithzone"},(0,r.kt)("inlineCode",{parentName:"h4"},"ends_at")," (",(0,r.kt)("code",null,"ActiveSupport::TimeWithZone"),")"),(0,r.kt)("p",null,"The time at which this convention ends"),(0,r.kt)("h4",{id:"event_categories-arrayeventcategorydrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"event_categories")," (",(0,r.kt)("code",null,"Array","<",(0,r.kt)("a",{href:"/docs/liquid/drops/event-category-drop"},"EventCategoryDrop"),">"),")"),(0,r.kt)("p",null,"Event categories at the convention"),(0,r.kt)("h4",{id:"event_mailing_list_domain-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"event_mailing_list_domain")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,"The domain name this convention uses for automatically-generated event\nmailing lists"),(0,r.kt)("h4",{id:"events-arrayeventdrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"events")," (",(0,r.kt)("code",null,"Array","<",(0,r.kt)("a",{href:"/docs/liquid/drops/event-drop"},"EventDrop"),">"),")"),(0,r.kt)("p",null,"Events at the convention"),(0,r.kt)("h4",{id:"events_created_since-eventscreatedsincedrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"events_created_since")," (",(0,r.kt)("code",null,(0,r.kt)("a",{href:"/docs/liquid/drops/events-created-since-drop"},"EventsCreatedSinceDrop")),")"),(0,r.kt)("p",null,"A structure that lets you access just the events created since\na certain time.  This is much more efficient than using the\nevents method and filtering by created_at."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-liquid",metastring:'title="Retrieving the events created since a certain date"',title:'"Retrieving',the:!0,events:!0,created:!0,since:!0,a:!0,certain:!0,'date"':!0},'{{ convention.events_created_since["2018-11-03T00:00:00-05:00"] }}\n')),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-liquid",metastring:'title="Retrieving the events created since the last signup round opened"',title:'"Retrieving',the:!0,events:!0,created:!0,since:!0,last:!0,signup:!0,round:!0,'opened"':!0},"{{ convention.events_created_since[convention.maximum_event_signups.current_value_change] }}\n")),(0,r.kt)("h4",{id:"id-integer"},(0,r.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,r.kt)("code",null,"Integer"),")"),(0,r.kt)("p",null,"The numeric database id of the convention"),(0,r.kt)("h4",{id:"location-hash"},(0,r.kt)("inlineCode",{parentName:"h4"},"location")," (",(0,r.kt)("code",null,"Hash"),")"),(0,r.kt)("p",null,"A hash value representing this convention's location, suitable for passing\nto the {% map %} tag"),(0,r.kt)("h4",{id:"maximum_event_signups-scheduledvaluedrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"maximum_event_signups")," (",(0,r.kt)("code",null,(0,r.kt)("a",{href:"/docs/liquid/drops/scheduled-value-drop"},"ScheduledValueDrop")),")"),(0,r.kt)("p",null,"The schedule of maximum event signups for this convention"),(0,r.kt)("h4",{id:"name-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"name")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,"The name of the convention"),(0,r.kt)("h4",{id:"non_volunteer_runs_with_openings-arrayrundrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"non_volunteer_runs_with_openings")," (",(0,r.kt)("code",null,"Array","<",(0,r.kt)("a",{href:"/docs/liquid/drops/run-drop"},"RunDrop"),">"),")"),(0,r.kt)("p",null,"Runs of non-volunteer events in this convention that have any available\nslots in limited buckets"),(0,r.kt)("h4",{id:"organization-organizationdrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"organization")," (",(0,r.kt)("code",null,(0,r.kt)("a",{href:"/docs/liquid/drops/organization-drop"},"OrganizationDrop")),")"),(0,r.kt)("p",null,"The organization running this convention"),(0,r.kt)("h4",{id:"products-arrayproductdrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"products")," (",(0,r.kt)("code",null,"Array","<",(0,r.kt)("a",{href:"/docs/liquid/drops/product-drop"},"ProductDrop"),">"),")"),(0,r.kt)("p",null,"All products in this convention"),(0,r.kt)("h4",{id:"run_availabilities-arrayrunavailabilitydrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"run_availabilities")," (",(0,r.kt)("code",null,"Array","<",(0,r.kt)("a",{href:"/docs/liquid/drops/run-availability-drop"},"RunAvailabilityDrop"),">"),")"),(0,r.kt)("p",null,"Run availabilities for this convention"),(0,r.kt)("h4",{id:"run_availabilities_with_any_slots-arrayrunavailabilitydrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"run_availabilities_with_any_slots")," (",(0,r.kt)("code",null,"Array","<",(0,r.kt)("a",{href:"/docs/liquid/drops/run-availability-drop"},"RunAvailabilityDrop"),">"),")"),(0,r.kt)("p",null,"Run availabilities for this convention with any slots\n(counted or not-counted) available"),(0,r.kt)("h4",{id:"run_availabilities_with_counted_slots-arrayrunavailabilitydrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"run_availabilities_with_counted_slots")," (",(0,r.kt)("code",null,"Array","<",(0,r.kt)("a",{href:"/docs/liquid/drops/run-availability-drop"},"RunAvailabilityDrop"),">"),")"),(0,r.kt)("p",null,"Run availabilities for this convention with counted slots\navailable"),(0,r.kt)("h4",{id:"run_availabilities_with_not_counted_slots-arrayrunavailabilitydrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"run_availabilities_with_not_counted_slots")," (",(0,r.kt)("code",null,"Array","<",(0,r.kt)("a",{href:"/docs/liquid/drops/run-availability-drop"},"RunAvailabilityDrop"),">"),")"),(0,r.kt)("p",null,"Run availabilities for this convention with not-counted\nslots available"),(0,r.kt)("h4",{id:"runs-arrayrundrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"runs")," (",(0,r.kt)("code",null,"Array","<",(0,r.kt)("a",{href:"/docs/liquid/drops/run-drop"},"RunDrop"),">"),")"),(0,r.kt)("p",null,"Event runs at the convention"),(0,r.kt)("h4",{id:"runs_with_openings-arrayrundrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"runs_with_openings")," (",(0,r.kt)("code",null,"Array","<",(0,r.kt)("a",{href:"/docs/liquid/drops/run-drop"},"RunDrop"),">"),")"),(0,r.kt)("p",null,"Runs of events in this convention that have any available slots in\nlimited buckets"),(0,r.kt)("h4",{id:"show_event_list-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"show_event_list")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,'"no", "priv", "gms", or "yes" depending on who the event list is visible to'),(0,r.kt)("h4",{id:"show_schedule-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"show_schedule")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,'"no", "priv", "gms", or "yes" depending on who the schedule is visible to'),(0,r.kt)("h4",{id:"staff_positions-arraystaffpositiondrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"staff_positions")," (",(0,r.kt)("code",null,"Array","<",(0,r.kt)("a",{href:"/docs/liquid/drops/staff-position-drop"},"StaffPositionDrop"),">"),")"),(0,r.kt)("p",null,"All staff positions in this convention"),(0,r.kt)("h4",{id:"staff_positions_by_name-hashstring-staffpositiondrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"staff_positions_by_name")," (",(0,r.kt)("code",null,"Hash<String, StaffPositionDrop>"),")"),(0,r.kt)("p",null,"All staff positions in this convention, indexed by\nname (all lowercase, spaces replaced with underscores)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-liquid",metastring:'title="Retrieving the vendor liaison email address for a convention"',title:'"Retrieving',the:!0,vendor:!0,liaison:!0,email:!0,address:!0,for:!0,a:!0,'convention"':!0},"{{ convention.staff_positions_by_name.vendor_liaison.email }}\n")),(0,r.kt)("h4",{id:"started-boolean"},(0,r.kt)("inlineCode",{parentName:"h4"},"started")," (",(0,r.kt)("code",null,"Boolean"),")"),(0,r.kt)("p",null,"Whether or not the convention has already started"),(0,r.kt)("h4",{id:"starts_at-activesupporttimewithzone"},(0,r.kt)("inlineCode",{parentName:"h4"},"starts_at")," (",(0,r.kt)("code",null,"ActiveSupport::TimeWithZone"),")"),(0,r.kt)("p",null,"The time at which this convention starts"),(0,r.kt)("h4",{id:"ticket_counts_by_type-hashstring-integer"},(0,r.kt)("inlineCode",{parentName:"h4"},"ticket_counts_by_type")," (",(0,r.kt)("code",null,"Hash<String, Integer>"),")"),(0,r.kt)("p",null,"The number of tickets that have been issued in this convention,\nindexed by ticket type name"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-liquid",metastring:'title="Retrieving the count of weekend tickets for a convention"',title:'"Retrieving',the:!0,count:!0,of:!0,weekend:!0,tickets:!0,for:!0,a:!0,'convention"':!0},"{{ convention.ticket_counts_by_type.weekend }}\n")),(0,r.kt)("h4",{id:"ticket_mode-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"ticket_mode")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,"How tickets are handled in this convention (possible values are 'disabled'\nand 'required_for_signup')"),(0,r.kt)("h4",{id:"ticket_name-string"},(0,r.kt)("inlineCode",{parentName:"h4"},"ticket_name")," (",(0,r.kt)("code",null,"String"),")"),(0,r.kt)("p",null,'The name this convention uses for "tickets"'),(0,r.kt)("h4",{id:"ticket_types-arraytickettypedrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"ticket_types")," (",(0,r.kt)("code",null,"Array","<",(0,r.kt)("a",{href:"/docs/liquid/drops/ticket-type-drop"},"TicketTypeDrop"),">"),")"),(0,r.kt)("p",null,"All ticket types for this convention"),(0,r.kt)("h4",{id:"timespan-scheduledvaluetimespandrop"},(0,r.kt)("inlineCode",{parentName:"h4"},"timespan")," (",(0,r.kt)("code",null,(0,r.kt)("a",{href:"/docs/liquid/drops/scheduled-value-timespan-drop"},"ScheduledValue",":",":","TimespanDrop")),")"),(0,r.kt)("p",null,"The time span of the convention"),(0,r.kt)("h4",{id:"url"},(0,r.kt)("inlineCode",{parentName:"h4"},"url")),(0,r.kt)("p",null,"String The root URL for this convention"))}v.isMDXComponent=!0}}]);