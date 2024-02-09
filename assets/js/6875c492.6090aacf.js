"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[32392],{30976:(e,t,n)=>{n.d(t,{c:()=>r});n(79020);var s=n(55520),a=n(93528),i=n(36544);function r(e){const{metadata:t}=e,{previousPage:n,nextPage:r}=t;return(0,i.jsxs)("nav",{className:"pagination-nav","aria-label":(0,s.G)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"}),children:[n&&(0,i.jsx)(a.c,{permalink:n,title:(0,i.jsx)(s.c,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)",children:"Newer Entries"})}),r&&(0,i.jsx)(a.c,{permalink:r,title:(0,i.jsx)(s.c,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)",children:"Older Entries"}),isNext:!0})]})}},78696:(e,t,n)=>{n.d(t,{c:()=>r});n(79020);var s=n(52808),a=n(86892),i=n(36544);function r(e){let{items:t,component:n=a.c}=e;return(0,i.jsx)(i.Fragment,{children:t.map((e=>{let{content:t}=e;return(0,i.jsx)(s.E,{content:t,children:(0,i.jsx)(n,{children:(0,i.jsx)(t,{})})},t.metadata.permalink)}))})}},80460:(e,t,n)=>{n.r(t),n.d(t,{default:()=>f});n(79020);var s=n(18816),a=n(55520),i=n(94752),r=n(29076),l=n(89800),o=n(2840),c=n(60628),d=n(30976),g=n(44852),u=n(78696),h=n(22708),p=n(57638),m=n(36544);function x(e){const t=function(){const{selectMessage:e}=(0,i.A)();return t=>e(t,(0,a.G)({id:"theme.blog.post.plurals",description:'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One post|{count} posts"},{count:t}))}();return(0,a.G)({id:"theme.blog.tagTitle",description:"The title of the page for a blog tag",message:'{nPosts} tagged with "{tagName}"'},{nPosts:t(e.count),tagName:e.label})}function j(e){let{tag:t}=e;const n=x(t);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(r.U7,{title:n}),(0,m.jsx)(g.c,{tag:"blog_tags_posts"})]})}function b(e){let{tag:t,items:n,sidebar:s,listMetadata:i}=e;const r=x(t);return(0,m.jsxs)(c.c,{sidebar:s,children:[t.unlisted&&(0,m.jsx)(h.c,{}),(0,m.jsxs)("header",{className:"margin-bottom--xl",children:[(0,m.jsx)(p.c,{as:"h1",children:r}),(0,m.jsx)(o.c,{href:t.allTagsPath,children:(0,m.jsx)(a.c,{id:"theme.tags.tagsPageLink",description:"The label of the link targeting the tag list page",children:"View All Tags"})})]}),(0,m.jsx)(u.c,{items:n}),(0,m.jsx)(d.c,{metadata:i})]})}function f(e){return(0,m.jsxs)(r.cr,{className:(0,s.c)(l.W.wrapper.blogPages,l.W.page.blogTagPostListPage),children:[(0,m.jsx)(j,{...e}),(0,m.jsx)(b,{...e})]})}},22708:(e,t,n)=>{n.d(t,{c:()=>h});n(79020);var s=n(18816),a=n(55520),i=n(90520),r=n(36544);function l(){return(0,r.jsx)(a.c,{id:"theme.unlistedContent.title",description:"The unlisted content banner title",children:"Unlisted page"})}function o(){return(0,r.jsx)(a.c,{id:"theme.unlistedContent.message",description:"The unlisted content banner message",children:"This page is unlisted. Search engines will not index it, and only users having a direct link can access it."})}function c(){return(0,r.jsx)(i.c,{children:(0,r.jsx)("meta",{name:"robots",content:"noindex, nofollow"})})}var d=n(89800),g=n(88876);function u(e){let{className:t}=e;return(0,r.jsx)(g.c,{type:"caution",title:(0,r.jsx)(l,{}),className:(0,s.c)(t,d.W.common.unlistedBanner),children:(0,r.jsx)(o,{})})}function h(e){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(c,{}),(0,r.jsx)(u,{...e})]})}}}]);