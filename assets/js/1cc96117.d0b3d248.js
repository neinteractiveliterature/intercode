"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[3488],{75631:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>h});var n=a(3289);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function d(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=n.createContext({}),s=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},c=function(e){var t=s(e.components);return n.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,c=d(e,["components","mdxType","originalType","parentName"]),p=s(a),h=r,k=p["".concat(l,".").concat(h)]||p[h]||m[h]||i;return a?n.createElement(k,o(o({ref:t},c),{},{components:a})):n.createElement(k,o({ref:t},c))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,o=new Array(i);o[0]=p;var d={};for(var l in t)hasOwnProperty.call(t,l)&&(d[l]=t[l]);d.originalType=e,d.mdxType="string"==typeof e?e:r,o[1]=d;for(var s=2;s<i;s++)o[s]=a[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}p.displayName="MDXCreateElement"},9638:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>d,toc:()=>s});var n=a(60953),r=(a(3289),a(75631));const i={id:"event",title:"Event",hide_table_of_contents:!1},o=void 0,d={unversionedId:"graphql/objects/event",id:"graphql/objects/event",title:"Event",description:"No description",source:"@site/docs/graphql/objects/event.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/event",permalink:"/docs/graphql/objects/event",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/event.mdx",tags:[],version:"current",frontMatter:{id:"event",title:"Event",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"EventWithChoiceCounts",permalink:"/docs/graphql/objects/event-with-choice-counts"},next:{title:"EventsPagination",permalink:"/docs/graphql/objects/events-pagination"}},l={},s=[{value:"Fields",id:"fields",level:3},{value:"<code>admin_notes</code> (<code>String</code>)",id:"admin_notes-string",level:4},{value:"<code>age_restrictions</code> (<code>String</code>)",id:"age_restrictions-string",level:4},{value:"<code>author</code> (<code>String</code>)",id:"author-string",level:4},{value:"<code>can_play_concurrently</code> (<code>Boolean!</code>)",id:"can_play_concurrently-boolean",level:4},{value:"<code>con_mail_destination</code> (<code>String</code>)",id:"con_mail_destination-string",level:4},{value:"<code>content_warnings</code> (<code>String</code>)",id:"content_warnings-string",level:4},{value:"<code>created_at</code> (<code>Date</code>)",id:"created_at-date",level:4},{value:"<code>current_user_form_item_viewer_role</code> (<code>FormItemRole!</code>)",id:"current_user_form_item_viewer_role-formitemrole",level:4},{value:"<code>current_user_form_item_writer_role</code> (<code>FormItemRole!</code>)",id:"current_user_form_item_writer_role-formitemrole",level:4},{value:"<code>description</code> (<code>String</code>)",id:"description-string",level:4},{value:"<code>description_html</code> (<code>String</code>)",id:"description_html-string",level:4},{value:"<code>email</code> (<code>String</code>)",id:"email-string",level:4},{value:"<code>event_category</code> (<code>EventCategory!</code>)",id:"event_category-eventcategory",level:4},{value:"<code>form</code> (<code>Form</code>)",id:"form-form",level:4},{value:"<code>form_response_attrs_json</code> (<code>Json</code>)",id:"form_response_attrs_json-json",level:4},{value:"<code>form_response_attrs_json_with_rendered_markdown</code> (<code>Json</code>)",id:"form_response_attrs_json_with_rendered_markdown-json",level:4},{value:"<code>form_response_changes</code> (<code>[FormResponseChange!]!</code>)",id:"form_response_changes-formresponsechange",level:4},{value:"<code>id</code> (<code>ID!</code>)",id:"id-id",level:4},{value:"<code>images</code> (<code>[ActiveStorageAttachment!]!</code>)",id:"images-activestorageattachment",level:4},{value:"<code>length_seconds</code> (<code>Int!</code>)",id:"length_seconds-int",level:4},{value:"<code>maximum_event_provided_tickets_overrides</code> (<code>[MaximumEventProvidedTicketsOverride!]!</code>)",id:"maximum_event_provided_tickets_overrides-maximumeventprovidedticketsoverride",level:4},{value:"<code>my_rating</code> (<code>Int</code>)",id:"my_rating-int",level:4},{value:"<code>organization</code> (<code>String</code>)",id:"organization-string",level:4},{value:"<code>participant_communications</code> (<code>String</code>)",id:"participant_communications-string",level:4},{value:"<code>private_signup_list</code> (<code>Boolean</code>)",id:"private_signup_list-boolean",level:4},{value:"<code>provided_tickets</code> (<code>[Ticket!]!</code>)",id:"provided_tickets-ticket",level:4},{value:"<code>registration_policy</code> (<code>RegistrationPolicy</code>)",id:"registration_policy-registrationpolicy",level:4},{value:"<code>run</code> (<code>Run!</code>)",id:"run-run",level:4},{value:"<code>runs</code> (<code>[Run!]!</code>)",id:"runs-run",level:4},{value:"<code>short_blurb</code> (<code>String</code>)",id:"short_blurb-string",level:4},{value:"<code>short_blurb_html</code> (<code>String</code>)",id:"short_blurb_html-string",level:4},{value:"<code>slots_limited</code> (<code>Boolean</code>)",id:"slots_limited-boolean",level:4},{value:"<code>status</code> (<code>String</code>)",id:"status-string",level:4},{value:"<code>team_members</code> (<code>[TeamMember!]!</code>)",id:"team_members-teammember",level:4},{value:"<code>ticket_types</code> (<code>[TicketType!]!</code>)",id:"ticket_types-tickettype",level:4},{value:"<code>title</code> (<code>String</code>)",id:"title-string",level:4},{value:"<code>total_slots</code> (<code>Int</code>)",id:"total_slots-int",level:4},{value:"<code>url</code> (<code>String</code>)",id:"url-string",level:4}],c={toc:s};function m(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"No description"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-graphql"},"type Event {\n  admin_notes: String\n  age_restrictions: String\n  author: String\n  can_play_concurrently: Boolean!\n  con_mail_destination: String\n  content_warnings: String\n  created_at: Date\n  current_user_form_item_viewer_role: FormItemRole!\n  current_user_form_item_writer_role: FormItemRole!\n  description: String\n  description_html: String\n  email: String\n  event_category: EventCategory!\n  form: Form\n  form_response_attrs_json: Json\n  form_response_attrs_json_with_rendered_markdown: Json\n  form_response_changes: [FormResponseChange!]!\n  id: ID!\n  images: [ActiveStorageAttachment!]!\n  length_seconds: Int!\n  maximum_event_provided_tickets_overrides: [MaximumEventProvidedTicketsOverride!]!\n  my_rating: Int\n  organization: String\n  participant_communications: String\n  private_signup_list: Boolean\n  provided_tickets: [Ticket!]!\n  registration_policy: RegistrationPolicy\n  run(\n  id: ID\n): Run!\n  runs(\n  excludeConflicts: Boolean\n  finish: Date\n  start: Date\n): [Run!]!\n  short_blurb: String\n  short_blurb_html: String\n  slots_limited: Boolean\n  status: String\n  team_members: [TeamMember!]!\n  ticket_types: [TicketType!]!\n  title: String\n  total_slots: Int\n  url: String\n}\n")),(0,r.kt)("h3",{id:"fields"},"Fields"),(0,r.kt)("h4",{id:"admin_notes-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"admin_notes"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"age_restrictions-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"age_restrictions"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"author-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"author"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"can_play_concurrently-boolean"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"can_play_concurrently"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,r.kt)("inlineCode",{parentName:"a"},"Boolean!")),")"),(0,r.kt)("h4",{id:"con_mail_destination-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"con_mail_destination"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"content_warnings-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"content_warnings"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"created_at-date"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"created_at"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/date"},(0,r.kt)("inlineCode",{parentName:"a"},"Date")),")"),(0,r.kt)("h4",{id:"current_user_form_item_viewer_role-formitemrole"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"current_user_form_item_viewer_role"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/enums/form-item-role"},(0,r.kt)("inlineCode",{parentName:"a"},"FormItemRole!")),")"),(0,r.kt)("h4",{id:"current_user_form_item_writer_role-formitemrole"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"current_user_form_item_writer_role"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/enums/form-item-role"},(0,r.kt)("inlineCode",{parentName:"a"},"FormItemRole!")),")"),(0,r.kt)("h4",{id:"description-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"description"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"description_html-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"description_html"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"email-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"email"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"event_category-eventcategory"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"event_category"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/event-category"},(0,r.kt)("inlineCode",{parentName:"a"},"EventCategory!")),")"),(0,r.kt)("h4",{id:"form-form"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"form"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/form"},(0,r.kt)("inlineCode",{parentName:"a"},"Form")),")"),(0,r.kt)("h4",{id:"form_response_attrs_json-json"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"form_response_attrs_json"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/json"},(0,r.kt)("inlineCode",{parentName:"a"},"Json")),")"),(0,r.kt)("h4",{id:"form_response_attrs_json_with_rendered_markdown-json"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"form_response_attrs_json_with_rendered_markdown"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/json"},(0,r.kt)("inlineCode",{parentName:"a"},"Json")),")"),(0,r.kt)("h4",{id:"form_response_changes-formresponsechange"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"form_response_changes"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/form-response-change"},(0,r.kt)("inlineCode",{parentName:"a"},"[FormResponseChange!]!")),")"),(0,r.kt)("h4",{id:"id-id"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"id"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,r.kt)("inlineCode",{parentName:"a"},"ID!")),")"),(0,r.kt)("h4",{id:"images-activestorageattachment"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"images"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/active-storage-attachment"},(0,r.kt)("inlineCode",{parentName:"a"},"[ActiveStorageAttachment!]!")),")"),(0,r.kt)("h4",{id:"length_seconds-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"length_seconds"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int!")),")"),(0,r.kt)("h4",{id:"maximum_event_provided_tickets_overrides-maximumeventprovidedticketsoverride"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"maximum_event_provided_tickets_overrides"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/maximum-event-provided-tickets-override"},(0,r.kt)("inlineCode",{parentName:"a"},"[MaximumEventProvidedTicketsOverride!]!")),")"),(0,r.kt)("h4",{id:"my_rating-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"my_rating"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,r.kt)("h4",{id:"organization-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"organization"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"participant_communications-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"participant_communications"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"private_signup_list-boolean"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"private_signup_list"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,r.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,r.kt)("h4",{id:"provided_tickets-ticket"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"provided_tickets"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/ticket"},(0,r.kt)("inlineCode",{parentName:"a"},"[Ticket!]!")),")"),(0,r.kt)("h4",{id:"registration_policy-registrationpolicy"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"registration_policy"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/registration-policy"},(0,r.kt)("inlineCode",{parentName:"a"},"RegistrationPolicy")),")"),(0,r.kt)("h4",{id:"run-run"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"run"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/run"},(0,r.kt)("inlineCode",{parentName:"a"},"Run!")),")"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"id-id-1"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"id"))," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/id"},(0,r.kt)("inlineCode",{parentName:"a"},"ID")),")"))),(0,r.kt)("h4",{id:"runs-run"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"runs"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/run"},(0,r.kt)("inlineCode",{parentName:"a"},"[Run!]!")),")"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"excludeconflicts-boolean"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"excludeConflicts"))," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/boolean"},(0,r.kt)("inlineCode",{parentName:"a"},"Boolean")),")"))),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"finish-date"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"finish"))," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/date"},(0,r.kt)("inlineCode",{parentName:"a"},"Date")),")"))),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"start-date"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"start"))," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/date"},(0,r.kt)("inlineCode",{parentName:"a"},"Date")),")"))),(0,r.kt)("h4",{id:"short_blurb-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"short_blurb"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"short_blurb_html-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"short_blurb_html"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"slots_limited-boolean"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"slots_limited"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,r.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,r.kt)("h4",{id:"status-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"status"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"team_members-teammember"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"team_members"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/team-member"},(0,r.kt)("inlineCode",{parentName:"a"},"[TeamMember!]!")),")"),(0,r.kt)("h4",{id:"ticket_types-tickettype"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"ticket_types"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/ticket-type"},(0,r.kt)("inlineCode",{parentName:"a"},"[TicketType!]!")),")"),(0,r.kt)("h4",{id:"title-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"title"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,r.kt)("h4",{id:"total_slots-int"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"total_slots"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,r.kt)("h4",{id:"url-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"url"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"))}m.isMDXComponent=!0}}]);