"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[97602],{75631:function(e,t,n){n.d(t,{Zo:function(){return l},kt:function(){return f}});var r=n(3289);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var a=r.createContext({}),u=function(e){var t=r.useContext(a),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},l=function(e){var t=u(e.components);return r.createElement(a.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,a=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),s=u(n),f=i,m=s["".concat(a,".").concat(f)]||s[f]||d[f]||o;return n?r.createElement(m,c(c({ref:t},l),{},{components:n})):r.createElement(m,c({ref:t},l))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,c=new Array(o);c[0]=s;var p={};for(var a in t)hasOwnProperty.call(t,a)&&(p[a]=t[a]);p.originalType=e,p.mdxType="string"==typeof e?e:i,c[1]=p;for(var u=2;u<o;u++)c[u]=n[u];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},49996:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return p},contentTitle:function(){return a},metadata:function(){return u},toc:function(){return l},default:function(){return s}});var r=n(50753),i=n(61242),o=(n(3289),n(75631)),c=["components"],p={id:"ticket-input",title:"TicketInput"},a=void 0,u={unversionedId:"graphql/inputs/ticket-input",id:"graphql/inputs/ticket-input",isDocsHomePage:!1,title:"TicketInput",description:"No description",source:"@site/docs/graphql/inputs/ticket-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/ticket-input",permalink:"/docs/graphql/inputs/ticket-input",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/ticket-input.mdx",tags:[],version:"current",frontMatter:{id:"ticket-input",title:"TicketInput"},sidebar:"sidebar",previous:{title:"TeamMemberInput",permalink:"/docs/graphql/inputs/team-member-input"},next:{title:"TicketTypeInput",permalink:"/docs/graphql/inputs/ticket-type-input"}},l=[{value:"Fields",id:"fields",children:[{value:"<code>providedByEventId</code> (ID)",id:"providedbyeventid-id",children:[],level:4},{value:"<code>ticketTypeId</code> (ID)",id:"tickettypeid-id",children:[],level:4}],level:3}],d={toc:l};function s(e){var t=e.components,n=(0,i.Z)(e,c);return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"No description"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type TicketInput {\n  providedByEventId: ID\n  ticketTypeId: ID\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"providedbyeventid-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"providedByEventId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,o.kt)("h4",{id:"tickettypeid-id"},(0,o.kt)("inlineCode",{parentName:"h4"},"ticketTypeId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,o.kt)("inlineCode",{parentName:"a"},"ID")),")"))}s.isMDXComponent=!0}}]);