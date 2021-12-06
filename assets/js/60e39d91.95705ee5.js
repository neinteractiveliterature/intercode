"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[23524],{75631:function(e,n,t){t.d(n,{Zo:function(){return s},kt:function(){return u}});var r=t(3289);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var c=r.createContext({}),d=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},s=function(e){var n=d(e.components);return r.createElement(c.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),m=d(t),u=a,h=m["".concat(c,".").concat(u)]||m[u]||p[u]||i;return t?r.createElement(h,o(o({ref:n},s),{},{components:t})):r.createElement(h,o({ref:n},s))}));function u(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=t.length,o=new Array(i);o[0]=m;var l={};for(var c in n)hasOwnProperty.call(n,c)&&(l[c]=n[c]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var d=2;d<i;d++)o[d]=t[d];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},79762:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return d},toc:function(){return s},default:function(){return m}});var r=t(50753),a=t(61242),i=(t(3289),t(75631)),o=["components"],l={id:"page",title:"Page"},c=void 0,d={unversionedId:"graphql/objects/page",id:"graphql/objects/page",isDocsHomePage:!1,title:"Page",description:"No description",source:"@site/docs/graphql/objects/page.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/page",permalink:"/docs/graphql/objects/page",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/page.mdx",tags:[],version:"current",frontMatter:{id:"page",title:"Page"},sidebar:"sidebar",previous:{title:"Organization",permalink:"/docs/graphql/objects/organization"},next:{title:"Permission",permalink:"/docs/graphql/objects/permission"}},s=[{value:"Fields",id:"fields",children:[{value:"<code>admin_notes</code> (String)",id:"admin_notes-string",children:[],level:4},{value:"<code>cms_layout</code> (CmsLayout)",id:"cms_layout-cmslayout",children:[],level:4},{value:"<code>content</code> (String)",id:"content-string",children:[],level:4},{value:"<code>content_html</code> (String)",id:"content_html-string",children:[],level:4},{value:"<code>current_ability_can_delete</code> (Boolean)",id:"current_ability_can_delete-boolean",children:[],level:4},{value:"<code>current_ability_can_update</code> (Boolean)",id:"current_ability_can_update-boolean",children:[],level:4},{value:"<code>hidden_from_search</code> (Boolean)",id:"hidden_from_search-boolean",children:[],level:4},{value:"<code>id</code> (ID)",id:"id-id",children:[],level:4},{value:"<code>name</code> (String)",id:"name-string",children:[],level:4},{value:"<code>referenced_partials</code> (CmsPartial)",id:"referenced_partials-cmspartial",children:[],level:4},{value:"<code>skip_clickwrap_agreement</code> (Boolean)",id:"skip_clickwrap_agreement-boolean",children:[],level:4},{value:"<code>slug</code> (String)",id:"slug-string",children:[],level:4}],level:3}],p={toc:s};function m(e){var n=e.components,t=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"No description"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"type Page {\n  admin_notes: String\n  cms_layout: CmsLayout\n  content: String\n  content_html: String!\n  current_ability_can_delete: Boolean!\n  current_ability_can_update: Boolean!\n  hidden_from_search: Boolean!\n  id: ID!\n  name: String\n  referenced_partials: [CmsPartial!]!\n  skip_clickwrap_agreement: Boolean\n  slug: String\n}\n")),(0,i.kt)("h3",{id:"fields"},"Fields"),(0,i.kt)("h4",{id:"admin_notes-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"admin_notes")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("h4",{id:"cms_layout-cmslayout"},(0,i.kt)("inlineCode",{parentName:"h4"},"cms_layout")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/cms-layout"},(0,i.kt)("inlineCode",{parentName:"a"},"CmsLayout")),")"),(0,i.kt)("h4",{id:"content-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"content")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("h4",{id:"content_html-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"content_html")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("h4",{id:"current_ability_can_delete-boolean"},(0,i.kt)("inlineCode",{parentName:"h4"},"current_ability_can_delete")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,i.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,i.kt)("h4",{id:"current_ability_can_update-boolean"},(0,i.kt)("inlineCode",{parentName:"h4"},"current_ability_can_update")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,i.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,i.kt)("h4",{id:"hidden_from_search-boolean"},(0,i.kt)("inlineCode",{parentName:"h4"},"hidden_from_search")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,i.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,i.kt)("h4",{id:"id-id"},(0,i.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,i.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,i.kt)("h4",{id:"name-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"name")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("h4",{id:"referenced_partials-cmspartial"},(0,i.kt)("inlineCode",{parentName:"h4"},"referenced_partials")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/cms-partial"},(0,i.kt)("inlineCode",{parentName:"a"},"CmsPartial")),")"),(0,i.kt)("h4",{id:"skip_clickwrap_agreement-boolean"},(0,i.kt)("inlineCode",{parentName:"h4"},"skip_clickwrap_agreement")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/boolean"},(0,i.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,i.kt)("h4",{id:"slug-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"slug")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"))}m.isMDXComponent=!0}}]);