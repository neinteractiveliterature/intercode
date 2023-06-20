"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[78960],{75631:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>f});var n=r(45721);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var p=n.createContext({}),d=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=d(e.components);return n.createElement(p.Provider,{value:t},e.children)},c="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),c=d(r),m=o,f=c["".concat(p,".").concat(m)]||c[m]||s[m]||a;return r?n.createElement(f,i(i({ref:t},u),{},{components:r})):n.createElement(f,i({ref:t},u))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=m;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l[c]="string"==typeof e?e:o,i[1]=l;for(var d=2;d<a;d++)i[d]=r[d];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},64929:(e,t,r)=>{r.r(t),r.d(t,{Badge:()=>m,Bullet:()=>c,SpecifiedBy:()=>s,assets:()=>d,contentTitle:()=>l,default:()=>y,frontMatter:()=>i,metadata:()=>p,toc:()=>u});var n=r(9715),o=r(45721),a=r(75631);const i={id:"update-form-with-json",title:"updateFormWithJSON",hide_table_of_contents:!1},l=void 0,p={unversionedId:"graphql/mutations/update-form-with-json",id:"graphql/mutations/update-form-with-json",title:"updateFormWithJSON",description:"No description",source:"@site/docs/graphql/mutations/update-form-with-json.mdx",sourceDirName:"graphql/mutations",slug:"/graphql/mutations/update-form-with-json",permalink:"/docs/graphql/mutations/update-form-with-json",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/mutations/update-form-with-json.mdx",tags:[],version:"current",frontMatter:{id:"update-form-with-json",title:"updateFormWithJSON",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"updateFormSection",permalink:"/docs/graphql/mutations/update-form-section"},next:{title:"updateForm",permalink:"/docs/graphql/mutations/update-form"}},d={},u=[{value:"Arguments",id:"arguments",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>updateFormWithJSON.<b>input</b></code><Bullet /><code>UpdateFormWithJSONInput!</code> <Badge class="secondary" text="non-null"/> <Badge class="secondary" text="input"/>',id:"code-style-fontweight-normal-updateformwithjsonbinputbcodeupdateformwithjsoninput--",level:4},{value:"Type",id:"type",level:3},{value:'<code>UpdateFormWithJSONPayload</code> <Badge class="secondary" text="object"/>',id:"updateformwithjsonpayload-",level:4}],c=()=>(0,a.kt)(o.Fragment,null,(0,a.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),s=e=>(0,a.kt)(o.Fragment,null,"Specification",(0,a.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),m=e=>(0,a.kt)(o.Fragment,null,(0,a.kt)("span",{class:"badge badge--"+e.class},e.text)),f={toc:u,Bullet:c,SpecifiedBy:s,Badge:m},h="wrapper";function y(e){let{components:t,...r}=e;return(0,a.kt)(h,(0,n.Z)({},f,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"No description"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"updateFormWithJSON(\n  input: UpdateFormWithJSONInput!\n): UpdateFormWithJSONPayload!\n")),(0,a.kt)("h3",{id:"arguments"},"Arguments"),(0,a.kt)("h4",{id:"code-style-fontweight-normal-updateformwithjsonbinputbcodeupdateformwithjsoninput--"},(0,a.kt)("a",{parentName:"h4",href:"#"},(0,a.kt)("code",{style:{fontWeight:"normal"}},"updateFormWithJSON.",(0,a.kt)("b",null,"input"))),(0,a.kt)(c,{mdxType:"Bullet"}),(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/update-form-with-jsoninput"},(0,a.kt)("inlineCode",{parentName:"a"},"UpdateFormWithJSONInput!"))," ",(0,a.kt)(m,{class:"secondary",text:"non-null",mdxType:"Badge"})," ",(0,a.kt)(m,{class:"secondary",text:"input",mdxType:"Badge"})),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"Parameters for UpdateFormWithJSON")),(0,a.kt)("h3",{id:"type"},"Type"),(0,a.kt)("h4",{id:"updateformwithjsonpayload-"},(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/update-form-with-jsonpayload"},(0,a.kt)("inlineCode",{parentName:"a"},"UpdateFormWithJSONPayload"))," ",(0,a.kt)(m,{class:"secondary",text:"object",mdxType:"Badge"})),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"Autogenerated return type of UpdateFormWithJSON.")))}y.isMDXComponent=!0}}]);