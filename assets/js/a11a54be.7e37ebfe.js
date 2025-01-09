"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[7163],{9482:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>h,frontMatter:()=>r,metadata:()=>o,toc:()=>l});const o=JSON.parse('{"id":"liquid/drops/registration-policy-bucket-drop","title":"RegistrationPolicy::BucketDrop","description":"A registration bucket for an event","source":"@site/docs/liquid/drops/registration-policy-bucket-drop.mdx","sourceDirName":"liquid/drops","slug":"/liquid/drops/registration-policy-bucket-drop","permalink":"/docs/liquid/drops/registration-policy-bucket-drop","draft":false,"unlisted":false,"editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/liquid/drops/registration-policy-bucket-drop.mdx","tags":[],"version":"current","frontMatter":{"id":"registration-policy-bucket-drop","title":"RegistrationPolicy::BucketDrop"},"sidebar":"sidebar","previous":{"title":"ProductVariantDrop","permalink":"/docs/liquid/drops/product-variant-drop"},"next":{"title":"RunAvailabilityDrop","permalink":"/docs/liquid/drops/run-availability-drop"}}');var i=n(58040),d=n(5365);const r={id:"registration-policy-bucket-drop",title:"RegistrationPolicy::BucketDrop"},s=void 0,c={},l=[{value:"Fields",id:"fields",level:3},{value:"<code>anything</code> (<code>Boolean</code>)",id:"anything-boolean",level:4},{value:"<code>description</code> (<code>String</code>)",id:"description-string",level:4},{value:"<code>expose_attendees</code> (<code>Boolean</code>)",id:"expose_attendees-boolean",level:4},{value:"<code>key</code> (<code>String</code>)",id:"key-string",level:4},{value:"<code>minimum_slots</code> (<code>Integer</code>)",id:"minimum_slots-integer",level:4},{value:"<code>name</code> (<code>String</code>)",id:"name-string",level:4},{value:"<code>not_counted</code> (<code>Boolean</code>)",id:"not_counted-boolean",level:4},{value:"<code>preferred_slots</code> (<code>Integer</code>)",id:"preferred_slots-integer",level:4},{value:"<code>slots_limited</code> (<code>Boolean</code>)",id:"slots_limited-boolean",level:4},{value:"<code>total_slots</code> (<code>Integer</code>)",id:"total_slots-integer",level:4}];function a(e){const t={code:"code",h3:"h3",h4:"h4",p:"p",...(0,d.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.p,{children:"A registration bucket for an event"}),"\n",(0,i.jsx)(t.h3,{id:"fields",children:"Fields"}),"\n",(0,i.jsxs)(t.h4,{id:"anything-boolean",children:[(0,i.jsx)(t.code,{children:"anything"})," (",(0,i.jsx)("code",{children:"Boolean"}),")"]}),"\n",(0,i.jsx)(t.p,{children:'Whether or not this is a "flex" bucket ("anything" is a legacy term for\n"flex")'}),"\n",(0,i.jsxs)(t.h4,{id:"description-string",children:[(0,i.jsx)(t.code,{children:"description"})," (",(0,i.jsx)("code",{children:"String"}),")"]}),"\n",(0,i.jsx)(t.p,{children:"A long-form description for the bucket (currently not exposed anywhere)"}),"\n",(0,i.jsxs)(t.h4,{id:"expose_attendees-boolean",children:[(0,i.jsx)(t.code,{children:"expose_attendees"})," (",(0,i.jsx)("code",{children:"Boolean"}),")"]}),"\n",(0,i.jsx)(t.p,{children:"Whether or not to allow other attendees to see that a person is in this\nbucket in the signup summary page"}),"\n",(0,i.jsxs)(t.h4,{id:"key-string",children:[(0,i.jsx)(t.code,{children:"key"})," (",(0,i.jsx)("code",{children:"String"}),")"]}),"\n",(0,i.jsx)(t.p,{children:"The unique string identifier for this bucket"}),"\n",(0,i.jsxs)(t.h4,{id:"minimum_slots-integer",children:[(0,i.jsx)(t.code,{children:"minimum_slots"})," (",(0,i.jsx)("code",{children:"Integer"}),")"]}),"\n",(0,i.jsx)(t.p,{children:"The minimum number of attendees needed for this bucket"}),"\n",(0,i.jsxs)(t.h4,{id:"name-string",children:[(0,i.jsx)(t.code,{children:"name"})," (",(0,i.jsx)("code",{children:"String"}),")"]}),"\n",(0,i.jsx)(t.p,{children:"The name of this bucket"}),"\n",(0,i.jsxs)(t.h4,{id:"not_counted-boolean",children:[(0,i.jsx)(t.code,{children:"not_counted"})," (",(0,i.jsx)("code",{children:"Boolean"}),")"]}),"\n",(0,i.jsx)(t.p,{children:"If true, attendees in this bucket are not counted towards total attendees\nfor runs of this event, and this event will not count towards their maximum\nevent signups allowed"}),"\n",(0,i.jsxs)(t.h4,{id:"preferred_slots-integer",children:[(0,i.jsx)(t.code,{children:"preferred_slots"})," (",(0,i.jsx)("code",{children:"Integer"}),")"]}),"\n",(0,i.jsx)(t.p,{children:"The preferred number of attendees for this bucket"}),"\n",(0,i.jsxs)(t.h4,{id:"slots_limited-boolean",children:[(0,i.jsx)(t.code,{children:"slots_limited"})," (",(0,i.jsx)("code",{children:"Boolean"}),")"]}),"\n",(0,i.jsx)(t.p,{children:"Whether or not the number of attendees is limited in this bucket"}),"\n",(0,i.jsxs)(t.h4,{id:"total_slots-integer",children:[(0,i.jsx)(t.code,{children:"total_slots"})," (",(0,i.jsx)("code",{children:"Integer"}),")"]}),"\n",(0,i.jsx)(t.p,{children:"The maximum number of attendees this bucket can accept"})]})}function h(e={}){const{wrapper:t}={...(0,d.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},5365:(e,t,n)=>{n.d(t,{R:()=>r,x:()=>s});var o=n(62340);const i={},d=o.createContext(i);function r(e){const t=o.useContext(d);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),o.createElement(d.Provider,{value:t},e.children)}}}]);