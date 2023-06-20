"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[42584],{75631:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>g});var r=a(45721);function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function n(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?n(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):n(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,r,o=function(e,t){if(null==e)return{};var a,r,o={},n=Object.keys(e);for(r=0;r<n.length;r++)a=n[r],t.indexOf(a)>=0||(o[a]=e[a]);return o}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(r=0;r<n.length;r++)a=n[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(o[a]=e[a])}return o}var d=r.createContext({}),s=function(e){var t=r.useContext(d),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},c=function(e){var t=s(e.components);return r.createElement(d.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var a=e.components,o=e.mdxType,n=e.originalType,d=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),p=s(a),u=o,g=p["".concat(d,".").concat(u)]||p[u]||m[u]||n;return a?r.createElement(g,l(l({ref:t},c),{},{components:a})):r.createElement(g,l({ref:t},c))}));function g(e,t){var a=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var n=a.length,l=new Array(n);l[0]=u;var i={};for(var d in t)hasOwnProperty.call(t,d)&&(i[d]=t[d]);i.originalType=e,i[p]="string"==typeof e?e:o,l[1]=i;for(var s=2;s<n;s++)l[s]=a[s];return r.createElement.apply(null,l)}return r.createElement.apply(null,a)}u.displayName="MDXCreateElement"},77411:(e,t,a)=>{a.r(t),a.d(t,{Badge:()=>u,Bullet:()=>p,SpecifiedBy:()=>m,assets:()=>s,contentTitle:()=>i,default:()=>f,frontMatter:()=>l,metadata:()=>d,toc:()=>c});var r=a(9715),o=a(45721),n=a(75631);const l={id:"email-route",title:"EmailRoute",hide_table_of_contents:!1},i=void 0,d={unversionedId:"graphql/objects/email-route",id:"graphql/objects/email-route",title:"EmailRoute",description:"No description",source:"@site/docs/graphql/objects/email-route.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/email-route",permalink:"/docs/graphql/objects/email-route",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/email-route.mdx",tags:[],version:"current",frontMatter:{id:"email-route",title:"EmailRoute",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"DropEventPayload",permalink:"/docs/graphql/objects/drop-event-payload"},next:{title:"EmailRoutesPagination",permalink:"/docs/graphql/objects/email-routes-pagination"}},s={},c=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>EmailRoute.<b>forward_addresses</b></code><Bullet /><code>[String!]</code> <Badge class="secondary" text="list"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-emailroutebforward_addressesbcodestring--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EmailRoute.<b>id</b></code><Bullet /><code>ID!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-emailroutebidbcodeid--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EmailRoute.<b>receiver_address</b></code><Bullet /><code>String!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-emailroutebreceiver_addressbcodestring--",level:4},{value:"Member of",id:"member-of",level:3}],p=()=>(0,n.kt)(o.Fragment,null,(0,n.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),m=e=>(0,n.kt)(o.Fragment,null,"Specification",(0,n.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),u=e=>(0,n.kt)(o.Fragment,null,(0,n.kt)("span",{class:"badge badge--"+e.class},e.text)),g={toc:c,Bullet:p,SpecifiedBy:m,Badge:u},y="wrapper";function f(e){let{components:t,...a}=e;return(0,n.kt)(y,(0,r.Z)({},g,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"No description"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-graphql"},"type EmailRoute {\n  forward_addresses: [String!]\n  id: ID!\n  receiver_address: String!\n}\n")),(0,n.kt)("h3",{id:"fields"},"Fields"),(0,n.kt)("h4",{id:"code-style-fontweight-normal-emailroutebforward_addressesbcodestring--"},(0,n.kt)("a",{parentName:"h4",href:"#"},(0,n.kt)("code",{style:{fontWeight:"normal"}},"EmailRoute.",(0,n.kt)("b",null,"forward_addresses"))),(0,n.kt)(p,{mdxType:"Bullet"}),(0,n.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,n.kt)("inlineCode",{parentName:"a"},"[String!]"))," ",(0,n.kt)(u,{class:"secondary",text:"list",mdxType:"Badge"})," ",(0,n.kt)(u,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,n.kt)("blockquote",null),(0,n.kt)("h4",{id:"code-style-fontweight-normal-emailroutebidbcodeid--"},(0,n.kt)("a",{parentName:"h4",href:"#"},(0,n.kt)("code",{style:{fontWeight:"normal"}},"EmailRoute.",(0,n.kt)("b",null,"id"))),(0,n.kt)(p,{mdxType:"Bullet"}),(0,n.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,n.kt)("inlineCode",{parentName:"a"},"ID!"))," ",(0,n.kt)(u,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,n.kt)(u,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,n.kt)("blockquote",null),(0,n.kt)("h4",{id:"code-style-fontweight-normal-emailroutebreceiver_addressbcodestring--"},(0,n.kt)("a",{parentName:"h4",href:"#"},(0,n.kt)("code",{style:{fontWeight:"normal"}},"EmailRoute.",(0,n.kt)("b",null,"receiver_address"))),(0,n.kt)(p,{mdxType:"Bullet"}),(0,n.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,n.kt)("inlineCode",{parentName:"a"},"String!"))," ",(0,n.kt)(u,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,n.kt)(u,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,n.kt)("blockquote",null),(0,n.kt)("h3",{id:"member-of"},"Member of"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"/docs/graphql/objects/create-email-route-payload"},(0,n.kt)("inlineCode",{parentName:"a"},"CreateEmailRoutePayload")),"  ",(0,n.kt)(u,{class:"secondary",text:"object",mdxType:"Badge"}),(0,n.kt)(p,{mdxType:"Bullet"}),(0,n.kt)("a",{parentName:"p",href:"/docs/graphql/objects/delete-email-route-payload"},(0,n.kt)("inlineCode",{parentName:"a"},"DeleteEmailRoutePayload")),"  ",(0,n.kt)(u,{class:"secondary",text:"object",mdxType:"Badge"}),(0,n.kt)(p,{mdxType:"Bullet"}),(0,n.kt)("a",{parentName:"p",href:"/docs/graphql/objects/email-routes-pagination"},(0,n.kt)("inlineCode",{parentName:"a"},"EmailRoutesPagination")),"  ",(0,n.kt)(u,{class:"secondary",text:"object",mdxType:"Badge"}),(0,n.kt)(p,{mdxType:"Bullet"}),(0,n.kt)("a",{parentName:"p",href:"/docs/graphql/objects/update-email-route-payload"},(0,n.kt)("inlineCode",{parentName:"a"},"UpdateEmailRoutePayload")),"  ",(0,n.kt)(u,{class:"secondary",text:"object",mdxType:"Badge"})))}f.isMDXComponent=!0}}]);