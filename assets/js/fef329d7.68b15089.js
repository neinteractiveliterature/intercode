"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[67442],{75631:function(t,e,n){n.d(e,{Zo:function(){return c},kt:function(){return d}});var r=n(3289);function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function a(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){i(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function p(t,e){if(null==t)return{};var n,r,i=function(t,e){if(null==t)return{};var n,r,i={},o=Object.keys(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||(i[n]=t[n]);return i}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(i[n]=t[n])}return i}var u=r.createContext({}),s=function(t){var e=r.useContext(u),n=e;return t&&(n="function"==typeof t?t(e):a(a({},e),t)),n},c=function(t){var e=s(t.components);return r.createElement(u.Provider,{value:e},t.children)},f={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},l=r.forwardRef((function(t,e){var n=t.components,i=t.mdxType,o=t.originalType,u=t.parentName,c=p(t,["components","mdxType","originalType","parentName"]),l=s(n),d=i,m=l["".concat(u,".").concat(d)]||l[d]||f[d]||o;return n?r.createElement(m,a(a({ref:e},c),{},{components:n})):r.createElement(m,a({ref:e},c))}));function d(t,e){var n=arguments,i=e&&e.mdxType;if("string"==typeof t||i){var o=n.length,a=new Array(o);a[0]=l;var p={};for(var u in e)hasOwnProperty.call(e,u)&&(p[u]=e[u]);p.originalType=t,p.mdxType="string"==typeof t?t:i,a[1]=p;for(var s=2;s<o;s++)a[s]=n[s];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}l.displayName="MDXCreateElement"},11005:function(t,e,n){n.r(e),n.d(e,{assets:function(){return c},contentTitle:function(){return u},default:function(){return d},frontMatter:function(){return p},metadata:function(){return s},toc:function(){return f}});var r=n(3149),i=n(97596),o=(n(3289),n(75631)),a=["components"],p={id:"create-staff-position-input",title:"CreateStaffPositionInput",hide_table_of_contents:!1},u=void 0,s={unversionedId:"graphql/inputs/create-staff-position-input",id:"graphql/inputs/create-staff-position-input",title:"CreateStaffPositionInput",description:"Autogenerated input type of CreateStaffPosition",source:"@site/docs/graphql/inputs/create-staff-position-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/create-staff-position-input",permalink:"/docs/graphql/inputs/create-staff-position-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/create-staff-position-input.mdx",tags:[],version:"current",frontMatter:{id:"create-staff-position-input",title:"CreateStaffPositionInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"CreateSignupRequestInput",permalink:"/docs/graphql/inputs/create-signup-request-input"},next:{title:"CreateTeamMemberInput",permalink:"/docs/graphql/inputs/create-team-member-input"}},c={},f=[{value:"Fields",id:"fields",level:3},{value:"<code>clientMutationId</code> (<code>String</code>)",id:"clientmutationid-string",level:4},{value:"<code>staff_position</code> (<code>StaffPositionInput</code>)",id:"staff_position-staffpositioninput",level:4}],l={toc:f};function d(t){var e=t.components,n=(0,i.Z)(t,a);return(0,o.kt)("wrapper",(0,r.Z)({},l,n,{components:e,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Autogenerated input type of CreateStaffPosition"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"input CreateStaffPositionInput {\n  clientMutationId: String\n  staff_position: StaffPositionInput!\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"clientmutationid-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"clientMutationId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,o.kt)("h4",{id:"staff_position-staffpositioninput"},(0,o.kt)("inlineCode",{parentName:"h4"},"staff_position")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/staff-position-input"},(0,o.kt)("inlineCode",{parentName:"a"},"StaffPositionInput")),")"))}d.isMDXComponent=!0}}]);