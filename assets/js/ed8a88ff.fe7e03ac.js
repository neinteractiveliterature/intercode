"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[48935],{75631:function(t,e,n){n.d(e,{Zo:function(){return c},kt:function(){return g}});var r=n(3289);function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function u(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function a(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?u(Object(n),!0).forEach((function(e){i(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function o(t,e){if(null==t)return{};var n,r,i=function(t,e){if(null==t)return{};var n,r,i={},u=Object.keys(t);for(r=0;r<u.length;r++)n=u[r],e.indexOf(n)>=0||(i[n]=t[n]);return i}(t,e);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(t);for(r=0;r<u.length;r++)n=u[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(i[n]=t[n])}return i}var s=r.createContext({}),l=function(t){var e=r.useContext(s),n=e;return t&&(n="function"==typeof t?t(e):a(a({},e),t)),n},c=function(t){var e=l(t.components);return r.createElement(s.Provider,{value:e},t.children)},p={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},d=r.forwardRef((function(t,e){var n=t.components,i=t.mdxType,u=t.originalType,s=t.parentName,c=o(t,["components","mdxType","originalType","parentName"]),d=l(n),g=i,m=d["".concat(s,".").concat(g)]||d[g]||p[g]||u;return n?r.createElement(m,a(a({ref:e},c),{},{components:n})):r.createElement(m,a({ref:e},c))}));function g(t,e){var n=arguments,i=e&&e.mdxType;if("string"==typeof t||i){var u=n.length,a=new Array(u);a[0]=d;var o={};for(var s in e)hasOwnProperty.call(e,s)&&(o[s]=e[s]);o.originalType=t,o.mdxType="string"==typeof t?t:i,a[1]=o;for(var l=2;l<u;l++)a[l]=n[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},67882:function(t,e,n){n.r(e),n.d(e,{assets:function(){return c},contentTitle:function(){return s},default:function(){return g},frontMatter:function(){return o},metadata:function(){return l},toc:function(){return p}});var r=n(3149),i=n(97596),u=(n(3289),n(75631)),a=["components"],o={id:"withdraw-user-signup-button",title:"withdraw_user_signup_button"},s=void 0,l={unversionedId:"liquid/tags/withdraw-user-signup-button",id:"liquid/tags/withdraw-user-signup-button",title:"withdraw_user_signup_button",description:'Renders a "Withdraw" button for an existing signup.  The button text and the button',source:"@site/docs/liquid/tags/withdraw-user-signup-button.mdx",sourceDirName:"liquid/tags",slug:"/liquid/tags/withdraw-user-signup-button",permalink:"/docs/liquid/tags/withdraw-user-signup-button",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/liquid/tags/withdraw-user-signup-button.mdx",tags:[],version:"current",frontMatter:{id:"withdraw-user-signup-button",title:"withdraw_user_signup_button"},sidebar:"sidebar",previous:{title:"short_form_event_details",permalink:"/docs/liquid/tags/short-form-event-details"},next:{title:"youtube",permalink:"/docs/liquid/tags/youtube"}},c={},p=[{value:"Examples",id:"examples",level:3}],d={toc:p};function g(t){var e=t.components,n=(0,i.Z)(t,a);return(0,u.kt)("wrapper",(0,r.Z)({},d,n,{components:e,mdxType:"MDXLayout"}),(0,u.kt)("p",null,'Renders a "Withdraw" button for an existing signup.  The button text and the button\nCSS classes can be customized.'),(0,u.kt)("h3",{id:"examples"},"Examples"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-liquid",metastring:'title="Basic"',title:'"Basic"'},"{% withdraw_user_signup_button signup %}\n")),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-liquid",metastring:'title="Customizing the button text"',title:'"Customizing',the:!0,button:!0,'text"':!0},'{% withdraw_user_signup_button signup "Withdraw my signup" %}\n')),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-liquid",metastring:'title="Customizing the button text and the CSS class"',title:'"Customizing',the:!0,button:!0,text:!0,and:!0,CSS:!0,'class"':!0},'{% withdraw_user_signup_button signup "Withdraw my signup" btn-warning %}\n')))}g.isMDXComponent=!0}}]);