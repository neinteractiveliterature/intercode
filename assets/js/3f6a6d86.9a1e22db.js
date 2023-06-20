"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[47063],{75631:(e,t,a)=>{a.d(t,{Zo:()=>s,kt:()=>k});var n=a(45721);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function c(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),d=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},s=function(e){var t=d(e.components);return n.createElement(i.Provider,{value:t},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},y=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),p=d(a),y=r,k=p["".concat(i,".").concat(y)]||p[y]||u[y]||l;return a?n.createElement(k,o(o({ref:t},s),{},{components:a})):n.createElement(k,o({ref:t},s))}));function k(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,o=new Array(l);o[0]=y;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c[p]="string"==typeof e?e:r,o[1]=c;for(var d=2;d<l;d++)o[d]=a[d];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}y.displayName="MDXCreateElement"},8092:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>y,Bullet:()=>p,SpecifiedBy:()=>u,assets:()=>d,contentTitle:()=>c,default:()=>f,frontMatter:()=>o,metadata:()=>i,toc:()=>s});var n=a(9715),r=a(45721),l=a(75631);const o={id:"delete-ticket-payload",title:"DeleteTicketPayload",hide_table_of_contents:!1},c=void 0,i={unversionedId:"graphql/objects/delete-ticket-payload",id:"graphql/objects/delete-ticket-payload",title:"DeleteTicketPayload",description:"Autogenerated return type of DeleteTicket.",source:"@site/docs/graphql/objects/delete-ticket-payload.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/delete-ticket-payload",permalink:"/docs/graphql/objects/delete-ticket-payload",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/delete-ticket-payload.mdx",tags:[],version:"current",frontMatter:{id:"delete-ticket-payload",title:"DeleteTicketPayload",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"DeleteTeamMemberPayload",permalink:"/docs/graphql/objects/delete-team-member-payload"},next:{title:"DeleteTicketTypePayload",permalink:"/docs/graphql/objects/delete-ticket-type-payload"}},d={},s=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>DeleteTicketPayload.<b>clientMutationId</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-deleteticketpayloadbclientmutationidbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>DeleteTicketPayload.<b>ticket</b></code><Bullet /><code>Ticket!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-deleteticketpayloadbticketbcodeticket--",level:4},{value:"Returned by",id:"returned-by",level:3}],p=()=>(0,l.kt)(r.Fragment,null,(0,l.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),u=e=>(0,l.kt)(r.Fragment,null,"Specification",(0,l.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),y=e=>(0,l.kt)(r.Fragment,null,(0,l.kt)("span",{class:"badge badge--"+e.class},e.text)),k={toc:s,Bullet:p,SpecifiedBy:u,Badge:y},m="wrapper";function f(e){let{components:t,...a}=e;return(0,l.kt)(m,(0,n.Z)({},k,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Autogenerated return type of DeleteTicket."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-graphql"},"type DeleteTicketPayload {\n  clientMutationId: String\n  ticket: Ticket!\n}\n")),(0,l.kt)("h3",{id:"fields"},"Fields"),(0,l.kt)("h4",{id:"code-style-fontweight-normal-deleteticketpayloadbclientmutationidbcodestring-"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"DeleteTicketPayload.",(0,l.kt)("b",null,"clientMutationId"))),(0,l.kt)(p,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,l.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,l.kt)(y,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"A unique identifier for the client performing the mutation.")),(0,l.kt)("h4",{id:"code-style-fontweight-normal-deleteticketpayloadbticketbcodeticket--"},(0,l.kt)("a",{parentName:"h4",href:"#"},(0,l.kt)("code",{style:{fontWeight:"normal"}},"DeleteTicketPayload.",(0,l.kt)("b",null,"ticket"))),(0,l.kt)(p,{mdxType:"Bullet"}),(0,l.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/ticket"},(0,l.kt)("inlineCode",{parentName:"a"},"Ticket!"))," ",(0,l.kt)(y,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,l.kt)(y,{class:"secondary",text:"object",mdxType:"Badge"})),(0,l.kt)("blockquote",null),(0,l.kt)("h3",{id:"returned-by"},"Returned by"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/docs/graphql/mutations/delete-ticket"},(0,l.kt)("inlineCode",{parentName:"a"},"deleteTicket")),"  ",(0,l.kt)(y,{class:"secondary",text:"mutation",mdxType:"Badge"})))}f.isMDXComponent=!0}}]);