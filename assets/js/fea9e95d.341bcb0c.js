"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[35639],{75631:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>f});var a=r(45721);function l(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){l(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,a,l=function(e,t){if(null==e)return{};var r,a,l={},n=Object.keys(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||(l[r]=e[r]);return l}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(l[r]=e[r])}return l}var c=a.createContext({}),d=function(e){var t=a.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},s=function(e){var t=d(e.components);return a.createElement(c.Provider,{value:t},e.children)},y="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var r=e.components,l=e.mdxType,n=e.originalType,c=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),y=d(r),u=l,f=y["".concat(c,".").concat(u)]||y[u]||p[u]||n;return r?a.createElement(f,i(i({ref:t},s),{},{components:r})):a.createElement(f,i({ref:t},s))}));function f(e,t){var r=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var n=r.length,i=new Array(n);i[0]=u;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o[y]="string"==typeof e?e:l,i[1]=o;for(var d=2;d<n;d++)i[d]=r[d];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}u.displayName="MDXCreateElement"},39166:(e,t,r)=>{r.r(t),r.d(t,{Badge:()=>u,Bullet:()=>y,SpecifiedBy:()=>p,assets:()=>d,contentTitle:()=>o,default:()=>g,frontMatter:()=>i,metadata:()=>c,toc:()=>s});var a=r(9715),l=r(45721),n=r(75631);const i={id:"delete-user-activity-alert-payload",title:"DeleteUserActivityAlertPayload",hide_table_of_contents:!1},o=void 0,c={unversionedId:"graphql/objects/delete-user-activity-alert-payload",id:"graphql/objects/delete-user-activity-alert-payload",title:"DeleteUserActivityAlertPayload",description:"Autogenerated return type of DeleteUserActivityAlert.",source:"@site/docs/graphql/objects/delete-user-activity-alert-payload.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/delete-user-activity-alert-payload",permalink:"/docs/graphql/objects/delete-user-activity-alert-payload",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/delete-user-activity-alert-payload.mdx",tags:[],version:"current",frontMatter:{id:"delete-user-activity-alert-payload",title:"DeleteUserActivityAlertPayload",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"DeleteTicketTypePayload",permalink:"/docs/graphql/objects/delete-ticket-type-payload"},next:{title:"DeleteUserConProfilePayload",permalink:"/docs/graphql/objects/delete-user-con-profile-payload"}},d={},s=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>DeleteUserActivityAlertPayload.<b>clientMutationId</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-deleteuseractivityalertpayloadbclientmutationidbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>DeleteUserActivityAlertPayload.<b>user_activity_alert</b></code><Bullet /><code>UserActivityAlert!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-deleteuseractivityalertpayloadbuser_activity_alertbcodeuseractivityalert--",level:4},{value:"Returned by",id:"returned-by",level:3}],y=()=>(0,n.kt)(l.Fragment,null,(0,n.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),p=e=>(0,n.kt)(l.Fragment,null,"Specification",(0,n.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),u=e=>(0,n.kt)(l.Fragment,null,(0,n.kt)("span",{class:"badge badge--"+e.class},e.text)),f={toc:s,Bullet:y,SpecifiedBy:p,Badge:u},m="wrapper";function g(e){let{components:t,...r}=e;return(0,n.kt)(m,(0,a.Z)({},f,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Autogenerated return type of DeleteUserActivityAlert."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-graphql"},"type DeleteUserActivityAlertPayload {\n  clientMutationId: String\n  user_activity_alert: UserActivityAlert!\n}\n")),(0,n.kt)("h3",{id:"fields"},"Fields"),(0,n.kt)("h4",{id:"code-style-fontweight-normal-deleteuseractivityalertpayloadbclientmutationidbcodestring-"},(0,n.kt)("a",{parentName:"h4",href:"#"},(0,n.kt)("code",{style:{fontWeight:"normal"}},"DeleteUserActivityAlertPayload.",(0,n.kt)("b",null,"clientMutationId"))),(0,n.kt)(y,{mdxType:"Bullet"}),(0,n.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,n.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,n.kt)(u,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"A unique identifier for the client performing the mutation.")),(0,n.kt)("h4",{id:"code-style-fontweight-normal-deleteuseractivityalertpayloadbuser_activity_alertbcodeuseractivityalert--"},(0,n.kt)("a",{parentName:"h4",href:"#"},(0,n.kt)("code",{style:{fontWeight:"normal"}},"DeleteUserActivityAlertPayload.",(0,n.kt)("b",null,"user_activity_alert"))),(0,n.kt)(y,{mdxType:"Bullet"}),(0,n.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/user-activity-alert"},(0,n.kt)("inlineCode",{parentName:"a"},"UserActivityAlert!"))," ",(0,n.kt)(u,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,n.kt)(u,{class:"secondary",text:"object",mdxType:"Badge"})),(0,n.kt)("blockquote",null),(0,n.kt)("h3",{id:"returned-by"},"Returned by"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"/docs/graphql/mutations/delete-user-activity-alert"},(0,n.kt)("inlineCode",{parentName:"a"},"deleteUserActivityAlert")),"  ",(0,n.kt)(u,{class:"secondary",text:"mutation",mdxType:"Badge"})))}g.isMDXComponent=!0}}]);