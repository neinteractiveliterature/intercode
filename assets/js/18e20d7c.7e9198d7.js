"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[80278],{75631:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>h});var n=a(3289);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),c=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},p=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=c(a),h=r,u=m["".concat(s,".").concat(h)]||m[h]||d[h]||i;return a?n.createElement(u,o(o({ref:t},p),{},{components:a})):n.createElement(u,o({ref:t},p))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,o=new Array(i);o[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var c=2;c<i;c++)o[c]=a[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},24969:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>l,toc:()=>c});var n=a(60953),r=(a(3289),a(75631));const i={id:"cms-parent",title:"CmsParent",hide_table_of_contents:!1},o=void 0,l={unversionedId:"graphql/interfaces/cms-parent",id:"graphql/interfaces/cms-parent",title:"CmsParent",description:"A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such",source:"@site/docs/graphql/interfaces/cms-parent.mdx",sourceDirName:"graphql/interfaces",slug:"/graphql/interfaces/cms-parent",permalink:"/docs/graphql/interfaces/cms-parent",draft:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/interfaces/cms-parent.mdx",tags:[],version:"current",frontMatter:{id:"cms-parent",title:"CmsParent",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"WithdrawUserSignupInput",permalink:"/docs/graphql/inputs/withdraw-user-signup-input"},next:{title:"PaginationInterface",permalink:"/docs/graphql/interfaces/pagination-interface"}},s={},c=[{value:"Fields",id:"fields",level:3},{value:"<code>cmsContentGroup</code> (<code>CmsContentGroup!</code>)",id:"cmscontentgroup-cmscontentgroup",level:4},{value:"<code>cmsContentGroups</code> (<code>[CmsContentGroup!]!</code>)",id:"cmscontentgroups-cmscontentgroup",level:4},{value:"<code>cmsFiles</code> (<code>[CmsFile!]!</code>)",id:"cmsfiles-cmsfile",level:4},{value:"<code>cmsGraphqlQueries</code> (<code>[CmsGraphqlQuery!]!</code>)",id:"cmsgraphqlqueries-cmsgraphqlquery",level:4},{value:"<code>cmsLayouts</code> (<code>[CmsLayout!]!</code>)",id:"cmslayouts-cmslayout",level:4},{value:"<code>cmsNavigationItems</code> (<code>[CmsNavigationItem!]!</code>)",id:"cmsnavigationitems-cmsnavigationitem",level:4},{value:"<code>cmsPage</code> (<code>Page!</code>)",id:"cmspage-page",level:4},{value:"<code>cmsPages</code> (<code>[Page!]!</code>)",id:"cmspages-page",level:4},{value:"<code>cmsPartials</code> (<code>[CmsPartial!]!</code>)",id:"cmspartials-cmspartial",level:4},{value:"<code>cmsVariables</code> (<code>[CmsVariable!]!</code>)",id:"cmsvariables-cmsvariable",level:4},{value:"<code>defaultLayout</code> (<code>CmsLayout!</code>)",id:"defaultlayout-cmslayout",level:4},{value:"<code>effectiveCmsLayout</code> (<code>CmsLayout!</code>)",id:"effectivecmslayout-cmslayout",level:4},{value:"<code>fullTextSearch</code> (<code>SearchResult!</code>)",id:"fulltextsearch-searchresult",level:4},{value:"<code>id</code> (<code>ID!</code>)",id:"id-id-2",level:4},{value:"<code>liquidAssigns</code> (<code>[LiquidAssign!]!</code>)",id:"liquidassigns-liquidassign",level:4},{value:"<code>previewLiquid</code> (<code>String!</code>)",id:"previewliquid-string",level:4},{value:"<code>previewMarkdown</code> (<code>String!</code>)",id:"previewmarkdown-string",level:4},{value:"<code>rootPage</code> (<code>Page!</code>)",id:"rootpage-page",level:4},{value:"<code>typeaheadSearchCmsContent</code> (<code>[CmsContent!]!</code>)",id:"typeaheadsearchcmscontent-cmscontent",level:4}],p={toc:c};function d(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such\nas pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries."),(0,r.kt)("p",null,"Most CMS parents are conventions, so their content will be convention-specific and scoped to\nthat convention's domain name. The exception to this is the root site, which is what Intercode\nrenders when there is no convention associated with the current domain name. (See the RootSite\nobject for more details about this.)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-graphql"},"interface CmsParent {\n  cmsContentGroup(\n  id: ID\n): CmsContentGroup!\n  cmsContentGroups: [CmsContentGroup!]!\n  cmsFiles: [CmsFile!]!\n  cmsGraphqlQueries: [CmsGraphqlQuery!]!\n  cmsLayouts: [CmsLayout!]!\n  cmsNavigationItems: [CmsNavigationItem!]!\n  cmsPage(\n  id: ID\n  rootPage: Boolean\n  slug: String\n): Page!\n  cmsPages: [Page!]!\n  cmsPartials: [CmsPartial!]!\n  cmsVariables: [CmsVariable!]!\n  defaultLayout: CmsLayout!\n  effectiveCmsLayout(\n  path: String!\n): CmsLayout!\n  fullTextSearch(\n  query: String!\n): SearchResult!\n  id: ID!\n  liquidAssigns: [LiquidAssign!]!\n  previewLiquid(\n  content: String!\n): String!\n  previewMarkdown(\n  eventId: ID\n  eventProposalId: ID\n  markdown: String!\n): String!\n  rootPage: Page!\n  typeaheadSearchCmsContent(\n  name: String\n): [CmsContent!]!\n}\n")),(0,r.kt)("h3",{id:"fields"},"Fields"),(0,r.kt)("h4",{id:"cmscontentgroup-cmscontentgroup"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"cmsContentGroup"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/cms-content-group"},(0,r.kt)("inlineCode",{parentName:"a"},"CmsContentGroup!")),")"),(0,r.kt)("p",null,"Finds a CMS content group by ID within the domain name of this HTTP request. If there is no\nCMS content group with that ID, or the CMS content group is associated with a different\ndomain name, errors out."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"id-id"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"id"))," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/id"},(0,r.kt)("inlineCode",{parentName:"a"},"ID")),")"))),(0,r.kt)("p",null,"The ID of the CMS content group to find."),(0,r.kt)("h4",{id:"cmscontentgroups-cmscontentgroup"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"cmsContentGroups"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/cms-content-group"},(0,r.kt)("inlineCode",{parentName:"a"},"[CmsContentGroup!]!")),")"),(0,r.kt)("p",null,"Returns all CMS content groups within the current domain."),(0,r.kt)("h4",{id:"cmsfiles-cmsfile"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"cmsFiles"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/cms-file"},(0,r.kt)("inlineCode",{parentName:"a"},"[CmsFile!]!")),")"),(0,r.kt)("p",null,"Returns all CMS files within the current domain."),(0,r.kt)("h4",{id:"cmsgraphqlqueries-cmsgraphqlquery"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"cmsGraphqlQueries"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/cms-graphql-query"},(0,r.kt)("inlineCode",{parentName:"a"},"[CmsGraphqlQuery!]!")),")"),(0,r.kt)("p",null,"Returns all CMS GraphQL queries within the current domain."),(0,r.kt)("h4",{id:"cmslayouts-cmslayout"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"cmsLayouts"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/cms-layout"},(0,r.kt)("inlineCode",{parentName:"a"},"[CmsLayout!]!")),")"),(0,r.kt)("p",null,"Returns all CMS layouts within the current domain."),(0,r.kt)("h4",{id:"cmsnavigationitems-cmsnavigationitem"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"cmsNavigationItems"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/cms-navigation-item"},(0,r.kt)("inlineCode",{parentName:"a"},"[CmsNavigationItem!]!")),")"),(0,r.kt)("p",null,"Returns all CMS navigation items within the current domain."),(0,r.kt)("h4",{id:"cmspage-page"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"cmsPage"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/page"},(0,r.kt)("inlineCode",{parentName:"a"},"Page!")),")"),(0,r.kt)("p",null,"Finds a CMS page within the domain name of this HTTP request. Exactly one of the three\noptional arguments (",(0,r.kt)("inlineCode",{parentName:"p"},"id"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"slug"),", and ",(0,r.kt)("inlineCode",{parentName:"p"},"rootPage"),") must be specified. These each represent a\ndifferent way of finding a page. If the desired page can't be found within the current\ndomain name, errors out."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"id-id-1"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"id"))," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/id"},(0,r.kt)("inlineCode",{parentName:"a"},"ID")),")"))),(0,r.kt)("p",null,"The ID of the page to find."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"rootpage-boolean"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"rootPage"))," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/boolean"},(0,r.kt)("inlineCode",{parentName:"a"},"Boolean")),")"))),(0,r.kt)("p",null,"If true, returns the root page for this domain."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"slug-string"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"slug"))," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"))),(0,r.kt)("p",null,"The unique slug of the page to find."),(0,r.kt)("h4",{id:"cmspages-page"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"cmsPages"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/page"},(0,r.kt)("inlineCode",{parentName:"a"},"[Page!]!")),")"),(0,r.kt)("p",null,"Returns all CMS pages within the current domain."),(0,r.kt)("h4",{id:"cmspartials-cmspartial"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"cmsPartials"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/cms-partial"},(0,r.kt)("inlineCode",{parentName:"a"},"[CmsPartial!]!")),")"),(0,r.kt)("p",null,"Returns all CMS partials within the current domain."),(0,r.kt)("h4",{id:"cmsvariables-cmsvariable"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"cmsVariables"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/cms-variable"},(0,r.kt)("inlineCode",{parentName:"a"},"[CmsVariable!]!")),")"),(0,r.kt)("p",null,"Returns all CMS variables within the current domain."),(0,r.kt)("h4",{id:"defaultlayout-cmslayout"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"defaultLayout"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/cms-layout"},(0,r.kt)("inlineCode",{parentName:"a"},"CmsLayout!")),")"),(0,r.kt)("h4",{id:"effectivecmslayout-cmslayout"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"effectiveCmsLayout"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/cms-layout"},(0,r.kt)("inlineCode",{parentName:"a"},"CmsLayout!")),")"),(0,r.kt)("p",null,"Returns the CMS layout to be used for a particular URL path within the current domain. (This\nwill be the page-specific layout if the URL corresponds to a page with a layout override, or\nthe default layout for the domain otherwise.)"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"path-string"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"path"))," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String!")),")"))),(0,r.kt)("p",null,"The path to find the effective layout for."),(0,r.kt)("h4",{id:"fulltextsearch-searchresult"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"fullTextSearch"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/search-result"},(0,r.kt)("inlineCode",{parentName:"a"},"SearchResult!")),")"),(0,r.kt)("p",null,"Does a full-text search within this domain."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"query-string"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"query"))," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String!")),")"))),(0,r.kt)("p",null,"The text to search for."),(0,r.kt)("h4",{id:"id-id-2"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"id"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,r.kt)("inlineCode",{parentName:"a"},"ID!")),")"),(0,r.kt)("h4",{id:"liquidassigns-liquidassign"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"liquidAssigns"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/liquid-assign"},(0,r.kt)("inlineCode",{parentName:"a"},"[LiquidAssign!]!")),")"),(0,r.kt)("p",null,"Returns all the Liquid assigns for regular CMS page rendering in the current domain name.\nThis is a combination of globally-accessible Liquid assigns and domain-specific user-defined\nCMS variables."),(0,r.kt)("h4",{id:"previewliquid-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"previewLiquid"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String!")),")"),(0,r.kt)("p",null,"Given a Liquid text string, renders it to HTML and returns the result."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"content-string"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"content"))," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String!")),")"))),(0,r.kt)("p",null,"The Liquid content to render."),(0,r.kt)("h4",{id:"previewmarkdown-string"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"previewMarkdown"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String!")),")"),(0,r.kt)("p",null,"Given a Markdown text string, renders it to HTML and returns the result."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"eventid-id"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"eventId"))," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/id"},(0,r.kt)("inlineCode",{parentName:"a"},"ID")),")"))),(0,r.kt)("p",null,"The event ID that this Markdown will apply to, if applicable."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"eventproposalid-id"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"eventProposalId"))," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/id"},(0,r.kt)("inlineCode",{parentName:"a"},"ID")),")"))),(0,r.kt)("p",null,"The event proposal ID that this Markdown will apply to, if applicable."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"markdown-string"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"markdown"))," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String!")),")"))),(0,r.kt)("p",null,"The Markdown content to render."),(0,r.kt)("h4",{id:"rootpage-page"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"rootPage"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/page"},(0,r.kt)("inlineCode",{parentName:"a"},"Page!")),")"),(0,r.kt)("h4",{id:"typeaheadsearchcmscontent-cmscontent"},(0,r.kt)("a",{parentName:"h4",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"typeaheadSearchCmsContent"))," (",(0,r.kt)("a",{parentName:"h4",href:"/docs/graphql/unions/cms-content"},(0,r.kt)("inlineCode",{parentName:"a"},"[CmsContent!]!")),")"),(0,r.kt)("p",null,"Finds CMS content by partial name, case-insensitive, within the current domain's CMS content.\nFor example, in a convention that has a partial called ",(0,r.kt)("inlineCode",{parentName:"p"},"attendee_profile")," and a page called\n",(0,r.kt)("inlineCode",{parentName:"p"},"info_for_attendees"),", a search for ",(0,r.kt)("inlineCode",{parentName:"p"},"attendee")," would return both of these."),(0,r.kt)("p",null,"This query is always limited to a maximum of 10 results."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("h5",{parentName:"li",id:"name-string"},(0,r.kt)("a",{parentName:"h5",href:"#"},(0,r.kt)("inlineCode",{parentName:"a"},"name"))," (",(0,r.kt)("a",{parentName:"h5",href:"/docs/graphql/scalars/string"},(0,r.kt)("inlineCode",{parentName:"a"},"String")),")"))),(0,r.kt)("p",null,"The partial name to search by.  If not specified, returns all CMS content\nwithin the current domain (limited to 10 results)."))}d.isMDXComponent=!0}}]);