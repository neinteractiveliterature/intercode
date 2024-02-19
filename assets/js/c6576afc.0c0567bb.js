"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[29994],{13960:(e,i,t)=>{t.r(i),t.d(i,{assets:()=>d,contentTitle:()=>r,default:()=>m,frontMatter:()=>s,metadata:()=>a,toc:()=>o});var n=t(35091),l=t(1422);const s={id:"email-link",title:"email_link"},r=void 0,a={id:"liquid/filters/email-link",title:"email_link",description:"Outputs either a clickable mailto: link (if the user is currently logged in), or an",source:"@site/docs/liquid/filters/email-link.mdx",sourceDirName:"liquid/filters",slug:"/liquid/filters/email-link",permalink:"/docs/liquid/filters/email-link",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/liquid/filters/email-link.mdx",tags:[],version:"current",frontMatter:{id:"email-link",title:"email_link"},sidebar:"sidebar",previous:{title:"date_with_local_time",permalink:"/docs/liquid/filters/date-with-local-time"},next:{title:"humanize",permalink:"/docs/liquid/filters/humanize"}},d={},o=[{value:"Parameters",id:"parameters",level:3},{value:"<code>input</code> (<code>String</code>)",id:"input-string",level:4},{value:"Returns (<code>String</code>)",id:"returns-string",level:3},{value:"Examples",id:"examples",level:3}];function c(e){const i={code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,l.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(i.p,{children:"Outputs either a clickable mailto: link (if the user is currently logged in), or an\nobfuscated email (if the user is not logged in).  The intent of this is to be a spammer-safe\nway to link to email addresses."}),"\n",(0,n.jsx)(i.h3,{id:"parameters",children:"Parameters"}),"\n",(0,n.jsxs)(i.h4,{id:"input-string",children:[(0,n.jsx)(i.code,{children:"input"})," (",(0,n.jsx)("code",{children:"String"}),")"]}),"\n",(0,n.jsx)(i.p,{children:"An email address"}),"\n",(0,n.jsxs)(i.h3,{id:"returns-string",children:["Returns (",(0,n.jsx)("code",{children:"String"}),")"]}),"\n",(0,n.jsx)(i.p,{children:"A spammer-safe HTML representation of the email address"}),"\n",(0,n.jsx)(i.h3,{id:"examples",children:"Examples"}),"\n",(0,n.jsx)(i.pre,{children:(0,n.jsx)(i.code,{className:"language-liquid",metastring:'title="When logged in"',children:'{{ "test@example.com" | email_link }}\n=> <a href="mailto:test@example.com">test@example.com</a>\n'})}),"\n",(0,n.jsx)(i.pre,{children:(0,n.jsx)(i.code,{className:"language-liquid",metastring:'title="When not logged in"',children:'{{ "test@example.com" | email_link }}\n=> test AT example DOT com\n'})})]})}function m(e={}){const{wrapper:i}={...(0,l.R)(),...e.components};return i?(0,n.jsx)(i,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},1422:(e,i,t)=>{t.d(i,{R:()=>r,x:()=>a});var n=t(7731);const l={},s=n.createContext(l);function r(e){const i=n.useContext(s);return n.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function a(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:r(e.components),n.createElement(s.Provider,{value:i},e.children)}}}]);