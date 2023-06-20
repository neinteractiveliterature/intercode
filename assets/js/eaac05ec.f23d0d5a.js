"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[3643],{75631:(e,t,a)=>{a.d(t,{Zo:()=>i,kt:()=>y});var n=a(45721);function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function p(e,t){if(null==e)return{};var a,n,o=function(e,t){if(null==e)return{};var a,n,o={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(o[a]=e[a]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(o[a]=e[a])}return o}var d=n.createContext({}),s=function(e){var t=n.useContext(d),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},i=function(e){var t=s(e.components);return n.createElement(d.Provider,{value:t},e.children)},c="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,o=e.mdxType,r=e.originalType,d=e.parentName,i=p(e,["components","mdxType","originalType","parentName"]),c=s(a),m=o,y=c["".concat(d,".").concat(m)]||c[m]||u[m]||r;return a?n.createElement(y,l(l({ref:t},i),{},{components:a})):n.createElement(y,l({ref:t},i))}));function y(e,t){var a=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=a.length,l=new Array(r);l[0]=m;var p={};for(var d in t)hasOwnProperty.call(t,d)&&(p[d]=t[d]);p.originalType=e,p[c]="string"==typeof e?e:o,l[1]=p;for(var s=2;s<r;s++)l[s]=a[s];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},18944:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>m,Bullet:()=>c,SpecifiedBy:()=>u,assets:()=>s,contentTitle:()=>p,default:()=>v,frontMatter:()=>l,metadata:()=>d,toc:()=>i});var n=a(9715),o=a(45721),r=a(75631);const l={id:"update-event-proposal-admin-notes-payload",title:"UpdateEventProposalAdminNotesPayload",hide_table_of_contents:!1},p=void 0,d={unversionedId:"graphql/objects/update-event-proposal-admin-notes-payload",id:"graphql/objects/update-event-proposal-admin-notes-payload",title:"UpdateEventProposalAdminNotesPayload",description:"Autogenerated return type of UpdateEventProposalAdminNotes.",source:"@site/docs/graphql/objects/update-event-proposal-admin-notes-payload.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/update-event-proposal-admin-notes-payload",permalink:"/docs/graphql/objects/update-event-proposal-admin-notes-payload",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/update-event-proposal-admin-notes-payload.mdx",tags:[],version:"current",frontMatter:{id:"update-event-proposal-admin-notes-payload",title:"UpdateEventProposalAdminNotesPayload",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"UpdateEventPayload",permalink:"/docs/graphql/objects/update-event-payload"},next:{title:"UpdateEventProposalPayload",permalink:"/docs/graphql/objects/update-event-proposal-payload"}},s={},i=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateEventProposalAdminNotesPayload.<b>clientMutationId</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-updateeventproposaladminnotespayloadbclientmutationidbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateEventProposalAdminNotesPayload.<b>event_proposal</b></code><Bullet /><code>EventProposal!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-updateeventproposaladminnotespayloadbevent_proposalbcodeeventproposal--",level:4},{value:"Returned by",id:"returned-by",level:3}],c=()=>(0,r.kt)(o.Fragment,null,(0,r.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),u=e=>(0,r.kt)(o.Fragment,null,"Specification",(0,r.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),m=e=>(0,r.kt)(o.Fragment,null,(0,r.kt)("span",{class:"badge badge--"+e.class},e.text)),y={toc:i,Bullet:c,SpecifiedBy:u,Badge:m},f="wrapper";function v(e){let{components:t,...a}=e;return(0,r.kt)(f,(0,n.Z)({},y,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Autogenerated return type of UpdateEventProposalAdminNotes."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-graphql"},"type UpdateEventProposalAdminNotesPayload {\n  clientMutationId: String\n  event_proposal: EventProposal!\n}\n")),(0,r.kt)("h3",{id:"fields"},"Fields"),(0,r.kt)("h4",{id:"code-style-fontweight-normal-updateeventproposaladminnotespayloadbclientmutationidbcodestring-"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("code",{style:{fontWeight:"normal"}},"UpdateEventProposalAdminNotesPayload.",(0,r.kt)("b",null,"clientMutationId"))),(0,r.kt)(c,{mdxType:"Bullet"}),(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,r.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"A unique identifier for the client performing the mutation.")),(0,r.kt)("h4",{id:"code-style-fontweight-normal-updateeventproposaladminnotespayloadbevent_proposalbcodeeventproposal--"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("code",{style:{fontWeight:"normal"}},"UpdateEventProposalAdminNotesPayload.",(0,r.kt)("b",null,"event_proposal"))),(0,r.kt)(c,{mdxType:"Bullet"}),(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/event-proposal"},(0,r.kt)("inlineCode",{parentName:"a"},"EventProposal!"))," ",(0,r.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,r.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"})),(0,r.kt)("blockquote",null),(0,r.kt)("h3",{id:"returned-by"},"Returned by"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"/docs/graphql/mutations/update-event-proposal-admin-notes"},(0,r.kt)("inlineCode",{parentName:"a"},"updateEventProposalAdminNotes")),"  ",(0,r.kt)(m,{class:"secondary",text:"mutation",mdxType:"Badge"})))}v.isMDXComponent=!0}}]);