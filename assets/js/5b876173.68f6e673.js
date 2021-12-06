"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[70201],{75631:function(e,t,n){n.d(t,{Zo:function(){return l},kt:function(){return f}});var r=n(3289);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},u=Object.keys(e);for(r=0;r<u.length;r++)n=u[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(r=0;r<u.length;r++)n=u[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var o=r.createContext({}),c=function(e){var t=r.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},l=function(e){var t=c(e.components);return r.createElement(o.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,u=e.originalType,o=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),s=c(n),f=i,m=s["".concat(o,".").concat(f)]||s[f]||d[f]||u;return n?r.createElement(m,a(a({ref:t},l),{},{components:n})):r.createElement(m,a({ref:t},l))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var u=n.length,a=new Array(u);a[0]=s;var p={};for(var o in t)hasOwnProperty.call(t,o)&&(p[o]=t[o]);p.originalType=e,p.mdxType="string"==typeof e?e:i,a[1]=p;for(var c=2;c<u;c++)a[c]=n[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},24054:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return p},contentTitle:function(){return o},metadata:function(){return c},toc:function(){return l},default:function(){return s}});var r=n(50753),i=n(61242),u=(n(3289),n(75631)),a=["components"],p={id:"update-run-input",title:"UpdateRunInput"},o=void 0,c={unversionedId:"graphql/inputs/update-run-input",id:"graphql/inputs/update-run-input",isDocsHomePage:!1,title:"UpdateRunInput",description:"Autogenerated input type of UpdateRun",source:"@site/docs/graphql/inputs/update-run-input.mdx",sourceDirName:"graphql/inputs",slug:"/graphql/inputs/update-run-input",permalink:"/docs/graphql/inputs/update-run-input",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/inputs/update-run-input.mdx",tags:[],version:"current",frontMatter:{id:"update-run-input",title:"UpdateRunInput"},sidebar:"sidebar",previous:{title:"UpdateRootSiteInput",permalink:"/docs/graphql/inputs/update-root-site-input"},next:{title:"UpdateSignupBucketInput",permalink:"/docs/graphql/inputs/update-signup-bucket-input"}},l=[{value:"Fields",id:"fields",children:[{value:"<code>clientMutationId</code> (String)",id:"clientmutationid-string",children:[],level:4},{value:"<code>id</code> (ID)",id:"id-id",children:[],level:4},{value:"<code>run</code> (RunInput)",id:"run-runinput",children:[],level:4}],level:3}],d={toc:l};function s(e){var t=e.components,n=(0,i.Z)(e,a);return(0,u.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,u.kt)("p",null,"Autogenerated input type of UpdateRun"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-graphql"},"type UpdateRunInput {\n  clientMutationId: String\n  id: ID\n  run: RunInput!\n}\n")),(0,u.kt)("h3",{id:"fields"},"Fields"),(0,u.kt)("h4",{id:"clientmutationid-string"},(0,u.kt)("inlineCode",{parentName:"h4"},"clientMutationId")," (",(0,u.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,u.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,u.kt)("p",null,"A unique identifier for the client performing the mutation."),(0,u.kt)("h4",{id:"id-id"},(0,u.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,u.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,u.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,u.kt)("h4",{id:"run-runinput"},(0,u.kt)("inlineCode",{parentName:"h4"},"run")," (",(0,u.kt)("a",{parentName:"h4",href:"/docs/graphql/inputs/run-input"},(0,u.kt)("inlineCode",{parentName:"a"},"RunInput")),")"))}s.isMDXComponent=!0}}]);