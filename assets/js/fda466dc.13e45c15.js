"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[29529],{75631:function(e,n,t){t.d(n,{Zo:function(){return m},kt:function(){return d}});var r=t(3289);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var c=r.createContext({}),p=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},m=function(e){var n=p(e.components);return r.createElement(c.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},s=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),s=p(t),d=i,f=s["".concat(c,".").concat(d)]||s[d]||u[d]||a;return t?r.createElement(f,o(o({ref:n},m),{},{components:t})):r.createElement(f,o({ref:n},m))}));function d(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var a=t.length,o=new Array(a);o[0]=s;var l={};for(var c in n)hasOwnProperty.call(n,c)&&(l[c]=n[c]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var p=2;p<a;p++)o[p]=t[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}s.displayName="MDXCreateElement"},60264:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return m},default:function(){return s}});var r=t(236),i=t(86460),a=(t(3289),t(75631)),o=["components"],l={id:"team-member-input",title:"TeamMemberInput"},c=void 0,p={unversionedId:"graphql/inputs/team-member-input",id:"graphql/inputs/team-member-input",title:"TeamMemberInput",description:"No description",source:"@site/docs/graphql/inputs/team-member-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/team-member-input",permalink:"/docs/graphql/inputs/team-member-input",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/team-member-input.mdx",tags:[],version:"current",frontMatter:{id:"team-member-input",title:"TeamMemberInput"},sidebar:"sidebar",previous:{title:"SubmitOrderInput",permalink:"/docs/graphql/inputs/submit-order-input"},next:{title:"TicketInput",permalink:"/docs/graphql/inputs/ticket-input"}},m=[{value:"Fields",id:"fields",children:[{value:"<code>display_team_member</code> (Boolean)",id:"display_team_member-boolean",children:[],level:4},{value:"<code>receive_con_email</code> (Boolean)",id:"receive_con_email-boolean",children:[],level:4},{value:"<code>receive_signup_email</code> (ReceiveSignupEmail)",id:"receive_signup_email-receivesignupemail",children:[],level:4},{value:"<code>show_email</code> (Boolean)",id:"show_email-boolean",children:[],level:4}],level:3}],u={toc:m};function s(e){var n=e.components,t=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"No description"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"type TeamMemberInput {\n  display_team_member: Boolean\n  receive_con_email: Boolean\n  receive_signup_email: ReceiveSignupEmail\n  show_email: Boolean\n}\n")),(0,a.kt)("h3",{id:"fields"},"Fields"),(0,a.kt)("h4",{id:"display_team_member-boolean"},(0,a.kt)("inlineCode",{parentName:"h4"},"display_team_member")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,a.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,a.kt)("h4",{id:"receive_con_email-boolean"},(0,a.kt)("inlineCode",{parentName:"h4"},"receive_con_email")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,a.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,a.kt)("h4",{id:"receive_signup_email-receivesignupemail"},(0,a.kt)("inlineCode",{parentName:"h4"},"receive_signup_email")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/enums/receive-signup-email"},(0,a.kt)("inlineCode",{parentName:"a"},"ReceiveSignupEmail")),")"),(0,a.kt)("h4",{id:"show_email-boolean"},(0,a.kt)("inlineCode",{parentName:"h4"},"show_email")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,a.kt)("inlineCode",{parentName:"a"},"Boolean")),")"))}s.isMDXComponent=!0}}]);