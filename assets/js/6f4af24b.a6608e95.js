"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[69532],{86590:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>o,contentTitle:()=>r,default:()=>m,frontMatter:()=>l,metadata:()=>a,toc:()=>c});var n=i(35091),s=i(1422);const l={id:"timespan-with-local-time",title:"timespan_with_local_time"},r=void 0,a={id:"liquid/filters/timespan-with-local-time",title:"timespan_with_local_time",description:"Given a timespan, format it in the given timezone, translating to the user's local",source:"@site/docs/liquid/filters/timespan-with-local-time.mdx",sourceDirName:"liquid/filters",slug:"/liquid/filters/timespan-with-local-time",permalink:"/docs/liquid/filters/timespan-with-local-time",draft:!1,unlisted:!1,editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/liquid/filters/timespan-with-local-time.mdx",tags:[],version:"current",frontMatter:{id:"timespan-with-local-time",title:"timespan_with_local_time"},sidebar:"sidebar",previous:{title:"singularize",permalink:"/docs/liquid/filters/singularize"},next:{title:"titleize",permalink:"/docs/liquid/filters/titleize"}},o={},c=[{value:"Parameters",id:"parameters",level:3},{value:"<code>format</code> (<code>String</code>)",id:"format-string",level:4},{value:"<code>input</code> (<code><a>ScheduledValue::TimespanDrop</a></code>)",id:"input-scheduledvaluetimespandrop",level:4},{value:"<code>timezone_name</code> (<code>String</code>)",id:"timezone_name-string",level:4},{value:"Returns (<code>String</code>)",id:"returns-string",level:3},{value:"Examples",id:"examples",level:3}];function d(e){const t={a:"a",code:"code",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.p,{children:"Given a timespan, format it in the given timezone, translating to the user's local\ntime if it isn't the same.  Automatically removes duplicate verbiage in the middle (e.g.\nday of week, time zone, etc.)"}),"\n",(0,n.jsx)(t.h3,{id:"parameters",children:"Parameters"}),"\n",(0,n.jsxs)(t.h4,{id:"format-string",children:[(0,n.jsx)(t.code,{children:"format"})," (",(0,n.jsx)("code",{children:"String"}),")"]}),"\n",(0,n.jsxs)(t.p,{children:['A time formatting string, like the one the built-in Liquid "date"\nfilter uses (see ',(0,n.jsx)(t.a,{href:"http://strftime.net",children:"http://strftime.net"}),' for examples).  We recommend\nincluding "%Z" in this string in order to have an explicit time zone\nspecifier.']}),"\n",(0,n.jsxs)(t.h4,{id:"input-scheduledvaluetimespandrop",children:[(0,n.jsx)(t.code,{children:"input"})," (",(0,n.jsx)("code",{children:(0,n.jsx)("a",{href:"/docs/liquid/drops/scheduled-value-timespan-drop",children:"ScheduledValue::TimespanDrop"})}),")"]}),"\n",(0,n.jsx)(t.p,{children:"A timespan"}),"\n",(0,n.jsxs)(t.h4,{id:"timezone_name-string",children:[(0,n.jsx)(t.code,{children:"timezone_name"})," (",(0,n.jsx)("code",{children:"String"}),")"]}),"\n",(0,n.jsx)(t.p,{children:"An IANA timezone name to use for the default format.  If\nnot given, this filter will try to use the convention's\nlocal timezone (if one exists)."}),"\n",(0,n.jsxs)(t.h3,{id:"returns-string",children:["Returns (",(0,n.jsx)("code",{children:"String"}),")"]}),"\n",(0,n.jsx)(t.h3,{id:"examples",children:"Examples"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-liquid",metastring:'title="Formatting a timespan using an explicit time zone, while the user is in that zone"',children:'{{ convention.timespan\n  | timespan_with_local_time: "%A, %B %e from %l:%M%P %Z", "America/New_York" }} =>\n  "Saturday, July 11 from 10:00am to 11:59pm EDT"\n'})}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-liquid",metastring:'title="Formatting a time using an explicit time zone, while the user is not in that zone"',children:'{{ convention.timespan\n  | timespan_with_local_time: "%A, %B %e from %l:%M%P %Z", "America/New_York" }} =>\n  "Saturday, July 11 from 10:00am to 11:59pm EDT (7:00am to 8:59pm PDT)"\n'})}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-liquid",metastring:'title="Using the convention\'s time zone implicitly"',children:'{{ convention.timespan | timespan_with_local_time: "%A, %B %e from %l:%M%P %Z" }} =>\n  "Saturday, July 11 from 10:00am to 11:59pm EDT"\n'})})]})}function m(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},1422:(e,t,i)=>{i.d(t,{R:()=>r,x:()=>a});var n=i(7731);const s={},l=n.createContext(s);function r(e){const t=n.useContext(l);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),n.createElement(l.Provider,{value:t},e.children)}}}]);