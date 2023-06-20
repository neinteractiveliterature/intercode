"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[53965],{75631:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>g});var a=n(45721);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var i=a.createContext({}),s=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},d=function(e){var t=s(e.components);return a.createElement(i.Provider,{value:t},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,i=e.parentName,d=c(e,["components","mdxType","originalType","parentName"]),p=s(n),m=o,g=p["".concat(i,".").concat(m)]||p[m]||u[m]||r;return n?a.createElement(g,l(l({ref:t},d),{},{components:n})):a.createElement(g,l({ref:t},d))}));function g(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,l=new Array(r);l[0]=m;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c[p]="string"==typeof e?e:o,l[1]=c;for(var s=2;s<r;s++)l[s]=n[s];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},31624:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>m,Bullet:()=>p,SpecifiedBy:()=>u,assets:()=>s,contentTitle:()=>c,default:()=>y,frontMatter:()=>l,metadata:()=>i,toc:()=>d});var a=n(9715),o=n(45721),r=n(75631);const l={id:"stripe-account",title:"StripeAccount",hide_table_of_contents:!1},c=void 0,i={unversionedId:"graphql/objects/stripe-account",id:"graphql/objects/stripe-account",title:"StripeAccount",description:"No description",source:"@site/docs/graphql/objects/stripe-account.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/stripe-account",permalink:"/docs/graphql/objects/stripe-account",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/stripe-account.mdx",tags:[],version:"current",frontMatter:{id:"stripe-account",title:"StripeAccount",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"StaffPosition",permalink:"/docs/graphql/objects/staff-position"},next:{title:"SubmitEventProposalPayload",permalink:"/docs/graphql/objects/submit-event-proposal-payload"}},s={},d=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>StripeAccount.<b>account_onboarding_link</b></code><Bullet /><code>String!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-stripeaccountbaccount_onboarding_linkbcodestring--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>StripeAccount.<b>charges_enabled</b></code><Bullet /><code>Boolean!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-stripeaccountbcharges_enabledbcodeboolean--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>StripeAccount.<b>display_name</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-stripeaccountbdisplay_namebcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>StripeAccount.<b>email</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-stripeaccountbemailbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>StripeAccount.<b>id</b></code><Bullet /><code>ID!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-stripeaccountbidbcodeid--",level:4},{value:"Member of",id:"member-of",level:3}],p=()=>(0,r.kt)(o.Fragment,null,(0,r.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),u=e=>(0,r.kt)(o.Fragment,null,"Specification",(0,r.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),m=e=>(0,r.kt)(o.Fragment,null,(0,r.kt)("span",{class:"badge badge--"+e.class},e.text)),g={toc:d,Bullet:p,SpecifiedBy:u,Badge:m},b="wrapper";function y(e){let{components:t,...n}=e;return(0,r.kt)(b,(0,a.Z)({},g,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"No description"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-graphql"},"type StripeAccount {\n  account_onboarding_link(\n  base_url: String!\n): String!\n  charges_enabled: Boolean!\n  display_name: String\n  email: String\n  id: ID!\n}\n")),(0,r.kt)("h3",{id:"fields"},"Fields"),(0,r.kt)("h4",{id:"code-style-fontweight-normal-stripeaccountbaccount_onboarding_linkbcodestring--"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("code",{style:{fontWeight:"normal"}},"StripeAccount.",(0,r.kt)("b",null,"account_onboarding_link"))),(0,r.kt)(p,{mdxType:"Bullet"}),(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String!"))," ",(0,r.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,r.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,r.kt)("blockquote",null,(0,r.kt)("h5",{parentName:"blockquote",id:"code-style-fontweight-normal-stripeaccountaccount_onboarding_linkbbase_urlbcodestring--"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("code",{style:{fontWeight:"normal"}},"StripeAccount.account_onboarding_link.",(0,r.kt)("b",null,"base_url"))),(0,r.kt)(p,{mdxType:"Bullet"}),(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String!"))," ",(0,r.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,r.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"}))),(0,r.kt)("h4",{id:"code-style-fontweight-normal-stripeaccountbcharges_enabledbcodeboolean--"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("code",{style:{fontWeight:"normal"}},"StripeAccount.",(0,r.kt)("b",null,"charges_enabled"))),(0,r.kt)(p,{mdxType:"Bullet"}),(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,r.kt)("inlineCode",{parentName:"a"},"Boolean!"))," ",(0,r.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,r.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,r.kt)("blockquote",null),(0,r.kt)("h4",{id:"code-style-fontweight-normal-stripeaccountbdisplay_namebcodestring-"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("code",{style:{fontWeight:"normal"}},"StripeAccount.",(0,r.kt)("b",null,"display_name"))),(0,r.kt)(p,{mdxType:"Bullet"}),(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,r.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,r.kt)("blockquote",null),(0,r.kt)("h4",{id:"code-style-fontweight-normal-stripeaccountbemailbcodestring-"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("code",{style:{fontWeight:"normal"}},"StripeAccount.",(0,r.kt)("b",null,"email"))),(0,r.kt)(p,{mdxType:"Bullet"}),(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,r.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,r.kt)("blockquote",null),(0,r.kt)("h4",{id:"code-style-fontweight-normal-stripeaccountbidbcodeid--"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("code",{style:{fontWeight:"normal"}},"StripeAccount.",(0,r.kt)("b",null,"id"))),(0,r.kt)(p,{mdxType:"Bullet"}),(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,r.kt)("inlineCode",{parentName:"a"},"ID!"))," ",(0,r.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,r.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,r.kt)("blockquote",null),(0,r.kt)("h3",{id:"member-of"},"Member of"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"/docs/graphql/objects/convention"},(0,r.kt)("inlineCode",{parentName:"a"},"Convention")),"  ",(0,r.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"}),(0,r.kt)(p,{mdxType:"Bullet"}),(0,r.kt)("a",{parentName:"p",href:"/docs/graphql/objects/create-convention-stripe-account-payload"},(0,r.kt)("inlineCode",{parentName:"a"},"CreateConventionStripeAccountPayload")),"  ",(0,r.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"})))}y.isMDXComponent=!0}}]);