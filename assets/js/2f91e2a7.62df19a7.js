"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[62664],{2832:(e,n,t)=>{t.r(n),t.d(n,{Badge:()=>h,Bullet:()=>l,SpecifiedBy:()=>m,assets:()=>c,contentTitle:()=>i,default:()=>u,frontMatter:()=>r,metadata:()=>o,toc:()=>d});var s=t(36544),a=t(54332);const r={id:"cms-parent-by-domain",title:"cmsParentByDomain",hide_table_of_contents:!1},i=void 0,o={id:"graphql/queries/cms-parent-by-domain",title:"cmsParentByDomain",description:"Returns the CMS parent object associated with a given domain name. In a",source:"@site/docs/graphql/queries/cms-parent-by-domain.mdx",sourceDirName:"graphql/queries",slug:"/graphql/queries/cms-parent-by-domain",permalink:"/docs/graphql/queries/cms-parent-by-domain",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/queries/cms-parent-by-domain.mdx",tags:[],version:"current",frontMatter:{id:"cms-parent-by-domain",title:"cmsParentByDomain",hide_table_of_contents:!1},sidebar:"sidebar",previous:{title:"assumedIdentityFromProfile",permalink:"/docs/graphql/queries/assumed-identity-from-profile"},next:{title:"cmsParentByRequestHost",permalink:"/docs/graphql/queries/cms-parent-by-request-host"}},c={},d=[{value:"Arguments",id:"arguments",level:3},{value:'<code>cmsParentByDomain.<b>domain</b></code><Bullet></Bullet><code>String!</code> <Badge class="secondary"></Badge> <Badge class="secondary"></Badge>',id:"cmsparentbydomaindomainstring--",level:4},{value:"Type",id:"type",level:3},{value:'<code>CmsParent</code> <Badge class="secondary"></Badge>',id:"cmsparent-",level:4}],l=()=>{const e={span:"span",...(0,a.M)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},m=e=>{const n={a:"a",...(0,a.M)()};return(0,s.jsxs)(s.Fragment,{children:["Specification",(0,s.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},h=e=>{const n={span:"span",...(0,a.M)()};return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(n.span,{class:"badge badge--"+e.class,children:e.text})})};function p(e){const n={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,a.M)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.p,{children:["Returns the CMS parent object associated with a given domain name. In a\nconvention domain, this is the ",(0,s.jsx)(n.code,{children:"Convention"})," itself. Otherwise, it's the ",(0,s.jsx)(n.code,{children:"RootSite"}),"."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-graphql",children:"cmsParentByDomain(\n  domain: String!\n): CmsParent!\n"})}),"\n",(0,s.jsx)(n.h3,{id:"arguments",children:"Arguments"}),"\n",(0,s.jsxs)(n.h4,{id:"cmsparentbydomaindomainstring--",children:[(0,s.jsx)(n.a,{href:"#",children:(0,s.jsxs)("code",{style:{fontWeight:"normal"},children:["cmsParentByDomain.",(0,s.jsx)("b",{children:"domain"})]})}),(0,s.jsx)(l,{}),(0,s.jsx)(n.a,{href:"/docs/graphql/scalars/string",children:(0,s.jsx)(n.code,{children:"String!"})})," ",(0,s.jsx)(h,{class:"secondary",text:"non-null"})," ",(0,s.jsx)(h,{class:"secondary",text:"scalar"})]}),"\n",(0,s.jsx)(n.blockquote,{children:"\n"}),"\n",(0,s.jsx)(n.h3,{id:"type",children:"Type"}),"\n",(0,s.jsxs)(n.h4,{id:"cmsparent-",children:[(0,s.jsx)(n.a,{href:"/docs/graphql/interfaces/cms-parent",children:(0,s.jsx)(n.code,{children:"CmsParent"})})," ",(0,s.jsx)(h,{class:"secondary",text:"interface"})]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsx)(n.p,{children:"A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such\nas pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries."}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Most CMS parents are conventions, so their content will be convention-specific and scoped to\nthat convention's domain name. The exception to this is the root site, which is what Intercode\nrenders when there is no convention associated with the current domain name. (See the RootSite\nobject for more details about this.)"}),"\n",(0,s.jsx)(n.blockquote,{children:"\n"})]})}function u(e={}){const{wrapper:n}={...(0,a.M)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(p,{...e})}):p(e)}},54332:(e,n,t)=>{t.d(n,{I:()=>o,M:()=>i});var s=t(79020);const a={},r=s.createContext(a);function i(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);