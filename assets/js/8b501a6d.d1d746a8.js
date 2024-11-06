"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[53158],{23678:(e,s,i)=>{i.r(s),i.d(s,{Badge:()=>h,Bullet:()=>o,Details:()=>b,SpecifiedBy:()=>g,assets:()=>c,contentTitle:()=>r,default:()=>j,frontMatter:()=>d,metadata:()=>l,toc:()=>u});const l=JSON.parse('{"id":"graphql/types/objects/mailing-lists","title":"MailingLists","description":"No description","source":"@site/docs/graphql/types/objects/mailing-lists.mdx","sourceDirName":"graphql/types/objects","slug":"/graphql/types/objects/mailing-lists","permalink":"/docs/graphql/types/objects/mailing-lists","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/mailing-lists.mdx","tags":[],"version":"current","frontMatter":{"id":"mailing-lists","title":"MailingLists"},"sidebar":"sidebar","previous":{"title":"MailingListsWaitlistsResult","permalink":"/docs/graphql/types/objects/mailing-lists-waitlists-result"},"next":{"title":"MarkOrderPaidPayload","permalink":"/docs/graphql/types/objects/mark-order-paid-payload"}}');var t=i(58040),a=i(5365),n=i(62340);const d={id:"mailing-lists",title:"MailingLists"},r=void 0,c={},o=()=>{const e={span:"span",...(0,a.R)()};return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},g=e=>{const s={a:"a",...(0,a.R)()};return(0,t.jsxs)(t.Fragment,{children:["Specification",(0,t.jsx)(s.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},h=e=>{const s={span:"span",...(0,a.R)()};return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(s.span,{className:e.class,children:e.text})})},b=({dataOpen:e,dataClose:s,children:i,startOpen:l=!1})=>{const d={details:"details",summary:"summary",...(0,a.R)()},[r,c]=(0,n.useState)(l);return(0,t.jsxs)(d.details,{...r?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,t.jsx)(d.summary,{onClick:e=>{e.preventDefault(),c((e=>!e))},style:{listStyle:"none"},children:r?e:s}),r&&i]})},u=[{value:"Fields",id:"fields",level:3},{value:'<code>MailingLists.<b>event_proposers</b></code><Bullet></Bullet><code>MailingListsResult!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"mailinglistsevent_proposersmailinglistsresult--",level:4},{value:'<code>MailingLists.<b>team_members</b></code><Bullet></Bullet><code>MailingListsResult!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"mailingliststeam_membersmailinglistsresult--",level:4},{value:'<code>MailingLists.<b>ticketed_attendees</b></code><Bullet></Bullet><code>MailingListsResult!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"mailingliststicketed_attendeesmailinglistsresult--",level:4},{value:'<code>MailingLists.<b>users_with_pending_bio</b></code><Bullet></Bullet><code>MailingListsResult!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"mailinglistsusers_with_pending_biomailinglistsresult--",level:4},{value:'<code>MailingLists.<b>waitlists</b></code><Bullet></Bullet><code>[MailingListsWaitlistsResult!]!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"mailinglistswaitlistsmailinglistswaitlistsresult--",level:4},{value:'<code>MailingLists.<b>whos_free</b></code><Bullet></Bullet><code>MailingListsResult!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"mailinglistswhos_freemailinglistsresult--",level:4},{value:'<code>MailingLists.whos_free.<b>finish</b></code><Bullet></Bullet><code>Date!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"mailinglistswhos_freefinishdate--",level:5},{value:'<code>MailingLists.whos_free.<b>start</b></code><Bullet></Bullet><code>Date!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"mailinglistswhos_freestartdate--",level:5},{value:"Member Of",id:"member-of",level:3}];function x(e){const s={a:"a",code:"code",h3:"h3",h4:"h4",h5:"h5",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.p,{children:"No description"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-graphql",children:"type MailingLists {\n  event_proposers: MailingListsResult!\n  team_members: MailingListsResult!\n  ticketed_attendees: MailingListsResult!\n  users_with_pending_bio: MailingListsResult!\n  waitlists: [MailingListsWaitlistsResult!]!\n  whos_free(\n    finish: Date!\n    start: Date!\n  ): MailingListsResult!\n}\n"})}),"\n",(0,t.jsx)(s.h3,{id:"fields",children:"Fields"}),"\n",(0,t.jsxs)(s.h4,{id:"mailinglistsevent_proposersmailinglistsresult--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["MailingLists.",(0,t.jsx)("b",{children:"event_proposers"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/mailing-lists-result",children:(0,t.jsx)(s.code,{children:"MailingListsResult!"})})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,t.jsxs)(s.h4,{id:"mailingliststeam_membersmailinglistsresult--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["MailingLists.",(0,t.jsx)("b",{children:"team_members"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/mailing-lists-result",children:(0,t.jsx)(s.code,{children:"MailingListsResult!"})})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,t.jsxs)(s.h4,{id:"mailingliststicketed_attendeesmailinglistsresult--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["MailingLists.",(0,t.jsx)("b",{children:"ticketed_attendees"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/mailing-lists-result",children:(0,t.jsx)(s.code,{children:"MailingListsResult!"})})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,t.jsxs)(s.h4,{id:"mailinglistsusers_with_pending_biomailinglistsresult--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["MailingLists.",(0,t.jsx)("b",{children:"users_with_pending_bio"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/mailing-lists-result",children:(0,t.jsx)(s.code,{children:"MailingListsResult!"})})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,t.jsxs)(s.h4,{id:"mailinglistswaitlistsmailinglistswaitlistsresult--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["MailingLists.",(0,t.jsx)("b",{children:"waitlists"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/mailing-lists-waitlists-result",children:(0,t.jsx)(s.code,{children:"[MailingListsWaitlistsResult!]!"})})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,t.jsxs)(s.h4,{id:"mailinglistswhos_freemailinglistsresult--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["MailingLists.",(0,t.jsx)("b",{children:"whos_free"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/mailing-lists-result",children:(0,t.jsx)(s.code,{children:"MailingListsResult!"})})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,t.jsxs)(s.h5,{id:"mailinglistswhos_freefinishdate--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["MailingLists.whos_free.",(0,t.jsx)("b",{children:"finish"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/scalars/date",children:(0,t.jsx)(s.code,{children:"Date!"})})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsxs)(s.h5,{id:"mailinglistswhos_freestartdate--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["MailingLists.whos_free.",(0,t.jsx)("b",{children:"start"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/scalars/date",children:(0,t.jsx)(s.code,{children:"Date!"})})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsx)(s.h3,{id:"member-of",children:"Member Of"}),"\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/convention",children:(0,t.jsx)(s.code,{children:"Convention"})}),"  ",(0,t.jsx)(h,{class:"badge badge--secondary",text:"object"})]})]})}function j(e={}){const{wrapper:s}={...(0,a.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(x,{...e})}):x(e)}},5365:(e,s,i)=>{i.d(s,{R:()=>n,x:()=>d});var l=i(62340);const t={},a=l.createContext(t);function n(e){const s=l.useContext(a);return l.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function d(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:n(e.components),l.createElement(a.Provider,{value:s},e.children)}}}]);