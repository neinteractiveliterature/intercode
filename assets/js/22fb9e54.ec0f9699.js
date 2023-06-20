"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[73764],{75631:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>s});var o=n(45721);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i=o.createContext({}),y=function(e){var t=o.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},p=function(e){var t=y(e.components);return o.createElement(i.Provider,{value:t},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},u=o.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,i=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=y(n),u=a,s=d["".concat(i,".").concat(u)]||d[u]||m[u]||r;return n?o.createElement(s,c(c({ref:t},p),{},{components:n})):o.createElement(s,c({ref:t},p))}));function s(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,c=new Array(r);c[0]=u;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l[d]="string"==typeof e?e:a,c[1]=l;for(var y=2;y<r;y++)c[y]=n[y];return o.createElement.apply(null,c)}return o.createElement.apply(null,n)}u.displayName="MDXCreateElement"},67506:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>u,Bullet:()=>d,SpecifiedBy:()=>m,assets:()=>y,contentTitle:()=>l,default:()=>b,frontMatter:()=>c,metadata:()=>i,toc:()=>p});var o=n(9715),a=n(45721),r=n(75631);const c={id:"ticket-count-by-type-and-payment-amount",title:"TicketCountByTypeAndPaymentAmount",hide_table_of_contents:!1},l=void 0,i={unversionedId:"graphql/objects/ticket-count-by-type-and-payment-amount",id:"graphql/objects/ticket-count-by-type-and-payment-amount",title:"TicketCountByTypeAndPaymentAmount",description:"No description",source:"@site/docs/graphql/objects/ticket-count-by-type-and-payment-amount.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/ticket-count-by-type-and-payment-amount",permalink:"/docs/graphql/objects/ticket-count-by-type-and-payment-amount",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/ticket-count-by-type-and-payment-amount.mdx",tags:[],version:"current",frontMatter:{id:"ticket-count-by-type-and-payment-amount",title:"TicketCountByTypeAndPaymentAmount",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"TeamMember",permalink:"/docs/graphql/objects/team-member"},next:{title:"TicketType",permalink:"/docs/graphql/objects/ticket-type"}},y={},p=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>TicketCountByTypeAndPaymentAmount.<b>count</b></code><Bullet /><code>Int!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-ticketcountbytypeandpaymentamountbcountbcodeint--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>TicketCountByTypeAndPaymentAmount.<b>payment_amount</b></code><Bullet /><code>Money!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-ticketcountbytypeandpaymentamountbpayment_amountbcodemoney--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>TicketCountByTypeAndPaymentAmount.<b>ticket_type</b></code><Bullet /><code>TicketType!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-ticketcountbytypeandpaymentamountbticket_typebcodetickettype--",level:4},{value:"Member of",id:"member-of",level:3}],d=()=>(0,r.kt)(a.Fragment,null,(0,r.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),m=e=>(0,r.kt)(a.Fragment,null,"Specification",(0,r.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),u=e=>(0,r.kt)(a.Fragment,null,(0,r.kt)("span",{class:"badge badge--"+e.class},e.text)),s={toc:p,Bullet:d,SpecifiedBy:m,Badge:u},k="wrapper";function b(e){let{components:t,...n}=e;return(0,r.kt)(k,(0,o.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"No description"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-graphql"},"type TicketCountByTypeAndPaymentAmount {\n  count: Int!\n  payment_amount: Money!\n  ticket_type: TicketType!\n}\n")),(0,r.kt)("h3",{id:"fields"},"Fields"),(0,r.kt)("h4",{id:"code-style-fontweight-normal-ticketcountbytypeandpaymentamountbcountbcodeint--"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("code",{style:{fontWeight:"normal"}},"TicketCountByTypeAndPaymentAmount.",(0,r.kt)("b",null,"count"))),(0,r.kt)(d,{mdxType:"Bullet"}),(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,r.kt)("inlineCode",{parentName:"a"},"Int!"))," ",(0,r.kt)(u,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,r.kt)(u,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,r.kt)("blockquote",null),(0,r.kt)("h4",{id:"code-style-fontweight-normal-ticketcountbytypeandpaymentamountbpayment_amountbcodemoney--"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("code",{style:{fontWeight:"normal"}},"TicketCountByTypeAndPaymentAmount.",(0,r.kt)("b",null,"payment_amount"))),(0,r.kt)(d,{mdxType:"Bullet"}),(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/money"},(0,r.kt)("inlineCode",{parentName:"a"},"Money!"))," ",(0,r.kt)(u,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,r.kt)(u,{class:"secondary",text:"object",mdxType:"Badge"})),(0,r.kt)("blockquote",null),(0,r.kt)("h4",{id:"code-style-fontweight-normal-ticketcountbytypeandpaymentamountbticket_typebcodetickettype--"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("code",{style:{fontWeight:"normal"}},"TicketCountByTypeAndPaymentAmount.",(0,r.kt)("b",null,"ticket_type"))),(0,r.kt)(d,{mdxType:"Bullet"}),(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/ticket-type"},(0,r.kt)("inlineCode",{parentName:"a"},"TicketType!"))," ",(0,r.kt)(u,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,r.kt)(u,{class:"secondary",text:"object",mdxType:"Badge"})),(0,r.kt)("blockquote",null),(0,r.kt)("h3",{id:"member-of"},"Member of"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"/docs/graphql/objects/convention-reports"},(0,r.kt)("inlineCode",{parentName:"a"},"ConventionReports")),"  ",(0,r.kt)(u,{class:"secondary",text:"object",mdxType:"Badge"})))}b.isMDXComponent=!0}}]);