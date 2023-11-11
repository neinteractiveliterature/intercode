"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[84904],{75631:(e,t,a)=>{a.d(t,{Zo:()=>i,kt:()=>y});var n=a(45721);function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function r(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function c(e,t){if(null==e)return{};var a,n,o=function(e,t){if(null==e)return{};var a,n,o={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(o[a]=e[a]);return o}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(o[a]=e[a])}return o}var d=n.createContext({}),s=function(e){var t=n.useContext(d),a=t;return e&&(a="function"==typeof e?e(t):r(r({},t),e)),a},i=function(e){var t=s(e.components);return n.createElement(d.Provider,{value:t},e.children)},g="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,o=e.mdxType,l=e.originalType,d=e.parentName,i=c(e,["components","mdxType","originalType","parentName"]),g=s(a),m=o,y=g["".concat(d,".").concat(m)]||g[m]||p[m]||l;return a?n.createElement(y,r(r({ref:t},i),{},{components:a})):n.createElement(y,r({ref:t},i))}));function y(e,t){var a=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var l=a.length,r=new Array(l);r[0]=m;var c={};for(var d in t)hasOwnProperty.call(t,d)&&(c[d]=t[d]);c.originalType=e,c[g]="string"==typeof e?e:o,r[1]=c;for(var s=2;s<l;s++)r[s]=a[s];return n.createElement.apply(null,r)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},46510:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>m,Bullet:()=>g,SpecifiedBy:()=>p,assets:()=>s,contentTitle:()=>c,default:()=>k,frontMatter:()=>r,metadata:()=>d,toc:()=>i});var n=a(11330),o=a(45721),l=a(75631);const r={id:"event-category",title:"EventCategory",hide_table_of_contents:!1},c=void 0,d={unversionedId:"graphql/objects/event-category",id:"graphql/objects/event-category",title:"EventCategory",description:"No description",source:"@site/docs/graphql/objects/event-category.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/event-category",permalink:"/docs/graphql/objects/event-category",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/event-category.mdx",tags:[],version:"current",frontMatter:{id:"event-category",title:"EventCategory",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"EmailRoutesPagination",permalink:"/docs/graphql/objects/email-routes-pagination"},next:{title:"EventProposal",permalink:"/docs/graphql/objects/event-proposal"}},s={},i=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>can_provide_tickets</b></code><Bullet /><code>Boolean!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventcategorybcan_provide_ticketsbcodeboolean--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>convention</b></code><Bullet /><code>Convention!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-eventcategorybconventionbcodeconvention--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>default_color</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventcategorybdefault_colorbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>department</b></code><Bullet /><code>Department</code> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-eventcategorybdepartmentbcodedepartment-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>event_form</b></code><Bullet /><code>Form!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-eventcategorybevent_formbcodeform--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>event_proposal_form</b></code><Bullet /><code>Form</code> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-eventcategorybevent_proposal_formbcodeform-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>events_paginated</b></code><Bullet /><code>EventsPagination!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-eventcategorybevents_paginatedbcodeeventspagination--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.events_paginated.<b>page</b></code><Bullet /><code>Int</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventcategoryevents_paginatedbpagebcodeint-",level:5},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.events_paginated.<b>per_page</b></code><Bullet /><code>Int</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventcategoryevents_paginatedbper_pagebcodeint-",level:5},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.events_paginated.<b>sort</b></code><Bullet /><code>[SortInput!]</code> <Badge class="secondary" text="list"/> <Badge class="secondary" text="input"/>',id:"code-style-fontweight-normal-eventcategoryevents_paginatedbsortbcodesortinput--",level:5},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>full_color</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventcategorybfull_colorbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>id</b></code><Bullet /><code>ID!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventcategorybidbcodeid--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>name</b></code><Bullet /><code>String!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventcategorybnamebcodestring--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>proposable</b></code><Bullet /><code>Boolean!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventcategorybproposablebcodeboolean--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>proposal_description</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventcategorybproposal_descriptionbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>scheduling_ui</b></code><Bullet /><code>SchedulingUi!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="enum"/>',id:"code-style-fontweight-normal-eventcategorybscheduling_uibcodeschedulingui--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>signed_up_color</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventcategorybsigned_up_colorbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>teamMemberNamePlural</b></code><Bullet /><code>String!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventcategorybteammembernamepluralbcodestring--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventCategory.<b>team_member_name</b></code><Bullet /><code>String!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventcategorybteam_member_namebcodestring--",level:4},{value:"Member of",id:"member-of",level:3},{value:"Implemented by",id:"implemented-by",level:3}],g=()=>(0,l.kt)(o.Fragment,null,(0,l.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),p=e=>(0,l.kt)(o.Fragment,null,"Specification",(0,l.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),m=e=>(0,l.kt)(o.Fragment,null,(0,l.kt)("span",{class:"badge badge--"+e.class},e.text)),y={toc:i,Bullet:g,SpecifiedBy:p,Badge:m},u="wrapper";function k(e){let{components:t,...a}=e;return(0,l.kt)(u,(0,n.Z)({},y,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"No description"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-graphql"},"type EventCategory {\n  can_provide_tickets: Boolean!\n  convention: Convention!\n  default_color: String\n  department: Department\n  event_form: Form!\n  event_proposal_form: Form\n  events_paginated(\n  filters: EventFiltersInput\n  page: Int\n  per_page: Int\n  sort: [SortInput!]\n): EventsPagination!\n  full_color: String\n  id: ID!\n  name: String!\n  proposable: Boolean!\n  proposal_description: String\n  scheduling_ui: SchedulingUi!\n  signed_up_color: String\n  teamMemberNamePlural: String!\n  team_member_name: String!\n}\n")),(0,l.kt)("h3",{id:"fields"},"Fields"),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybcan_provide_ticketsbcodeboolean--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"can_provide_tickets"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,l.kt)("inlineCode",{parentName:"a"},"Boolean!"))," ",(0,l.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybconventionbcodeconvention--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"convention"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/convention"},(0,l.kt)("inlineCode",{parentName:"a"},"Convention!"))," ",(0,l.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybdefault_colorbcodestring-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"default_color"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,l.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,l.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybdepartmentbcodedepartment-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"department"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/department"},(0,l.kt)("inlineCode",{parentName:"a"},"Department"))," ",(0,l.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybevent_formbcodeform--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"event_form"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/form"},(0,l.kt)("inlineCode",{parentName:"a"},"Form!"))," ",(0,l.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybevent_proposal_formbcodeform-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"event_proposal_form"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/form"},(0,l.kt)("inlineCode",{parentName:"a"},"Form"))," ",(0,l.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybevents_paginatedbcodeeventspagination--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"events_paginated"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/events-pagination"},(0,l.kt)("inlineCode",{parentName:"a"},"EventsPagination!"))," ",(0,l.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("blockquote",null,(0,l.kt)("h5",{parentName:"blockquote",id:"code-style-fontweight-normal-eventcategoryevents_paginatedbfiltersbcodeeventfiltersinput-"},(0,l.kt)("a",{parentName:"h5",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.events_paginated.",(0,l.kt)("b",null,"filters"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h5",href:"/docs/graphql/inputs/event-filters-input"},(0,l.kt)("inlineCode",{parentName:"a"},"EventFiltersInput"))," ",(0,l.kt)(m,{class:"secondary",text:"input",mdxType:"Badge"})),(0,l.kt)("p",{parentName:"blockquote"},"Filters to restrict what items will appear in the result set.")),(0,l.kt)("h5",{id:"code-style-fontweight-normal-eventcategoryevents_paginatedbpagebcodeint-"},(0,l.kt)("a",{parentName:"h5",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.events_paginated.",(0,l.kt)("b",null,"page"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/int"},(0,l.kt)("inlineCode",{parentName:"a"},"Int"))," ",(0,l.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"The page number to return from the result set.  Page numbers start with 1.")),(0,l.kt)("h5",{id:"code-style-fontweight-normal-eventcategoryevents_paginatedbper_pagebcodeint-"},(0,l.kt)("a",{parentName:"h5",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.events_paginated.",(0,l.kt)("b",null,"per_page"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/int"},(0,l.kt)("inlineCode",{parentName:"a"},"Int"))," ",(0,l.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"The number of items to return per page.  Defaults to 20, can go up to 200.")),(0,l.kt)("h5",{id:"code-style-fontweight-normal-eventcategoryevents_paginatedbsortbcodesortinput--"},(0,l.kt)("a",{parentName:"h5",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.events_paginated.",(0,l.kt)("b",null,"sort"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h5",href:"/docs/graphql/inputs/sort-input"},(0,l.kt)("inlineCode",{parentName:"a"},"[SortInput!]"))," ",(0,l.kt)(m,{class:"secondary",text:"list",mdxType:"Badge"})," ",(0,l.kt)(m,{class:"secondary",text:"input",mdxType:"Badge"})),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"A set of fields to use for ordering the result set. The second field is used as a\ntiebreaker for the first, the third field is used as a tiebreaker for the first two,\nand so on. If the sort argument is missing or empty, the order of items will be left\nup to the database (and may be unpredictable).")),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybfull_colorbcodestring-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"full_color"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,l.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,l.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybidbcodeid--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"id"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,l.kt)("inlineCode",{parentName:"a"},"ID!"))," ",(0,l.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybnamebcodestring--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"name"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,l.kt)("inlineCode",{parentName:"a"},"String!"))," ",(0,l.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybproposablebcodeboolean--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"proposable"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,l.kt)("inlineCode",{parentName:"a"},"Boolean!"))," ",(0,l.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybproposal_descriptionbcodestring-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"proposal_description"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,l.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,l.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybscheduling_uibcodeschedulingui--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"scheduling_ui"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/enums/scheduling-ui"},(0,l.kt)("inlineCode",{parentName:"a"},"SchedulingUi!"))," ",(0,l.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(m,{class:"secondary",text:"enum",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybsigned_up_colorbcodestring-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"signed_up_color"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,l.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,l.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybteammembernamepluralbcodestring--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"teamMemberNamePlural"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,l.kt)("inlineCode",{parentName:"a"},"String!"))," ",(0,l.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventcategorybteam_member_namebcodestring--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventCategory.",(0,l.kt)("b",null,"team_member_name"))),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,l.kt)("inlineCode",{parentName:"a"},"String!"))," ",(0,l.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h3",{id:"member-of"},"Member of"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/convention"},(0,l.kt)("inlineCode",{parentName:"a"},"Convention")),"  ",(0,l.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/create-event-category-payload"},(0,l.kt)("inlineCode",{parentName:"a"},"CreateEventCategoryPayload")),"  ",(0,l.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/delete-event-category-payload"},(0,l.kt)("inlineCode",{parentName:"a"},"DeleteEventCategoryPayload")),"  ",(0,l.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/department"},(0,l.kt)("inlineCode",{parentName:"a"},"Department")),"  ",(0,l.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/event"},(0,l.kt)("inlineCode",{parentName:"a"},"Event")),"  ",(0,l.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/event-proposal"},(0,l.kt)("inlineCode",{parentName:"a"},"EventProposal")),"  ",(0,l.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/form"},(0,l.kt)("inlineCode",{parentName:"a"},"Form")),"  ",(0,l.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(g,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/update-event-category-payload"},(0,l.kt)("inlineCode",{parentName:"a"},"UpdateEventCategoryPayload")),"  ",(0,l.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("h3",{id:"implemented-by"},"Implemented by"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/unions/permissioned-model"},(0,l.kt)("inlineCode",{parentName:"a"},"PermissionedModel")),"  ",(0,l.kt)(m,{class:"secondary",text:"union",mdxType:"Badge"})))}k.isMDXComponent=!0}}]);