"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[60664],{75631:function(e,t,r){r.d(t,{Zo:function(){return c},kt:function(){return f}});var n=r(3289);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=u(r),f=i,m=p["".concat(s,".").concat(f)]||p[f]||d[f]||o;return r?n.createElement(m,a(a({ref:t},c),{},{components:r})):n.createElement(m,a({ref:t},c))}));function f(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=r.length,a=new Array(o);a[0]=p;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,a[1]=l;for(var u=2;u<o;u++)a[u]=r[u];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}p.displayName="MDXCreateElement"},24181:function(e,t,r){r.r(t),r.d(t,{assets:function(){return c},contentTitle:function(){return s},default:function(){return f},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return d}});var n=r(3149),i=r(97596),o=(r(3289),r(75631)),a=["components"],l={id:"user-drop",title:"UserDrop"},s=void 0,u={unversionedId:"liquid/drops/user-drop",id:"liquid/drops/user-drop",title:"UserDrop",description:"A user account on the site.  Most of the relevant data for the user is not here, but in",source:"@site/docs/liquid/drops/user-drop.mdx",sourceDirName:"liquid/drops",slug:"/liquid/drops/user-drop",permalink:"/docs/liquid/drops/user-drop",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/liquid/drops/user-drop.mdx",tags:[],version:"current",frontMatter:{id:"user-drop",title:"UserDrop"},sidebar:"sidebar",previous:{title:"UserConProfileDrop",permalink:"/docs/liquid/drops/user-con-profile-drop"},next:{title:"absolute_url",permalink:"/docs/liquid/filters/absolute-url"}},c={},d=[{value:"Fields",id:"fields",level:3},{value:"<code>email</code> (<code>String</code>)",id:"email-string",level:4},{value:"<code>first_name</code> (<code>String</code>)",id:"first_name-string",level:4},{value:"<code>id</code> (<code>Integer</code>)",id:"id-integer",level:4},{value:"<code>last_name</code> (<code>String</code>)",id:"last_name-string",level:4},{value:"<code>name</code> (<code>String</code>)",id:"name-string",level:4}],p={toc:d};function f(e){var t=e.components,r=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"A user account on the site.  Most of the relevant data for the user is not here, but in\nUserConProfileDrop, which is the user's profile for a particular convention."),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"email-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"email")," (",(0,o.kt)("code",null,"String"),")"),(0,o.kt)("p",null,"The user's email address"),(0,o.kt)("h4",{id:"first_name-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"first_name")," (",(0,o.kt)("code",null,"String"),")"),(0,o.kt)("p",null,"The user's first name.  Note that this may be different than the first name\nthis person has used for particular convention profiles."),(0,o.kt)("h4",{id:"id-integer"},(0,o.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,o.kt)("code",null,"Integer"),")"),(0,o.kt)("p",null,"The numeric database ID for this user account"),(0,o.kt)("h4",{id:"last_name-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"last_name")," (",(0,o.kt)("code",null,"String"),")"),(0,o.kt)("p",null,"The user's last name.  Note that this may be different than the last name\nthis person has used for particular convention profiles."),(0,o.kt)("h4",{id:"name-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"name")," (",(0,o.kt)("code",null,"String"),")"),(0,o.kt)("p",null,"The user's full name.  Note that this may be different than the name\nthis person has used for particular convention profiles."))}f.isMDXComponent=!0}}]);