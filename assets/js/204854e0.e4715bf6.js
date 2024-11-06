"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[74117],{77235:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>h,Bullet:()=>l,Details:()=>u,SpecifiedBy:()=>p,assets:()=>d,contentTitle:()=>c,default:()=>y,frontMatter:()=>o,metadata:()=>s,toc:()=>m});const s=JSON.parse('{"id":"graphql/api/queries/cms-parent-by-request-host","title":"cmsParentByRequestHost","description":"Returns the CMS parent object associated with the domain name of this HTTP request. In a","source":"@site/docs/graphql/api/queries/cms-parent-by-request-host.mdx","sourceDirName":"graphql/api/queries","slug":"/graphql/api/queries/cms-parent-by-request-host","permalink":"/docs/graphql/api/queries/cms-parent-by-request-host","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/api/queries/cms-parent-by-request-host.mdx","tags":[],"version":"current","frontMatter":{"id":"cms-parent-by-request-host","title":"cmsParentByRequestHost"},"sidebar":"sidebar","previous":{"title":"cmsParentByDomain","permalink":"/docs/graphql/api/queries/cms-parent-by-domain"},"next":{"title":"conventionByDomain","permalink":"/docs/graphql/api/queries/convention-by-domain"}}');var a=n(58040),r=n(5365),i=n(62340);const o={id:"cms-parent-by-request-host",title:"cmsParentByRequestHost"},c=void 0,d={},l=()=>{const e={span:"span",...(0,r.R)()};return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,r.R)()};return(0,a.jsxs)(a.Fragment,{children:["Specification",(0,a.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},h=e=>{const t={span:"span",...(0,r.R)()};return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(t.span,{className:e.class,children:e.text})})},u=({dataOpen:e,dataClose:t,children:n,startOpen:s=!1})=>{const o={details:"details",summary:"summary",...(0,r.R)()},[c,d]=(0,i.useState)(s);return(0,a.jsxs)(o.details,{...c?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,a.jsx)(o.summary,{onClick:e=>{e.preventDefault(),d((e=>!e))},style:{listStyle:"none"},children:c?e:t}),c&&n]})},m=[{value:"Type",id:"type",level:3},{value:'<code>CmsParent</code> <Badge class="badge badge--secondary"></Badge>',id:"cmsparent-",level:4}];function f(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(t.p,{children:["Returns the CMS parent object associated with the domain name of this HTTP request. In a\nconvention domain, this is the ",(0,a.jsx)(t.code,{children:"Convention"})," itself. Otherwise, it's the ",(0,a.jsx)(t.code,{children:"RootSite"}),"."]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-graphql",children:"cmsParentByRequestHost: CmsParent!\n"})}),"\n",(0,a.jsx)(t.h3,{id:"type",children:"Type"}),"\n",(0,a.jsxs)(t.h4,{id:"cmsparent-",children:[(0,a.jsx)(t.a,{href:"/docs/graphql/types/interfaces/cms-parent",children:(0,a.jsx)(t.code,{children:"CmsParent"})})," ",(0,a.jsx)(h,{class:"badge badge--secondary",text:"interface"})]}),"\n",(0,a.jsx)(t.p,{children:"A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such\nas pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries."}),"\n",(0,a.jsx)(t.p,{children:"Most CMS parents are conventions, so their content will be convention-specific and scoped to\nthat convention's domain name. The exception to this is the root site, which is what Intercode\nrenders when there is no convention associated with the current domain name. (See the RootSite\nobject for more details about this.)"})]})}function y(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(f,{...e})}):f(e)}},5365:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>o});var s=n(62340);const a={},r=s.createContext(a);function i(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);