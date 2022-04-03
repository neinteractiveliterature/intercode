"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[10792],{75631:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return f}});var r=n(3289);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=p(n),f=i,m=d["".concat(c,".").concat(f)]||d[f]||s[f]||a;return n?r.createElement(m,o(o({ref:t},u),{},{components:n})):r.createElement(m,o({ref:t},u))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=d;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var p=2;p<a;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},97620:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return c},default:function(){return f},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return s}});var r=n(35161),i=n(79675),a=(n(3289),n(75631)),o=["components"],l={id:"create-cms-file-input",title:"CreateCmsFileInput"},c=void 0,p={unversionedId:"graphql/inputs/create-cms-file-input",id:"graphql/inputs/create-cms-file-input",title:"CreateCmsFileInput",description:"Autogenerated input type of CreateCmsFile",source:"@site/docs/graphql/inputs/create-cms-file-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/create-cms-file-input",permalink:"/docs/graphql/inputs/create-cms-file-input",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/create-cms-file-input.mdx",tags:[],version:"current",frontMatter:{id:"create-cms-file-input",title:"CreateCmsFileInput"},sidebar:"sidebar",previous:{title:"CreateCmsContentGroupInput",permalink:"/docs/graphql/inputs/create-cms-content-group-input"},next:{title:"CreateCmsGraphqlQueryInput",permalink:"/docs/graphql/inputs/create-cms-graphql-query-input"}},u={},s=[{value:"Fields",id:"fields",level:3},{value:"<code>clientMutationId</code> (<code>String</code>)",id:"clientmutationid-string",level:4},{value:"<code>file</code> (<code>Upload</code>)",id:"file-upload",level:4},{value:"<code>signedBlobId</code> (<code>ID</code>)",id:"signedblobid-id",level:4}],d={toc:s};function f(e){var t=e.components,n=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Autogenerated input type of CreateCmsFile"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"input CreateCmsFileInput {\n  clientMutationId: String\n  file: Upload\n  signedBlobId: ID\n}\n")),(0,a.kt)("h3",{id:"fields"},"Fields"),(0,a.kt)("h4",{id:"clientmutationid-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"clientMutationId")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,a.kt)("h4",{id:"file-upload"},(0,a.kt)("inlineCode",{parentName:"h4"},"file")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/upload"},(0,a.kt)("inlineCode",{parentName:"a"},"Upload")),")"),(0,a.kt)("h4",{id:"signedblobid-id"},(0,a.kt)("inlineCode",{parentName:"h4"},"signedBlobId")," (",(0,a.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,a.kt)("inlineCode",{parentName:"a"},"ID")),")"))}f.isMDXComponent=!0}}]);