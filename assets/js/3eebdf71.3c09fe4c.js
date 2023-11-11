"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[29124],{75631:(e,t,o)=>{o.d(t,{Zo:()=>p,kt:()=>g});var a=o(45721);function n(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function l(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,a)}return o}function r(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?l(Object(o),!0).forEach((function(t){n(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):l(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function s(e,t){if(null==e)return{};var o,a,n=function(e,t){if(null==e)return{};var o,a,n={},l=Object.keys(e);for(a=0;a<l.length;a++)o=l[a],t.indexOf(o)>=0||(n[o]=e[o]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)o=l[a],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(n[o]=e[o])}return n}var d=a.createContext({}),c=function(e){var t=a.useContext(d),o=t;return e&&(o="function"==typeof e?e(t):r(r({},t),e)),o},p=function(e){var t=c(e.components);return a.createElement(d.Provider,{value:t},e.children)},i="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},y=a.forwardRef((function(e,t){var o=e.components,n=e.mdxType,l=e.originalType,d=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),i=c(o),y=n,g=i["".concat(d,".").concat(y)]||i[y]||m[y]||l;return o?a.createElement(g,r(r({ref:t},p),{},{components:o})):a.createElement(g,r({ref:t},p))}));function g(e,t){var o=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=o.length,r=new Array(l);r[0]=y;var s={};for(var d in t)hasOwnProperty.call(t,d)&&(s[d]=t[d]);s.originalType=e,s[i]="string"==typeof e?e:n,r[1]=s;for(var c=2;c<l;c++)r[c]=o[c];return a.createElement.apply(null,r)}return a.createElement.apply(null,o)}y.displayName="MDXCreateElement"},4914:(e,t,o)=>{o.r(t),o.d(t,{Badge:()=>y,Bullet:()=>i,SpecifiedBy:()=>m,assets:()=>c,contentTitle:()=>s,default:()=>h,frontMatter:()=>r,metadata:()=>d,toc:()=>p});var a=o(11330),n=o(45721),l=o(75631);const r={id:"event-proposal",title:"EventProposal",hide_table_of_contents:!1},s=void 0,d={unversionedId:"graphql/objects/event-proposal",id:"graphql/objects/event-proposal",title:"EventProposal",description:"No description",source:"@site/docs/graphql/objects/event-proposal.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/event-proposal",permalink:"/docs/graphql/objects/event-proposal",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/event-proposal.mdx",tags:[],version:"current",frontMatter:{id:"event-proposal",title:"EventProposal",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"EventCategory",permalink:"/docs/graphql/objects/event-category"},next:{title:"EventProposalsPagination",permalink:"/docs/graphql/objects/event-proposals-pagination"}},c={},p=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>admin_notes</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventproposalbadmin_notesbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>convention</b></code><Bullet /><code>Convention!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-eventproposalbconventionbcodeconvention--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>created_at</b></code><Bullet /><code>Date!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventproposalbcreated_atbcodedate--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>current_user_form_item_viewer_role</b></code><Bullet /><code>FormItemRole!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="enum"/>',id:"code-style-fontweight-normal-eventproposalbcurrent_user_form_item_viewer_rolebcodeformitemrole--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>current_user_form_item_writer_role</b></code><Bullet /><code>FormItemRole!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="enum"/>',id:"code-style-fontweight-normal-eventproposalbcurrent_user_form_item_writer_rolebcodeformitemrole--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>event</b></code><Bullet /><code>Event</code> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-eventproposalbeventbcodeevent-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>event_category</b></code><Bullet /><code>EventCategory!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-eventproposalbevent_categorybcodeeventcategory--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>form</b></code><Bullet /><code>Form</code> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-eventproposalbformbcodeform-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>form_response_attrs_json</b></code><Bullet /><code>Json</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventproposalbform_response_attrs_jsonbcodejson-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>form_response_attrs_json_with_rendered_markdown</b></code><Bullet /><code>Json</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventproposalbform_response_attrs_json_with_rendered_markdownbcodejson-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>form_response_changes</b></code><Bullet /><code>[FormResponseChange!]!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-eventproposalbform_response_changesbcodeformresponsechange--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>id</b></code><Bullet /><code>ID!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventproposalbidbcodeid--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>images</b></code><Bullet /><code>[ActiveStorageAttachment!]!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-eventproposalbimagesbcodeactivestorageattachment--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>length_seconds</b></code><Bullet /><code>Int</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventproposalblength_secondsbcodeint-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>owner</b></code><Bullet /><code>UserConProfile!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-eventproposalbownerbcodeuserconprofile--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>registration_policy</b></code><Bullet /><code>RegistrationPolicy</code> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-eventproposalbregistration_policybcoderegistrationpolicy-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>status</b></code><Bullet /><code>String!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventproposalbstatusbcodestring--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>submitted_at</b></code><Bullet /><code>Date</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventproposalbsubmitted_atbcodedate-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>title</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventproposalbtitlebcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposal.<b>updated_at</b></code><Bullet /><code>Date!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventproposalbupdated_atbcodedate--",level:4},{value:"Member of",id:"member-of",level:3},{value:"Implemented by",id:"implemented-by",level:3}],i=()=>(0,l.kt)(n.Fragment,null,(0,l.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),m=e=>(0,l.kt)(n.Fragment,null,"Specification",(0,l.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),y=e=>(0,l.kt)(n.Fragment,null,(0,l.kt)("span",{class:"badge badge--"+e.class},e.text)),g={toc:p,Bullet:i,SpecifiedBy:m,Badge:y},k="wrapper";function h(e){let{components:t,...o}=e;return(0,l.kt)(k,(0,a.Z)({},g,o,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"No description"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-graphql"},"type EventProposal {\n  admin_notes: String\n  convention: Convention!\n  created_at: Date!\n  current_user_form_item_viewer_role: FormItemRole!\n  current_user_form_item_writer_role: FormItemRole!\n  event: Event\n  event_category: EventCategory!\n  form: Form\n  form_response_attrs_json(\n  itemIdentifiers: [String!]\n): Json\n  form_response_attrs_json_with_rendered_markdown(\n  itemIdentifiers: [String!]\n): Json\n  form_response_changes: [FormResponseChange!]!\n  id: ID!\n  images: [ActiveStorageAttachment!]!\n  length_seconds: Int\n  owner: UserConProfile!\n  registration_policy: RegistrationPolicy\n  status: String!\n  submitted_at: Date\n  title: String\n  updated_at: Date!\n}\n")),(0,l.kt)("h3",{id:"fields"},"Fields"),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbadmin_notesbcodestring-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"admin_notes"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,l.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,l.kt)(y,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbconventionbcodeconvention--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"convention"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/convention"},(0,l.kt)("inlineCode",{parentName:"a"},"Convention!"))," ",(0,l.kt)(y,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbcreated_atbcodedate--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"created_at"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/date"},(0,l.kt)("inlineCode",{parentName:"a"},"Date!"))," ",(0,l.kt)(y,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(y,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbcurrent_user_form_item_viewer_rolebcodeformitemrole--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"current_user_form_item_viewer_role"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/enums/form-item-role"},(0,l.kt)("inlineCode",{parentName:"a"},"FormItemRole!"))," ",(0,l.kt)(y,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(y,{class:"secondary",text:"enum",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbcurrent_user_form_item_writer_rolebcodeformitemrole--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"current_user_form_item_writer_role"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/enums/form-item-role"},(0,l.kt)("inlineCode",{parentName:"a"},"FormItemRole!"))," ",(0,l.kt)(y,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(y,{class:"secondary",text:"enum",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbeventbcodeevent-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"event"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/event"},(0,l.kt)("inlineCode",{parentName:"a"},"Event"))," ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbevent_categorybcodeeventcategory--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"event_category"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/event-category"},(0,l.kt)("inlineCode",{parentName:"a"},"EventCategory!"))," ",(0,l.kt)(y,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbformbcodeform-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"form"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/form"},(0,l.kt)("inlineCode",{parentName:"a"},"Form"))," ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbform_response_attrs_jsonbcodejson-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"form_response_attrs_json"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/json"},(0,l.kt)("inlineCode",{parentName:"a"},"Json"))," ",(0,l.kt)(y,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null,(0,l.kt)("h5",{parentName:"blockquote",id:"code-style-fontweight-normal-eventproposalform_response_attrs_jsonbitemidentifiersbcodestring--"},(0,l.kt)("a",{parentName:"h5",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.form_response_attrs_json.",(0,l.kt)("b",null,"itemIdentifiers"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/string"},(0,l.kt)("inlineCode",{parentName:"a"},"[String!]"))," ",(0,l.kt)(y,{class:"secondary",text:"list",mdxType:"Badge"})," ",(0,l.kt)(y,{class:"secondary",text:"scalar",mdxType:"Badge"}))),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbform_response_attrs_json_with_rendered_markdownbcodejson-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"form_response_attrs_json_with_rendered_markdown"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/json"},(0,l.kt)("inlineCode",{parentName:"a"},"Json"))," ",(0,l.kt)(y,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null,(0,l.kt)("h5",{parentName:"blockquote",id:"code-style-fontweight-normal-eventproposalform_response_attrs_json_with_rendered_markdownbitemidentifiersbcodestring--"},(0,l.kt)("a",{parentName:"h5",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.form_response_attrs_json_with_rendered_markdown.",(0,l.kt)("b",null,"itemIdentifiers"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/string"},(0,l.kt)("inlineCode",{parentName:"a"},"[String!]"))," ",(0,l.kt)(y,{class:"secondary",text:"list",mdxType:"Badge"})," ",(0,l.kt)(y,{class:"secondary",text:"scalar",mdxType:"Badge"}))),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbform_response_changesbcodeformresponsechange--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"form_response_changes"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/form-response-change"},(0,l.kt)("inlineCode",{parentName:"a"},"[FormResponseChange!]!"))," ",(0,l.kt)(y,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbidbcodeid--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"id"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,l.kt)("inlineCode",{parentName:"a"},"ID!"))," ",(0,l.kt)(y,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(y,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbimagesbcodeactivestorageattachment--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"images"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/active-storage-attachment"},(0,l.kt)("inlineCode",{parentName:"a"},"[ActiveStorageAttachment!]!"))," ",(0,l.kt)(y,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalblength_secondsbcodeint-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"length_seconds"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,l.kt)("inlineCode",{parentName:"a"},"Int"))," ",(0,l.kt)(y,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbownerbcodeuserconprofile--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"owner"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/user-con-profile"},(0,l.kt)("inlineCode",{parentName:"a"},"UserConProfile!"))," ",(0,l.kt)(y,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbregistration_policybcoderegistrationpolicy-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"registration_policy"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/registration-policy"},(0,l.kt)("inlineCode",{parentName:"a"},"RegistrationPolicy"))," ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbstatusbcodestring--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"status"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,l.kt)("inlineCode",{parentName:"a"},"String!"))," ",(0,l.kt)(y,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(y,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbsubmitted_atbcodedate-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"submitted_at"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/date"},(0,l.kt)("inlineCode",{parentName:"a"},"Date"))," ",(0,l.kt)(y,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbtitlebcodestring-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"title"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,l.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,l.kt)(y,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h4",{id:"code-style-fontweight-normal-eventproposalbupdated_atbcodedate--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"EventProposal.",(0,l.kt)("b",null,"updated_at"))),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/date"},(0,l.kt)("inlineCode",{parentName:"a"},"Date!"))," ",(0,l.kt)(y,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(y,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h3",{id:"member-of"},"Member of"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/attach-image-to-event-proposal-payload"},(0,l.kt)("inlineCode",{parentName:"a"},"AttachImageToEventProposalPayload")),"  ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/convention"},(0,l.kt)("inlineCode",{parentName:"a"},"Convention")),"  ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/create-event-proposal-payload"},(0,l.kt)("inlineCode",{parentName:"a"},"CreateEventProposalPayload")),"  ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/delete-event-proposal-payload"},(0,l.kt)("inlineCode",{parentName:"a"},"DeleteEventProposalPayload")),"  ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/event-proposals-pagination"},(0,l.kt)("inlineCode",{parentName:"a"},"EventProposalsPagination")),"  ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/submit-event-proposal-payload"},(0,l.kt)("inlineCode",{parentName:"a"},"SubmitEventProposalPayload")),"  ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/transition-event-proposal-payload"},(0,l.kt)("inlineCode",{parentName:"a"},"TransitionEventProposalPayload")),"  ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/update-event-proposal-admin-notes-payload"},(0,l.kt)("inlineCode",{parentName:"a"},"UpdateEventProposalAdminNotesPayload")),"  ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/update-event-proposal-payload"},(0,l.kt)("inlineCode",{parentName:"a"},"UpdateEventProposalPayload")),"  ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"}),(0,l.kt)(i,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/objects/user"},(0,l.kt)("inlineCode",{parentName:"a"},"User")),"  ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("h3",{id:"implemented-by"},"Implemented by"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/unions/searchable-model"},(0,l.kt)("inlineCode",{parentName:"a"},"SearchableModel")),"  ",(0,l.kt)(y,{class:"secondary",text:"union",mdxType:"Badge"})))}h.isMDXComponent=!0}}]);