"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[79569],{75631:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>g});var r=n(45721);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,l=function(e,t){if(null==e)return{};var n,r,l={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var i=r.createContext({}),p=function(e){var t=r.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(i.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,l=e.mdxType,o=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=p(n),f=l,g=d["".concat(i,".").concat(f)]||d[f]||u[f]||o;return n?r.createElement(g,a(a({ref:t},c),{},{components:n})):r.createElement(g,a({ref:t},c))}));function g(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var o=n.length,a=new Array(o);a[0]=f;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s[d]="string"==typeof e?e:l,a[1]=s;for(var p=2;p<o;p++)a[p]=n[p];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},60412:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>f,Bullet:()=>d,SpecifiedBy:()=>u,assets:()=>p,contentTitle:()=>s,default:()=>y,frontMatter:()=>a,metadata:()=>i,toc:()=>c});var r=n(9715),l=n(45721),o=n(75631);const a={id:"event-proposal-filters-input",title:"EventProposalFiltersInput",hide_table_of_contents:!1},s=void 0,i={unversionedId:"graphql/inputs/event-proposal-filters-input",id:"graphql/inputs/event-proposal-filters-input",title:"EventProposalFiltersInput",description:"No description",source:"@site/docs/graphql/inputs/event-proposal-filters-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/event-proposal-filters-input",permalink:"/docs/graphql/inputs/event-proposal-filters-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/event-proposal-filters-input.mdx",tags:[],version:"current",frontMatter:{id:"event-proposal-filters-input",title:"EventProposalFiltersInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"EventInput",permalink:"/docs/graphql/inputs/event-input"},next:{title:"EventProposalInput",permalink:"/docs/graphql/inputs/event-proposal-input"}},p={},c=[{value:"Fields",id:"fields",level:3},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposalFiltersInput.<b>event_category</b></code><Bullet /><code>[Int]</code> <Badge class="secondary" text="list"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventproposalfiltersinputbevent_categorybcodeint--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposalFiltersInput.<b>owner</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventproposalfiltersinputbownerbcodestring-",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposalFiltersInput.<b>status</b></code><Bullet /><code>[String]</code> <Badge class="secondary" text="list"/> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventproposalfiltersinputbstatusbcodestring--",level:4},{value:'<code style={{ fontWeight: \'normal\' }}>EventProposalFiltersInput.<b>title</b></code><Bullet /><code>String</code> <Badge class="secondary" text="scalar"/>',id:"code-style-fontweight-normal-eventproposalfiltersinputbtitlebcodestring-",level:4}],d=()=>(0,o.kt)(l.Fragment,null,(0,o.kt)("span",{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"}},"\xa0\u25cf\xa0")),u=e=>(0,o.kt)(l.Fragment,null,"Specification",(0,o.kt)("a",{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url},"\u2398")),f=e=>(0,o.kt)(l.Fragment,null,(0,o.kt)("span",{class:"badge badge--"+e.class},e.text)),g={toc:c,Bullet:d,SpecifiedBy:u,Badge:f},m="wrapper";function y(e){let{components:t,...n}=e;return(0,o.kt)(m,(0,r.Z)({},g,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"No description"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"input EventProposalFiltersInput {\n  event_category: [Int]\n  owner: String\n  status: [String]\n  title: String\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"code-style-fontweight-normal-eventproposalfiltersinputbevent_categorybcodeint--"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("code",{style:{fontWeight:"normal"}},"EventProposalFiltersInput.",(0,o.kt)("b",null,"event_category"))),(0,o.kt)(d,{mdxType:"Bullet"}),(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/int"},(0,o.kt)("inlineCode",{parentName:"a"},"[Int]"))," ",(0,o.kt)(f,{class:"secondary",text:"list",mdxType:"Badge"})," ",(0,o.kt)(f,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,o.kt)("blockquote",null),(0,o.kt)("h4",{id:"code-style-fontweight-normal-eventproposalfiltersinputbownerbcodestring-"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("code",{style:{fontWeight:"normal"}},"EventProposalFiltersInput.",(0,o.kt)("b",null,"owner"))),(0,o.kt)(d,{mdxType:"Bullet"}),(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,o.kt)(f,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,o.kt)("blockquote",null),(0,o.kt)("h4",{id:"code-style-fontweight-normal-eventproposalfiltersinputbstatusbcodestring--"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("code",{style:{fontWeight:"normal"}},"EventProposalFiltersInput.",(0,o.kt)("b",null,"status"))),(0,o.kt)(d,{mdxType:"Bullet"}),(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"[String]"))," ",(0,o.kt)(f,{class:"secondary",text:"list",mdxType:"Badge"})," ",(0,o.kt)(f,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,o.kt)("blockquote",null),(0,o.kt)("h4",{id:"code-style-fontweight-normal-eventproposalfiltersinputbtitlebcodestring-"},(0,o.kt)("a",{parentName:"h4",href:"#"},(0,o.kt)("code",{style:{fontWeight:"normal"}},"EventProposalFiltersInput.",(0,o.kt)("b",null,"title"))),(0,o.kt)(d,{mdxType:"Bullet"}),(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String"))," ",(0,o.kt)(f,{class:"secondary",text:"scalar",mdxType:"Badge"})),(0,o.kt)("blockquote",null))}y.isMDXComponent=!0}}]);