"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[80513],{23021:(e,d,s)=>{s.r(d),s.d(d,{assets:()=>t,contentTitle:()=>c,default:()=>o,frontMatter:()=>a,metadata:()=>n,toc:()=>m});const n=JSON.parse('{"id":"graphql/types/objects/order-entry","title":"OrderEntry","description":"No description","source":"@site/docs/graphql/types/objects/order-entry.md","sourceDirName":"graphql/types/objects","slug":"/graphql/types/objects/order-entry","permalink":"/docs/graphql/types/objects/order-entry","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/order-entry.md","tags":[],"version":"current","frontMatter":{"id":"order-entry","title":"OrderEntry"},"sidebar":"sidebar","previous":{"title":"NotificationTemplate","permalink":"/docs/graphql/types/objects/notification-template"},"next":{"title":"OrderQuantityByStatus","permalink":"/docs/graphql/types/objects/order-quantity-by-status"}}');var l=s(58040),r=s(5365);const a={id:"order-entry",title:"OrderEntry"},c=void 0,t={},m=[{value:"Fields",id:"fields",level:3},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">OrderEntry</code>.<code class="gqlmd-mdx-entity-name">describe_products</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"orderentrydescribe_productsstring-non-null-scalar",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">OrderEntry</code>.<code class="gqlmd-mdx-entity-name">id</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">ID!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"orderentryidid-non-null-scalar",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">OrderEntry</code>.<code class="gqlmd-mdx-entity-name">order</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Order!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">object</mark>',id:"orderentryorderorder-non-null-object",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">OrderEntry</code>.<code class="gqlmd-mdx-entity-name">price</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Money!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">object</mark>',id:"orderentrypricemoney-non-null-object",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">OrderEntry</code>.<code class="gqlmd-mdx-entity-name">price_per_item</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Money!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">object</mark>',id:"orderentryprice_per_itemmoney-non-null-object",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">OrderEntry</code>.<code class="gqlmd-mdx-entity-name">product</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Product!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">object</mark>',id:"orderentryproductproduct-non-null-object",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">OrderEntry</code>.<code class="gqlmd-mdx-entity-name">product_variant</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">ProductVariant</code></span> <mark class="gqlmd-mdx-badge">object</mark>',id:"orderentryproduct_variantproductvariant-object",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">OrderEntry</code>.<code class="gqlmd-mdx-entity-name">quantity</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Int!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"orderentryquantityint-non-null-scalar",level:4},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">OrderEntry</code>.<code class="gqlmd-mdx-entity-name">run</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Run</code></span> <mark class="gqlmd-mdx-badge">object</mark>',id:"orderentryrunrun-object",level:4},{value:"Member Of",id:"member-of",level:3}];function i(e){const d={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(d.p,{children:"No description"}),"\n",(0,l.jsx)(d.pre,{children:(0,l.jsx)(d.code,{className:"language-graphql",children:"type OrderEntry {\n  describe_products: String!\n  id: ID!\n  order: Order!\n  price: Money!\n  price_per_item: Money!\n  product: Product!\n  product_variant: ProductVariant\n  quantity: Int!\n  run: Run\n}\n"})}),"\n",(0,l.jsx)(d.h3,{id:"fields",children:"Fields"}),"\n",(0,l.jsxs)(d.h4,{id:"orderentrydescribe_productsstring-non-null-scalar",children:[(0,l.jsx)(d.a,{href:"#",children:(0,l.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,l.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"OrderEntry"}),".",(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"describe_products"})]})}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(d.a,{href:"/docs/graphql/types/scalars/string",children:(0,l.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"String!"})})})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,l.jsxs)(d.h4,{id:"orderentryidid-non-null-scalar",children:[(0,l.jsx)(d.a,{href:"#",children:(0,l.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,l.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"OrderEntry"}),".",(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"id"})]})}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(d.a,{href:"/docs/graphql/types/scalars/id",children:(0,l.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"ID!"})})})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,l.jsxs)(d.h4,{id:"orderentryorderorder-non-null-object",children:[(0,l.jsx)(d.a,{href:"#",children:(0,l.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,l.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"OrderEntry"}),".",(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"order"})]})}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(d.a,{href:"/docs/graphql/types/objects/order",children:(0,l.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Order!"})})})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]}),"\n",(0,l.jsxs)(d.h4,{id:"orderentrypricemoney-non-null-object",children:[(0,l.jsx)(d.a,{href:"#",children:(0,l.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,l.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"OrderEntry"}),".",(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"price"})]})}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(d.a,{href:"/docs/graphql/types/objects/money",children:(0,l.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Money!"})})})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]}),"\n",(0,l.jsxs)(d.h4,{id:"orderentryprice_per_itemmoney-non-null-object",children:[(0,l.jsx)(d.a,{href:"#",children:(0,l.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,l.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"OrderEntry"}),".",(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"price_per_item"})]})}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(d.a,{href:"/docs/graphql/types/objects/money",children:(0,l.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Money!"})})})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]}),"\n",(0,l.jsxs)(d.h4,{id:"orderentryproductproduct-non-null-object",children:[(0,l.jsx)(d.a,{href:"#",children:(0,l.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,l.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"OrderEntry"}),".",(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"product"})]})}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(d.a,{href:"/docs/graphql/types/objects/product",children:(0,l.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Product!"})})})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]}),"\n",(0,l.jsxs)(d.h4,{id:"orderentryproduct_variantproductvariant-object",children:[(0,l.jsx)(d.a,{href:"#",children:(0,l.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,l.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"OrderEntry"}),".",(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"product_variant"})]})}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(d.a,{href:"/docs/graphql/types/objects/product-variant",children:(0,l.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"ProductVariant"})})})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]}),"\n",(0,l.jsxs)(d.h4,{id:"orderentryquantityint-non-null-scalar",children:[(0,l.jsx)(d.a,{href:"#",children:(0,l.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,l.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"OrderEntry"}),".",(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"quantity"})]})}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(d.a,{href:"/docs/graphql/types/scalars/int",children:(0,l.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Int!"})})})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,l.jsxs)(d.h4,{id:"orderentryrunrun-object",children:[(0,l.jsx)(d.a,{href:"#",children:(0,l.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,l.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"OrderEntry"}),".",(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"run"})]})}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(d.a,{href:"/docs/graphql/types/objects/run",children:(0,l.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,l.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Run"})})})," ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]}),"\n",(0,l.jsx)(d.h3,{id:"member-of",children:"Member Of"}),"\n",(0,l.jsxs)(d.p,{children:[(0,l.jsx)(d.a,{href:"/docs/graphql/types/objects/add-order-entry-to-current-pending-order-payload",children:(0,l.jsx)(d.code,{children:"AddOrderEntryToCurrentPendingOrderPayload"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(d.a,{href:"/docs/graphql/types/objects/create-order-entry-payload",children:(0,l.jsx)(d.code,{children:"CreateOrderEntryPayload"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(d.a,{href:"/docs/graphql/types/objects/delete-order-entry-payload",children:(0,l.jsx)(d.code,{children:"DeleteOrderEntryPayload"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(d.a,{href:"/docs/graphql/types/objects/order",children:(0,l.jsx)(d.code,{children:"Order"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(d.a,{href:"/docs/graphql/types/objects/ticket",children:(0,l.jsx)(d.code,{children:"Ticket"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"}),(0,l.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,l.jsx)(d.a,{href:"/docs/graphql/types/objects/update-order-entry-payload",children:(0,l.jsx)(d.code,{children:"UpdateOrderEntryPayload"})}),"  ",(0,l.jsx)("mark",{class:"gqlmd-mdx-badge",children:"object"})]})]})}function o(e={}){const{wrapper:d}={...(0,r.R)(),...e.components};return d?(0,l.jsx)(d,{...e,children:(0,l.jsx)(i,{...e})}):i(e)}},5365:(e,d,s)=>{s.d(d,{R:()=>a,x:()=>c});var n=s(62340);const l={},r=n.createContext(l);function a(e){const d=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(d):{...d,...e}}),[d,e])}function c(e){let d;return d=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:a(e.components),n.createElement(r.Provider,{value:d},e.children)}}}]);