"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[9293],{75631:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>g});var r=n(45721);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var o=r.createContext({}),s=function(e){var t=r.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=s(e.components);return r.createElement(o.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,o=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),d=s(n),g=a,m=d["".concat(o,".").concat(g)]||d[g]||p[g]||i;return n?r.createElement(m,l(l({ref:t},c),{},{components:n})):r.createElement(m,l({ref:t},c))}));function g(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,l=new Array(i);l[0]=d;var u={};for(var o in t)hasOwnProperty.call(t,o)&&(u[o]=t[o]);u.originalType=e,u.mdxType="string"==typeof e?e:a,l[1]=u;for(var s=2;s<i;s++)l[s]=n[s];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1459:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>g,Bullet:()=>p,SpecifiedBy:()=>d,assets:()=>s,contentTitle:()=>u,default:()=>f,frontMatter:()=>l,metadata:()=>o,toc:()=>c});var r=n(50524),a=n(45721),i=n(75631);const l={id:"create-signup-request-input",title:"CreateSignupRequestInput",hide_table_of_contents:!1},u=void 0,o={unversionedId:"graphql/inputs/create-signup-request-input",id:"graphql/inputs/create-signup-request-input",title:"CreateSignupRequestInput",description:"Autogenerated input type of CreateSignupRequest",source:"@site/docs/graphql/inputs/create-signup-request-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/create-signup-request-input",permalink:"/docs/graphql/inputs/create-signup-request-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/create-signup-request-input.mdx",tags:[],version:"current",frontMatter:{id:"create-signup-request-input",title:"CreateSignupRequestInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"CreateRunInput",permalink:"/docs/graphql/inputs/create-run-input"},next:{title:"CreateStaffPositionInput",permalink:"/docs/graphql/inputs/create-staff-position-input"}},s={},c=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>CreateSignupRequestInput.<b>clientMutationId</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-createsignuprequestinputbclientmutationidbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>CreateSignupRequestInput.<b>replaceSignupId</b></code><Bullet /><code>ID</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-createsignuprequestinputbreplacesignupidbcodeid-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>CreateSignupRequestInput.<b>requested_bucket_key</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-createsignuprequestinputbrequested_bucket_keybcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>CreateSignupRequestInput.<b>targetRunId</b></code><Bullet /><code>ID</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-createsignuprequestinputbtargetrunidbcodeid-",level:4},{value:"Member of",id:"member-of",level:3}],p=()=>(0,i.kt)(a.Fragment,null,(0,i.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),d=e=>(0,i.kt)(a.Fragment,null,"Specification",(0,i.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),g=e=>(0,i.kt)(a.Fragment,null,(0,i.kt)("span",{class:"badge badge--"+e.class},e.text)),m={toc:c,Bullet:p,SpecifiedBy:d,Badge:g};function f(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Autogenerated input type of CreateSignupRequest"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"input CreateSignupRequestInput {\n  clientMutationId: String\n  replaceSignupId: ID\n  requested_bucket_key: String\n  targetRunId: ID\n}\n")),(0,i.kt)("h3",{id:"fields"},"Fields"),(0,i.kt)("h4",{id:"code-style-fontweight-normal-createsignuprequestinputbclientmutationidbcodestring-"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("code",{style:{fontWeight:"normal"}},"CreateSignupRequestInput.",(0,i.kt)("b",null,"clientMutationId"))),(0,i.kt)(p,{mdxType:"Bullet"}),(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,i.kt)(g,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"A unique identifier for the client performing the mutation.")),(0,i.kt)("h4",{id:"code-style-fontweight-normal-createsignuprequestinputbreplacesignupidbcodeid-"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("code",{style:{fontWeight:"normal"}},"CreateSignupRequestInput.",(0,i.kt)("b",null,"replaceSignupId"))),(0,i.kt)(p,{mdxType:"Bullet"}),(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,i.kt)("inlineCode",{parentName:"a"},"ID"))," ",(0,i.kt)(g,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,i.kt)("blockquote",null),(0,i.kt)("h4",{id:"code-style-fontweight-normal-createsignuprequestinputbrequested_bucket_keybcodestring-"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("code",{style:{fontWeight:"normal"}},"CreateSignupRequestInput.",(0,i.kt)("b",null,"requested_bucket_key"))),(0,i.kt)(p,{mdxType:"Bullet"}),(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,i.kt)(g,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,i.kt)("blockquote",null),(0,i.kt)("h4",{id:"code-style-fontweight-normal-createsignuprequestinputbtargetrunidbcodeid-"},(0,i.kt)("a",{parentName:"h4",href:"#"},(0,i.kt)("code",{style:{fontWeight:"normal"}},"CreateSignupRequestInput.",(0,i.kt)("b",null,"targetRunId"))),(0,i.kt)(p,{mdxType:"Bullet"}),(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,i.kt)("inlineCode",{parentName:"a"},"ID"))," ",(0,i.kt)(g,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,i.kt)("blockquote",null),(0,i.kt)("h3",{id:"member-of"},"Member of"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/docs/graphql/mutations/create-signup-request"},(0,i.kt)("inlineCode",{parentName:"a"},"createSignupRequest")),"  ",(0,i.kt)(g,{class:"secondary",text:"mutation",mdxType:"Badge"})))}f.isMDXComponent=!0}}]);