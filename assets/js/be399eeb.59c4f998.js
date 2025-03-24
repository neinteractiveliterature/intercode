"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[37191],{31076:(e,a,s)=>{s.r(a),s.d(a,{assets:()=>l,contentTitle:()=>i,default:()=>h,frontMatter:()=>o,metadata:()=>t,toc:()=>d});const t=JSON.parse('{"id":"graphql/operations/queries/oauth-pre-auth","title":"oauthPreAuth","description":"Given a set of valid OAuth query parameters for the /oauth/authorize endpoint, returns a","source":"@site/docs/graphql/operations/queries/oauth-pre-auth.md","sourceDirName":"graphql/operations/queries","slug":"/graphql/operations/queries/oauth-pre-auth","permalink":"/docs/graphql/operations/queries/oauth-pre-auth","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/operations/queries/oauth-pre-auth.md","tags":[],"version":"current","frontMatter":{"id":"oauth-pre-auth","title":"oauthPreAuth"},"sidebar":"sidebar","previous":{"title":"myAuthorizedApplications","permalink":"/docs/graphql/operations/queries/my-authorized-applications"},"next":{"title":"organizations","permalink":"/docs/graphql/operations/queries/organizations"}}');var n=s(58040),r=s(5365);const o={id:"oauth-pre-auth",title:"oauthPreAuth"},i=void 0,l={},d=[{value:"Arguments",id:"arguments",level:3},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">oauthPreAuth</code>.<code class="gqlmd-mdx-entity-name">queryParams</code></span><span class="gqlmd-mdx-bullet">\xa0\u25cf\xa0</span><span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Json!</code></span> <mark class="gqlmd-mdx-badge">non-null</mark> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"oauthpreauthqueryparamsjson-non-null-scalar",level:4},{value:"Type",id:"type",level:3},{value:'<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">Json</code></span> <mark class="gqlmd-mdx-badge">scalar</mark>',id:"json-scalar",level:4}];function c(e){const a={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(a.p,{children:["Given a set of valid OAuth query parameters for the ",(0,n.jsx)(a.code,{children:"/oauth/authorize"})," endpoint, returns a\nJSON object containing the necessary data for rendering the pre-authorization screen that\nchecks if you want to allow an application to access Intercode on your behalf."]}),"\n",(0,n.jsxs)(a.p,{children:["This essentially emulates the JSON behavior of\n",(0,n.jsx)(a.a,{href:"https://github.com/doorkeeper-gem/doorkeeper",children:"Doorkeeper"}),"'s API-only mode if you go to\n",(0,n.jsx)(a.code,{children:"/oauth/authorize"})," with query parameters. The only reason this query exists, rather than\nsimply having clients actually call ",(0,n.jsx)(a.code,{children:"/oauth/authorize"}),", is that we're running Doorkeeper\nin regular mode so that we can get the server-rendered HTML admin views."]}),"\n",(0,n.jsxs)(a.p,{children:["When we've implemented our own admin screens for OAuth\n(see ",(0,n.jsx)(a.a,{href:"https://github.com/neinteractiveliterature/intercode/issues/2740",children:"this Github issue"}),"),\nthis query will be deprecated."]}),"\n",(0,n.jsx)(a.pre,{children:(0,n.jsx)(a.code,{className:"language-graphql",children:"oauthPreAuth(\n  queryParams: Json!\n): Json!\n"})}),"\n",(0,n.jsx)(a.h3,{id:"arguments",children:"Arguments"}),"\n",(0,n.jsxs)(a.h4,{id:"oauthpreauthqueryparamsjson-non-null-scalar",children:[(0,n.jsx)(a.a,{href:"#",children:(0,n.jsxs)("span",{class:"gqlmd-mdx-entity",children:[(0,n.jsx)("code",{class:"gqlmd-mdx-entity-parent",children:"oauthPreAuth"}),".",(0,n.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"queryParams"})]})}),(0,n.jsx)("span",{class:"gqlmd-mdx-bullet",children:"\xa0\u25cf\xa0"}),(0,n.jsx)(a.a,{href:"/docs/graphql/types/scalars/json",children:(0,n.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,n.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Json!"})})})," ",(0,n.jsx)("mark",{class:"gqlmd-mdx-badge",children:"non-null"})," ",(0,n.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,n.jsxs)(a.p,{children:["A set of HTTP query parameters for ",(0,n.jsx)(a.code,{children:"/oauth/authorize"}),", parsed out and\nrepresented as a JSON object."]}),"\n",(0,n.jsx)(a.h3,{id:"type",children:"Type"}),"\n",(0,n.jsxs)(a.h4,{id:"json-scalar",children:[(0,n.jsx)(a.a,{href:"/docs/graphql/types/scalars/json",children:(0,n.jsx)("span",{class:"gqlmd-mdx-entity",children:(0,n.jsx)("code",{class:"gqlmd-mdx-entity-name",children:"Json"})})})," ",(0,n.jsx)("mark",{class:"gqlmd-mdx-badge",children:"scalar"})]}),"\n",(0,n.jsx)(a.p,{children:"An arbitrary object, serialized as JSON"})]})}function h(e={}){const{wrapper:a}={...(0,r.R)(),...e.components};return a?(0,n.jsx)(a,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},5365:(e,a,s)=>{s.d(a,{R:()=>o,x:()=>i});var t=s(62340);const n={},r=t.createContext(n);function o(e){const a=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function i(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:o(e.components),t.createElement(r.Provider,{value:a},e.children)}}}]);