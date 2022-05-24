"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[29529],{75631:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return d}});var r=n(3289);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},m=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),s=p(n),d=i,f=s["".concat(c,".").concat(d)]||s[d]||u[d]||a;return n?r.createElement(f,o(o({ref:t},m),{},{components:n})):r.createElement(f,o({ref:t},m))}));function d(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=s;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var p=2;p<a;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},39158:function(e,t,n){n.r(t),n.d(t,{assets:function(){return m},contentTitle:function(){return c},default:function(){return d},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return u}});var r=n(3149),i=n(97596),a=(n(3289),n(75631)),o=["components"],l={id:"team-member-input",title:"TeamMemberInput",hide_table_of_contents:!1},c=void 0,p={unversionedId:"graphql/inputs/team-member-input",id:"graphql/inputs/team-member-input",title:"TeamMemberInput",description:"No description",source:"@site/docs/graphql/inputs/team-member-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/team-member-input",permalink:"/docs/graphql/inputs/team-member-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/team-member-input.mdx",tags:[],version:"current",frontMatter:{id:"team-member-input",title:"TeamMemberInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"SubmitOrderInput",permalink:"/docs/graphql/inputs/submit-order-input"},next:{title:"TicketInput",permalink:"/docs/graphql/inputs/ticket-input"}},m={},u=[{value:"Fields",id:"fields",level:3},{value:"<code>display_team_member</code> (<code>Boolean</code>)",id:"display_team_member-boolean",level:4},{value:"<code>receive_con_email</code> (<code>Boolean</code>)",id:"receive_con_email-boolean",level:4},{value:"<code>receive_signup_email</code> (<code>ReceiveSignupEmail</code>)",id:"receive_signup_email-receivesignupemail",level:4},{value:"<code>show_email</code> (<code>Boolean</code>)",id:"show_email-boolean",level:4}],s={toc:u};function d(e){var t=e.components,n=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"No description"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"input TeamMemberInput {\n  display_team_member: Boolean\n  receive_con_email: Boolean\n  receive_signup_email: ReceiveSignupEmail\n  show_email: Boolean\n}\n")),(0,a.kt)("h3",{id:"fields"},"Fields"),(0,a.kt)("h4",{id:"display_team_member-boolean"},(0,a.kt)("inlineCode",{parentName:"h4"},"display_team_member")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,a.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,a.kt)("h4",{id:"receive_con_email-boolean"},(0,a.kt)("inlineCode",{parentName:"h4"},"receive_con_email")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,a.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,a.kt)("h4",{id:"receive_signup_email-receivesignupemail"},(0,a.kt)("inlineCode",{parentName:"h4"},"receive_signup_email")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/enums/receive-signup-email"},(0,a.kt)("inlineCode",{parentName:"a"},"ReceiveSignupEmail")),")"),(0,a.kt)("h4",{id:"show_email-boolean"},(0,a.kt)("inlineCode",{parentName:"h4"},"show_email")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,a.kt)("inlineCode",{parentName:"a"},"Boolean")),")"))}d.isMDXComponent=!0}}]);