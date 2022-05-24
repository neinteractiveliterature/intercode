"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[70012],{75631:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return f}});var i=n(3289);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,i,r=function(e,t){if(null==e)return{};var n,i,r={},o=Object.keys(e);for(i=0;i<o.length;i++)n=o[i],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(i=0;i<o.length;i++)n=o[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=i.createContext({}),p=function(e){var t=i.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=p(e.components);return i.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},s=i.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),s=p(n),f=r,m=s["".concat(c,".").concat(f)]||s[f]||d[f]||o;return n?i.createElement(m,a(a({ref:t},u),{},{components:n})):i.createElement(m,a({ref:t},u))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,a=new Array(o);a[0]=s;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:r,a[1]=l;for(var p=2;p<o;p++)a[p]=n[p];return i.createElement.apply(null,a)}return i.createElement.apply(null,n)}s.displayName="MDXCreateElement"},52273:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return c},default:function(){return f},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return d}});var i=n(3149),r=n(97596),o=(n(3289),n(75631)),a=["components"],l={id:"send-notification-preview-input",title:"SendNotificationPreviewInput",hide_table_of_contents:!1},c=void 0,p={unversionedId:"graphql/inputs/send-notification-preview-input",id:"graphql/inputs/send-notification-preview-input",title:"SendNotificationPreviewInput",description:"Autogenerated input type of SendNotificationPreview",source:"@site/docs/graphql/inputs/send-notification-preview-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/send-notification-preview-input",permalink:"/docs/graphql/inputs/send-notification-preview-input",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/send-notification-preview-input.mdx",tags:[],version:"current",frontMatter:{id:"send-notification-preview-input",title:"SendNotificationPreviewInput",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"ScheduledValueInput",permalink:"/docs/graphql/inputs/scheduled-value-input"},next:{title:"SetCmsVariableInput",permalink:"/docs/graphql/inputs/set-cms-variable-input"}},u={},d=[{value:"Fields",id:"fields",level:3},{value:"<code>clientMutationId</code> (<code>String</code>)",id:"clientmutationid-string",level:4},{value:"<code>email</code> (<code>Boolean</code>)",id:"email-boolean",level:4},{value:"<code>event_key</code> (<code>String</code>)",id:"event_key-string",level:4},{value:"<code>sms</code> (<code>Boolean</code>)",id:"sms-boolean",level:4}],s={toc:d};function f(e){var t=e.components,n=(0,r.Z)(e,a);return(0,o.kt)("wrapper",(0,i.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Autogenerated input type of SendNotificationPreview"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"input SendNotificationPreviewInput {\n  clientMutationId: String\n  email: Boolean!\n  event_key: String!\n  sms: Boolean!\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"clientmutationid-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"clientMutationId")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,o.kt)("h4",{id:"email-boolean"},(0,o.kt)("inlineCode",{parentName:"h4"},"email")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,o.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,o.kt)("h4",{id:"event_key-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"event_key")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("h4",{id:"sms-boolean"},(0,o.kt)("inlineCode",{parentName:"h4"},"sms")," (",(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,o.kt)("inlineCode",{parentName:"a"},"Boolean")),")"))}f.isMDXComponent=!0}}]);