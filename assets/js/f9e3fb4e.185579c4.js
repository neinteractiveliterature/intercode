"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[61797],{10338:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>r,toc:()=>c});var s=t(35091),a=t(1422);const i={title:"How Intercode builds and loads JavaScript",tags:["tech"],authors:["nbudin"]},o=void 0,r={permalink:"/blog/2023/05/11/js-loading-strategy",editUrl:"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/blog/blog/2023-05-11-js-loading-strategy.md",source:"@site/blog/2023-05-11-js-loading-strategy.md",title:"How Intercode builds and loads JavaScript",description:'Intercode is an open source Ruby on Rails application with a (mostly) single-page app frontend. Virtually all "pages" in',date:"2023-05-11T00:00:00.000Z",tags:[{label:"tech",permalink:"/blog/tags/tech"}],readingTime:10.82,hasTruncateMarker:!0,authors:[{name:"Nat Budin",url:"https://github.com/nbudin",imageURL:"https://github.com/nbudin.png",key:"nbudin"}],frontMatter:{title:"How Intercode builds and loads JavaScript",tags:["tech"],authors:["nbudin"]},unlisted:!1,nextItem:{title:"Database Export Security Issue Disclosure",permalink:"/blog/2022/12/02/database-export-security-disclosure"}},l={authorsImageUrls:[void 0]},c=[{value:"Rails and JavaScript",id:"rails-and-javascript",level:2},{value:"Going a different way",id:"going-a-different-way",level:2},{value:"Without further ado",id:"without-further-ado",level:2},{value:"Caching, and not caching",id:"caching-and-not-caching",level:3},{value:"Client auto-reload",id:"client-auto-reload",level:3},{value:"Conclusion",id:"conclusion",level:2}];function h(e){const n={a:"a",code:"code",em:"em",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.p,{children:['Intercode is an open source Ruby on Rails application with a (mostly) single-page app frontend. Virtually all "pages" in\nthe web application are resolved and rendered on the frontend using ',(0,s.jsx)(n.a,{href:"https://reactrouter.com/",children:"react-router"}),". These\npages then load the data they need using Intercode's GraphQL API, which is implemented on the Rails server side using\n",(0,s.jsx)(n.a,{href:"https://graphql-ruby.org",children:"graphql-ruby"}),"."]}),"\n",(0,s.jsx)(n.p,{children:"Intercode doesn't follow the recommended strategy for JavaScript loading in Rails applications. This blog post is an\nattempt to explain why, and what we do instead."}),"\n",(0,s.jsx)(n.h2,{id:"rails-and-javascript",children:"Rails and JavaScript"}),"\n",(0,s.jsx)(n.p,{children:"JavaScript in Rails applications has a long and winding history. This isn't a comprehensive timeline, but a basic\noutline of how things evolved follows:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["2005: ",(0,s.jsx)(n.a,{href:"https://rubyonrails.org/2005/12/13/rails-1-0-party-like-its-one-oh-oh",children:"The first stable Rails release"}),"\ncame bundled with ",(0,s.jsx)(n.a,{href:"http://prototypejs.org/",children:"Prototype.js"})," and ",(0,s.jsx)(n.a,{href:"http://script.aculo.us/",children:"Scriptaculous"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["2006: ",(0,s.jsx)(n.a,{href:"https://rubyonrails.org/2006/3/28/rails-1-1-rjs-active-record-respond_to-integration-tests-and-500-other-things",children:"Rails 1.1"}),'\nadded a feature called "RJS" which allowed Ruby developers to avoid writing JavaScript code for some common\noperations. Instead, developers could write Ruby code which generated JavaScript, which would be sent to the browser\nand executed on the fly.']}),"\n",(0,s.jsxs)(n.li,{children:["2011: ",(0,s.jsx)(n.a,{href:"https://rubyonrails.org/2011/5/22/rails-3-1-release-candidate",children:"Rails 3.1"})," introduced the asset pipeline. Based\non a library called Sprockets, the asset pipeline allows Rails applications to preprocess frontend assets such as\nJavaScript, CSS, and images. This made it much simpler for Rails applications to use languages that compile to\nJavaScript, and Rails encouraged this by recommending ",(0,s.jsx)(n.a,{href:"https://coffeescript.org/",children:"CoffeeScript"})," as a default."]}),"\n",(0,s.jsxs)(n.li,{children:["2013: ",(0,s.jsx)(n.a,{href:"https://rubyonrails.org/2013/6/25/Rails-4-0-final",children:"Rails 4.0"})," introduced new caching features to speed up\nserver-side rendering and added ",(0,s.jsx)(n.a,{href:"https://github.com/turbolinks/turbolinks-classic",children:"Turbolinks"})," as a default for new\napplications. The Rails 4.0 release notes explicitly discourage developers from writing single-page apps, instead\nrecommending these new features as an alternative."]}),"\n",(0,s.jsxs)(n.li,{children:["2017: ",(0,s.jsx)(n.a,{href:"https://rubyonrails.org/2017/4/27/Rails-5-1-final",children:"Rails 5.1"}),' is released, with the headline "Loving\nJavaScript." Along with this release comes ',(0,s.jsx)(n.a,{href:"https://github.com/rails/webpacker",children:"Webpacker"}),", a library for driving\nWebpack from the Rails server and integrating Webpack with the asset pipeline."]}),"\n",(0,s.jsxs)(n.li,{children:["2021: In advance of the release of Rails 7, Rails founder David Heinemeier Hansson announces\n",(0,s.jsx)(n.a,{href:"https://world.hey.com/dhh/rails-7-will-have-three-great-answers-to-javascript-in-2021-8d68191b",children:'"three great answers to JavaScript"'}),".\nThis announcement deprecates Webpacker and encourages developers to try using ",(0,s.jsx)(n.a,{href:"https://hotwired.dev/",children:"Hotwire"}),", a\nframework that includes a revamped version of Turbolinks and does most rendering on the server side. It also\nintroduces ",(0,s.jsx)(n.a,{href:"https://github.com/rails/jsbundling-rails",children:"jsbundling-rails"})," as a migration path for Webpacker users,\nalbeit one that loses some functionality, such as the ability to use webpack-dev-server."]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["One consistent theme running throughout this history is that ",(0,s.jsx)(n.strong,{children:"Rails has tried to make JavaScript as optional as possible"}),".\nThis makes sense from a perspective of onboarding new developers: learning Ruby, HTML, and (potentially) CSS is enough\nwithout having to also learn JavaScript."]}),"\n",(0,s.jsxs)(n.p,{children:["On the other hand, for Rails developers who have made the choice to embrace a frontend framework such as React, Vue, or\nEmber.js, this can make Rails upgrades difficult, particularly in recent years with the introduction and then\ndeprecation of Webpacker. There are even official forks such as ",(0,s.jsx)(n.a,{href:"https://github.com/shakacode/shakapacker",children:"Shakapacker"}),"\nwhich aim to provide a smooth path forward for people who built apps on top of Webpacker."]}),"\n",(0,s.jsx)(n.h2,{id:"going-a-different-way",children:"Going a different way"}),"\n",(0,s.jsx)(n.p,{children:'For me, Rails 7 was the culmination of what I saw as a pattern of decades of efforts by the Rails core team to steer\ndevelopers away from writing JavaScript frontends for API-only Rails applications. I tried out both jsbundling-rails\nand the import maps path outlined in the "three great answers" blog post, and didn\'t find either of them to be great\ndeveloper experiences in Intercode. (The blog post pretty much says this is the case for import maps in fully\nReact-based apps, and for me, the lack of webpack-dev-server support in jsbundling-rails made it significantly slower\nand more resource-intensive to develop with.)'}),"\n",(0,s.jsx)(n.p,{children:"What Intercode ideally needed was a solution that:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Decouples Rails from the JavaScript frontend as much as possible"}),"\n",(0,s.jsx)(n.li,{children:"Supports a single-repo build and deploy strategy, so that the backend and frontend can be deployed in tandem"}),"\n",(0,s.jsx)(n.li,{children:"Keeps the local development experience responsive and easy to work with"}),"\n",(0,s.jsx)(n.li,{children:"Works well in both a CDN-backed setup as well as a single-server, non-CDN setup (because NEIL's installation of\nIntercode uses the Amazon CloudFront CDN, but Consequences' uses a single server)"}),"\n",(0,s.jsx)(n.li,{children:"Allows browser caching to work for compiled JavaScript and CSS bundles"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Decoupling Rails from the JavaScript frontend would allow us to continue keeping Rails up to date without having to\nrethink our JavaScript build strategy every time the Rails core team changed its mind about the best way to integrate\nRails with JavaScript. This was important for us, because Rails updates often contain urgent security fixes and we want\nto be able to take those as quickly as possible."}),"\n",(0,s.jsx)(n.h2,{id:"without-further-ado",children:"Without further ado"}),"\n",(0,s.jsx)(n.p,{children:"Here's how we do it in Intercode."}),"\n",(0,s.jsx)(n.p,{children:"Intercode uses plain old off-the-shelf Webpack to build its JavaScript bundles. We use Webpack's built-in ability to\nadd fingerprint hashes to the end of built asset filenames for easy caching, just like what the Rails asset pipeline\ndoes by default."}),"\n",(0,s.jsx)(n.p,{children:"The only exception to this fingerprint hashing is a small set of JavaScript entry points. Here's a slightly abbreviated\nversion of the section of our webpack.config.js that sets this up:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",children:"entry: {\n  application: './app/javascript/packs/applicationEntry.ts',\n  'application-styles': './app/javascript/packs/applicationStyles.ts',\n},\noutput: {\n  filename: '[name].js',\n  chunkFilename: '[name]-[chunkhash].chunk.js',\n}\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Because of this configuration, all built JavaScript files will have a chunk hash in the filename, except the\n",(0,s.jsx)(n.code,{children:"application.js"})," and ",(0,s.jsx)(n.code,{children:"application-styles.js"})," files. Because of this, Rails doesn't need any kind of integration with\nWebpack - we can simply hard-code a JavaScript path in our Rails templates. Here's an excerpt from our global template:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-erb",children:"<% if ENV['ASSETS_HOST'].present? -%>\n  <script type=\"application/javascript\">\n    window.intercodeAssetsHost = <%=raw ENV['ASSETS_HOST'].to_json %>;\n  <\/script>\n<% end -%>\n<%= javascript_include_tag url_with_possible_host('/packs/application.js', ENV['ASSETS_HOST']), defer: true, type: 'module' %>\n"})}),"\n",(0,s.jsxs)(n.p,{children:["There are a bunch of shenanigans going on here with the asset host, but let's simplify this and assume that we're using\na simple, single-server Intercode setup. In this setup, the ",(0,s.jsx)(n.code,{children:"ASSETS_HOST"})," environment variable would not be set.\nEffectively, this snippet of template code would behave like this code:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-erb",children:"<%= javascript_include_tag '/packs/application.js', defer: true, type: 'module' %>\n"})}),"\n",(0,s.jsxs)(n.p,{children:["No fingerprint needed - all we need to do is have Webpack compile into ",(0,s.jsx)(n.code,{children:"/public/packs/application.js"})," in the root of the\nRails application, and Rails can hardcode the path to it and serve the files statically."]}),"\n",(0,s.jsxs)(n.p,{children:["The actual contents of these entry point files are relatively tiny. Here's the effective version of\n",(0,s.jsx)(n.code,{children:"applicationEntry.ts"}),", with all the code it imports shown inline instead:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"if (window.intercodeAssetsHost) {\n  __webpack_public_path__ = `//${window.intercodeAssetsHost}/packs/`;\n}\n\nimport(/* webpackChunkName: 'applicationStylesheet' */ '../styles/application.scss');\nimport(/* webpackChunkName: 'bootstrap-js' */ 'bootstrap');\nimport(/* webpackChunkName: \"application-main\" */ './application');\n"})}),"\n",(0,s.jsxs)(n.p,{children:["The heavy lifting here is done by the ",(0,s.jsx)(n.code,{children:"import"})," function, which is specified in the\n",(0,s.jsx)(n.a,{href:"https://tc39.es/proposal-dynamic-import/",children:"ECMAScript Dynamic Import proposal"})," and implemented by Webpack as\n",(0,s.jsx)(n.a,{href:"https://webpack.js.org/guides/code-splitting/#dynamic-imports",children:"part of its code splitting features"}),". Behind the\nscenes, Webpack adds a small function that allows it to dynamically load other modules on demand, as well as a data\nstructure that contains the fingerprint hashes of all modules that resulted from this build. This effectively makes\nthe application entry point into a kind of manifest file that has all the relevant information about the contents of\nthis Webpack build."]}),"\n",(0,s.jsx)(n.p,{children:"The net effect of this is:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["Rails renders a hardcoded ",(0,s.jsx)(n.code,{children:"<script>"})," tag into HTML templates that points at a known, non-fingerprinted location."]}),"\n",(0,s.jsx)(n.li,{children:"The user's web browser loads the entry point JS file from that location."}),"\n",(0,s.jsx)(n.li,{children:"When the entry point JS executes, its dynamic import statements point it at the fingerprinted URLs for the actual\nasset bundles for the main application code."}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"caching-and-not-caching",children:"Caching, and not caching"}),"\n",(0,s.jsx)(n.p,{children:"For this setup to perform well, it's very important that two things are true:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"Asset URLs with fingerprints in them get cached"}),"\n",(0,s.jsx)(n.li,{children:"Asset URLs without fingerprints in them don't get cached"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["The reason for caching URLs with fingerprints in them is straightforward: we don't want the user to be re-downloading\nlarge chunks of JavaScript and CSS on every page load. The reason for ",(0,s.jsx)(n.em,{children:"not"})," caching URLs without fingerprints in them\nis perhaps less obvious, but it's critical for the site to function correctly: if there has been a new deploy of\nfrontend code, we want users to get the new version the next time they do a page load."]}),"\n",(0,s.jsx)(n.p,{children:"Because the entry point file is effectively a manifest of all built asset hashes, loading the entry point is all that's\nneeded to let the browser do the right thing for loading the rest of the build. If the fingerprints haven't changed,\nand there's already a copy of those files in its local cache, the browser doesn't need to do anything - it can use the\ncopy it's already got. If they have changed, the URLs they're loaded from have changed and therefore the browser won't\nuse a cached copy."}),"\n",(0,s.jsxs)(n.p,{children:["The tradeoff here is that the entry point file has to be reloaded on every page load. For that reason, we try to keep\nit as small as possible. The ",(0,s.jsx)(n.a,{href:"https://assets.neilhosting.net/packs/application.js",children:"current production version"})," as of\nthis writing is a little over 9KB, and if the browser supports gzip compression (which\n",(0,s.jsx)(n.a,{href:"https://caniuse.com/sr_content-encoding-gzip",children:"effectively all browsers do"}),") it will only end up transferring around\n5KB."]}),"\n",(0,s.jsx)(n.p,{children:"To make sure the entry point files never get cached, we use a small bit of custom Rack middleware in the Rails app:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ruby",children:"# adapted from https://stackoverflow.com/a/52848885\nmodule Intercode\n  class DisableCachingForSpecificAssets\n    attr_reader :app, :asset_paths\n\n    def initialize(app, asset_paths)\n      @app = app\n      @asset_paths = Set.new(asset_paths)\n    end\n\n    def call(env)\n      # Let the next middleware classes & app do their thing first\u2026\n      status, headers, response = app.call(env)\n\n      # \u2026and modify the response if a cache-disabled asset was fetched.\n      if asset_paths.include?(env['REQUEST_PATH'])\n        headers['Cache-Control'] = 'no-cache'\n        headers.except!('Expires')\n      end\n\n      [status, headers, response]\n    end\n  end\nend\n"})}),"\n",(0,s.jsxs)(n.p,{children:["This middleware is loaded in ",(0,s.jsx)(n.code,{children:"config/environments/production.rb"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ruby",children:'if ENV["RAILS_SERVE_STATIC_FILES"].present?\n  config.middleware.insert_before ActionDispatch::Static,\n                                  Intercode::DisableCachingForSpecificAssets,\n                                  JSON.parse(File.read(File.expand_path("config/nocache-files.json", Rails.root)))\nend\n'})}),"\n",(0,s.jsxs)(n.p,{children:["This code reads a list of paths to disable caching on from ",(0,s.jsx)(n.code,{children:"config/nocache-files.json"}),", which contains this:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'["/packs/application.js", "/packs/application-styles.js"]\n'})}),"\n",(0,s.jsxs)(n.p,{children:["(The reason we split out the list of entry points into a separate JSON file is to support a workflow used by the\nConsequences team to support the ",(0,s.jsx)(n.a,{href:"https://www.consequences.org.uk/",children:"Consequences larp conventions"})," as well as other\nUK-based larp events. This team runs a separate nginx container to serve assets. That workflow needs to dynamically\ngenerate an nginx config file that says which paths to send the ",(0,s.jsx)(n.code,{children:"Cache-Control: no-cache"})," header on. We want to make\nsure that the Rails app and the nginx container stay in sync with one another, so we use the JSON file as a single\nsource of truth for both of them.)"]}),"\n",(0,s.jsx)(n.h3,{id:"client-auto-reload",children:"Client auto-reload"}),"\n",(0,s.jsx)(n.p,{children:"This setup also enables one other cool feature: it's possible for the frontend code in the browser to check whether or\nnot it's running out-of-date JavaScript. We can do this by making a HEAD request to the path of the application.js\nentry point:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",children:"const response = await fetch(`${__webpack_public_path__ ?? '/packs/'}application.js`, {\n  method: 'HEAD',\n  cache: 'no-store',\n});\n"})}),"\n",(0,s.jsxs)(n.p,{children:["We can then use this response to check whether certain headers are the same as the last time we did this request. In\nparticular, Intercode checks the ",(0,s.jsx)(n.code,{children:"Last-Modified"}),", ",(0,s.jsx)(n.code,{children:"ETag"}),", and ",(0,s.jsx)(n.code,{children:"Content-Length"})," headers of the entry point. If any of\nthose have changed, it considers the code it's running to be outdated. The full implementation of this is a little too\nlong to paste in here, but ",(0,s.jsx)(n.a,{href:"https://github.com/neinteractiveliterature/intercode/blob/07df0692f1b9473510db5a575268ffa74f75d92c/app/javascript/checkAppEntrypointHeadersMatch.ts",children:"here's a link to the full implementation"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["There are a few situations where Intercode checks whether or not it's running outdated code, but the most common one\nis during page transitions. We've set up a hook on the React Router location, and whenever it changes, we run this\ncheck. If the code is outdated, we do a ",(0,s.jsx)(n.code,{children:"window.location.reload()"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["Forcing a page reload can be a dangerous operation. If there's unsaved data in memory, reloading the page clears it\nout. To ensure this is safe in Intercode, we only change the URL location ",(0,s.jsx)(n.em,{children:"after"})," data has been successfully saved to\nthe server. For example, when creating a new staff position, the flow goes like this:"]}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["Go to ",(0,s.jsx)(n.code,{children:"/staff_positions/new"}),", which renders a blank form for the user to fill out."]}),"\n",(0,s.jsx)(n.li,{children:'The user fills out the form and presses "Submit".'}),"\n",(0,s.jsxs)(n.li,{children:["The frontend code does a GraphQL request using the ",(0,s.jsx)(n.code,{children:"createStaffPosition"})," mutation."]}),"\n",(0,s.jsxs)(n.li,{children:["Only after it returns a successful response, transition to the ",(0,s.jsx)(n.code,{children:"/staff_positions"})," page."]}),"\n",(0,s.jsx)(n.li,{children:"Because the location is changed, check whether we're running outdated code. If so, reload the page."}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Reloading the page in the last step is safe because we only change locations after the GraphQL request responds\nsuccessfully."}),"\n",(0,s.jsx)(n.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,s.jsx)(n.p,{children:"The approach of using a minimal, uncached, stub entry point with a predictable URL works well for Intercode. With this\nstrategy, we're able to decouple the backend server from the frontend application, ensuring that it's possible for us to\nupgrade Rails without the possibility of breaking our JavaScript stack."}),"\n",(0,s.jsx)(n.p,{children:"This approach is probably not right for every web application, or even every Rails application, but I do think it's a\nuseful approach for Rails apps where:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"The frontend code is largely responsible for rendering HTML, and talks to the server over some kind of API (REST,\nGraphQL, etc.)"}),"\n",(0,s.jsx)(n.li,{children:"The frontend code is built using a bundler, such as Webpack, which supports dynamic imports"}),"\n"]})]})}function d(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},1422:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>r});var s=t(7731);const a={},i=s.createContext(a);function o(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);