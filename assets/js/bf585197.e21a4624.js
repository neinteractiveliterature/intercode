"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[69634],{75631:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var r=n(3289);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var d=r.createContext({}),c=function(e){var t=r.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(d.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,d=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(n),m=i,g=u["".concat(d,".").concat(m)]||u[m]||s[m]||o;return n?r.createElement(g,a(a({ref:t},p),{},{components:n})):r.createElement(g,a({ref:t},p))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=u;var l={};for(var d in t)hasOwnProperty.call(t,d)&&(l[d]=t[d]);l.originalType=e,l.mdxType="string"==typeof e?e:i,a[1]=l;for(var c=2;c<o;c++)a[c]=n[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},50843:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return d},default:function(){return m},frontMatter:function(){return l},metadata:function(){return c},toc:function(){return s}});var r=n(35161),i=n(79675),o=(n(3289),n(75631)),a=["components"],l={id:"event-category-input",title:"EventCategoryInput"},d=void 0,c={unversionedId:"graphql/inputs/event-category-input",id:"graphql/inputs/event-category-input",title:"EventCategoryInput",description:"No description",source:"@site/docs/graphql/inputs/event-category-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/event-category-input",permalink:"/docs/graphql/inputs/event-category-input",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/event-category-input.mdx",tags:[],version:"current",frontMatter:{id:"event-category-input",title:"EventCategoryInput"},sidebar:"sidebar",previous:{title:"EmailRouteInput",permalink:"/docs/graphql/inputs/email-route-input"},next:{title:"EventFiltersInput",permalink:"/docs/graphql/inputs/event-filters-input"}},p={},s=[{value:"Fields",id:"fields",level:3},{value:"<code>can_provide_tickets</code> (<code>Boolean</code>)",id:"can_provide_tickets-boolean",level:4},{value:"<code>default_color</code> (<code>String</code>)",id:"default_color-string",level:4},{value:"<code>departmentId</code> (<code>ID</code>)",id:"departmentid-id",level:4},{value:"<code>eventFormId</code> (<code>ID</code>)",id:"eventformid-id",level:4},{value:"<code>eventProposalFormId</code> (<code>ID</code>)",id:"eventproposalformid-id",level:4},{value:"<code>full_color</code> (<code>String</code>)",id:"full_color-string",level:4},{value:"<code>name</code> (<code>String</code>)",id:"name-string",level:4},{value:"<code>proposal_description</code> (<code>String</code>)",id:"proposal_description-string",level:4},{value:"<code>scheduling_ui</code> (<code>SchedulingUi</code>)",id:"scheduling_ui-schedulingui",level:4},{value:"<code>signed_up_color</code> (<code>String</code>)",id:"signed_up_color-string",level:4},{value:"<code>team_member_name</code> (<code>String</code>)",id:"team_member_name-string",level:4}],u={toc:s};function m(e){var t=e.components,n=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"No description"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"input EventCategoryInput {\n  can_provide_tickets: Boolean\n  default_color: String\n  departmentId: ID\n  eventFormId: ID\n  eventProposalFormId: ID\n  full_color: String\n  name: String\n  proposal_description: String\n  scheduling_ui: SchedulingUi\n  signed_up_color: String\n  team_member_name: String\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"can_provide_tickets-boolean"},(0,o.kt)("inlineCode",{parentName:"h4"},"can_provide_tickets")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,o.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,o.kt)("h4",{id:"default_color-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"default_color")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("h4",{id:"departmentid-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"departmentId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,o.kt)("h4",{id:"eventformid-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"eventFormId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,o.kt)("h4",{id:"eventproposalformid-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"eventProposalFormId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,o.kt)("h4",{id:"full_color-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"full_color")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("h4",{id:"name-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"name")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("h4",{id:"proposal_description-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"proposal_description")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("h4",{id:"scheduling_ui-schedulingui"},(0,o.kt)("inlineCode",{parentName:"h4"},"scheduling_ui")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/enums/scheduling-ui"},(0,o.kt)("inlineCode",{parentName:"a"},"SchedulingUi")),")"),(0,o.kt)("h4",{id:"signed_up_color-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"signed_up_color")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("h4",{id:"team_member_name-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"team_member_name")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"))}m.isMDXComponent=!0}}]);