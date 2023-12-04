"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[76311],{72488:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>h,frontMatter:()=>o,metadata:()=>a,toc:()=>d});var s=t(52877),i=t(76553);const o={sidebar_position:0},r="Conventions",a={id:"concepts/conventions",title:"Conventions",description:"Intercode was first designed to manage web sites for conventions. In Intercode 1, a separate",source:"@site/docs/concepts/conventions.md",sourceDirName:"concepts",slug:"/concepts/conventions",permalink:"/docs/concepts/conventions",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/concepts/conventions.md",tags:[],version:"current",sidebarPosition:0,frontMatter:{sidebar_position:0},sidebar:"sidebar",previous:{title:"Welcome to Intercode",permalink:"/docs/intro"},next:{title:"Users and profiles",permalink:"/docs/concepts/users-and-profiles"}},c={},d=[{value:"Convention modes",id:"convention-modes",level:2},{value:"Site modes",id:"site-modes",level:3},{value:"Signup modes",id:"signup-modes",level:3},{value:"Ticket modes",id:"ticket-modes",level:3},{value:"Email modes",id:"email-modes",level:3},{value:"Time zone mode",id:"time-zone-mode",level:3}];function l(e){const n={a:"a",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...(0,i.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"conventions",children:"Conventions"}),"\n",(0,s.jsx)(n.p,{children:"Intercode was first designed to manage web sites for conventions. In Intercode 1, a separate\ninstance of the Intercode application would be set up for each convention."}),"\n",(0,s.jsx)(n.p,{children:"Intercode 2 is a multi-tenant application, designed to host multiple sites from a single application\ninstance. Because different conventions have vastly different needs, most of Intercode 2's\nconfigurability and customization options are attached to conventions in the database. A convention\nin Intercode includes:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"a unique domain name or subdomain"}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/concepts/content-management",children:"CMS content such as pages, layouts, and partials"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/concepts/events-and-runs",children:"events, runs, and event proposals"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/concepts/permissions",children:"staff positions"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/concepts/users-and-profiles",children:"user convention profiles"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/concepts/store",children:"tickets and products"})}),"\n",(0,s.jsx)(n.li,{children:"...and a lot more stuff"}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"convention-modes",children:"Convention modes"}),"\n",(0,s.jsxs)(n.p,{children:["There are a few overall configuration settings on conventions that affect the behavior\nof their web site. These are ",(0,s.jsx)(n.strong,{children:"site mode"}),", ",(0,s.jsx)(n.strong,{children:"signup mode"}),", ",(0,s.jsx)(n.strong,{children:"ticket mode"}),", ",(0,s.jsx)(n.strong,{children:"email mode"}),", and\n",(0,s.jsx)(n.strong,{children:"time zone mode"}),"."]}),"\n",(0,s.jsx)(n.h3,{id:"site-modes",children:"Site modes"}),"\n",(0,s.jsx)(n.p,{children:"There are currently three site modes: convention mode, single-event mode, and event series mode.\nConvention mode is the original behavior of Intercode, and provides the fullest set of\nfunctionality, including events that can run multiple times throughout the con, a schedule grid,\nticket sales, and more."}),"\n",(0,s.jsx)(n.p,{children:'Single-event mode is intended for simpler sites that represent just a single event (the fact that\nIntercode thinks of these, confusingly, as "conventions" is an unfortunate historical artifact).\nThis mode disables most of the user interface around events and scheduling, and enforces a single\nevent with a single run. Currently, ticket sales are not available in single-event mode (so\nsingle-event "conventions" must be free for attendees), but there are plans to enable them through\nfuture UX design work and development.'}),"\n",(0,s.jsx)(n.p,{children:"Event series mode is intended for sites that represent a set of connected events run under the same\numbrella, but taking place on different, non-consecutive dates and possibly in separate locations.\nEvent series mode operates similarly to convention mode, but disables some parts of the user\ninterface that are cumbersome or unworkable under these conditions, such as the grid view of the\nschedule. Event series sites, like single-event sites, cannot yet sell tickets, but this is also\nplanned."}),"\n",(0,s.jsx)(n.h3,{id:"signup-modes",children:"Signup modes"}),"\n",(0,s.jsxs)(n.p,{children:["There are currently two signup modes: self-service and moderated. Almost all conventions using\nIntercode use self-service signups, but some, such as ",(0,s.jsx)(n.a,{href:"https://beconlarp.com",children:"Be-Con"}),", use moderated\nsignups."]}),"\n",(0,s.jsxs)(n.p,{children:["Self-service signups allow attendees to sign up for events via the web site. When signups are\navailable, users can go to event pages on the site and click to sign up. If a spot is available,\nthe user will be instantly confirmed as an attendee. If not, they will be placed on the waitlist.\nFor more details about this process, see ",(0,s.jsx)(n.a,{href:"/docs/concepts/signups",children:"the signups section"}),'. In\nself-service signup mode, convention staff cannot directly manipulate the signups on events\n(although if absolutely necessary, they can use the "become user" feature to do so).']}),"\n",(0,s.jsxs)(n.p,{children:["Moderated signups present a similar experience to attendees, but rather than clicking to sign up\nfor an event, users can click to ",(0,s.jsx)(n.em,{children:"request"})," to sign up for an event. This request goes into a queue\nvisible to convention staff, from which they can accept or reject requests. Accepting a request\nwill sign the user up for the event, waitlisting them if necessary, just as in self-service signups.\nModerated signups also provide a direct user interface for con staff to sign users up for events\nwithout them having to submit a request. (This is useful for cases such as Be-Con's, where the\ninitial round of requests goes through a separate online survey that collects ranked choices.)"]}),"\n",(0,s.jsx)(n.h3,{id:"ticket-modes",children:"Ticket modes"}),"\n",(0,s.jsx)(n.p,{children:"There are currently two ticket modes: tickets disabled and tickets required for signup."}),"\n",(0,s.jsx)(n.p,{children:"If tickets are disabled, attending the convention is free. Anyone can sign up for events at the\nconvention just by logging in with their Intercode account, and doing so will effectively sign them\nup for the convention."}),"\n",(0,s.jsx)(n.p,{children:"If tickets are required for signup, attendees must purchase (or receive) a ticket before they are\nallowed to sign up for events. A single ticket covers all event signups for that attendee; there\nis no additional charge for further event registrations."}),"\n",(0,s.jsx)(n.p,{children:"In the future, there are potential plans to build more ticket modes, such as one that would allow\nconventions to sell per-event tickets."}),"\n",(0,s.jsx)(n.h3,{id:"email-modes",children:"Email modes"}),"\n",(0,s.jsx)(n.p,{children:"There are currently two email modes: forwarding and catch-all. These modes only have an effect if\nthe convention has set up their domain to have Intercode process its incoming emails."}),"\n",(0,s.jsx)(n.p,{children:"In forwarding mode, staff positions can have email aliases and forwarding addresses. These aliases\nwill automatically forward received email to everyone with that staff position, plus (optionally)\na CC list of additional addresses."}),"\n",(0,s.jsx)(n.p,{children:"In catch-all mode, all received emails will be forwarded to a catch-all address. This is primarily\nintended for conventions that are already over and for which their staff no longer wants to receive\nemail."}),"\n",(0,s.jsx)(n.h3,{id:"time-zone-mode",children:"Time zone mode"}),"\n",(0,s.jsx)(n.p,{children:"There are currently two time zone modes: convention time zone and user-local time zone."}),"\n",(0,s.jsx)(n.p,{children:"In convention time zone mode, the convention chooses a time zone in which it takes place. All\ndates and times of events on the web site are expressed in that zone. This is primarily intended\nfor conventions taking place at a specific location."}),"\n",(0,s.jsx)(n.p,{children:"In user-local time zone mode, the web site will automatically detect the time zone the user's\ncomputer or device is set to and express all times and dates in that zone. This is primarily\nintended for virtual conventions."})]})}function h(e={}){const{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},76553:(e,n,t)=>{t.d(n,{Z:()=>a,a:()=>r});var s=t(16589);const i={},o=s.createContext(i);function r(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);