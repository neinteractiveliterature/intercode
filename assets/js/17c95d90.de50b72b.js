"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[92463],{58802:(e,d,t)=>{t.r(d),t.d(d,{Badge:()=>h,Bullet:()=>i,Details:()=>u,SpecifiedBy:()=>g,assets:()=>l,contentTitle:()=>n,default:()=>x,frontMatter:()=>r,metadata:()=>o,toc:()=>p});var s=t(58040),a=t(1422),c=t(62340);const r={id:"product",title:"Product"},n=void 0,o={id:"graphql/types/objects/product",title:"Product",description:"No description",source:"@site/docs/graphql/types/objects/product.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/product",permalink:"/docs/graphql/types/objects/product",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/product.mdx",tags:[],version:"current",frontMatter:{id:"product",title:"Product"},sidebar:"sidebar",previous:{title:"ProductVariant",permalink:"/docs/graphql/types/objects/product-variant"},next:{title:"ProvideEventTicketPayload",permalink:"/docs/graphql/types/objects/provide-event-ticket-payload"}},l={},i=()=>{const e={span:"span",...(0,a.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},g=e=>{const d={a:"a",...(0,a.R)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(d.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},h=e=>{const d={span:"span",...(0,a.R)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(d.span,{className:e.class,children:e.text})})},u=({dataOpen:e,dataClose:d,children:t,startOpen:r=!1})=>{const n={details:"details",summary:"summary",...(0,a.R)()},[o,l]=(0,c.useState)(r);return(0,s.jsxs)(n.details,{...o?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,s.jsx)(n.summary,{onClick:e=>{e.preventDefault(),l((e=>!e))},style:{listStyle:"none"},children:o?e:d}),o&&t]})},p=[{value:"Fields",id:"fields",level:3},{value:'<code>Product.<b>available</b></code><Bullet></Bullet><code>Boolean!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"productavailableboolean--",level:4},{value:'<code>Product.<b>clickwrap_agreement</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"productclickwrap_agreementstring-",level:4},{value:'<code>Product.<b>clickwrap_agreement_html</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"productclickwrap_agreement_htmlstring-",level:4},{value:'<code>Product.<b>description</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"productdescriptionstring-",level:4},{value:'<code>Product.<b>description_html</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"productdescription_htmlstring-",level:4},{value:'<code>Product.<b>id</b></code><Bullet></Bullet><code>ID!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"productidid--",level:4},{value:'<code>Product.<b>image</b></code><Bullet></Bullet><code>ActiveStorageAttachment</code> <Badge class="badge badge--secondary"></Badge>',id:"productimageactivestorageattachment-",level:4},{value:'<code>Product.<b>image_url</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--deprecated badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"productimage_urlstring--",level:4},{value:'<code>Product.<b>name</b></code><Bullet></Bullet><code>String!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"productnamestring--",level:4},{value:'<code>Product.<b>order_quantities_by_status</b></code><Bullet></Bullet><code>[OrderQuantityByStatus!]!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"productorder_quantities_by_statusorderquantitybystatus--",level:4},{value:'<code>Product.<b>payment_options</b></code><Bullet></Bullet><code>[String!]!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"productpayment_optionsstring--",level:4},{value:'<code>Product.<b>pricing_structure</b></code><Bullet></Bullet><code>PricingStructure!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"productpricing_structurepricingstructure--",level:4},{value:'<code>Product.<b>product_variants</b></code><Bullet></Bullet><code>[ProductVariant!]!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"productproduct_variantsproductvariant--",level:4},{value:'<code>Product.<b>provides_ticket_type</b></code><Bullet></Bullet><code>TicketType</code> <Badge class="badge badge--secondary"></Badge>',id:"productprovides_ticket_typetickettype-",level:4},{value:"Member Of",id:"member-of",level:3}];function b(e){const d={a:"a",admonition:"admonition",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(d.p,{children:"No description"}),"\n",(0,s.jsx)(d.pre,{children:(0,s.jsx)(d.code,{className:"language-graphql",children:"type Product {\n  available: Boolean!\n  clickwrap_agreement: String\n  clickwrap_agreement_html: String\n  description: String\n  description_html: String\n  id: ID!\n  image: ActiveStorageAttachment\n  image_url: String @deprecated\n  name: String!\n  order_quantities_by_status: [OrderQuantityByStatus!]!\n  payment_options: [String!]!\n  pricing_structure: PricingStructure!\n  product_variants: [ProductVariant!]!\n  provides_ticket_type: TicketType\n}\n"})}),"\n",(0,s.jsx)(d.h3,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(d.h4,{id:"productavailableboolean--",children:[(0,s.jsx)(d.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Product.",(0,s.jsx)("b",{children:"available"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/scalars/boolean",children:(0,s.jsx)(d.code,{children:"Boolean!"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(d.h4,{id:"productclickwrap_agreementstring-",children:[(0,s.jsx)(d.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Product.",(0,s.jsx)("b",{children:"clickwrap_agreement"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(d.code,{children:"String"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(d.h4,{id:"productclickwrap_agreement_htmlstring-",children:[(0,s.jsx)(d.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Product.",(0,s.jsx)("b",{children:"clickwrap_agreement_html"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(d.code,{children:"String"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(d.h4,{id:"productdescriptionstring-",children:[(0,s.jsx)(d.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Product.",(0,s.jsx)("b",{children:"description"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(d.code,{children:"String"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(d.h4,{id:"productdescription_htmlstring-",children:[(0,s.jsx)(d.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Product.",(0,s.jsx)("b",{children:"description_html"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(d.code,{children:"String"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(d.h4,{id:"productidid--",children:[(0,s.jsx)(d.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Product.",(0,s.jsx)("b",{children:"id"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/scalars/id",children:(0,s.jsx)(d.code,{children:"ID!"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(d.h4,{id:"productimageactivestorageattachment-",children:[(0,s.jsx)(d.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Product.",(0,s.jsx)("b",{children:"image"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/objects/active-storage-attachment",children:(0,s.jsx)(d.code,{children:"ActiveStorageAttachment"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsxs)(d.h4,{id:"productimage_urlstring--",children:[(0,s.jsx)(d.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Product.",(0,s.jsx)("b",{children:"image_url"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(d.code,{children:"String"})})," ",(0,s.jsx)(h,{class:"badge badge--deprecated badge--secondary",text:"deprecated"})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsx)(d.admonition,{title:"DEPRECATED",type:"warning",children:(0,s.jsx)(d.p,{children:"Please use the image field instead."})}),"\n",(0,s.jsxs)(d.h4,{id:"productnamestring--",children:[(0,s.jsx)(d.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Product.",(0,s.jsx)("b",{children:"name"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(d.code,{children:"String!"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(d.h4,{id:"productorder_quantities_by_statusorderquantitybystatus--",children:[(0,s.jsx)(d.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Product.",(0,s.jsx)("b",{children:"order_quantities_by_status"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/objects/order-quantity-by-status",children:(0,s.jsx)(d.code,{children:"[OrderQuantityByStatus!]!"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsxs)(d.h4,{id:"productpayment_optionsstring--",children:[(0,s.jsx)(d.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Product.",(0,s.jsx)("b",{children:"payment_options"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/scalars/string",children:(0,s.jsx)(d.code,{children:"[String!]!"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,s.jsxs)(d.h4,{id:"productpricing_structurepricingstructure--",children:[(0,s.jsx)(d.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Product.",(0,s.jsx)("b",{children:"pricing_structure"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/objects/pricing-structure",children:(0,s.jsx)(d.code,{children:"PricingStructure!"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsxs)(d.h4,{id:"productproduct_variantsproductvariant--",children:[(0,s.jsx)(d.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Product.",(0,s.jsx)("b",{children:"product_variants"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/objects/product-variant",children:(0,s.jsx)(d.code,{children:"[ProductVariant!]!"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsxs)(d.h4,{id:"productprovides_ticket_typetickettype-",children:[(0,s.jsx)(d.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["Product.",(0,s.jsx)("b",{children:"provides_ticket_type"})]})}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/objects/ticket-type",children:(0,s.jsx)(d.code,{children:"TicketType"})})," ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,s.jsx)(d.h3,{id:"member-of",children:"Member Of"}),"\n",(0,s.jsxs)(d.p,{children:[(0,s.jsx)(d.a,{href:"/docs/graphql/types/objects/convention",children:(0,s.jsx)(d.code,{children:"Convention"})}),"  ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/objects/coupon",children:(0,s.jsx)(d.code,{children:"Coupon"})}),"  ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/objects/create-product-payload",children:(0,s.jsx)(d.code,{children:"CreateProductPayload"})}),"  ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/objects/delete-product-payload",children:(0,s.jsx)(d.code,{children:"DeleteProductPayload"})}),"  ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/objects/order-entry",children:(0,s.jsx)(d.code,{children:"OrderEntry"})}),"  ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/objects/product-variant",children:(0,s.jsx)(d.code,{children:"ProductVariant"})}),"  ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/objects/sales-count-by-product-and-payment-amount",children:(0,s.jsx)(d.code,{children:"SalesCountByProductAndPaymentAmount"})}),"  ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/objects/ticket-type",children:(0,s.jsx)(d.code,{children:"TicketType"})}),"  ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"}),(0,s.jsx)(i,{}),(0,s.jsx)(d.a,{href:"/docs/graphql/types/objects/update-product-payload",children:(0,s.jsx)(d.code,{children:"UpdateProductPayload"})}),"  ",(0,s.jsx)(h,{class:"badge badge--secondary",text:"object"})]})]})}function x(e={}){const{wrapper:d}={...(0,a.R)(),...e.components};return d?(0,s.jsx)(d,{...e,children:(0,s.jsx)(b,{...e})}):b(e)}},1422:(e,d,t)=>{t.d(d,{R:()=>r,x:()=>n});var s=t(62340);const a={},c=s.createContext(a);function r(e){const d=s.useContext(c);return s.useMemo((function(){return"function"==typeof e?e(d):{...d,...e}}),[d,e])}function n(e){let d;return d=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),s.createElement(c.Provider,{value:d},e.children)}}}]);