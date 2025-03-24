"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[61883],{91918:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>d,default:()=>m,frontMatter:()=>i,metadata:()=>t,toc:()=>o});const t=JSON.parse('{"id":"graphql/operations/queries/cms-parent-by-domain","title":"cmsParentByDomain","description":"Returns the CMS parent object associated with a given domain name. In a","source":"@site/docs/graphql/operations/queries/cms-parent-by-domain.md","sourceDirName":"graphql/operations/queries","slug":"/graphql/operations/queries/cms-parent-by-domain","permalink":"/docs/graphql/operations/queries/cms-parent-by-domain","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/operations/queries/cms-parent-by-domain.md","tags":[],"version":"current","frontMatter":{"id":"cms-parent-by-domain","title":"cmsParentByDomain"},"sidebar":"sidebar","previous":{"title":"assumedIdentityFromProfile","permalink":"/docs/graphql/operations/queries/assumed-identity-from-profile"},"next":{"title":"cmsParentByRequestHost","permalink":"/docs/graphql/operations/queries/cms-parent-by-request-host"}}');var a=s(58040),r=s(5365);const i={id:"cms-parent-by-domain",title:"cmsParentByDomain"},d=void 0,c={},o=[{value:"Arguments",id:"arguments",level:3},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">cmsParentByDomain</code>.<code class="gqlmd-mdx-entity-name">domain</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">String!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"cmsparentbydomaindomainstring-non-null-scalar",level:4},{value:"Type",id:"type",level:3},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">CmsParent</code></span> <mark class="gqlmd-mdx-badge">interface</mark>',id:"cmsparent-interface",level:4}];function l(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(n.p,{children:["Returns the CMS parent object associated with a given domain name. In a\nconvention domain, this is the ",(0,a.jsx)(n.code,{children:"Convention"})," itself. Otherwise, it's the ",(0,a.jsx)(n.code,{children:"RootSite"}),"."]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-graphql",children:"cmsParentByDomain(\n  domain: String!\n): CmsParent!\n"})}),"\n",(0,a.jsx)(n.h3,{id:"arguments",children:"Arguments"}),"\n",(0,a.jsxs)(n.h4,{id:"cmsparentbydomaindomainstring-non-null-scalar",children:[(0,a.jsx)(n.a,{href:"#",children:(0,a.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,a.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"cmsParentByDomain"}),".",(0,a.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"domain"})]})}),(0,a.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,a.jsx)(n.a,{href:"/docs/graphql/types/scalars/string",children:(0,a.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,a.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"String!"})})})," ",(0,a.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,a.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,a.jsx)(n.h3,{id:"type",children:"Type"}),"\n",(0,a.jsxs)(n.h4,{id:"cmsparent-interface",children:[(0,a.jsx)(n.a,{href:"/docs/graphql/types/interfaces/cms-parent",children:(0,a.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,a.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"CmsParent"})})})," ",(0,a.jsx)("mark",{class:"gqlmd-mdx-badge",children:"interface"})]}),"\n",(0,a.jsx)(n.p,{children:"A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such\nas pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries."}),"\n",(0,a.jsx)(n.p,{children:"Most CMS parents are conventions, so their content will be convention-specific and scoped to\nthat convention's domain name. The exception to this is the root site, which is what Intercode\nrenders when there is no convention associated with the current domain name. (See the RootSite\nobject for more details about this.)"})]})}function m(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(l,{...e})}):l(e)}},5365:(e,n,s)=>{s.d(n,{R:()=>i,x:()=>d});var t=s(62340);const a={},r=t.createContext(a);function i(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);