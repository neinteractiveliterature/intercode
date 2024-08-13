"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[14104],{55853:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>a,contentTitle:()=>i,default:()=>h,frontMatter:()=>r,metadata:()=>c,toc:()=>l});var t=s(58040),o=s(1422);const r={sidebar_position:1},i="Users and profiles",c={id:"concepts/users-and-profiles",title:"Users and profiles",description:"In Intercode, user accounts are shared across multiple convention sites. This is so that users don't have to remember",source:"@site/docs/concepts/users-and-profiles.md",sourceDirName:"concepts",slug:"/concepts/users-and-profiles",permalink:"/docs/concepts/users-and-profiles",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/concepts/users-and-profiles.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"sidebar",previous:{title:"Conventions",permalink:"/docs/concepts/conventions"},next:{title:"Content management",permalink:"/docs/concepts/content-management"}},a={},l=[];function d(e){const n={a:"a",h1:"h1",header:"header",li:"li",p:"p",ul:"ul",...(0,o.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"users-and-profiles",children:"Users and profiles"})}),"\n",(0,t.jsx)(n.p,{children:"In Intercode, user accounts are shared across multiple convention sites. This is so that users don't have to remember\na separate password for each convention they attend. It also allows some useful cross-site functionality, such as\nallowing users to quickly re-propose an event that they've proposed at other conventions."}),"\n",(0,t.jsx)(n.p,{children:"However, conventions typically want to collect some specific information about attendees, and that information shouldn't\nbe shared with other conventions by default. Therefore, Intercode has a separate concept of the \"user con profile,\" a\nconvention-specific record that contains the user's information for that particular convention."}),"\n",(0,t.jsx)(n.p,{children:"As a result, the user account itself ends up being fairly minimal. It contains only:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"The user's name"}),"\n",(0,t.jsx)(n.li,{children:"The user's email address"}),"\n",(0,t.jsx)(n.li,{children:"A hashed password"}),"\n",(0,t.jsx)(n.li,{children:"A flag for whether or not the user is a global (cross-site) administrator"}),"\n",(0,t.jsx)(n.li,{children:"Some record-keeping information about logins, password resets, etc."}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"The user con profile typically contains a great deal more:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"A copy of the user's name (separately editable by the user, and used everywhere on the con site)"}),"\n",(0,t.jsx)(n.li,{children:"The user's nickname (note: this feature might be phased out in the future)"}),"\n",(0,t.jsx)(n.li,{children:"Records of their ticket for the convention, if applicable"}),"\n",(0,t.jsx)(n.li,{children:"Orders from the convention's online store, if applicable"}),"\n",(0,t.jsx)(n.li,{children:"Event signups"}),"\n",(0,t.jsx)(n.li,{children:"Event team memberships"}),"\n",(0,t.jsx)(n.li,{children:"Convention staff positions"}),"\n",(0,t.jsxs)(n.li,{children:["Any other information the convention has decided to collect via its profile form (",(0,t.jsx)(n.a,{href:"/docs/concepts/forms",children:"see Forms for more details on how this works"}),")"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},1422:(e,n,s)=>{s.d(n,{R:()=>i,x:()=>c});var t=s(62340);const o={},r=t.createContext(o);function i(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);