"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[54392],{91523:(e,t,n)=>{n.r(t),n.d(t,{Badge:()=>u,Bullet:()=>r,Details:()=>m,SpecifiedBy:()=>p,assets:()=>c,contentTitle:()=>d,default:()=>g,frontMatter:()=>s,metadata:()=>l,toc:()=>f});var i=n(58040),a=n(1422),o=n(62340);const s={id:"update-notification-template-input",title:"UpdateNotificationTemplateInput"},d=void 0,l={id:"graphql/types/inputs/update-notification-template-input",title:"UpdateNotificationTemplateInput",description:"Autogenerated input type of UpdateNotificationTemplate",source:"@site/docs/graphql/types/inputs/update-notification-template-input.mdx",sourceDirName:"graphql/types/inputs",slug:"/graphql/types/inputs/update-notification-template-input",permalink:"/docs/graphql/types/inputs/update-notification-template-input",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/inputs/update-notification-template-input.mdx",tags:[],version:"current",frontMatter:{id:"update-notification-template-input",title:"UpdateNotificationTemplateInput"},sidebar:"sidebar",previous:{title:"UpdateMaximumEventProvidedTicketsOverrideInput",permalink:"/docs/graphql/types/inputs/update-maximum-event-provided-tickets-override-input"},next:{title:"UpdateOrderEntryInput",permalink:"/docs/graphql/types/inputs/update-order-entry-input"}},c={},r=()=>{const e={span:"span",...(0,a.R)()};return(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},p=e=>{const t={a:"a",...(0,a.R)()};return(0,i.jsxs)(i.Fragment,{children:["Specification",(0,i.jsx)(t.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},u=e=>{const t={span:"span",...(0,a.R)()};return(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(t.span,{className:e.class,children:e.text})})},m=({dataOpen:e,dataClose:t,children:n,startOpen:s=!1})=>{const d={details:"details",summary:"summary",...(0,a.R)()},[l,c]=(0,o.useState)(s);return(0,i.jsxs)(d.details,{...l?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,i.jsx)(d.summary,{onClick:e=>{e.preventDefault(),c((e=>!e))},style:{listStyle:"none"},children:l?e:t}),l&&n]})},f=[{value:"Fields",id:"fields",level:3},{value:'<code>UpdateNotificationTemplateInput.<b>clientMutationId</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"updatenotificationtemplateinputclientmutationidstring-",level:4},{value:'<code>UpdateNotificationTemplateInput.<b>event_key</b></code><Bullet></Bullet><code>String!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"updatenotificationtemplateinputevent_keystring--",level:4},{value:'<code>UpdateNotificationTemplateInput.<b>notification_template</b></code><Bullet></Bullet><code>NotificationTemplateInput!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"updatenotificationtemplateinputnotification_templatenotificationtemplateinput--",level:4},{value:"Member Of",id:"member-of",level:3}];function h(e){const t={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.p,{children:"Autogenerated input type of UpdateNotificationTemplate"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-graphql",children:"input UpdateNotificationTemplateInput {\n  clientMutationId: String\n  event_key: String!\n  notification_template: NotificationTemplateInput!\n}\n"})}),"\n",(0,i.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,i.jsxs)(t.h4,{id:"updatenotificationtemplateinputclientmutationidstring-",children:[(0,i.jsx)(t.a,{href:"#",children:(0,i.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateNotificationTemplateInput.",(0,i.jsx)("b",{children:"clientMutationId"})]})}),(0,i.jsx)(r,{}),(0,i.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,i.jsx)(t.code,{children:"String"})})," ",(0,i.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,i.jsxs)(t.blockquote,{children:["\n",(0,i.jsx)(t.p,{children:"A unique identifier for the client performing the mutation."}),"\n"]}),"\n",(0,i.jsxs)(t.h4,{id:"updatenotificationtemplateinputevent_keystring--",children:[(0,i.jsx)(t.a,{href:"#",children:(0,i.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateNotificationTemplateInput.",(0,i.jsx)("b",{children:"event_key"})]})}),(0,i.jsx)(r,{}),(0,i.jsx)(t.a,{href:"/docs/graphql/types/scalars/string",children:(0,i.jsx)(t.code,{children:"String!"})})," ",(0,i.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,i.jsx)(u,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,i.jsx)(t.blockquote,{children:"\n"}),"\n",(0,i.jsxs)(t.h4,{id:"updatenotificationtemplateinputnotification_templatenotificationtemplateinput--",children:[(0,i.jsx)(t.a,{href:"#",children:(0,i.jsxs)("code",{style:{fontWeight:"normal"},children:["UpdateNotificationTemplateInput.",(0,i.jsx)("b",{children:"notification_template"})]})}),(0,i.jsx)(r,{}),(0,i.jsx)(t.a,{href:"/docs/graphql/types/inputs/notification-template-input",children:(0,i.jsx)(t.code,{children:"NotificationTemplateInput!"})})," ",(0,i.jsx)(u,{class:"badge badge--secondary",text:"non-null"})," ",(0,i.jsx)(u,{class:"badge badge--secondary",text:"input"})]}),"\n",(0,i.jsx)(t.blockquote,{children:"\n"}),"\n",(0,i.jsx)(t.h3,{id:"member-of",children:"Member Of"}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.a,{href:"/docs/graphql/api/mutations/update-notification-template",children:(0,i.jsx)(t.code,{children:"updateNotificationTemplate"})}),"  ",(0,i.jsx)(u,{class:"badge badge--secondary",text:"mutation"})]})]})}function g(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},1422:(e,t,n)=>{n.d(t,{R:()=>s,x:()=>d});var i=n(62340);const a={},o=i.createContext(a);function s(e){const t=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:s(e.components),i.createElement(o.Provider,{value:t},e.children)}}}]);