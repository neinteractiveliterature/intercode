"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[46220],{75631:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>m});var a=n(45721);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},u=Object.keys(e);for(a=0;a<u.length;a++)n=u[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(a=0;a<u.length;a++)n=u[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),c=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},l=function(e){var t=c(e.components);return a.createElement(i.Provider,{value:t},e.children)},d="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},g=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,u=e.originalType,i=e.parentName,l=o(e,["components","mdxType","originalType","parentName"]),d=c(n),g=r,m=d["".concat(i,".").concat(g)]||d[g]||s[g]||u;return n?a.createElement(m,p(p({ref:t},l),{},{components:n})):a.createElement(m,p({ref:t},l))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var u=n.length,p=new Array(u);p[0]=g;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o[d]="string"==typeof e?e:r,p[1]=o;for(var c=2;c<u;c++)p[c]=n[c];return a.createElement.apply(null,p)}return a.createElement.apply(null,n)}g.displayName="MDXCreateElement"},1420:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>g,Bullet:()=>d,SpecifiedBy:()=>s,assets:()=>c,contentTitle:()=>o,default:()=>f,frontMatter:()=>p,metadata:()=>i,toc:()=>l});var a=n(9715),r=n(45721),u=n(75631);const p={id:"update-signup-bucket",title:"updateSignupBucket",hide_table_of_contents:!1},o=void 0,i={unversionedId:"graphql/mutations/update-signup-bucket",id:"graphql/mutations/update-signup-bucket",title:"updateSignupBucket",description:"No description",source:"@site/docs/graphql/mutations/update-signup-bucket.mdx",sourceDirName:"graphql/mutations",slug:"/graphql/mutations/update-signup-bucket",permalink:"/docs/graphql/mutations/update-signup-bucket",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/mutations/update-signup-bucket.mdx",tags:[],version:"current",frontMatter:{id:"update-signup-bucket",title:"updateSignupBucket",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"updateRun",permalink:"/docs/graphql/mutations/update-run"},next:{title:"updateSignupCounted",permalink:"/docs/graphql/mutations/update-signup-counted"}},c={},l=[{value:"Arguments",id:"arguments",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>updateSignupBucket.<b>input</b></code><Bullet /><code>UpdateSignupBucketInput!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="input"/>',id:"code-style-fontweight-normal-updatesignupbucketbinputbcodeupdatesignupbucketinput--",level:4},{value:"Type",id:"type",level:3},{value:'<code>UpdateSignupBucketPayload</code> <Badge class="secondary" text="object"/>',id:"updatesignupbucketpayload-",level:4}],d=()=>(0,u.kt)(r.Fragment,null,(0,u.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),s=e=>(0,u.kt)(r.Fragment,null,"Specification",(0,u.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),g=e=>(0,u.kt)(r.Fragment,null,(0,u.kt)("span",{class:"badge badge--"+e.class},e.text)),m={toc:l,Bullet:d,SpecifiedBy:s,Badge:g},k="wrapper";function f(e){let{components:t,...n}=e;return(0,u.kt)(k,(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,u.kt)("p",null,"No description"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-graphql"},"updateSignupBucket(\n  input: UpdateSignupBucketInput!\n): UpdateSignupBucketPayload!\n")),(0,u.kt)("h3",{id:"arguments"},"Arguments"),(0,u.kt)("h4",{id:"code-style-fontweight-normal-updatesignupbucketbinputbcodeupdatesignupbucketinput--"},(0,u.kt)("a",{parentName:"h4",href:"#"},(0,u.kt)("code",{style:{fontWeight:"normal"}},"updateSignupBucket.",(0,u.kt)("b",null,"input"))),(0,u.kt)(d,{mdxType:"Bullet"}),(0,u.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/update-signup-bucket-input"},(0,u.kt)("inlineCode",{parentName:"a"},"UpdateSignupBucketInput!"))," ",(0,u.kt)(g,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,u.kt)(g,{class:"secondary",text:"input",mdxType:"Badge"})),(0,u.kt)("blockquote",null,(0,u.kt)("p",{parentName:"blockquote"},"Parameters for UpdateSignupBucket")),(0,u.kt)("h3",{id:"type"},"Type"),(0,u.kt)("h4",{id:"updatesignupbucketpayload-"},(0,u.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/update-signup-bucket-payload"},(0,u.kt)("inlineCode",{parentName:"a"},"UpdateSignupBucketPayload"))," ",(0,u.kt)(g,{class:"secondary",text:"object",mdxType:"Badge"})),(0,u.kt)("blockquote",null,(0,u.kt)("p",{parentName:"blockquote"},"Autogenerated return type of UpdateSignupBucket.")))}f.isMDXComponent=!0}}]);