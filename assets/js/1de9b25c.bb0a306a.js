"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[36562],{81640:(e,n,t)=>{t.r(n),t.d(n,{Badge:()=>h,Bullet:()=>l,Details:()=>p,SpecifiedBy:()=>m,assets:()=>d,contentTitle:()=>r,default:()=>v,frontMatter:()=>a,metadata:()=>c,toc:()=>u});var o=t(58040),i=t(1422),s=t(62340);const a={id:"convention-by-domain",title:"conventionByDomain"},r=void 0,c={id:"graphql/api/queries/convention-by-domain",title:"conventionByDomain",description:"Returns the convention associated with a specified domain name.",source:"@site/docs/graphql/api/queries/convention-by-domain.mdx",sourceDirName:"graphql/api/queries",slug:"/graphql/api/queries/convention-by-domain",permalink:"/docs/graphql/api/queries/convention-by-domain",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/api/queries/convention-by-domain.mdx",tags:[],version:"current",frontMatter:{id:"convention-by-domain",title:"conventionByDomain"},sidebar:"sidebar",previous:{title:"cmsParentByRequestHost",permalink:"/docs/graphql/api/queries/cms-parent-by-request-host"},next:{title:"conventionById",permalink:"/docs/graphql/api/queries/convention-by-id"}},d={},l=()=>{const e={span:"span",...(0,i.R)()};return(0,o.jsx)(o.Fragment,{children:(0,o.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},m=e=>{const n={a:"a",...(0,i.R)()};return(0,o.jsxs)(o.Fragment,{children:["Specification",(0,o.jsx)(n.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},h=e=>{const n={span:"span",...(0,i.R)()};return(0,o.jsx)(o.Fragment,{children:(0,o.jsx)(n.span,{className:e.class,children:e.text})})},p=({dataOpen:e,dataClose:n,children:t,startOpen:a=!1})=>{const r={details:"details",summary:"summary",...(0,i.R)()},[c,d]=(0,s.useState)(a);return(0,o.jsxs)(r.details,{...c?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,o.jsx)(r.summary,{onClick:e=>{e.preventDefault(),d((e=>!e))},style:{listStyle:"none"},children:c?e:n}),c&&t]})},u=[{value:"Arguments",id:"arguments",level:3},{value:'<code>conventionByDomain.<b>domain</b></code><Bullet></Bullet><code>String!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"conventionbydomaindomainstring--",level:4},{value:"Type",id:"type",level:3},{value:'<code>Convention</code> <Badge class="badge badge--secondary"></Badge>',id:"convention-",level:4}];function g(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.p,{children:"Returns the convention associated with a specified domain name."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-graphql",children:"conventionByDomain(\n  domain: String!\n): Convention!\n"})}),"\n",(0,o.jsx)(n.h3,{id:"arguments",children:"Arguments"}),"\n",(0,o.jsxs)(n.h4,{id:"conventionbydomaindomainstring--",children:[(0,o.jsx)(n.a,{href:"#",children:(0,o.jsxs)("code",{style:{fontWeight:"normal"},children:["conventionByDomain.",(0,o.jsx)("b",{children:"domain"})]})}),(0,o.jsx)(l,{}),(0,o.jsx)(n.a,{href:"/docs/graphql/types/scalars/string",children:(0,o.jsx)(n.code,{children:"String!"})})," ",(0,o.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,o.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,o.jsx)(n.p,{children:"The domain name to find a convention by."}),"\n",(0,o.jsx)(n.h3,{id:"type",children:"Type"}),"\n",(0,o.jsxs)(n.h4,{id:"convention-",children:[(0,o.jsx)(n.a,{href:"/docs/graphql/types/objects/convention",children:(0,o.jsx)(n.code,{children:"Convention"})})," ",(0,o.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,o.jsx)(n.p,{children:"A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,\nreal-world convention (and this is probably the most common use case), but it can also represent a single event\n(if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series)."}),"\n",(0,o.jsx)(n.p,{children:"They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of\nthem as \"web site.\""})]})}function v(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(g,{...e})}):g(e)}},1422:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>r});var o=t(62340);const i={},s=o.createContext(i);function a(e){const n=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),o.createElement(s.Provider,{value:n},e.children)}}}]);