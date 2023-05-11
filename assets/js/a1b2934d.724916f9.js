"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[95229],{75631:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var a=n(45721);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=a.createContext({}),d=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=d(e.components);return a.createElement(l.Provider,{value:t},e.children)},u="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},h=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=d(n),h=o,m=u["".concat(l,".").concat(h)]||u[h]||p[h]||r;return n?a.createElement(m,i(i({ref:t},c),{},{components:n})):a.createElement(m,i({ref:t},c))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=h;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[u]="string"==typeof e?e:o,i[1]=s;for(var d=2;d<r;d++)i[d]=n[d];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}h.displayName="MDXCreateElement"},84991:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>r,metadata:()=>s,toc:()=>d});var a=n(64715),o=(n(45721),n(75631));const r={title:"Database Export Security Issue Disclosure",tags:["security"],authors:["nbudin","dkapell","jaelen","jcooke"]},i=void 0,s={permalink:"/blog/2022/12/02/database-export-security-disclosure",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/blog/blog/2022-12-02-database-export-security-disclosure.md",source:"@site/blog/2022-12-02-database-export-security-disclosure.md",title:"Database Export Security Issue Disclosure",description:"Hi larp community! A thing happened that we should tell you about. You're receiving this because you've logged into at least one convention website running in NEIL Hosting (Intercon, Be-Con, Festival, Bubble, etc).",date:"2022-12-02T00:00:00.000Z",formattedDate:"December 2, 2022",tags:[{label:"security",permalink:"/blog/tags/security"}],readingTime:3.24,hasTruncateMarker:!0,authors:[{name:"Nat Budin",url:"https://github.com/nbudin",imageURL:"https://github.com/nbudin.png",key:"nbudin"},{name:"Dave Kapell",url:"https://github.com/dkapell",imageURL:"https://github.com/dkapell.png",key:"dkapell"},{name:"Jae Hartwin",url:"https://github.com/jhartwin",imageURL:"https://github.com/jhartwin.png",key:"jaelen"},{name:"John Cooke",key:"jcooke"}],frontMatter:{title:"Database Export Security Issue Disclosure",tags:["security"],authors:["nbudin","dkapell","jaelen","jcooke"]},prevItem:{title:"How Intercode builds and loads JavaScript",permalink:"/blog/2023/05/11/js-loading-strategy"},nextItem:{title:"GraphQL Cross-Domain Security Issue Disclosure",permalink:"/blog/2022/01/18/graphql-cross-domain-security-issue-disclosure"}},l={authorsImageUrls:[void 0,void 0,void 0,void 0]},d=[{value:"What data was publicly accessible?",id:"what-data-was-publicly-accessible",level:2},{value:"How did this happen?",id:"how-did-this-happen",level:2},{value:"What are we doing about this?",id:"what-are-we-doing-about-this",level:2}],c={toc:d},u="wrapper";function p(e){let{components:t,...n}=e;return(0,o.kt)(u,(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Hi larp community! A thing happened that we should tell you about. You're receiving this because you've logged into at least one convention website running in NEIL Hosting (Intercon, Be-Con, Festival, Bubble, etc)."),(0,o.kt)("p",null,"While reviewing the code in the Intercode open source project, we discovered a backup of the Intercode production database. This backup was publicly available for about 6 weeks between September 18 and November 3, 2022."),(0,o.kt)("p",null,"We do not store payment card data in this database. In addition, we use industry-standard password hashing to protect passwords. ",(0,o.kt)("strong",{parentName:"p"},"Nevertheless, we recommend that you change your password as a precaution. To change your password, please visit: ",(0,o.kt)("a",{parentName:"strong",href:"https://www.neilhosting.net/users/edit"},"https://www.neilhosting.net/users/edit"))),(0,o.kt)("p",null,"We do not have any evidence that this data was accessed, and we have taken steps to remove it from the Internet. However, we also have no way to prove that the data was not accessed."),(0,o.kt)("h2",{id:"what-data-was-publicly-accessible"},"What data was publicly accessible?"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Information in User Profiles for all conventions hosted on this instance, which may include names, addresses, phone numbers, email addresses, birth dates (if provided), etc:",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"These conventions include but are not limited to: Intercon, Festival of the LARPs, Bubble, SLAW, Summer Larpin', Be-Con, NELCO, Winter Boffer Con, Wintercon, and others. Refer to ",(0,o.kt)("a",{parentName:"li",href:"https://www.neilhosting.net/pages/all-conventions"},"https://www.neilhosting.net/pages/all-conventions")," for a more complete list."))),(0,o.kt)("li",{parentName:"ul"},"Encrypted passwords for all user accounts. Passwords are hashed and salted using the industry-standard bcrypt algorithm."),(0,o.kt)("li",{parentName:"ul"},"Event proposals, signups, dropped events, individual event ratings (starred/hidden events), and all other data used in the signup system for Intercode-hosted conventions."),(0,o.kt)("li",{parentName:"ul"},"Historical data from past conventions, including previous addresses, names, phone numbers, and anything else attendees might have entered into profiles and not updated on that convention site."),(0,o.kt)("li",{parentName:"ul"},"Lists of user activity alerts set up by admins of current and prior conventions."),(0,o.kt)("li",{parentName:"ul"},"Sales records for tickets and merchandise at current and past conventions.")),(0,o.kt)("h2",{id:"how-did-this-happen"},"How did this happen?"),(0,o.kt)("p",null,"Prior to resetting the Intercon U signups and schedule, Nat took a manual export of the full database for safety. This is outside our standard backup procedure, which uses Amazon's automated database snapshot feature and stores backups in a separate secure environment."),(0,o.kt)("p",null,"The manual export file stayed on Nat's computer while he developed the COVID mask protocol features for Intercode that we're currently using at Intercon U. When checking the new code into the repository, Nat accidentally included the export."),(0,o.kt)("p",null,"The day before Intercon U signups opened for the first round, while reviewing unrelated code in preparation for the signups opening, Nat noticed the file on Github and immediately began taking steps to remove it."),(0,o.kt)("h2",{id:"what-are-we-doing-about-this"},"What are we doing about this?"),(0,o.kt)("p",null,"We have purged all known copies of this file from the public Internet. We've also reached out to the Consequences web team, who we believe accidentally received this file as part of their regular Intercode releases, and asked them to purge it from their systems. We also searched some of the places on the Internet where stolen data often appears to see if the Intercode export may have ended up there, and weren't able to find it."),(0,o.kt)("p",null,"We've also added some additional protections to our code repository and data export process to make it much less likely that a similar incident could occur in the future."),(0,o.kt)("p",null,"We held a post-mortem meeting to discuss this incident and document it. The meeting notes are available at: ",(0,o.kt)("a",{parentName:"p",href:"https://docs.google.com/document/d/1hcVCF9wzqpTevZPlImRUjhTONp4hFqgjcQhWER4Ao7M/edit?usp=sharing"},"https://docs.google.com/document/d/1hcVCF9wzqpTevZPlImRUjhTONp4hFqgjcQhWER4Ao7M/edit?usp=sharing")),(0,o.kt)("p",null,"We're also sending this email to all Intercode users to let them know. ",(0,o.kt)("strong",{parentName:"p"},"Again, we recommend that you change your password using the link above.")),(0,o.kt)("p",null,"We recognize the potential severity of this data exposure. We'd like to apologize deeply. We understand the importance of data security, and we should not have allowed this to happen. Transparency is important to us, and if you have any questions about this, we'd be more than happy to chat with you."),(0,o.kt)("p",null,"Nat Budin (he/him)",(0,o.kt)("br",null),"\nDave Kapell (he/him)",(0,o.kt)("br",null),"\nJae Hartwin (crow/crows)",(0,o.kt)("br",null),"\nJohn Cooke (he/him)"))}p.isMDXComponent=!0}}]);