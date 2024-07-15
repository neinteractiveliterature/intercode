"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[54575],{35530:(e,t,s)=>{s.r(t),s.d(t,{Badge:()=>h,Bullet:()=>r,Details:()=>x,SpecifiedBy:()=>p,assets:()=>i,contentTitle:()=>o,default:()=>j,frontMatter:()=>a,metadata:()=>l,toc:()=>g});var c=s(58040),d=s(1422),n=s(62340);const a={id:"ticket-type",title:"TicketType"},o=void 0,l={id:"graphql/types/objects/ticket-type",title:"TicketType",description:"No description",source:"@site/docs/graphql/types/objects/ticket-type.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/ticket-type",permalink:"/docs/graphql/types/objects/ticket-type",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/ticket-type.mdx",tags:[],version:"current",frontMatter:{id:"ticket-type",title:"TicketType"},sidebar:"sidebar",previous:{title:"TicketCountByTypeAndPaymentAmount",permalink:"/docs/graphql/types/objects/ticket-count-by-type-and-payment-amount"},next:{title:"Ticket",permalink:"/docs/graphql/types/objects/ticket"}},i={},r=()=>{const e={span:"span",...(0,d.R)()};return(0,c.jsx)(c.Fragment,{children:(0,c.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,d.R)()};return(0,c.jsxs)(c.Fragment,{children:["Specification",(0,c.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},h=e=>{const t={span:"span",...(0,d.R)()};return(0,c.jsx)(c.Fragment,{children:(0,c.jsx)(t.span,{className:e.class,children:e.text})})},x=({dataOpen:e,dataClose:t,children:s,startOpen:a=!1})=>{const o={details:"details",summary:"summary",...(0,d.R)()},[l,i]=(0,n.useState)(a);return(0,c.jsxs)(o.details,{...l?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,c.jsx)(o.summary,{onClick:e=>{e.preventDefault(),i((e=>!e))},style:{listStyle:"none"},children:l?e:t}),l&&s]})},g=[{value:"Fields",id:"fields",level:3},{value:'<code>TicketType.<b>allows_event_signups</b></code><Bullet></Bullet><code>Boolean!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"tickettypeallows_event_signupsboolean--",level:4},{value:'<code>TicketType.<b>convention</b></code><Bullet></Bullet><code>Convention</code> <Badge class="badge badge--secondary"></Badge>',id:"tickettypeconventionconvention-",level:4},{value:'<code>TicketType.<b>counts_towards_convention_maximum</b></code><Bullet></Bullet><code>Boolean!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"tickettypecounts_towards_convention_maximumboolean--",level:4},{value:'<code>TicketType.<b>description</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"tickettypedescriptionstring-",level:4},{value:'<code>TicketType.<b>event</b></code><Bullet></Bullet><code>Event</code> <Badge class="badge badge--secondary"></Badge>',id:"tickettypeeventevent-",level:4},{value:'<code>TicketType.<b>id</b></code><Bullet></Bullet><code>ID!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"tickettypeidid--",level:4},{value:'<code>TicketType.<b>maximum_event_provided_tickets</b></code><Bullet></Bullet><code>Int!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"tickettypemaximum_event_provided_ticketsint--",level:4},{value:'<code>TicketType.maximum_event_provided_tickets.<b>eventId</b></code><Bullet></Bullet><code>ID</code> <Badge class="badge badge--secondary"></Badge>',id:"tickettypemaximum_event_provided_ticketseventidid-",level:5},{value:'<code>TicketType.<b>name</b></code><Bullet></Bullet><code>String!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"tickettypenamestring--",level:4},{value:'<code>TicketType.<b>parent</b></code><Bullet></Bullet><code>TicketTypeParent!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"tickettypeparenttickettypeparent--",level:4},{value:'<code>TicketType.<b>providing_products</b></code><Bullet></Bullet><code>[Product!]!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"tickettypeproviding_productsproduct--",level:4},{value:"Member Of",id:"member-of",level:3}];function b(e){const t={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",h5:"h5",p:"p",pre:"pre",...(0,d.R)(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(t.p,{children:"No description"}),"\n",(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:"language-graphql",children:"type TicketType {\n  allows_event_signups: Boolean!\n  convention: Convention\n  counts_towards_convention_maximum: Boolean!\n  description: String\n  event: Event\n  id: ID!\n  maximum_event_provided_tickets(\n    eventId: ID\n  ): Int!\n  name: String!\n  parent: TicketTypeParent!\n  providing_products: [Product!]!\n}\n"})}),"\n",(0,c.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,c.jsxs)(t.h4,{id:"tickettypeallows_event_signupsboolean--",children:[(0,c.jsx)(t.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["TicketType.",(0,c.jsx)("b",{children:"allows_event_signups"})]})}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/scalars/boolean",children:(0,c.jsx)(t.code,{children:"Boolean!"})})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,c.jsx)(t.blockquote,{children:"\n"}),"\n",(0,c.jsxs)(t.h4,{id:"tickettypeconventionconvention-",children:[(0,c.jsx)(t.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["TicketType.",(0,c.jsx)("b",{children:"convention"})]})}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/objects/convention",children:(0,c.jsx)(t.code,{children:"Convention"})})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,c.jsx)(t.blockquote,{children:"\n"}),"\n",(0,c.jsxs)(t.h4,{id:"tickettypecounts_towards_convention_maximumboolean--",children:[(0,c.jsx)(t.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["TicketType.",(0,c.jsx)("b",{children:"counts_towards_convention_maximum"})]})}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/scalars/boolean",children:(0,c.jsx)(t.code,{children:"Boolean!"})})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,c.jsx)(t.blockquote,{children:"\n"}),"\n",(0,c.jsxs)(t.h4,{id:"tickettypedescriptionstring-",children:[(0,c.jsx)(t.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["TicketType.",(0,c.jsx)("b",{children:"description"})]})}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,c.jsx)(t.code,{children:"String"})})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,c.jsx)(t.blockquote,{children:"\n"}),"\n",(0,c.jsxs)(t.h4,{id:"tickettypeeventevent-",children:[(0,c.jsx)(t.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["TicketType.",(0,c.jsx)("b",{children:"event"})]})}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/objects/event",children:(0,c.jsx)(t.code,{children:"Event"})})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,c.jsx)(t.blockquote,{children:"\n"}),"\n",(0,c.jsxs)(t.h4,{id:"tickettypeidid--",children:[(0,c.jsx)(t.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["TicketType.",(0,c.jsx)("b",{children:"id"})]})}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/scalars/id",children:(0,c.jsx)(t.code,{children:"ID!"})})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,c.jsx)(t.blockquote,{children:"\n"}),"\n",(0,c.jsxs)(t.h4,{id:"tickettypemaximum_event_provided_ticketsint--",children:[(0,c.jsx)(t.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["TicketType.",(0,c.jsx)("b",{children:"maximum_event_provided_tickets"})]})}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/scalars/int",children:(0,c.jsx)(t.code,{children:"Int!"})})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,c.jsxs)(t.blockquote,{children:["\n",(0,c.jsxs)(t.h5,{id:"tickettypemaximum_event_provided_ticketseventidid-",children:[(0,c.jsx)(t.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["TicketType.maximum_event_provided_tickets.",(0,c.jsx)("b",{children:"eventId"})]})}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/scalars/id",children:(0,c.jsx)(t.code,{children:"ID"})})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n"]}),"\n",(0,c.jsxs)(t.h4,{id:"tickettypenamestring--",children:[(0,c.jsx)(t.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["TicketType.",(0,c.jsx)("b",{children:"name"})]})}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,c.jsx)(t.code,{children:"String!"})})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,c.jsx)(t.blockquote,{children:"\n"}),"\n",(0,c.jsxs)(t.h4,{id:"tickettypeparenttickettypeparent--",children:[(0,c.jsx)(t.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["TicketType.",(0,c.jsx)("b",{children:"parent"})]})}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/unions/ticket-type-parent",children:(0,c.jsx)(t.code,{children:"TicketTypeParent!"})})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"union"})]}),"\n",(0,c.jsx)(t.blockquote,{children:"\n"}),"\n",(0,c.jsxs)(t.h4,{id:"tickettypeproviding_productsproduct--",children:[(0,c.jsx)(t.a,{href:"#",children:(0,c.jsxs)("code",{style:{fontWeight:"normal"},children:["TicketType.",(0,c.jsx)("b",{children:"providing_products"})]})}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/objects/product",children:(0,c.jsx)(t.code,{children:"[Product!]!"})})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,c.jsx)(t.blockquote,{children:"\n"}),"\n",(0,c.jsx)(t.h3,{id:"member-of",children:"Member Of"}),"\n",(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.a,{href:"/docs/graphql/types/objects/convention",children:(0,c.jsx)(t.code,{children:"Convention"})}),"  ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/objects/create-ticket-type-payload",children:(0,c.jsx)(t.code,{children:"CreateTicketTypePayload"})}),"  ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/objects/delete-ticket-type-payload",children:(0,c.jsx)(t.code,{children:"DeleteTicketTypePayload"})}),"  ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/objects/event",children:(0,c.jsx)(t.code,{children:"Event"})}),"  ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/objects/maximum-event-provided-tickets-override",children:(0,c.jsx)(t.code,{children:"MaximumEventProvidedTicketsOverride"})}),"  ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/objects/product",children:(0,c.jsx)(t.code,{children:"Product"})}),"  ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/objects/ticket",children:(0,c.jsx)(t.code,{children:"Ticket"})}),"  ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/objects/ticket-count-by-type-and-payment-amount",children:(0,c.jsx)(t.code,{children:"TicketCountByTypeAndPaymentAmount"})}),"  ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,c.jsx)(r,{}),(0,c.jsx)(t.a,{href:"/docs/graphql/types/objects/update-ticket-type-payload",children:(0,c.jsx)(t.code,{children:"UpdateTicketTypePayload"})}),"  ",(0,c.jsx)(h,{class:"badge badge--secondary",text:"object"})]})]})}function j(e={}){const{wrapper:t}={...(0,d.R)(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(b,{...e})}):b(e)}},1422:(e,t,s)=>{s.d(t,{R:()=>a,x:()=>o});var c=s(62340);const d={},n=c.createContext(d);function a(e){const t=c.useContext(n);return c.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:a(e.components),c.createElement(n.Provider,{value:t},e.children)}}}]);