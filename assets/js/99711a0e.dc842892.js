"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[29530],{7299:(e,s,n)=>{n.r(s),n.d(s,{Badge:()=>g,Bullet:()=>o,Details:()=>p,SpecifiedBy:()=>u,assets:()=>l,contentTitle:()=>r,default:()=>x,frontMatter:()=>c,metadata:()=>i,toc:()=>h});var t=n(58040),d=n(1422),a=n(62340);const c={id:"signup-request",title:"SignupRequest"},r=void 0,i={id:"graphql/types/objects/signup-request",title:"SignupRequest",description:"In a moderated-signup convention, SignupRequests are the queue of signups that users have asked to do.  Convention",source:"@site/docs/graphql/types/objects/signup-request.mdx",sourceDirName:"graphql/types/objects",slug:"/graphql/types/objects/signup-request",permalink:"/docs/graphql/types/objects/signup-request",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/types/objects/signup-request.mdx",tags:[],version:"current",frontMatter:{id:"signup-request",title:"SignupRequest"},sidebar:"sidebar",previous:{title:"SignupRankedChoice",permalink:"/docs/graphql/types/objects/signup-ranked-choice"},next:{title:"SignupRequestsPagination",permalink:"/docs/graphql/types/objects/signup-requests-pagination"}},l={},o=()=>{const e={span:"span",...(0,d.R)()};return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(e.span,{style:{fontWeight:"normal",fontSize:".5em",color:"var(--ifm-color-secondary-darkest)"},children:"\xa0\u25cf\xa0"})})},u=e=>{const s={a:"a",...(0,d.R)()};return(0,t.jsxs)(t.Fragment,{children:["Specification",(0,t.jsx)(s.a,{className:"link",style:{fontSize:"1.5em",paddingLeft:"4px"},target:"_blank",href:e.url,title:"Specified by "+e.url,children:"\u2398"})]})},g=e=>{const s={span:"span",...(0,d.R)()};return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(s.span,{className:e.class,children:e.text})})},p=({dataOpen:e,dataClose:s,children:n,startOpen:c=!1})=>{const r={details:"details",summary:"summary",...(0,d.R)()},[i,l]=(0,a.useState)(c);return(0,t.jsxs)(r.details,{...i?{open:!0}:{},className:"details",style:{border:"none",boxShadow:"none",background:"var(--ifm-background-color)"},children:[(0,t.jsx)(r.summary,{onClick:e=>{e.preventDefault(),l((e=>!e))},style:{listStyle:"none"},children:i?e:s}),i&&n]})},h=[{value:"Fields",id:"fields",level:3},{value:'<code>SignupRequest.<b>created_at</b></code><Bullet></Bullet><code>Date!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuprequestcreated_atdate--",level:4},{value:'<code>SignupRequest.<b>id</b></code><Bullet></Bullet><code>ID!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuprequestidid--",level:4},{value:'<code>SignupRequest.<b>replace_signup</b></code><Bullet></Bullet><code>Signup</code> <Badge class="badge badge--secondary"></Badge>',id:"signuprequestreplace_signupsignup-",level:4},{value:'<code>SignupRequest.<b>requested_bucket_key</b></code><Bullet></Bullet><code>String</code> <Badge class="badge badge--secondary"></Badge>',id:"signuprequestrequested_bucket_keystring-",level:4},{value:'<code>SignupRequest.<b>result_signup</b></code><Bullet></Bullet><code>Signup</code> <Badge class="badge badge--secondary"></Badge>',id:"signuprequestresult_signupsignup-",level:4},{value:'<code>SignupRequest.<b>state</b></code><Bullet></Bullet><code>SignupRequestState!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuprequeststatesignuprequeststate--",level:4},{value:'<code>SignupRequest.<b>target_run</b></code><Bullet></Bullet><code>Run!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuprequesttarget_runrun--",level:4},{value:'<code>SignupRequest.<b>updated_at</b></code><Bullet></Bullet><code>Date!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuprequestupdated_atdate--",level:4},{value:'<code>SignupRequest.<b>updated_by</b></code><Bullet></Bullet><code>User!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuprequestupdated_byuser--",level:4},{value:'<code>SignupRequest.<b>user_con_profile</b></code><Bullet></Bullet><code>UserConProfile!</code> <Badge class="badge badge--secondary"></Badge> <Badge class="badge badge--secondary"></Badge>',id:"signuprequestuser_con_profileuserconprofile--",level:4},{value:"Member Of",id:"member-of",level:3}];function j(e){const s={a:"a",blockquote:"blockquote",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,d.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.p,{children:"In a moderated-signup convention, SignupRequests are the queue of signups that users have asked to do.  Convention\nstaff can go through these requests and accept them (which produces a Signup) or reject them."}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-graphql",children:"type SignupRequest {\n  created_at: Date!\n  id: ID!\n  replace_signup: Signup\n  requested_bucket_key: String\n  result_signup: Signup\n  state: SignupRequestState!\n  target_run: Run!\n  updated_at: Date!\n  updated_by: User!\n  user_con_profile: UserConProfile!\n}\n"})}),"\n",(0,t.jsx)(s.h3,{id:"fields",children:"Fields"}),"\n",(0,t.jsxs)(s.h4,{id:"signuprequestcreated_atdate--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRequest.",(0,t.jsx)("b",{children:"created_at"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/scalars/date",children:(0,t.jsx)(s.code,{children:"Date!"})})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsx)(s.p,{children:"The time this request was put in"}),"\n"]}),"\n",(0,t.jsxs)(s.h4,{id:"signuprequestidid--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRequest.",(0,t.jsx)("b",{children:"id"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/scalars/id",children:(0,t.jsx)(s.code,{children:"ID!"})})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsx)(s.p,{children:"The ID of this SignupRequest"}),"\n"]}),"\n",(0,t.jsxs)(s.h4,{id:"signuprequestreplace_signupsignup-",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRequest.",(0,t.jsx)("b",{children:"replace_signup"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/signup",children:(0,t.jsx)(s.code,{children:"Signup"})})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsx)(s.p,{children:"The signup that this request is asking to replace (e.g. if the user is trying to leave a conflicting event).  If\nthis request is accepted, the replace_signup will be withdrawn."}),"\n"]}),"\n",(0,t.jsxs)(s.h4,{id:"signuprequestrequested_bucket_keystring-",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRequest.",(0,t.jsx)("b",{children:"requested_bucket_key"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/scalars/string",children:(0,t.jsx)(s.code,{children:"String"})})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsx)(s.p,{children:"The bucket that this request is asking to sign up in (or null, if it's a no-preference signup)"}),"\n"]}),"\n",(0,t.jsxs)(s.h4,{id:"signuprequestresult_signupsignup-",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRequest.",(0,t.jsx)("b",{children:"result_signup"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/signup",children:(0,t.jsx)(s.code,{children:"Signup"})})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsx)(s.p,{children:"The resulting Signup from accepting this request, if it has been accepted"}),"\n"]}),"\n",(0,t.jsxs)(s.h4,{id:"signuprequeststatesignuprequeststate--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRequest.",(0,t.jsx)("b",{children:"state"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/enums/signup-request-state",children:(0,t.jsx)(s.code,{children:"SignupRequestState!"})})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"enum"})]}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsx)(s.p,{children:"The current processing state of this request (e.g. pending, accepted, rejected)"}),"\n"]}),"\n",(0,t.jsxs)(s.h4,{id:"signuprequesttarget_runrun--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRequest.",(0,t.jsx)("b",{children:"target_run"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/run",children:(0,t.jsx)(s.code,{children:"Run!"})})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsx)(s.p,{children:"The run the user would like to sign up for"}),"\n"]}),"\n",(0,t.jsxs)(s.h4,{id:"signuprequestupdated_atdate--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRequest.",(0,t.jsx)("b",{children:"updated_at"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/scalars/date",children:(0,t.jsx)(s.code,{children:"Date!"})})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"scalar"})]}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsx)(s.p,{children:"The last time this request was modified"}),"\n"]}),"\n",(0,t.jsxs)(s.h4,{id:"signuprequestupdated_byuser--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRequest.",(0,t.jsx)("b",{children:"updated_by"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/user",children:(0,t.jsx)(s.code,{children:"User!"})})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsx)(s.p,{children:"The last user who modified this request"}),"\n"]}),"\n",(0,t.jsxs)(s.h4,{id:"signuprequestuser_con_profileuserconprofile--",children:[(0,t.jsx)(s.a,{href:"#",children:(0,t.jsxs)("code",{style:{fontWeight:"normal"},children:["SignupRequest.",(0,t.jsx)("b",{children:"user_con_profile"})]})}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/user-con-profile",children:(0,t.jsx)(s.code,{children:"UserConProfile!"})})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"non-null"})," ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"object"})]}),"\n",(0,t.jsxs)(s.blockquote,{children:["\n",(0,t.jsx)(s.p,{children:"The user who made this request"}),"\n"]}),"\n",(0,t.jsx)(s.h3,{id:"member-of",children:"Member Of"}),"\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/accept-signup-request-payload",children:(0,t.jsx)(s.code,{children:"AcceptSignupRequestPayload"})}),"  ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/convention",children:(0,t.jsx)(s.code,{children:"Convention"})}),"  ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/create-signup-request-payload",children:(0,t.jsx)(s.code,{children:"CreateSignupRequestPayload"})}),"  ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/ranked-choice-decision",children:(0,t.jsx)(s.code,{children:"RankedChoiceDecision"})}),"  ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/reject-signup-request-payload",children:(0,t.jsx)(s.code,{children:"RejectSignupRequestPayload"})}),"  ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/run",children:(0,t.jsx)(s.code,{children:"Run"})}),"  ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/signup-ranked-choice",children:(0,t.jsx)(s.code,{children:"SignupRankedChoice"})}),"  ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/signup-requests-pagination",children:(0,t.jsx)(s.code,{children:"SignupRequestsPagination"})}),"  ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/user-con-profile",children:(0,t.jsx)(s.code,{children:"UserConProfile"})}),"  ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"object"}),(0,t.jsx)(o,{}),(0,t.jsx)(s.a,{href:"/docs/graphql/types/objects/withdraw-signup-request-payload",children:(0,t.jsx)(s.code,{children:"WithdrawSignupRequestPayload"})}),"  ",(0,t.jsx)(g,{class:"badge badge--secondary",text:"object"})]})]})}function x(e={}){const{wrapper:s}={...(0,d.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(j,{...e})}):j(e)}},1422:(e,s,n)=>{n.d(s,{R:()=>c,x:()=>r});var t=n(62340);const d={},a=t.createContext(d);function c(e){const s=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function r(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:c(e.components),t.createElement(a.Provider,{value:s},e.children)}}}]);