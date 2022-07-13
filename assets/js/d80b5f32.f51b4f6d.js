"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[11665],{75631:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>d});var r=n(3289);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},l=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),m=p(n),d=o,h=m["".concat(c,".").concat(d)]||m[d]||u[d]||a;return n?r.createElement(h,s(s({ref:t},l),{},{components:n})):r.createElement(h,s({ref:t},l))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,s=new Array(a);s[0]=m;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:o,s[1]=i;for(var p=2;p<a;p++)s[p]=n[p];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},56314:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>u,frontMatter:()=>a,metadata:()=>i,toc:()=>p});var r=n(60953),o=(n(3289),n(75631));const a={id:"cms-parent-by-request-host",title:"cmsParentByRequestHost",hide_table_of_contents:!1},s=void 0,i={unversionedId:"graphql/queries/cms-parent-by-request-host",id:"graphql/queries/cms-parent-by-request-host",title:"cmsParentByRequestHost",description:"Returns the CMS parent object associated with the domain name of this HTTP request. In a",source:"@site/docs/graphql/queries/cms-parent-by-request-host.mdx",sourceDirName:"graphql/queries",slug:"/graphql/queries/cms-parent-by-request-host",permalink:"/docs/graphql/queries/cms-parent-by-request-host",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/queries/cms-parent-by-request-host.mdx",tags:[],version:"current",frontMatter:{id:"cms-parent-by-request-host",title:"cmsParentByRequestHost",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"cmsParentByDomain",permalink:"/docs/graphql/queries/cms-parent-by-domain"},next:{title:"conventionByDomain",permalink:"/docs/graphql/queries/convention-by-domain"}},c={},p=[{value:"Type",id:"type",level:3},{value:"<code>CmsParent</code>",id:"cmsparent",level:4}],l={toc:p};function u(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Returns the CMS parent object associated with the domain name of this HTTP request. In a\nconvention domain, this is the ",(0,o.kt)("inlineCode",{parentName:"p"},"Convention")," itself. Otherwise, it's the ",(0,o.kt)("inlineCode",{parentName:"p"},"RootSite"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"cmsParentByRequestHost: CmsParent!\n")),(0,o.kt)("h3",{id:"type"},"Type"),(0,o.kt)("h4",{id:"cmsparent"},(0,o.kt)("a",{parentName:"h4",href:"/docs/graphql/interfaces/cms-parent"},(0,o.kt)("inlineCode",{parentName:"a"},"CmsParent"))),(0,o.kt)("p",null,"A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such\nas pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries."),(0,o.kt)("p",null,"Most CMS parents are conventions, so their content will be convention-specific and scoped to\nthat convention's domain name. The exception to this is the root site, which is what Intercode\nrenders when there is no convention associated with the current domain name. (See the RootSite\nobject for more details about this.)"))}u.isMDXComponent=!0}}]);