"use strict";(self.webpackChunkdoc_site=self.webpackChunkdoc_site||[]).push([[11477],{30010:e=>{e.exports=JSON.parse('{"blogPosts":[{"id":"/2023/05/11/js-loading-strategy","metadata":{"permalink":"/blog/2023/05/11/js-loading-strategy","editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/blog/blog/2023-05-11-js-loading-strategy.md","source":"@site/blog/2023-05-11-js-loading-strategy.md","title":"How Intercode builds and loads JavaScript","description":"Intercode is an open source Ruby on Rails application with a (mostly) single-page app frontend. Virtually all \\"pages\\" in","date":"2023-05-11T00:00:00.000Z","formattedDate":"May 11, 2023","tags":[{"label":"tech","permalink":"/blog/tags/tech"}],"readingTime":10.82,"hasTruncateMarker":true,"authors":[{"name":"Nat Budin","url":"https://github.com/nbudin","imageURL":"https://github.com/nbudin.png","key":"nbudin"}],"frontMatter":{"title":"How Intercode builds and loads JavaScript","tags":["tech"],"authors":["nbudin"]},"unlisted":false,"nextItem":{"title":"Database Export Security Issue Disclosure","permalink":"/blog/2022/12/02/database-export-security-disclosure"}},"content":"Intercode is an open source Ruby on Rails application with a (mostly) single-page app frontend. Virtually all \\"pages\\" in\\nthe web application are resolved and rendered on the frontend using [react-router](https://reactrouter.com/). These\\npages then load the data they need using Intercode\'s GraphQL API, which is implemented on the Rails server side using\\n[graphql-ruby](https://graphql-ruby.org).\\n\\nIntercode doesn\'t follow the recommended strategy for JavaScript loading in Rails applications. This blog post is an\\nattempt to explain why, and what we do instead.\\n\\n\x3c!--truncate--\x3e\\n\\n## Rails and JavaScript\\n\\nJavaScript in Rails applications has a long and winding history. This isn\'t a comprehensive timeline, but a basic\\noutline of how things evolved follows:\\n\\n- 2005: [The first stable Rails release](https://rubyonrails.org/2005/12/13/rails-1-0-party-like-its-one-oh-oh)\\n  came bundled with [Prototype.js](http://prototypejs.org/) and [Scriptaculous](http://script.aculo.us/).\\n- 2006: [Rails 1.1](https://rubyonrails.org/2006/3/28/rails-1-1-rjs-active-record-respond_to-integration-tests-and-500-other-things)\\n  added a feature called \\"RJS\\" which allowed Ruby developers to avoid writing JavaScript code for some common\\n  operations. Instead, developers could write Ruby code which generated JavaScript, which would be sent to the browser\\n  and executed on the fly.\\n- 2011: [Rails 3.1](https://rubyonrails.org/2011/5/22/rails-3-1-release-candidate) introduced the asset pipeline. Based\\n  on a library called Sprockets, the asset pipeline allows Rails applications to preprocess frontend assets such as\\n  JavaScript, CSS, and images. This made it much simpler for Rails applications to use languages that compile to\\n  JavaScript, and Rails encouraged this by recommending [CoffeeScript](https://coffeescript.org/) as a default.\\n- 2013: [Rails 4.0](https://rubyonrails.org/2013/6/25/Rails-4-0-final) introduced new caching features to speed up\\n  server-side rendering and added [Turbolinks](https://github.com/turbolinks/turbolinks-classic) as a default for new\\n  applications. The Rails 4.0 release notes explicitly discourage developers from writing single-page apps, instead\\n  recommending these new features as an alternative.\\n- 2017: [Rails 5.1](https://rubyonrails.org/2017/4/27/Rails-5-1-final) is released, with the headline \\"Loving\\n  JavaScript.\\" Along with this release comes [Webpacker](https://github.com/rails/webpacker), a library for driving\\n  Webpack from the Rails server and integrating Webpack with the asset pipeline.\\n- 2021: In advance of the release of Rails 7, Rails founder David Heinemeier Hansson announces\\n  [\\"three great answers to JavaScript\\"](https://world.hey.com/dhh/rails-7-will-have-three-great-answers-to-javascript-in-2021-8d68191b).\\n  This announcement deprecates Webpacker and encourages developers to try using [Hotwire](https://hotwired.dev/), a\\n  framework that includes a revamped version of Turbolinks and does most rendering on the server side. It also\\n  introduces [jsbundling-rails](https://github.com/rails/jsbundling-rails) as a migration path for Webpacker users,\\n  albeit one that loses some functionality, such as the ability to use webpack-dev-server.\\n\\nOne consistent theme running throughout this history is that **Rails has tried to make JavaScript as optional as possible**.\\nThis makes sense from a perspective of onboarding new developers: learning Ruby, HTML, and (potentially) CSS is enough\\nwithout having to also learn JavaScript.\\n\\nOn the other hand, for Rails developers who have made the choice to embrace a frontend framework such as React, Vue, or\\nEmber.js, this can make Rails upgrades difficult, particularly in recent years with the introduction and then\\ndeprecation of Webpacker. There are even official forks such as [Shakapacker](https://github.com/shakacode/shakapacker)\\nwhich aim to provide a smooth path forward for people who built apps on top of Webpacker.\\n\\n## Going a different way\\n\\nFor me, Rails 7 was the culmination of what I saw as a pattern of decades of efforts by the Rails core team to steer\\ndevelopers away from writing JavaScript frontends for API-only Rails applications. I tried out both jsbundling-rails\\nand the import maps path outlined in the \\"three great answers\\" blog post, and didn\'t find either of them to be great\\ndeveloper experiences in Intercode. (The blog post pretty much says this is the case for import maps in fully\\nReact-based apps, and for me, the lack of webpack-dev-server support in jsbundling-rails made it significantly slower\\nand more resource-intensive to develop with.)\\n\\nWhat Intercode ideally needed was a solution that:\\n\\n- Decouples Rails from the JavaScript frontend as much as possible\\n- Supports a single-repo build and deploy strategy, so that the backend and frontend can be deployed in tandem\\n- Keeps the local development experience responsive and easy to work with\\n- Works well in both a CDN-backed setup as well as a single-server, non-CDN setup (because NEIL\'s installation of\\n  Intercode uses the Amazon CloudFront CDN, but Consequences\' uses a single server)\\n- Allows browser caching to work for compiled JavaScript and CSS bundles\\n\\nDecoupling Rails from the JavaScript frontend would allow us to continue keeping Rails up to date without having to\\nrethink our JavaScript build strategy every time the Rails core team changed its mind about the best way to integrate\\nRails with JavaScript. This was important for us, because Rails updates often contain urgent security fixes and we want\\nto be able to take those as quickly as possible.\\n\\n## Without further ado\\n\\nHere\'s how we do it in Intercode.\\n\\nIntercode uses plain old off-the-shelf Webpack to build its JavaScript bundles. We use Webpack\'s built-in ability to\\nadd fingerprint hashes to the end of built asset filenames for easy caching, just like what the Rails asset pipeline\\ndoes by default.\\n\\nThe only exception to this fingerprint hashing is a small set of JavaScript entry points. Here\'s a slightly abbreviated\\nversion of the section of our webpack.config.js that sets this up:\\n\\n```js\\nentry: {\\n  application: \'./app/javascript/packs/applicationEntry.ts\',\\n  \'application-styles\': \'./app/javascript/packs/applicationStyles.ts\',\\n},\\noutput: {\\n  filename: \'[name].js\',\\n  chunkFilename: \'[name]-[chunkhash].chunk.js\',\\n}\\n```\\n\\nBecause of this configuration, all built JavaScript files will have a chunk hash in the filename, except the\\n`application.js` and `application-styles.js` files. Because of this, Rails doesn\'t need any kind of integration with\\nWebpack - we can simply hard-code a JavaScript path in our Rails templates. Here\'s an excerpt from our global template:\\n\\n```erb\\n<% if ENV[\'ASSETS_HOST\'].present? -%>\\n  <script type=\\"application/javascript\\">\\n    window.intercodeAssetsHost = <%=raw ENV[\'ASSETS_HOST\'].to_json %>;\\n  <\/script>\\n<% end -%>\\n<%= javascript_include_tag url_with_possible_host(\'/packs/application.js\', ENV[\'ASSETS_HOST\']), defer: true, type: \'module\' %>\\n```\\n\\nThere are a bunch of shenanigans going on here with the asset host, but let\'s simplify this and assume that we\'re using\\na simple, single-server Intercode setup. In this setup, the `ASSETS_HOST` environment variable would not be set.\\nEffectively, this snippet of template code would behave like this code:\\n\\n```erb\\n<%= javascript_include_tag \'/packs/application.js\', defer: true, type: \'module\' %>\\n```\\n\\nNo fingerprint needed - all we need to do is have Webpack compile into `/public/packs/application.js` in the root of the\\nRails application, and Rails can hardcode the path to it and serve the files statically.\\n\\nThe actual contents of these entry point files are relatively tiny. Here\'s the effective version of\\n`applicationEntry.ts`, with all the code it imports shown inline instead:\\n\\n```ts\\nif (window.intercodeAssetsHost) {\\n  __webpack_public_path__ = `//${window.intercodeAssetsHost}/packs/`;\\n}\\n\\nimport(/* webpackChunkName: \'applicationStylesheet\' */ \'../styles/application.scss\');\\nimport(/* webpackChunkName: \'bootstrap-js\' */ \'bootstrap\');\\nimport(/* webpackChunkName: \\"application-main\\" */ \'./application\');\\n```\\n\\nThe heavy lifting here is done by the `import` function, which is specified in the\\n[ECMAScript Dynamic Import proposal](https://tc39.es/proposal-dynamic-import/) and implemented by Webpack as\\n[part of its code splitting features](https://webpack.js.org/guides/code-splitting/#dynamic-imports). Behind the\\nscenes, Webpack adds a small function that allows it to dynamically load other modules on demand, as well as a data\\nstructure that contains the fingerprint hashes of all modules that resulted from this build. This effectively makes\\nthe application entry point into a kind of manifest file that has all the relevant information about the contents of\\nthis Webpack build.\\n\\nThe net effect of this is:\\n\\n1. Rails renders a hardcoded `<script>` tag into HTML templates that points at a known, non-fingerprinted location.\\n2. The user\'s web browser loads the entry point JS file from that location.\\n3. When the entry point JS executes, its dynamic import statements point it at the fingerprinted URLs for the actual\\n   asset bundles for the main application code.\\n\\n### Caching, and not caching\\n\\nFor this setup to perform well, it\'s very important that two things are true:\\n\\n1. Asset URLs with fingerprints in them get cached\\n2. Asset URLs without fingerprints in them don\'t get cached\\n\\nThe reason for caching URLs with fingerprints in them is straightforward: we don\'t want the user to be re-downloading\\nlarge chunks of JavaScript and CSS on every page load. The reason for _not_ caching URLs without fingerprints in them\\nis perhaps less obvious, but it\'s critical for the site to function correctly: if there has been a new deploy of\\nfrontend code, we want users to get the new version the next time they do a page load.\\n\\nBecause the entry point file is effectively a manifest of all built asset hashes, loading the entry point is all that\'s\\nneeded to let the browser do the right thing for loading the rest of the build. If the fingerprints haven\'t changed,\\nand there\'s already a copy of those files in its local cache, the browser doesn\'t need to do anything - it can use the\\ncopy it\'s already got. If they have changed, the URLs they\'re loaded from have changed and therefore the browser won\'t\\nuse a cached copy.\\n\\nThe tradeoff here is that the entry point file has to be reloaded on every page load. For that reason, we try to keep\\nit as small as possible. The [current production version](https://assets.neilhosting.net/packs/application.js) as of\\nthis writing is a little over 9KB, and if the browser supports gzip compression (which\\n[effectively all browsers do](https://caniuse.com/sr_content-encoding-gzip)) it will only end up transferring around\\n5KB.\\n\\nTo make sure the entry point files never get cached, we use a small bit of custom Rack middleware in the Rails app:\\n\\n```ruby\\n# adapted from https://stackoverflow.com/a/52848885\\nmodule Intercode\\n  class DisableCachingForSpecificAssets\\n    attr_reader :app, :asset_paths\\n\\n    def initialize(app, asset_paths)\\n      @app = app\\n      @asset_paths = Set.new(asset_paths)\\n    end\\n\\n    def call(env)\\n      # Let the next middleware classes & app do their thing first\u2026\\n      status, headers, response = app.call(env)\\n\\n      # \u2026and modify the response if a cache-disabled asset was fetched.\\n      if asset_paths.include?(env[\'REQUEST_PATH\'])\\n        headers[\'Cache-Control\'] = \'no-cache\'\\n        headers.except!(\'Expires\')\\n      end\\n\\n      [status, headers, response]\\n    end\\n  end\\nend\\n```\\n\\nThis middleware is loaded in `config/environments/production.rb`:\\n\\n```ruby\\nif ENV[\\"RAILS_SERVE_STATIC_FILES\\"].present?\\n  config.middleware.insert_before ActionDispatch::Static,\\n                                  Intercode::DisableCachingForSpecificAssets,\\n                                  JSON.parse(File.read(File.expand_path(\\"config/nocache-files.json\\", Rails.root)))\\nend\\n```\\n\\nThis code reads a list of paths to disable caching on from `config/nocache-files.json`, which contains this:\\n\\n```json\\n[\\"/packs/application.js\\", \\"/packs/application-styles.js\\"]\\n```\\n\\n(The reason we split out the list of entry points into a separate JSON file is to support a workflow used by the\\nConsequences team to support the [Consequences larp conventions](https://www.consequences.org.uk/) as well as other\\nUK-based larp events. This team runs a separate nginx container to serve assets. That workflow needs to dynamically\\ngenerate an nginx config file that says which paths to send the `Cache-Control: no-cache` header on. We want to make\\nsure that the Rails app and the nginx container stay in sync with one another, so we use the JSON file as a single\\nsource of truth for both of them.)\\n\\n### Client auto-reload\\n\\nThis setup also enables one other cool feature: it\'s possible for the frontend code in the browser to check whether or\\nnot it\'s running out-of-date JavaScript. We can do this by making a HEAD request to the path of the application.js\\nentry point:\\n\\n```js\\nconst response = await fetch(`${__webpack_public_path__ ?? \'/packs/\'}application.js`, {\\n  method: \'HEAD\',\\n  cache: \'no-store\',\\n});\\n```\\n\\nWe can then use this response to check whether certain headers are the same as the last time we did this request. In\\nparticular, Intercode checks the `Last-Modified`, `ETag`, and `Content-Length` headers of the entry point. If any of\\nthose have changed, it considers the code it\'s running to be outdated. The full implementation of this is a little too\\nlong to paste in here, but [here\'s a link to the full implementation](https://github.com/neinteractiveliterature/intercode/blob/07df0692f1b9473510db5a575268ffa74f75d92c/app/javascript/checkAppEntrypointHeadersMatch.ts).\\n\\nThere are a few situations where Intercode checks whether or not it\'s running outdated code, but the most common one\\nis during page transitions. We\'ve set up a hook on the React Router location, and whenever it changes, we run this\\ncheck. If the code is outdated, we do a `window.location.reload()`.\\n\\nForcing a page reload can be a dangerous operation. If there\'s unsaved data in memory, reloading the page clears it\\nout. To ensure this is safe in Intercode, we only change the URL location _after_ data has been successfully saved to\\nthe server. For example, when creating a new staff position, the flow goes like this:\\n\\n1. Go to `/staff_positions/new`, which renders a blank form for the user to fill out.\\n2. The user fills out the form and presses \\"Submit\\".\\n3. The frontend code does a GraphQL request using the `createStaffPosition` mutation.\\n4. Only after it returns a successful response, transition to the `/staff_positions` page.\\n5. Because the location is changed, check whether we\'re running outdated code. If so, reload the page.\\n\\nReloading the page in the last step is safe because we only change locations after the GraphQL request responds\\nsuccessfully.\\n\\n## Conclusion\\n\\nThe approach of using a minimal, uncached, stub entry point with a predictable URL works well for Intercode. With this\\nstrategy, we\'re able to decouple the backend server from the frontend application, ensuring that it\'s possible for us to\\nupgrade Rails without the possibility of breaking our JavaScript stack.\\n\\nThis approach is probably not right for every web application, or even every Rails application, but I do think it\'s a\\nuseful approach for Rails apps where:\\n\\n- The frontend code is largely responsible for rendering HTML, and talks to the server over some kind of API (REST,\\n  GraphQL, etc.)\\n- The frontend code is built using a bundler, such as Webpack, which supports dynamic imports"},{"id":"/2022/12/02/database-export-security-disclosure","metadata":{"permalink":"/blog/2022/12/02/database-export-security-disclosure","editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/blog/blog/2022-12-02-database-export-security-disclosure.md","source":"@site/blog/2022-12-02-database-export-security-disclosure.md","title":"Database Export Security Issue Disclosure","description":"Hi larp community! A thing happened that we should tell you about. You\'re receiving this because you\'ve logged into at least one convention website running in NEIL Hosting (Intercon, Be-Con, Festival, Bubble, etc).","date":"2022-12-02T00:00:00.000Z","formattedDate":"December 2, 2022","tags":[{"label":"security","permalink":"/blog/tags/security"}],"readingTime":3.24,"hasTruncateMarker":true,"authors":[{"name":"Nat Budin","url":"https://github.com/nbudin","imageURL":"https://github.com/nbudin.png","key":"nbudin"},{"name":"Dave Kapell","url":"https://github.com/dkapell","imageURL":"https://github.com/dkapell.png","key":"dkapell"},{"name":"Jae Hartwin","url":"https://github.com/jhartwin","imageURL":"https://github.com/jhartwin.png","key":"jaelen"},{"name":"John Cooke","key":"jcooke"}],"frontMatter":{"title":"Database Export Security Issue Disclosure","tags":["security"],"authors":["nbudin","dkapell","jaelen","jcooke"]},"unlisted":false,"prevItem":{"title":"How Intercode builds and loads JavaScript","permalink":"/blog/2023/05/11/js-loading-strategy"},"nextItem":{"title":"GraphQL Cross-Domain Security Issue Disclosure","permalink":"/blog/2022/01/18/graphql-cross-domain-security-issue-disclosure"}},"content":"Hi larp community! A thing happened that we should tell you about. You\'re receiving this because you\'ve logged into at least one convention website running in NEIL Hosting (Intercon, Be-Con, Festival, Bubble, etc).\\n\\nWhile reviewing the code in the Intercode open source project, we discovered a backup of the Intercode production database. This backup was publicly available for about 6 weeks between September 18 and November 3, 2022.\\n\\nWe do not store payment card data in this database. In addition, we use industry-standard password hashing to protect passwords. **Nevertheless, we recommend that you change your password as a precaution. To change your password, please visit: https://www.neilhosting.net/users/edit**\\n\\nWe do not have any evidence that this data was accessed, and we have taken steps to remove it from the Internet. However, we also have no way to prove that the data was not accessed.\\n\\n\x3c!--truncate--\x3e\\n\\n## What data was publicly accessible?\\n\\n- Information in User Profiles for all conventions hosted on this instance, which may include names, addresses, phone numbers, email addresses, birth dates (if provided), etc:\\n  - These conventions include but are not limited to: Intercon, Festival of the LARPs, Bubble, SLAW, Summer Larpin\', Be-Con, NELCO, Winter Boffer Con, Wintercon, and others. Refer to https://www.neilhosting.net/pages/all-conventions for a more complete list.\\n- Encrypted passwords for all user accounts. Passwords are hashed and salted using the industry-standard bcrypt algorithm.\\n- Event proposals, signups, dropped events, individual event ratings (starred/hidden events), and all other data used in the signup system for Intercode-hosted conventions.\\n- Historical data from past conventions, including previous addresses, names, phone numbers, and anything else attendees might have entered into profiles and not updated on that convention site.\\n- Lists of user activity alerts set up by admins of current and prior conventions.\\n- Sales records for tickets and merchandise at current and past conventions.\\n\\n## How did this happen?\\n\\nPrior to resetting the Intercon U signups and schedule, Nat took a manual export of the full database for safety. This is outside our standard backup procedure, which uses Amazon\'s automated database snapshot feature and stores backups in a separate secure environment.\\n\\nThe manual export file stayed on Nat\'s computer while he developed the COVID mask protocol features for Intercode that we\'re currently using at Intercon U. When checking the new code into the repository, Nat accidentally included the export.\\n\\nThe day before Intercon U signups opened for the first round, while reviewing unrelated code in preparation for the signups opening, Nat noticed the file on Github and immediately began taking steps to remove it.\\n\\n## What are we doing about this?\\n\\nWe have purged all known copies of this file from the public Internet. We\'ve also reached out to the Consequences web team, who we believe accidentally received this file as part of their regular Intercode releases, and asked them to purge it from their systems. We also searched some of the places on the Internet where stolen data often appears to see if the Intercode export may have ended up there, and weren\'t able to find it.\\n\\nWe\'ve also added some additional protections to our code repository and data export process to make it much less likely that a similar incident could occur in the future.\\n\\nWe held a post-mortem meeting to discuss this incident and document it. The meeting notes are available at: https://docs.google.com/document/d/1hcVCF9wzqpTevZPlImRUjhTONp4hFqgjcQhWER4Ao7M/edit?usp=sharing\\n\\nWe\'re also sending this email to all Intercode users to let them know. **Again, we recommend that you change your password using the link above.**\\n\\nWe recognize the potential severity of this data exposure. We\'d like to apologize deeply. We understand the importance of data security, and we should not have allowed this to happen. Transparency is important to us, and if you have any questions about this, we\'d be more than happy to chat with you.\\n\\nNat Budin (he/him)<br />\\nDave Kapell (he/him)<br />\\nJae Hartwin (crow/crows)<br />\\nJohn Cooke (he/him)"},{"id":"/2022/01/18/graphql-cross-domain-security-issue-disclosure","metadata":{"permalink":"/blog/2022/01/18/graphql-cross-domain-security-issue-disclosure","editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/blog/blog/2022-01-18-graphql-cross-domain-security-issue-disclosure.md","source":"@site/blog/2022-01-18-graphql-cross-domain-security-issue-disclosure.md","title":"GraphQL Cross-Domain Security Issue Disclosure","description":"Hey all. This thing happened we should tell you about.","date":"2022-01-18T00:00:00.000Z","formattedDate":"January 18, 2022","tags":[{"label":"security","permalink":"/blog/tags/security"}],"readingTime":2.285,"hasTruncateMarker":true,"authors":[{"name":"Marleigh Norton","url":"https://github.com/marleighnorton","imageURL":"https://github.com/marleighnorton.png","key":"marleighnorton"},{"name":"Nat Budin","url":"https://github.com/nbudin","imageURL":"https://github.com/nbudin.png","key":"nbudin"},{"name":"Dave Kapell","url":"https://github.com/dkapell","imageURL":"https://github.com/dkapell.png","key":"dkapell"},{"name":"Jae Hartwin","url":"https://github.com/jhartwin","imageURL":"https://github.com/jhartwin.png","key":"jaelen"}],"frontMatter":{"title":"GraphQL Cross-Domain Security Issue Disclosure","tags":["security"],"authors":["marleighnorton","nbudin","dkapell","jaelen"]},"unlisted":false,"prevItem":{"title":"Database Export Security Issue Disclosure","permalink":"/blog/2022/12/02/database-export-security-disclosure"},"nextItem":{"title":"Email forwarding","permalink":"/blog/2020/03/15/email-forwarding"}},"content":"Hey all. This thing happened we should tell you about.\\n\\nWhile performing platform upgrades, we found a bug in Intercode, the website code used by conventions such as Intercon. It has since been fixed.\\n\\nThis bug created an exploit where people with leadership access to one Intercode convention could use certain permissions on any convention. As a reminder, not even admins have access to your passwords or financial information.\\n\\nDue to the technical complexity of accessing the exploit and the small number of people who had the permissions required to take advantage of this, we don\u2019t think it was used, but can\u2019t prove it.\\n\\n\x3c!--truncate--\x3e\\n\\n## What Happened?\\n\\nIt\u2019s technically possible con leadership from one convention looked at or modified information for conventions they should not have had access to. We don\u2019t think anyone did, and it\u2019s since been fixed, but here\u2019s the low down.\\n\\nThere\u2019s a function called \u201cBecome user\u201d which certain people on the convention team have permissions for. Just like it sounds, it lets people see the convention website as if they were logged in as the selected user. It\u2019s used for things like running the convention, debugging, and accessing the website on behalf of a user at their request. It does not allow access to anyone\u2019s passwords or payment information.\\n\\nThis permission is fairly restricted and convention specific. That being said, if you had Become user permissions on one convention using Intercode, it turns out there was a way to then Become user on any Intercode convention. It would involve coding and would not be easy, but it was possible. For example, someone with admin access to Intercon S could have accessed admin functions on Be-Con 2019, including viewing and modifying event and attendee data.\\n\\n## What Are We Doing About This?\\n\\nThe bug has been fixed and the exploit is gone. We\u2019ve also reviewed the list of people who have Become user permissions on any Intercode site. Considering the difficulty of finding the exploit, the technical expertise required to use it, and the limited set of people who have the necessary permissions, we think it\u2019s really unlikely anyone did so. That being said, we can\u2019t prove a negative.\\n\\nA post-mortem was held to document the exploit, which you can find at: https://docs.google.com/document/d/1Ov8jFIpExWn-elUBXtRd22BwoIQGSbWMFio_iTL9IRM/edit?usp=sharing. It includes timelines and technical details for the interested.\\n\\nAnd of course, we\u2019re now telling you about it. We take the safety and security of our community very seriously, which means owning up to our mistakes. We apologize this happened at all, and we\'re even more sorry it took us so long to notice it.\\n\\nThanks for your faith in us.\\n\\nThe Intercode Team<br />\\nNat Budin (he/him)<br />\\nDave Kapell (he/him)<br />\\nJae Hartwin (they/them)<br />\\nMarleigh Norton (she/her)"},{"id":"/2020/03/15/email-forwarding","metadata":{"permalink":"/blog/2020/03/15/email-forwarding","editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/blog/blog/2020-03-15-email-forwarding.md","source":"@site/blog/2020-03-15-email-forwarding.md","title":"Email forwarding","description":"Intercode can now forward emails recieved by a convention domain to appropriate staff members. For example, if your convention is hosted at 2020.example.com, and you have a staff position called Webmaster whose contact email is set as webmaster@2020.example.com, Intercode can now automatically forward emails received at that address to all the people in that staff position.","date":"2020-03-15T00:00:00.000Z","formattedDate":"March 15, 2020","tags":[{"label":"changelog","permalink":"/blog/tags/changelog"}],"readingTime":0.61,"hasTruncateMarker":false,"authors":[{"name":"Nat Budin","url":"https://github.com/nbudin","imageURL":"https://github.com/nbudin.png","key":"nbudin"}],"frontMatter":{"title":"Email forwarding","tags":["changelog"],"authors":["nbudin"]},"unlisted":false,"prevItem":{"title":"GraphQL Cross-Domain Security Issue Disclosure","permalink":"/blog/2022/01/18/graphql-cross-domain-security-issue-disclosure"},"nextItem":{"title":"SMS Notifications","permalink":"/blog/2020/01/27/sms-notifications"}},"content":"Intercode can now forward emails recieved by a convention domain to appropriate staff members. For example, if your convention is hosted at 2020.example.com, and you have a staff position called Webmaster whose contact email is set as webmaster@2020.example.com, Intercode can now automatically forward emails received at that address to all the people in that staff position.\\n\\nAdditionally, staff positions can now have CC addresses (which will also receive email sent to that staff position) and aliases (additional email addresses that can be used to contact that staff position).\\n\\nIn order to take advantage of this feature, conventions will need to set the MX record on their domain name appropriately. If you\'d like to do this, please contact us at hosting@neilhosting.net for instructions!"},{"id":"/2020/01/27/sms-notifications","metadata":{"permalink":"/blog/2020/01/27/sms-notifications","editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/blog/blog/2020-01-27-sms-notifications.md","source":"@site/blog/2020-01-27-sms-notifications.md","title":"SMS Notifications","description":"Intercode is now able to send SMS (text message) notifications! For conventions that keep online event signups open during the con itself, Intercode will deliver notifications of signups, withdrawals, and waitlist pulls starting 24 hours before the start of the convention. The text of notifications is customizable via the \\"Notification templates\\" feature in the Admin section.","date":"2020-01-27T00:00:00.000Z","formattedDate":"January 27, 2020","tags":[{"label":"changelog","permalink":"/blog/tags/changelog"}],"readingTime":0.4,"hasTruncateMarker":false,"authors":[{"name":"Nat Budin","url":"https://github.com/nbudin","imageURL":"https://github.com/nbudin.png","key":"nbudin"}],"frontMatter":{"title":"SMS Notifications","tags":["changelog"],"authors":["nbudin"]},"unlisted":false,"prevItem":{"title":"Email forwarding","permalink":"/blog/2020/03/15/email-forwarding"},"nextItem":{"title":"New Intercode Schedule Design","permalink":"/blog/2019/10/03/new-intercode-schedule-design"}},"content":"Intercode is now able to send SMS (text message) notifications! For conventions that keep online event signups open during the con itself, Intercode will deliver notifications of signups, withdrawals, and waitlist pulls starting 24 hours before the start of the convention. The text of notifications is customizable via the \\"Notification templates\\" feature in the Admin section.\\n\\nUsers can opt out of SMS notifications via a new setting in their user profile for a convention. Texts will come from 415-NEIL-010 (415-634-5010)."},{"id":"/2019/10/03/new-intercode-schedule-design","metadata":{"permalink":"/blog/2019/10/03/new-intercode-schedule-design","editUrl":"https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/blog/blog/2019-10-03-new-intercode-schedule-design/index.md","source":"@site/blog/2019-10-03-new-intercode-schedule-design/index.md","title":"New Intercode Schedule Design","description":"We\'re rolling out some changes to how the schedule and run buckets display in Intercode 2. Here\u2019s the highlights:","date":"2019-10-03T00:00:00.000Z","formattedDate":"October 3, 2019","tags":[{"label":"changelog","permalink":"/blog/tags/changelog"}],"readingTime":1.59,"hasTruncateMarker":true,"authors":[{"name":"Marleigh Norton","url":"https://github.com/marleighnorton","imageURL":"https://github.com/marleighnorton.png","key":"marleighnorton"},{"name":"Nat Budin","url":"https://github.com/nbudin","imageURL":"https://github.com/nbudin.png","key":"nbudin"},{"name":"Dave Kapell","url":"https://github.com/dkapell","imageURL":"https://github.com/dkapell.png","key":"dkapell"}],"frontMatter":{"title":"New Intercode Schedule Design","tags":["changelog"],"authors":["marleighnorton","nbudin","dkapell"]},"unlisted":false,"prevItem":{"title":"SMS Notifications","permalink":"/blog/2020/01/27/sms-notifications"}},"content":"We\'re rolling out some changes to how the schedule and run buckets display in Intercode 2. Here\u2019s the highlights:\\n\\n\x3c!--truncate--\x3e\\n\\n## Schedule\\n\\n- Instead of having a thin green bar that empties as people sign up for an event, the event will have rounded ends, and act as a progress bar that goes up as people sign up. Once the event is full, it will be lightened to show that it is full.\\n- Events that have unlimited slots will remain rectangular, and have a gradient background to show that you can sign up for them.\\n- Events that have no slots (i.e. consuite) will remain rectangular, and have a solid background.\\n- The \\"you are signed up for this game\\" has changed to a user/head icon instead of the checkbox that looked like an interactive element.\\n- The concom only \\"Schedule With Counts\\" view has been updated to show the percentage of signups in the same style, as a background progress bar on each event.\\n- The sorting of events on the schedule has been updated to better group multiple runs of events together if they\u2019re sequential.\\n\\n### Schedule Legend Example\\n\\n![The new schedule legend view, showing examples of types of event](news_20191003_legend.png)\\n\\n## Signup Buckets\\n\\n- Instead of having a broken line that turns from colored segments to gray, we\u2019re displaying a set of empty circles that get replaced by the same user/head icon that we use on the schedule as people sign up. This should be easier to read at a glance.\\n- When you click on a run in the schedule view, the same set of circles/heads are displayed there as well.\\n\\n### Signup Bucket Examples\\n\\n![The view of an event run from its event page, showing the lines of empty circles for open slots](news_20191003_run.png)\\n\\n![The view of an event run from the schedule grid, showing the reorganized popup view with lines of empty circles](news_20191003_popup.png)"}]}')}}]);