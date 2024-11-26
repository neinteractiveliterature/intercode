"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[16937],{96746:(e,n,t)=>{t.r(n),t.d(n,{Badge:()=>u,Bullet:()=>l,Details:()=>h,SpecifiedBy:()=>p,assets:()=>r,contentTitle:()=>a,default:()=>j,frontMatter:()=>i,metadata:()=>s,toc:()=>x});const s=JSON.parse('{"id":"graphql/types/inputs/coupon-input","title":"CouponInput","description":"No description","source":"@site/docs/graphql/types/inputs/coupon-input.mdx","sourceDirName":"graphql/types/inputs","slug":"/graphql/types/inputs/coupon-input","permalink":"/docs/graphql/types/inputs/coupon-input","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/inputs/coupon-input.mdx","tags":[],"version":"current","frontMatter":{"id":"coupon-input","title":"CouponInput"},"sidebar":"sidebar","previous":{"title":"CouponFiltersInput","permalink":"/docs/graphql/types/inputs/coupon-filters-input"},"next":{"title":"CreateCmsContentGroupInput","permalink":"/docs/graphql/types/inputs/create-cms-content-group-input"}}');var o=t(58040),d=t(5365),c=t(62340);const i={id:"coupon-input",title:"CouponInput"},a=void 0,r={},l=()=>{const e={span:"span",...(0,d.R)()};return(0,o.jsx)(o.Fragment,{children:(0,o.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const n={a:"a",...(0,d.R)()};return(0,o.jsxs)(o.Fragment,{children:["Specification",(0,o.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const n={span:"span",...(0,d.R)()};return(0,o.jsx)(o.Fragment,{children:(0,o.jsx)(n.span,{className:e.class,children:e.text})})},h=({dataOpen:e,dataClose:n,children:t,startOpen:s=!1})=>{const i={details:"details",summary:"summary",...(0,d.R)()},[a,r]=(0,c.useState)(s);return(0,o.jsxs)(i.details,{...a?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,o.jsx)(i.summary,{onClick:e=>{e.preventDefault(),r((e=>!e))},style:{listStyle:"none"},children:a?e:n}),a&&t]})},x=[{value:"Fields",id:"fields",level:3},{value:'<code>CouponInput.<b>code</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"couponinputcodestring-",level:4},{value:'<code>CouponInput.<b>expires_at</b></code><Bullet></Bullet><code>Date</code> <Badge class="badge badge--secondary"></Badge>',id:"couponinputexpires_atdate-",level:4},{value:'<code>CouponInput.<b>fixed_amount</b></code><Bullet></Bullet><code>MoneyInput</code> <Badge class="badge badge--secondary"></Badge>',id:"couponinputfixed_amountmoneyinput-",level:4},{value:'<code>CouponInput.<b>percent_discount</b></code><Bullet></Bullet><code>BigDecimal</code> <Badge class="badge badge--secondary"></Badge>',id:"couponinputpercent_discountbigdecimal-",level:4},{value:'<code>CouponInput.<b>providesProductId</b></code><Bullet></Bullet><code>ID</code> <Badge class="badge badge--secondary"></Badge>',id:"couponinputprovidesproductidid-",level:4},{value:'<code>CouponInput.<b>usage_limit</b></code><Bullet></Bullet><code>Int</code> <Badge class="badge badge--secondary"></Badge>',id:"couponinputusage_limitint-",level:4},{value:"Member Of",id:"member-of",level:3}];function g(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,d.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.p,{children:"No description"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-graphql",children:"input CouponInput {\n  code: String\n  expires_at: Date\n  fixed_amount: MoneyInput\n  percent_discount: BigDecimal\n  providesProductId: ID\n  usage_limit: Int\n}\n"})}),"\n",(0,o.jsx)(n.h3,{id:"fields",children:"Fields"}),"\n",(0,o.jsxs)(n.h4,{id:"couponinputcodestring-",children:[(0,o.jsx)(n.a,{href:"#",children:(0,o.jsxs)("code",{style:{fontWeight:"normal"},children:["CouponInput.",(0,o.jsx)("b",{children:"code"})]})}),(0,o.jsx)(l,{}),(0,o.jsx)(n.a,{href:"/docs/graphql/types/scalars/string",children:(0,o.jsx)(n.code,{children:"String"})})," ",(0,o.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,o.jsxs)(n.h4,{id:"couponinputexpires_atdate-",children:[(0,o.jsx)(n.a,{href:"#",children:(0,o.jsxs)("code",{style:{fontWeight:"normal"},children:["CouponInput.",(0,o.jsx)("b",{children:"expires_at"})]})}),(0,o.jsx)(l,{}),(0,o.jsx)(n.a,{href:"/docs/graphql/types/scalars/date",children:(0,o.jsx)(n.code,{children:"Date"})})," ",(0,o.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,o.jsxs)(n.h4,{id:"couponinputfixed_amountmoneyinput-",children:[(0,o.jsx)(n.a,{href:"#",children:(0,o.jsxs)("code",{style:{fontWeight:"normal"},children:["CouponInput.",(0,o.jsx)("b",{children:"fixed_amount"})]})}),(0,o.jsx)(l,{}),(0,o.jsx)(n.a,{href:"/docs/graphql/types/inputs/money-input",children:(0,o.jsx)(n.code,{children:"MoneyInput"})})," ",(0,o.jsx)(u,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,o.jsxs)(n.h4,{id:"couponinputpercent_discountbigdecimal-",children:[(0,o.jsx)(n.a,{href:"#",children:(0,o.jsxs)("code",{style:{fontWeight:"normal"},children:["CouponInput.",(0,o.jsx)("b",{children:"percent_discount"})]})}),(0,o.jsx)(l,{}),(0,o.jsx)(n.a,{href:"/docs/graphql/types/scalars/big-decimal",children:(0,o.jsx)(n.code,{children:"BigDecimal"})})," ",(0,o.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,o.jsxs)(n.h4,{id:"couponinputprovidesproductidid-",children:[(0,o.jsx)(n.a,{href:"#",children:(0,o.jsxs)("code",{style:{fontWeight:"normal"},children:["CouponInput.",(0,o.jsx)("b",{children:"providesProductId"})]})}),(0,o.jsx)(l,{}),(0,o.jsx)(n.a,{href:"/docs/graphql/types/scalars/id",children:(0,o.jsx)(n.code,{children:"ID"})})," ",(0,o.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,o.jsxs)(n.h4,{id:"couponinputusage_limitint-",children:[(0,o.jsx)(n.a,{href:"#",children:(0,o.jsxs)("code",{style:{fontWeight:"normal"},children:["CouponInput.",(0,o.jsx)("b",{children:"usage_limit"})]})}),(0,o.jsx)(l,{}),(0,o.jsx)(n.a,{href:"/docs/graphql/types/scalars/int",children:(0,o.jsx)(n.code,{children:"Int"})})," ",(0,o.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,o.jsx)(n.h3,{id:"member-of",children:"Member Of"}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.a,{href:"/docs/graphql/types/inputs/create-coupon-input",children:(0,o.jsx)(n.code,{children:"CreateCouponInput"})}),"  ",(0,o.jsx)(u,{class:"badge badge--secondary",text:"input"}),(0,o.jsx)(l,{}),(0,o.jsx)(n.a,{href:"/docs/graphql/types/inputs/update-coupon-input",children:(0,o.jsx)(n.code,{children:"UpdateCouponInput"})}),"  ",(0,o.jsx)(u,{class:"badge badge--secondary",text:"input"})]})]})}function j(e={}){const{wrapper:n}={...(0,d.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(g,{...e})}):g(e)}},5365:(e,n,t)=>{t.d(n,{R:()=>c,x:()=>i});var s=t(62340);const o={},d=s.createContext(o);function c(e){const n=s.useContext(d);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:c(e.components),s.createElement(d.Provider,{value:n},e.children)}}}]);