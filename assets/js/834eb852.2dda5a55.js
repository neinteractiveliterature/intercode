"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[18722],{15526:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>o,contentTitle:()=>c,default:()=>i,frontMatter:()=>a,metadata:()=>t,toc:()=>m});const t=JSON.parse('{"id":"graphql/types/objects/convention-reports","title":"ConventionReports","description":"Reports that can be queried against a convention.","source":"@site/docs/graphql/types/objects/convention-reports.md","sourceDirName":"graphql/types/objects","slug":"/graphql/types/objects/convention-reports","permalink":"/docs/graphql/types/objects/convention-reports","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/convention-reports.md","tags":[],"version":"current","frontMatter":{"id":"convention-reports","title":"ConventionReports"},"sidebar":"sidebar","previous":{"title":"ContactEmail","permalink":"/docs/graphql/types/objects/contact-email"},"next":{"title":"Convention","permalink":"/docs/graphql/types/objects/convention"}}');var d=s(58040),l=s(5365);const a={id:"convention-reports",title:"ConventionReports"},c=void 0,o={},m=[{value:"Fields",id:"fields",level:3},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">ConventionReports</code>.<code class="gqlmd-mdx-entity-name">event_provided_tickets</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">[EventProvidedTicketList!]!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">object</mark>',id:"conventionreportsevent_provided_ticketseventprovidedticketlist-non-null-object",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">ConventionReports</code>.<code class="gqlmd-mdx-entity-name">events_by_choice</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">[EventWithChoiceCounts!]!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">object</mark>',id:"conventionreportsevents_by_choiceeventwithchoicecounts-non-null-object",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">ConventionReports</code>.<code class="gqlmd-mdx-entity-name">sales_count_by_product_and_payment_amount</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">[SalesCountByProductAndPaymentAmount!]!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">object</mark>',id:"conventionreportssales_count_by_product_and_payment_amountsalescountbyproductandpaymentamount-non-null-object",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">ConventionReports</code>.<code class="gqlmd-mdx-entity-name">sum_revenue</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Money!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">object</mark>',id:"conventionreportssum_revenuemoney-non-null-object",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">ConventionReports.sum_revenue</code>.<code class="gqlmd-mdx-entity-name">orderStatuses</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">[OrderStatus!]</code></span> <mark class="gqlmd-mdx-badge">list</mark> <mark class="gqlmd-mdx-badge">enum</mark>',id:"conventionreportssum_revenueorderstatusesorderstatus-list-enum",level:5},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">ConventionReports.sum_revenue</code>.<code class="gqlmd-mdx-entity-name">productIds</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">[ID!]</code></span> <mark class="gqlmd-mdx-badge">list</mark> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"conventionreportssum_revenueproductidsid-list-scalar",level:5},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">ConventionReports</code>.<code class="gqlmd-mdx-entity-name">ticket_count_by_type_and_payment_amount</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">[TicketCountByTypeAndPaymentAmount!]!</code></span> <mark class="gqlmd-mdx-badge">deprecated</mark> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">object</mark>',id:"conventionreportsticket_count_by_type_and_payment_amountticketcountbytypeandpaymentamount-deprecated-non-null-object",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">ConventionReports</code>.<code class="gqlmd-mdx-entity-name">total_revenue</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Money!</code></span> <mark class="gqlmd-mdx-badge">deprecated</mark> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">object</mark>',id:"conventionreportstotal_revenuemoney-deprecated-non-null-object",level:4},{value:"Member Of",id:"member-of",level:3}];function r(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",h5:"h5",p:"p",pre:"pre",...(0,l.R)(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(n.p,{children:"Reports that can be queried against a convention."}),"\n",(0,d.jsx)(n.pre,{children:(0,d.jsx)(n.code,{className:"language-graphql",children:"type ConventionReports {\n  event_provided_tickets: [EventProvidedTicketList!]!\n  events_by_choice: [EventWithChoiceCounts!]!\n  sales_count_by_product_and_payment_amount: [SalesCountByProductAndPaymentAmount!]!\n  sum_revenue(\n    orderStatuses: [OrderStatus!]\n    productIds: [ID!]\n  ): Money!\n  ticket_count_by_type_and_payment_amount: [TicketCountByTypeAndPaymentAmount!]! @deprecated\n  total_revenue: Money! @deprecated\n}\n"})}),"\n",(0,d.jsx)(n.h3,{id:"fields",children:"Fields"}),"\n",(0,d.jsxs)(n.h4,{id:"conventionreportsevent_provided_ticketseventprovidedticketlist-non-null-object",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,d.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"ConventionReports"}),".",(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"event_provided_tickets"})]})}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/objects/event-provided-ticket-list",children:(0,d.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"[EventProvidedTicketList!]!"})})})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]}),"\n",(0,d.jsx)(n.p,{children:"A report of all tickets provided by events at this convention."}),"\n",(0,d.jsxs)(n.h4,{id:"conventionreportsevents_by_choiceeventwithchoicecounts-non-null-object",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,d.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"ConventionReports"}),".",(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"events_by_choice"})]})}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/objects/event-with-choice-counts",children:(0,d.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"[EventWithChoiceCounts!]!"})})})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]}),"\n",(0,d.jsx)(n.p,{children:"A report of events people signed up for along with which numbered choice they were for that person."}),"\n",(0,d.jsxs)(n.h4,{id:"conventionreportssales_count_by_product_and_payment_amountsalescountbyproductandpaymentamount-non-null-object",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,d.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"ConventionReports"}),".",(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"sales_count_by_product_and_payment_amount"})]})}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/objects/sales-count-by-product-and-payment-amount",children:(0,d.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"[SalesCountByProductAndPaymentAmount!]!"})})})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]}),"\n",(0,d.jsx)(n.p,{children:"A breakdown of all product and ticket sales in this convention."}),"\n",(0,d.jsxs)(n.h4,{id:"conventionreportssum_revenuemoney-non-null-object",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,d.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"ConventionReports"}),".",(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"sum_revenue"})]})}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/objects/money",children:(0,d.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Money!"})})})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]}),"\n",(0,d.jsx)(n.p,{children:"The total revenue taken in by this convention, optionally filtered by various parameters."}),"\n",(0,d.jsxs)(n.h5,{id:"conventionreportssum_revenueorderstatusesorderstatus-list-enum",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,d.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"ConventionReports.sum_revenue"}),".",(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"orderStatuses"})]})}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/enums/order-status",children:(0,d.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"[OrderStatus!]"})})})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"list"})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"enum"})]}),"\n",(0,d.jsx)(n.p,{children:"If specified, only counts revenue from orders with these statuses."}),"\n",(0,d.jsxs)(n.h5,{id:"conventionreportssum_revenueproductidsid-list-scalar",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,d.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"ConventionReports.sum_revenue"}),".",(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"productIds"})]})}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/scalars/id",children:(0,d.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"[ID!]"})})})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"list"})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,d.jsx)(n.p,{children:"If specified, only counts revenue from these products."}),"\n",(0,d.jsxs)(n.h4,{id:"conventionreportsticket_count_by_type_and_payment_amountticketcountbytypeandpaymentamount-deprecated-non-null-object",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,d.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"ConventionReports"}),".",(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"ticket_count_by_type_and_payment_amount"})]})}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/objects/ticket-count-by-type-and-payment-amount",children:(0,d.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"[TicketCountByTypeAndPaymentAmount!]!"})})})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"deprecated"})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]}),"\n",(0,d.jsxs)("fieldset",{class:"gqlmd-mdx-admonition-fieldset",children:[(0,d.jsx)("legend",{class:"gqlmd-mdx-admonition-legend",children:(0,d.jsx)("span",{class:"gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-warning",children:"\u26a0\ufe0f DEPRECATED"})}),(0,d.jsx)("span",{children:(0,d.jsx)(n.p,{children:"This only takes ticket sales into account.  Please use the sales_count_by_product_and_payment_amount field instead."})})]}),"\n",(0,d.jsxs)(n.h4,{id:"conventionreportstotal_revenuemoney-deprecated-non-null-object",children:[(0,d.jsx)(n.a,{href:"#",children:(0,d.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,d.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"ConventionReports"}),".",(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"total_revenue"})]})}),(0,d.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,d.jsx)(n.a,{href:"/docs/graphql/types/objects/money",children:(0,d.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,d.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Money!"})})})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"deprecated"})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]}),"\n",(0,d.jsxs)("fieldset",{class:"gqlmd-mdx-admonition-fieldset",children:[(0,d.jsx)("legend",{class:"gqlmd-mdx-admonition-legend",children:(0,d.jsx)("span",{class:"gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-warning",children:"\u26a0\ufe0f DEPRECATED"})}),(0,d.jsx)("span",{children:(0,d.jsx)(n.p,{children:"This only takes ticket sales into account.  Please use the sum_revenue field instead."})})]}),"\n",(0,d.jsx)(n.h3,{id:"member-of",children:"Member Of"}),"\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.a,{href:"/docs/graphql/types/objects/convention",children:(0,d.jsx)(n.code,{children:"Convention"})}),"  ",(0,d.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]})]})}function i(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,d.jsx)(n,{...e,children:(0,d.jsx)(r,{...e})}):r(e)}},5365:(e,n,s)=>{s.d(n,{R:()=>a,x:()=>c});var t=s(62340);const d={},l=t.createContext(d);function a(e){const n=t.useContext(l);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:a(e.components),t.createElement(l.Provider,{value:n},e.children)}}}]);