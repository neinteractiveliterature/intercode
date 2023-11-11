"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[61827],{75631:(e,t,o)=>{o.d(t,{Zo:()=>p,kt:()=>y});var a=o(45721);function r(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function n(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,a)}return o}function l(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?n(Object(o),!0).forEach((function(t){r(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):n(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function d(e,t){if(null==e)return{};var o,a,r=function(e,t){if(null==e)return{};var o,a,r={},n=Object.keys(e);for(a=0;a<n.length;a++)o=n[a],t.indexOf(o)>=0||(r[o]=e[o]);return r}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(a=0;a<n.length;a++)o=n[a],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}var c=a.createContext({}),i=function(e){var t=a.useContext(c),o=t;return e&&(o="function"==typeof e?e(t):l(l({},t),e)),o},p=function(e){var t=i(e.components);return a.createElement(c.Provider,{value:t},e.children)},s="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var o=e.components,r=e.mdxType,n=e.originalType,c=e.parentName,p=d(e,["components","mdxType","originalType","parentName"]),s=i(o),m=r,y=s["".concat(c,".").concat(m)]||s[m]||u[m]||n;return o?a.createElement(y,l(l({ref:t},p),{},{components:o})):a.createElement(y,l({ref:t},p))}));function y(e,t){var o=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var n=o.length,l=new Array(n);l[0]=m;var d={};for(var c in t)hasOwnProperty.call(t,c)&&(d[c]=t[c]);d.originalType=e,d[s]="string"==typeof e?e:r,l[1]=d;for(var i=2;i<n;i++)l[i]=o[i];return a.createElement.apply(null,l)}return a.createElement.apply(null,o)}m.displayName="MDXCreateElement"},19900:(e,t,o)=>{o.r(t),o.d(t,{Badge:()=>m,Bullet:()=>s,SpecifiedBy:()=>u,assets:()=>i,contentTitle:()=>d,default:()=>g,frontMatter:()=>l,metadata:()=>c,toc:()=>p});var a=o(11330),r=o(45721),n=o(75631);const l={id:"update-room-payload",title:"UpdateRoomPayload",hide_table_of_contents:!1},d=void 0,c={unversionedId:"graphql/objects/update-room-payload",id:"graphql/objects/update-room-payload",title:"UpdateRoomPayload",description:"Autogenerated return type of UpdateRoom.",source:"@site/docs/graphql/objects/update-room-payload.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/update-room-payload",permalink:"/docs/graphql/objects/update-room-payload",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/update-room-payload.mdx",tags:[],version:"current",frontMatter:{id:"update-room-payload",title:"UpdateRoomPayload",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"UpdateProductPayload",permalink:"/docs/graphql/objects/update-product-payload"},next:{title:"UpdateRootSitePayload",permalink:"/docs/graphql/objects/update-root-site-payload"}},i={},p=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateRoomPayload.<b>clientMutationId</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-updateroompayloadbclientmutationidbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>UpdateRoomPayload.<b>room</b></code><Bullet /><code>Room!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="object"/>',id:"code-style-fontweight-normal-updateroompayloadbroombcoderoom--",level:4},{value:"Returned by",id:"returned-by",level:3}],s=()=>(0,n.kt)(r.Fragment,null,(0,n.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),u=e=>(0,n.kt)(r.Fragment,null,"Specification",(0,n.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),m=e=>(0,n.kt)(r.Fragment,null,(0,n.kt)("span",{class:"badge badge--"+e.class},e.text)),y={toc:p,Bullet:s,SpecifiedBy:u,Badge:m},f="wrapper";function g(e){let{components:t,...o}=e;return(0,n.kt)(f,(0,a.Z)({},y,o,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Autogenerated return type of UpdateRoom."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-graphql"},"type UpdateRoomPayload {\n  clientMutationId: String\n  room: Room!\n}\n")),(0,n.kt)("h3",{id:"fields"},"Fields"),(0,n.kt)("h4",{id:"code-style-fontweight-normal-updateroompayloadbclientmutationidbcodestring-"},(0,n.kt)("a",{parentName:"h4",href:"#"},(0,n.kt)("code",{style:{fontWeight:"normal"}},"UpdateRoomPayload.",(0,n.kt)("b",null,"clientMutationId"))),(0,n.kt)(s,{mdxType:"Bullet"}),(0,n.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,n.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,n.kt)(m,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"A unique identifier for the client performing the mutation.")),(0,n.kt)("h4",{id:"code-style-fontweight-normal-updateroompayloadbroombcoderoom--"},(0,n.kt)("a",{parentName:"h4",href:"#"},(0,n.kt)("code",{style:{fontWeight:"normal"}},"UpdateRoomPayload.",(0,n.kt)("b",null,"room"))),(0,n.kt)(s,{mdxType:"Bullet"}),(0,n.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/room"},(0,n.kt)("inlineCode",{parentName:"a"},"Room!"))," ",(0,n.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,n.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"})),(0,n.kt)("blockquote",null),(0,n.kt)("h3",{id:"returned-by"},"Returned by"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"/docs/graphql/mutations/update-room"},(0,n.kt)("inlineCode",{parentName:"a"},"updateRoom")),"  ",(0,n.kt)(m,{class:"secondary",text:"mutation",mdxType:"Badge"})))}g.isMDXComponent=!0}}]);