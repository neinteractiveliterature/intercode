"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[26409],{97238:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>p,frontMatter:()=>s,metadata:()=>i,toc:()=>c});var a=n(35091),o=n(1422);const s={title:"How Intercode builds and loads JavaScript",tags:["tech"],authors:["nbudin"]},r=void 0,i={permalink:"/blog/2023/05/11/js-loading-strategy",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/blog/blog/2023-05-11-js-loading-strategy.md",source:"@site/blog/2023-05-11-js-loading-strategy.md",title:"How Intercode builds and loads JavaScript",description:'Intercode is an open source Ruby on Rails application with a (mostly) single-page app frontend. Virtually all "pages" in',date:"2023-05-11T00:00:00.000Z",tags:[{label:"tech",permalink:"/blog/tags/tech"}],readingTime:10.82,hasTruncateMarker:!0,authors:[{name:"Nat Budin",url:"https://github.com/nbudin",imageURL:"https://github.com/nbudin.png",key:"nbudin"}],frontMatter:{title:"How Intercode builds and loads JavaScript",tags:["tech"],authors:["nbudin"]},unlisted:!1,nextItem:{title:"Database Export Security Issue Disclosure",permalink:"/blog/2022/12/02/database-export-security-disclosure"}},l={authorsImageUrls:[void 0]},c=[];function d(e){const t={a:"a",p:"p",...(0,o.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(t.p,{children:['Intercode is an open source Ruby on Rails application with a (mostly) single-page app frontend. Virtually all "pages" in\nthe web application are resolved and rendered on the frontend using ',(0,a.jsx)(t.a,{href:"https://reactrouter.com/",children:"react-router"}),". These\npages then load the data they need using Intercode's GraphQL API, which is implemented on the Rails server side using\n",(0,a.jsx)(t.a,{href:"https://graphql-ruby.org",children:"graphql-ruby"}),"."]}),"\n",(0,a.jsx)(t.p,{children:"Intercode doesn't follow the recommended strategy for JavaScript loading in Rails applications. This blog post is an\nattempt to explain why, and what we do instead."})]})}function p(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(d,{...e})}):d(e)}},1422:(e,t,n)=>{n.d(t,{R:()=>r,x:()=>i});var a=n(7731);const o={},s=a.createContext(o);function r(e){const t=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),a.createElement(s.Provider,{value:t},e.children)}}}]);