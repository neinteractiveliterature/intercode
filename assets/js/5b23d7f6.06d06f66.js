"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[43075],{75631:(e,t,a)=>{a.d(t,{Zo:()=>l,kt:()=>k});var n=a(45721);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function p(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?p(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):p(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},p=Object.keys(e);for(n=0;n<p.length;n++)a=p[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(n=0;n<p.length;n++)a=p[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),d=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},l=function(e){var t=d(e.components);return n.createElement(i.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,p=e.originalType,i=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),m=d(a),k=r,u=m["".concat(i,".").concat(k)]||m[k]||c[k]||p;return a?n.createElement(u,o(o({ref:t},l),{},{components:a})):n.createElement(u,o({ref:t},l))}));function k(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var p=a.length,o=new Array(p);o[0]=m;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var d=2;d<p;d++)o[d]=a[d];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},56138:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>k,Bullet:()=>c,SpecifiedBy:()=>m,assets:()=>d,contentTitle:()=>s,default:()=>y,frontMatter:()=>o,metadata:()=>i,toc:()=>l});var n=a(50524),r=a(45721),p=a(75631);const o={id:"int",title:"Int",hide_table_of_contents:!1},s=void 0,i={unversionedId:"graphql/scalars/int",id:"graphql/scalars/int",title:"Int",description:"The Int scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.",source:"@site/docs/graphql/scalars/int.mdx",sourceDirName:"graphql/scalars",slug:"/graphql/scalars/int",permalink:"/docs/graphql/scalars/int",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/scalars/int.mdx",tags:[],version:"current",frontMatter:{id:"int",title:"Int",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"ID",permalink:"/docs/graphql/scalars/id"},next:{title:"Json",permalink:"/docs/graphql/scalars/json"}},d={},l=[{value:"Member of",id:"member-of",level:3}],c=()=>(0,p.kt)(r.Fragment,null,(0,p.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),m=e=>(0,p.kt)(r.Fragment,null,"Specification",(0,p.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),k=e=>(0,p.kt)(r.Fragment,null,(0,p.kt)("span",{class:"badge badge--"+e.class},e.text)),u={toc:l,Bullet:c,SpecifiedBy:m,Badge:k};function y(e){let{components:t,...a}=e;return(0,p.kt)("wrapper",(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,p.kt)("p",null,"The ",(0,p.kt)("inlineCode",{parentName:"p"},"Int")," scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1."),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-graphql"},"scalar Int\n")),(0,p.kt)("h3",{id:"member-of"},"Member of"),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/active-storage-attachment"},(0,p.kt)("inlineCode",{parentName:"a"},"ActiveStorageAttachment")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/choice-count"},(0,p.kt)("inlineCode",{parentName:"a"},"ChoiceCount")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/cms-navigation-item"},(0,p.kt)("inlineCode",{parentName:"a"},"CmsNavigationItem")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/cms-navigation-item-input"},(0,p.kt)("inlineCode",{parentName:"a"},"CmsNavigationItemInput")),"  ",(0,p.kt)(k,{class:"secondary",text:"input",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/convention"},(0,p.kt)("inlineCode",{parentName:"a"},"Convention")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/convention-input"},(0,p.kt)("inlineCode",{parentName:"a"},"ConventionInput")),"  ",(0,p.kt)(k,{class:"secondary",text:"input",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/queries/conventions-paginated"},(0,p.kt)("inlineCode",{parentName:"a"},"conventions_paginated")),"  ",(0,p.kt)(k,{class:"secondary",text:"query",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/conventions-pagination"},(0,p.kt)("inlineCode",{parentName:"a"},"ConventionsPagination")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/coupon"},(0,p.kt)("inlineCode",{parentName:"a"},"Coupon")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/coupon-input"},(0,p.kt)("inlineCode",{parentName:"a"},"CouponInput")),"  ",(0,p.kt)(k,{class:"secondary",text:"input",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/coupons-pagination"},(0,p.kt)("inlineCode",{parentName:"a"},"CouponsPagination")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/create-maximum-event-provided-tickets-override-input"},(0,p.kt)("inlineCode",{parentName:"a"},"CreateMaximumEventProvidedTicketsOverrideInput")),"  ",(0,p.kt)(k,{class:"secondary",text:"input",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/queries/email-routes-paginated"},(0,p.kt)("inlineCode",{parentName:"a"},"email_routes_paginated")),"  ",(0,p.kt)(k,{class:"secondary",text:"query",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/email-routes-pagination"},(0,p.kt)("inlineCode",{parentName:"a"},"EmailRoutesPagination")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/event"},(0,p.kt)("inlineCode",{parentName:"a"},"Event")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/event-filters-input"},(0,p.kt)("inlineCode",{parentName:"a"},"EventFiltersInput")),"  ",(0,p.kt)(k,{class:"secondary",text:"input",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/event-proposal"},(0,p.kt)("inlineCode",{parentName:"a"},"EventProposal")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/event-proposal-filters-input"},(0,p.kt)("inlineCode",{parentName:"a"},"EventProposalFiltersInput")),"  ",(0,p.kt)(k,{class:"secondary",text:"input",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/event-proposals-pagination"},(0,p.kt)("inlineCode",{parentName:"a"},"EventProposalsPagination")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/events-pagination"},(0,p.kt)("inlineCode",{parentName:"a"},"EventsPagination")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/form-item"},(0,p.kt)("inlineCode",{parentName:"a"},"FormItem")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/form-section"},(0,p.kt)("inlineCode",{parentName:"a"},"FormSection")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/maximum-event-provided-tickets-override"},(0,p.kt)("inlineCode",{parentName:"a"},"MaximumEventProvidedTicketsOverride")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/money"},(0,p.kt)("inlineCode",{parentName:"a"},"Money")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/money-input"},(0,p.kt)("inlineCode",{parentName:"a"},"MoneyInput")),"  ",(0,p.kt)(k,{class:"secondary",text:"input",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/move-form-item-input"},(0,p.kt)("inlineCode",{parentName:"a"},"MoveFormItemInput")),"  ",(0,p.kt)(k,{class:"secondary",text:"input",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/move-form-section-input"},(0,p.kt)("inlineCode",{parentName:"a"},"MoveFormSectionInput")),"  ",(0,p.kt)(k,{class:"secondary",text:"input",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/order-entry"},(0,p.kt)("inlineCode",{parentName:"a"},"OrderEntry")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/order-entry-input"},(0,p.kt)("inlineCode",{parentName:"a"},"OrderEntryInput")),"  ",(0,p.kt)(k,{class:"secondary",text:"input",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/order-quantity-by-status"},(0,p.kt)("inlineCode",{parentName:"a"},"OrderQuantityByStatus")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/orders-pagination"},(0,p.kt)("inlineCode",{parentName:"a"},"OrdersPagination")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/interfaces/pagination-interface"},(0,p.kt)("inlineCode",{parentName:"a"},"PaginationInterface")),"  ",(0,p.kt)(k,{class:"secondary",text:"interface",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/product-variant"},(0,p.kt)("inlineCode",{parentName:"a"},"ProductVariant")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/rate-event-input"},(0,p.kt)("inlineCode",{parentName:"a"},"RateEventInput")),"  ",(0,p.kt)(k,{class:"secondary",text:"input",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/registration-policy"},(0,p.kt)("inlineCode",{parentName:"a"},"RegistrationPolicy")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/registration-policy-bucket"},(0,p.kt)("inlineCode",{parentName:"a"},"RegistrationPolicyBucket")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/run"},(0,p.kt)("inlineCode",{parentName:"a"},"Run")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/search-result"},(0,p.kt)("inlineCode",{parentName:"a"},"SearchResult")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/signup"},(0,p.kt)("inlineCode",{parentName:"a"},"Signup")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/signup-changes-pagination"},(0,p.kt)("inlineCode",{parentName:"a"},"SignupChangesPagination")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/signup-count-by-state"},(0,p.kt)("inlineCode",{parentName:"a"},"SignupCountByState")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/signup-move-result"},(0,p.kt)("inlineCode",{parentName:"a"},"SignupMoveResult")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/signup-requests-pagination"},(0,p.kt)("inlineCode",{parentName:"a"},"SignupRequestsPagination")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/signups-pagination"},(0,p.kt)("inlineCode",{parentName:"a"},"SignupsPagination")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/ticket-count-by-type-and-payment-amount"},(0,p.kt)("inlineCode",{parentName:"a"},"TicketCountByTypeAndPaymentAmount")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/ticket-type"},(0,p.kt)("inlineCode",{parentName:"a"},"TicketType")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/ticket-type-input"},(0,p.kt)("inlineCode",{parentName:"a"},"TicketTypeInput")),"  ",(0,p.kt)(k,{class:"secondary",text:"input",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/inputs/update-maximum-event-provided-tickets-override-input"},(0,p.kt)("inlineCode",{parentName:"a"},"UpdateMaximumEventProvidedTicketsOverrideInput")),"  ",(0,p.kt)(k,{class:"secondary",text:"input",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/user-con-profile"},(0,p.kt)("inlineCode",{parentName:"a"},"UserConProfile")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/user-con-profiles-pagination"},(0,p.kt)("inlineCode",{parentName:"a"},"UserConProfilesPagination")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/queries/users-paginated"},(0,p.kt)("inlineCode",{parentName:"a"},"users_paginated")),"  ",(0,p.kt)(k,{class:"secondary",text:"query",mdxType:"Badge"}),(0,p.kt)(c,{mdxType:"Bullet"}),(0,p.kt)("a",{parentName:"p",href:"/docs/graphql/objects/users-pagination"},(0,p.kt)("inlineCode",{parentName:"a"},"UsersPagination")),"  ",(0,p.kt)(k,{class:"secondary",text:"object",mdxType:"Badge"})))}y.isMDXComponent=!0}}]);