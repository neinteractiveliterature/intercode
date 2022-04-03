"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[2352],{75631:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return g}});var r=n(3289);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},l=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,p=u(e,["components","mdxType","originalType","parentName"]),l=c(n),g=a,f=l["".concat(s,".").concat(g)]||l[g]||d[g]||i;return n?r.createElement(f,o(o({ref:t},p),{},{components:n})):r.createElement(f,o({ref:t},p))}));function g(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=l;var u={};for(var s in t)hasOwnProperty.call(t,s)&&(u[s]=t[s]);u.originalType=e,u.mdxType="string"==typeof e?e:a,o[1]=u;for(var c=2;c<i;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}l.displayName="MDXCreateElement"},81956:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return s},default:function(){return g},frontMatter:function(){return u},metadata:function(){return c},toc:function(){return d}});var r=n(35161),a=n(79675),i=(n(3289),n(75631)),o=["components"],u={id:"signup-request",title:"SignupRequest"},s=void 0,c={unversionedId:"graphql/objects/signup-request",id:"graphql/objects/signup-request",title:"SignupRequest",description:"No description",source:"@site/docs/graphql/objects/signup-request.mdx",sourceDirName:"graphql/objects",slug:"/graphql/objects/signup-request",permalink:"/docs/graphql/objects/signup-request",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/docs/graphql/objects/signup-request.mdx",tags:[],version:"current",frontMatter:{id:"signup-request",title:"SignupRequest"},sidebar:"sidebar",previous:{title:"SignupMoveResult",permalink:"/docs/graphql/objects/signup-move-result"},next:{title:"SignupRequestsPagination",permalink:"/docs/graphql/objects/signup-requests-pagination"}},p={},d=[{value:"Fields",id:"fields",level:3},{value:"<code>created_at</code> (<code>Date</code>)",id:"created_at-date",level:4},{value:"<code>id</code> (<code>ID</code>)",id:"id-id",level:4},{value:"<code>replace_signup</code> (<code>Signup</code>)",id:"replace_signup-signup",level:4},{value:"<code>requested_bucket_key</code> (<code>String</code>)",id:"requested_bucket_key-string",level:4},{value:"<code>result_signup</code> (<code>Signup</code>)",id:"result_signup-signup",level:4},{value:"<code>state</code> (<code>SignupRequestState</code>)",id:"state-signuprequeststate",level:4},{value:"<code>target_run</code> (<code>Run</code>)",id:"target_run-run",level:4},{value:"<code>updated_at</code> (<code>Date</code>)",id:"updated_at-date",level:4},{value:"<code>updated_by</code> (<code>User</code>)",id:"updated_by-user",level:4},{value:"<code>user_con_profile</code> (<code>UserConProfile</code>)",id:"user_con_profile-userconprofile",level:4}],l={toc:d};function g(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"No description"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"type SignupRequest {\n  created_at: Date!\n  id: ID!\n  replace_signup: Signup\n  requested_bucket_key: String\n  result_signup: Signup\n  state: SignupRequestState!\n  target_run: Run!\n  updated_at: Date!\n  updated_by: User!\n  user_con_profile: UserConProfile!\n}\n")),(0,i.kt)("h3",{id:"fields"},"Fields"),(0,i.kt)("h4",{id:"created_at-date"},(0,i.kt)("inlineCode",{parentName:"h4"},"created_at")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/date"},(0,i.kt)("inlineCode",{parentName:"a"},"Date")),")"),(0,i.kt)("h4",{id:"id-id"},(0,i.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/id"},(0,i.kt)("inlineCode",{parentName:"a"},"ID")),")"),(0,i.kt)("h4",{id:"replace_signup-signup"},(0,i.kt)("inlineCode",{parentName:"h4"},"replace_signup")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/signup"},(0,i.kt)("inlineCode",{parentName:"a"},"Signup")),")"),(0,i.kt)("h4",{id:"requested_bucket_key-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"requested_bucket_key")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("h4",{id:"result_signup-signup"},(0,i.kt)("inlineCode",{parentName:"h4"},"result_signup")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/signup"},(0,i.kt)("inlineCode",{parentName:"a"},"Signup")),")"),(0,i.kt)("h4",{id:"state-signuprequeststate"},(0,i.kt)("inlineCode",{parentName:"h4"},"state")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/enums/signup-request-state"},(0,i.kt)("inlineCode",{parentName:"a"},"SignupRequestState")),")"),(0,i.kt)("h4",{id:"target_run-run"},(0,i.kt)("inlineCode",{parentName:"h4"},"target_run")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/run"},(0,i.kt)("inlineCode",{parentName:"a"},"Run")),")"),(0,i.kt)("h4",{id:"updated_at-date"},(0,i.kt)("inlineCode",{parentName:"h4"},"updated_at")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/scalars/date"},(0,i.kt)("inlineCode",{parentName:"a"},"Date")),")"),(0,i.kt)("h4",{id:"updated_by-user"},(0,i.kt)("inlineCode",{parentName:"h4"},"updated_by")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/user"},(0,i.kt)("inlineCode",{parentName:"a"},"User")),")"),(0,i.kt)("h4",{id:"user_con_profile-userconprofile"},(0,i.kt)("inlineCode",{parentName:"h4"},"user_con_profile")," (",(0,i.kt)("a",{parentName:"h4",href:"/docs/graphql/objects/user-con-profile"},(0,i.kt)("inlineCode",{parentName:"a"},"UserConProfile")),")"))}g.isMDXComponent=!0}}]);