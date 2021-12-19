"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[88943],{75631:function(e,t,n){n.d(t,{Zo:function(){return l},kt:function(){return d}});var r=n(3289);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},l=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),m=p(n),d=a,f=m["".concat(c,".").concat(d)]||m[d]||u[d]||i;return n?r.createElement(f,o(o({ref:t},l),{},{components:n})):r.createElement(f,o({ref:t},l))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var p=2;p<i;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},31217:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return l},default:function(){return m}});var r=n(69432),a=n(58703),i=(n(3289),n(75631)),o=["components"],s={id:"cms-parent-by-domain",title:"cmsParentByDomain"},c=void 0,p={unversionedId:"graphql/queries/cms-parent-by-domain",id:"graphql/queries/cms-parent-by-domain",title:"cmsParentByDomain",description:"Returns the CMS parent object associated with a given domain name. In a",source:"@site/docs/graphql/queries/cms-parent-by-domain.mdx",sourceDirName:"graphql/queries",slug:"/graphql/queries/cms-parent-by-domain",permalink:"/docs/graphql/queries/cms-parent-by-domain",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/queries/cms-parent-by-domain.mdx",tags:[],version:"current",frontMatter:{id:"cms-parent-by-domain",title:"cmsParentByDomain"},sidebar:"sidebar",previous:{title:"assumedIdentityFromProfile",permalink:"/docs/graphql/queries/assumed-identity-from-profile"},next:{title:"cmsParentByRequestHost",permalink:"/docs/graphql/queries/cms-parent-by-request-host"}},l=[{value:"Arguments",id:"arguments",children:[{value:"<code>domain</code> (String)",id:"domain-string",children:[],level:4}],level:3},{value:"Type",id:"type",children:[{value:"CmsParent",id:"cmsparent",children:[],level:4}],level:3}],u={toc:l};function m(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Returns the CMS parent object associated with a given domain name. In a\nconvention domain, this is the ",(0,i.kt)("inlineCode",{parentName:"p"},"Convention")," itself. Otherwise, it's the ",(0,i.kt)("inlineCode",{parentName:"p"},"RootSite"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"cmsParentByDomain(\n  domain: String!\n): CmsParent!\n\n")),(0,i.kt)("h3",{id:"arguments"},"Arguments"),(0,i.kt)("h4",{id:"domain-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"domain")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("h3",{id:"type"},"Type"),(0,i.kt)("h4",{id:"cmsparent"},(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/interfaces/cms-parent"},(0,i.kt)("inlineCode",{parentName:"a"},"CmsParent"))),(0,i.kt)("p",null,"A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such\nas pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries."),(0,i.kt)("p",null,"Most CMS parents are conventions, so their content will be convention-specific and scoped to\nthat convention's domain name. The exception to this is the root site, which is what Intercode\nrenders when there is no convention associated with the current domain name. (See the RootSite\nobject for more details about this.)"))}m.isMDXComponent=!0}}]);