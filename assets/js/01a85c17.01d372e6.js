"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[64013],{95353:function(e,t,a){a.d(t,{Z:function(){return N}});var n=a(97596),r=a(3289),l=a(52238),i=a(17479),c=a(75174),s=a(67695),m="sidebar_k_wS",o="sidebarItemTitle_UOni",u="sidebarItemList_vcTH",g="sidebarItem_EETZ",d="sidebarItemLink_yBD8",E="sidebarItemLinkActive_AkDs";function b(e){var t=e.sidebar;return r.createElement("aside",{className:"col col--3"},r.createElement("nav",{className:(0,l.Z)(m,"thin-scrollbar"),"aria-label":(0,s.I)({id:"theme.blog.sidebar.navAriaLabel",message:"Blog recent posts navigation",description:"The ARIA label for recent posts in the blog sidebar"})},r.createElement("div",{className:(0,l.Z)(o,"margin-bottom--md")},t.title),r.createElement("ul",{className:(0,l.Z)(u,"clean-list")},t.items.map((function(e){return r.createElement("li",{key:e.permalink,className:g},r.createElement(c.Z,{isNavLink:!0,to:e.permalink,className:d,activeClassName:E},e.title))})))))}var v=a(31325);function p(e){var t=e.sidebar;return r.createElement("ul",{className:"menu__list"},t.items.map((function(e){return r.createElement("li",{key:e.permalink,className:"menu__list-item"},r.createElement(c.Z,{isNavLink:!0,to:e.permalink,className:"menu__link",activeClassName:"menu__link--active"},e.title))})))}function f(e){return r.createElement(v.Zo,{component:p,props:e})}var k=a(93565);function h(e){var t=e.sidebar,a=(0,k.i)();return null!=t&&t.items.length?"mobile"===a?r.createElement(f,{sidebar:t}):r.createElement(b,{sidebar:t}):null}var _=["sidebar","toc","children"];function N(e){var t=e.sidebar,a=e.toc,c=e.children,s=(0,n.Z)(e,_),m=t&&t.items.length>0;return r.createElement(i.Z,s,r.createElement("div",{className:"container margin-vert--lg"},r.createElement("div",{className:"row"},r.createElement(h,{sidebar:t}),r.createElement("main",{className:(0,l.Z)("col",{"col--7":m,"col--9 col--offset-1":!m}),itemScope:!0,itemType:"http://schema.org/Blog"},c),a&&r.createElement("div",{className:"col col--2"},a))))}},34348:function(e,t,a){a.r(t),a.d(t,{default:function(){return E}});var n=a(3289),r=a(95353),l=a(77510),i=a(67695);var c="tag_aPYI";function s(e){var t=e.letterEntry;return n.createElement("article",null,n.createElement("h2",null,t.letter),n.createElement("ul",{className:"padding--none"},t.tags.map((function(e){return n.createElement("li",{key:e.permalink,className:c},n.createElement(l.Z,e))}))),n.createElement("hr",null))}function m(e){var t=function(e){var t={};return Object.values(e).forEach((function(e){var a=function(e){return e[0].toUpperCase()}(e.label);null!=t[a]||(t[a]=[]),t[a].push(e)})),Object.entries(t).sort((function(e,t){var a=e[0],n=t[0];return a.localeCompare(n)})).map((function(e){return{letter:e[0],tags:e[1].sort((function(e,t){return e.label.localeCompare(t.label)}))}}))}(e.tags);return n.createElement("section",{className:"margin-vert--lg"},t.map((function(e){return n.createElement(s,{key:e.letter,letterEntry:e})})))}var o=a(10210),u=a(79231),g=a(25058),d=a(52238);function E(e){var t=e.tags,a=e.sidebar,l=(0,i.I)({id:"theme.tags.tagsPageTitle",message:"Tags",description:"The title of the tag list page"});return n.createElement(o.FG,{className:(0,d.Z)(u.k.wrapper.blogPages,u.k.page.blogTagsListPage)},n.createElement(o.d,{title:l}),n.createElement(g.Z,{tag:"blog_tags_list"}),n.createElement(r.Z,{sidebar:a},n.createElement("h1",null,l),n.createElement(m,{tags:t})))}},77510:function(e,t,a){a.d(t,{Z:function(){return m}});var n=a(3289),r=a(52238),l=a(75174),i="tag_cscm",c="tagRegular_TXVr",s="tagWithCount_gWUV";function m(e){var t=e.permalink,a=e.label,m=e.count;return n.createElement(l.Z,{href:t,className:(0,r.Z)(i,m?s:c)},a,m&&n.createElement("span",null,m))}}}]);