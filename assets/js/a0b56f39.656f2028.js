"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[81192],{57202:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>c,contentTitle:()=>t,default:()=>p,frontMatter:()=>r,metadata:()=>s,toc:()=>l});var d=n(52877),o=n(76553);const r={id:"signup-drop",title:"SignupDrop"},t=void 0,s={id:"liquid/drops/signup-drop",title:"SignupDrop",description:"A signup for a run of an event",source:"@site/docs/liquid/drops/signup-drop.mdx",sourceDirName:"liquid/drops",slug:"/liquid/drops/signup-drop",permalink:"/docs/liquid/drops/signup-drop",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/liquid/drops/signup-drop.mdx",tags:[],version:"current",frontMatter:{id:"signup-drop",title:"SignupDrop"},sidebar:"sidebar",previous:{title:"ScheduledValue::TimespanDrop",permalink:"/docs/liquid/drops/scheduled-value-timespan-drop"},next:{title:"SignupMoveResultDrop",permalink:"/docs/liquid/drops/signup-move-result-drop"}},c={},l=[{value:"Fields",id:"fields",level:3},{value:"<code>bucket</code> (<code><a>RegistrationPolicy::BucketDrop</a></code>)",id:"bucket-registrationpolicybucketdrop",level:4},{value:"<code>counted</code> (<code>Boolean</code>)",id:"counted-boolean",level:4},{value:"<code>ends_at</code> (<code>ActiveSupport::TimeWithZone</code>)",id:"ends_at-activesupporttimewithzone",level:4},{value:"<code>event</code> (<code><a>EventDrop</a></code>)",id:"event-eventdrop",level:4},{value:"<code>event_url</code> (<code>String</code>)",id:"event_url-string",level:4},{value:"<code>expires_at</code> (<code>DateTime</code>)",id:"expires_at-datetime",level:4},{value:"<code>id</code> (<code>Integer</code>)",id:"id-integer",level:4},{value:"<code>length_seconds</code> (<code>Integer</code>)",id:"length_seconds-integer",level:4},{value:"<code>requested_bucket</code> (<code><a>RegistrationPolicy::BucketDrop</a></code>)",id:"requested_bucket-registrationpolicybucketdrop",level:4},{value:"<code>run</code> (<code><a>RunDrop</a></code>)",id:"run-rundrop",level:4},{value:"<code>starts_at</code> (<code>ActiveSupport::TimeWithZone</code>)",id:"starts_at-activesupporttimewithzone",level:4},{value:"<code>state</code> (<code>String</code>)",id:"state-string",level:4},{value:"<code>team_member</code> (<code>Boolean</code>)",id:"team_member-boolean",level:4},{value:"<code>user_con_profile</code> (<code><a>UserConProfileDrop</a></code>)",id:"user_con_profile-userconprofiledrop",level:4}];function u(e){const i={code:"code",h3:"h3",h4:"h4",p:"p",...(0,o.a)(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(i.p,{children:"A signup for a run of an event"}),"\n",(0,d.jsx)(i.h3,{id:"fields",children:"Fields"}),"\n",(0,d.jsxs)(i.h4,{id:"bucket-registrationpolicybucketdrop",children:[(0,d.jsx)(i.code,{children:"bucket"})," (",(0,d.jsx)("code",{children:(0,d.jsx)("a",{href:"/docs/liquid/drops/registration-policy-bucket-drop",children:"RegistrationPolicy::BucketDrop"})}),")"]}),"\n",(0,d.jsx)(i.p,{children:"The bucket assigned to this signup"}),"\n",(0,d.jsxs)(i.h4,{id:"counted-boolean",children:[(0,d.jsx)(i.code,{children:"counted"})," (",(0,d.jsx)("code",{children:"Boolean"}),")"]}),"\n",(0,d.jsx)(i.p,{children:"Whether or not the signup is counted (for the purposes of maximum signups\nallowed, and counting totals for the event)"}),"\n",(0,d.jsxs)(i.h4,{id:"ends_at-activesupporttimewithzone",children:[(0,d.jsx)(i.code,{children:"ends_at"})," (",(0,d.jsx)("code",{children:"ActiveSupport::TimeWithZone"}),")"]}),"\n",(0,d.jsx)(i.p,{children:"When the run ends"}),"\n",(0,d.jsxs)(i.h4,{id:"event-eventdrop",children:[(0,d.jsx)(i.code,{children:"event"})," (",(0,d.jsx)("code",{children:(0,d.jsx)("a",{href:"/docs/liquid/drops/event-drop",children:"EventDrop"})}),")"]}),"\n",(0,d.jsx)(i.p,{children:"The event the signup is for"}),"\n",(0,d.jsxs)(i.h4,{id:"event_url-string",children:[(0,d.jsx)(i.code,{children:"event_url"})," (",(0,d.jsx)("code",{children:"String"}),")"]}),"\n",(0,d.jsx)(i.p,{children:"The relative URL of the event's page on the convention site"}),"\n",(0,d.jsxs)(i.h4,{id:"expires_at-datetime",children:[(0,d.jsx)(i.code,{children:"expires_at"})," (",(0,d.jsx)("code",{children:"DateTime"}),")"]}),"\n",(0,d.jsx)(i.p,{children:"When this signup will expire, if it's being held tempoarily"}),"\n",(0,d.jsxs)(i.h4,{id:"id-integer",children:[(0,d.jsx)(i.code,{children:"id"})," (",(0,d.jsx)("code",{children:"Integer"}),")"]}),"\n",(0,d.jsx)(i.p,{children:"The numeric database id of this signup"}),"\n",(0,d.jsxs)(i.h4,{id:"length_seconds-integer",children:[(0,d.jsx)(i.code,{children:"length_seconds"})," (",(0,d.jsx)("code",{children:"Integer"}),")"]}),"\n",(0,d.jsx)(i.p,{children:"The length of the run in seconds"}),"\n",(0,d.jsxs)(i.h4,{id:"requested_bucket-registrationpolicybucketdrop",children:[(0,d.jsx)(i.code,{children:"requested_bucket"})," (",(0,d.jsx)("code",{children:(0,d.jsx)("a",{href:"/docs/liquid/drops/registration-policy-bucket-drop",children:"RegistrationPolicy::BucketDrop"})}),")"]}),"\n",(0,d.jsx)(i.p,{children:"The bucket the user requested to sign up in, if any"}),"\n",(0,d.jsxs)(i.h4,{id:"run-rundrop",children:[(0,d.jsx)(i.code,{children:"run"})," (",(0,d.jsx)("code",{children:(0,d.jsx)("a",{href:"/docs/liquid/drops/run-drop",children:"RunDrop"})}),")"]}),"\n",(0,d.jsx)(i.p,{children:"The run the signup is for"}),"\n",(0,d.jsxs)(i.h4,{id:"starts_at-activesupporttimewithzone",children:[(0,d.jsx)(i.code,{children:"starts_at"})," (",(0,d.jsx)("code",{children:"ActiveSupport::TimeWithZone"}),")"]}),"\n",(0,d.jsx)(i.p,{children:"When the run starts"}),"\n",(0,d.jsxs)(i.h4,{id:"state-string",children:[(0,d.jsx)(i.code,{children:"state"})," (",(0,d.jsx)("code",{children:"String"}),")"]}),"\n",(0,d.jsx)(i.p,{children:"The state of this signup (e.g. confirmed, waitlisted, withdrawn)"}),"\n",(0,d.jsxs)(i.h4,{id:"team_member-boolean",children:[(0,d.jsx)(i.code,{children:"team_member"})," (",(0,d.jsx)("code",{children:"Boolean"}),")"]}),"\n",(0,d.jsx)(i.p,{children:"Whether or not this signup is for an event team member"}),"\n",(0,d.jsxs)(i.h4,{id:"user_con_profile-userconprofiledrop",children:[(0,d.jsx)(i.code,{children:"user_con_profile"})," (",(0,d.jsx)("code",{children:(0,d.jsx)("a",{href:"/docs/liquid/drops/user-con-profile-drop",children:"UserConProfileDrop"})}),")"]}),"\n",(0,d.jsx)(i.p,{children:"The profile of the person who is signed up"})]})}function p(e={}){const{wrapper:i}={...(0,o.a)(),...e.components};return i?(0,d.jsx)(i,{...e,children:(0,d.jsx)(u,{...e})}):u(e)}},76553:(e,i,n)=>{n.d(i,{Z:()=>s,a:()=>t});var d=n(16589);const o={},r=d.createContext(o);function t(e){const i=d.useContext(r);return d.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function s(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:t(e.components),d.createElement(r.Provider,{value:i},e.children)}}}]);