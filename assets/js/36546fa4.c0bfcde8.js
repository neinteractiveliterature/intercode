"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[97128],{9018:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>t,contentTitle:()=>o,default:()=>h,frontMatter:()=>d,metadata:()=>c,toc:()=>l});var r=n(58040),s=n(1422);const d={id:"user-con-profile-drop",title:"UserConProfileDrop"},o=void 0,c={id:"liquid/drops/user-con-profile-drop",title:"UserConProfileDrop",description:"A profile for a user attending a convention.  This is the main object used for all user-specific",source:"@site/docs/liquid/drops/user-con-profile-drop.mdx",sourceDirName:"liquid/drops",slug:"/liquid/drops/user-con-profile-drop",permalink:"/docs/liquid/drops/user-con-profile-drop",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/liquid/drops/user-con-profile-drop.mdx",tags:[],version:"current",frontMatter:{id:"user-con-profile-drop",title:"UserConProfileDrop"},sidebar:"sidebar",previous:{title:"TimespanWithValueDrop",permalink:"/docs/liquid/drops/timespan-with-value-drop"},next:{title:"UserDrop",permalink:"/docs/liquid/drops/user-drop"}},t={},l=[{value:"Fields",id:"fields",level:3},{value:"<code>bio</code> (<code>String</code>)",id:"bio-string",level:4},{value:"<code>bio_name</code> (<code>String</code>)",id:"bio_name-string",level:4},{value:"<code>email</code> (<code>String</code>)",id:"email-string",level:4},{value:"<code>event_proposals</code> (<code>Array&lt;<a>EventProposalDrop</a>&gt;</code>)",id:"event_proposals-arrayeventproposaldrop",level:4},{value:"<code>first_name</code> (<code>String</code>)",id:"first_name-string",level:4},{value:"<code>form_response</code> (<code>Hash</code>)",id:"form_response-hash",level:4},{value:"<code>gravatar_url</code> (<code>String</code>)",id:"gravatar_url-string",level:4},{value:"<code>ical_secret</code> (<code>String</code>)",id:"ical_secret-string",level:4},{value:"<code>id</code> (<code>Integer</code>)",id:"id-integer",level:4},{value:"<code>last_name</code> (<code>String</code>)",id:"last_name-string",level:4},{value:"<code>name</code> (<code>String</code>)",id:"name-string",level:4},{value:"<code>name_inverted</code> (<code>String</code>)",id:"name_inverted-string",level:4},{value:"<code>name_without_nickname</code> (<code>String</code>)",id:"name_without_nickname-string",level:4},{value:"<code>nickname</code> (<code>String</code>)",id:"nickname-string",level:4},{value:"<code>privileges</code> (<code>Array&lt;String&gt;</code>)",id:"privileges-arraystring",level:4},{value:"<code>schedule_calendar_url</code> (<code>String</code>)",id:"schedule_calendar_url-string",level:4},{value:"<code>signups</code> (<code>Array&lt;<a>SignupDrop</a>&gt;</code>)",id:"signups-arraysignupdrop",level:4},{value:"<code>staff_positions</code> (<code>Array&lt;<a>StaffPositionDrop</a>&gt;</code>)",id:"staff_positions-arraystaffpositiondrop",level:4},{value:"<code>team_member_events</code> (<code>Array&lt;<a>EventDrop</a>&gt;</code>)",id:"team_member_events-arrayeventdrop",level:4},{value:"<code>ticket</code> (<code><a>TicketDrop</a></code>)",id:"ticket-ticketdrop",level:4}];function a(e){const i={code:"code",h3:"h3",h4:"h4",p:"p",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(i.p,{children:"A profile for a user attending a convention.  This is the main object used for all user-specific\ndata in a convention, rather than User, which is just the sitewide account data shared between\nall conventions."}),"\n",(0,r.jsx)(i.h3,{id:"fields",children:"Fields"}),"\n",(0,r.jsxs)(i.h4,{id:"bio-string",children:[(0,r.jsx)(i.code,{children:"bio"})," (",(0,r.jsx)("code",{children:"String"}),")"]}),"\n",(0,r.jsx)(i.p,{children:"The user's bio, as HTML"}),"\n",(0,r.jsxs)(i.h4,{id:"bio_name-string",children:[(0,r.jsx)(i.code,{children:"bio_name"})," (",(0,r.jsx)("code",{children:"String"}),")"]}),"\n",(0,r.jsx)(i.p,{children:"The name used for the user's bio, which will either include a nickname or not\ndepending on their preference"}),"\n",(0,r.jsxs)(i.h4,{id:"email-string",children:[(0,r.jsx)(i.code,{children:"email"})," (",(0,r.jsx)("code",{children:"String"}),")"]}),"\n",(0,r.jsx)(i.p,{children:"The user's email address"}),"\n",(0,r.jsxs)(i.h4,{id:"event_proposals-arrayeventproposaldrop",children:[(0,r.jsx)(i.code,{children:"event_proposals"})," (",(0,r.jsxs)("code",{children:["Array<",(0,r.jsx)("a",{href:"/docs/liquid/drops/event-proposal-drop",children:"EventProposalDrop"}),">"]}),")"]}),"\n",(0,r.jsx)(i.p,{children:"All the event proposals this user submitted for this convention"}),"\n",(0,r.jsxs)(i.h4,{id:"first_name-string",children:[(0,r.jsx)(i.code,{children:"first_name"})," (",(0,r.jsx)("code",{children:"String"}),")"]}),"\n",(0,r.jsx)(i.p,{children:"The user's first name"}),"\n",(0,r.jsxs)(i.h4,{id:"form_response-hash",children:[(0,r.jsx)(i.code,{children:"form_response"})," (",(0,r.jsx)("code",{children:"Hash"}),")"]}),"\n",(0,r.jsx)(i.p,{children:'The user\'s response to the profile form set up by this convention.  This includes\nthe fields that the user themselves can see; admin-only fields will be replaced\nwith a "this is hidden" message.'}),"\n",(0,r.jsxs)(i.h4,{id:"gravatar_url-string",children:[(0,r.jsx)(i.code,{children:"gravatar_url"})," (",(0,r.jsx)("code",{children:"String"}),")"]}),"\n",(0,r.jsx)(i.p,{children:"The URL of the user's Gravatar"}),"\n",(0,r.jsxs)(i.h4,{id:"ical_secret-string",children:[(0,r.jsx)(i.code,{children:"ical_secret"})," (",(0,r.jsx)("code",{children:"String"}),")"]}),"\n",(0,r.jsx)(i.p,{children:"The user's iCal secret for this convention (used in the\n{% add_to_calendar_dropdown %} tag)"}),"\n",(0,r.jsxs)(i.h4,{id:"id-integer",children:[(0,r.jsx)(i.code,{children:"id"})," (",(0,r.jsx)("code",{children:"Integer"}),")"]}),"\n",(0,r.jsx)(i.p,{children:"The numeric database ID of the user profile"}),"\n",(0,r.jsxs)(i.h4,{id:"last_name-string",children:[(0,r.jsx)(i.code,{children:"last_name"})," (",(0,r.jsx)("code",{children:"String"}),")"]}),"\n",(0,r.jsx)(i.p,{children:"The user's last name"}),"\n",(0,r.jsxs)(i.h4,{id:"name-string",children:[(0,r.jsx)(i.code,{children:"name"})," (",(0,r.jsx)("code",{children:"String"}),")"]}),"\n",(0,r.jsx)(i.p,{children:"The user's name, including nickname if present"}),"\n",(0,r.jsxs)(i.h4,{id:"name_inverted-string",children:[(0,r.jsx)(i.code,{children:"name_inverted"})," (",(0,r.jsx)("code",{children:"String"}),")"]}),"\n",(0,r.jsx)(i.p,{children:'The user\'s name in "Last, First" format'}),"\n",(0,r.jsxs)(i.h4,{id:"name_without_nickname-string",children:[(0,r.jsx)(i.code,{children:"name_without_nickname"})," (",(0,r.jsx)("code",{children:"String"}),")"]}),"\n",(0,r.jsx)(i.p,{children:"The user's name, not including nickname"}),"\n",(0,r.jsxs)(i.h4,{id:"nickname-string",children:[(0,r.jsx)(i.code,{children:"nickname"})," (",(0,r.jsx)("code",{children:"String"}),")"]}),"\n",(0,r.jsx)(i.p,{children:"The nickname the user entered on their profile"}),"\n",(0,r.jsxs)(i.h4,{id:"privileges-arraystring",children:[(0,r.jsx)(i.code,{children:"privileges"})," (",(0,r.jsx)("code",{children:"Array<String>"}),")"]}),"\n",(0,r.jsx)(i.p,{children:"The user's privileges for this convention"}),"\n",(0,r.jsxs)(i.h4,{id:"schedule_calendar_url-string",children:[(0,r.jsx)(i.code,{children:"schedule_calendar_url"})," (",(0,r.jsx)("code",{children:"String"}),")"]}),"\n",(0,r.jsx)(i.p,{children:"A webcal:// URL for the user's personal schedule for this convention.  This URL\nis considered secret and should only be given to that user."}),"\n",(0,r.jsxs)(i.h4,{id:"signups-arraysignupdrop",children:[(0,r.jsx)(i.code,{children:"signups"})," (",(0,r.jsxs)("code",{children:["Array<",(0,r.jsx)("a",{href:"/docs/liquid/drops/signup-drop",children:"SignupDrop"}),">"]}),")"]}),"\n",(0,r.jsx)(i.p,{children:"All the user's signups, excluding withdrawn events"}),"\n",(0,r.jsxs)(i.h4,{id:"staff_positions-arraystaffpositiondrop",children:[(0,r.jsx)(i.code,{children:"staff_positions"})," (",(0,r.jsxs)("code",{children:["Array<",(0,r.jsx)("a",{href:"/docs/liquid/drops/staff-position-drop",children:"StaffPositionDrop"}),">"]}),")"]}),"\n",(0,r.jsx)(i.p,{children:"All the staff positions this user holds at this convention"}),"\n",(0,r.jsxs)(i.h4,{id:"team_member_events-arrayeventdrop",children:[(0,r.jsx)(i.code,{children:"team_member_events"})," (",(0,r.jsxs)("code",{children:["Array<",(0,r.jsx)("a",{href:"/docs/liquid/drops/event-drop",children:"EventDrop"}),">"]}),")"]}),"\n",(0,r.jsx)(i.p,{children:"All the active events at this convention for which this user is a\nteam member"}),"\n",(0,r.jsxs)(i.h4,{id:"ticket-ticketdrop",children:[(0,r.jsx)(i.code,{children:"ticket"})," (",(0,r.jsx)("code",{children:(0,r.jsx)("a",{href:"/docs/liquid/drops/ticket-drop",children:"TicketDrop"})}),")"]}),"\n",(0,r.jsx)(i.p,{children:"The user's convention ticket, if present"})]})}function h(e={}){const{wrapper:i}={...(0,s.R)(),...e.components};return i?(0,r.jsx)(i,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},1422:(e,i,n)=>{n.d(i,{R:()=>o,x:()=>c});var r=n(62340);const s={},d=r.createContext(s);function o(e){const i=r.useContext(d);return r.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function c(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),r.createElement(d.Provider,{value:i},e.children)}}}]);