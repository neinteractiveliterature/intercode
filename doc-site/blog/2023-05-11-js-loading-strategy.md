---
title: How Intercode builds and loads JavaScript
tags: ['tech']
authors: ['nbudin']
---

Intercode is an open source Ruby on Rails application with a (mostly) single-page app frontend. Virtually all "pages" in
the web application are resolved and rendered on the frontend using [react-router](https://reactrouter.com/). These
pages then load the data they need using Intercode's GraphQL API, which is implemented on the Rails server side using
[graphql-ruby](https://graphql-ruby.org).

Intercode doesn't follow the recommended strategy for JavaScript loading in Rails applications. This blog post is an
attempt to explain why, and what we do instead.

<!--truncate-->

## Rails and JavaScript

JavaScript in Rails applications has a long and winding history. This isn't a comprehensive timeline, but a basic
outline of how things evolved follows:

- 2005: [The first stable Rails release](https://rubyonrails.org/2005/12/13/rails-1-0-party-like-its-one-oh-oh)
  came bundled with [Prototype.js](http://prototypejs.org/) and [Scriptaculous](http://script.aculo.us/).
- 2006: [Rails 1.1](https://rubyonrails.org/2006/3/28/rails-1-1-rjs-active-record-respond_to-integration-tests-and-500-other-things)
  added a feature called "RJS" which allowed Ruby developers to avoid writing JavaScript code for some common
  operations. Instead, developers could write Ruby code which generated JavaScript, which would be sent to the browser
  and executed on the fly.
- 2011: [Rails 3.1](https://rubyonrails.org/2011/5/22/rails-3-1-release-candidate) introduced the asset pipeline. Based
  on a library called Sprockets, the asset pipeline allows Rails applications to preprocess frontend assets such as
  JavaScript, CSS, and images. This made it much simpler for Rails applications to use languages that compile to
  JavaScript, and Rails encouraged this by recommending [CoffeeScript](https://coffeescript.org/) as a default.
- 2013: [Rails 4.0](https://rubyonrails.org/2013/6/25/Rails-4-0-final) introduced new caching features to speed up
  server-side rendering and added [Turbolinks](https://github.com/turbolinks/turbolinks-classic) as a default for new
  applications. The Rails 4.0 release notes explicitly discourage developers from writing single-page apps, instead
  recommending these new features as an alternative.
- 2017: [Rails 5.1](https://rubyonrails.org/2017/4/27/Rails-5-1-final) is released, with the headline "Loving
  JavaScript." Along with this release comes [Webpacker](https://github.com/rails/webpacker), a library for driving
  Webpack from the Rails server and integrating Webpack with the asset pipeline.
- 2021: In advance of the release of Rails 7, Rails founder David Heinemeier Hansson announces
  ["three great answers to JavaScript"](https://world.hey.com/dhh/rails-7-will-have-three-great-answers-to-javascript-in-2021-8d68191b).
  This announcement deprecates Webpacker and encourages developers to try using [Hotwire](https://hotwired.dev/), a
  framework that includes a revamped version of Turbolinks and does most rendering on the server side. It also
  introduces [jsbundling-rails](https://github.com/rails/jsbundling-rails) as a migration path for Webpacker users,
  albeit one that loses some functionality, such as the ability to use webpack-dev-server.

One consistent theme running throughout this history is that **Rails has tried to make JavaScript as optional as possible**.
This makes sense from a perspective of onboarding new developers: learning Ruby, HTML, and (potentially) CSS is enough
without having to also learn JavaScript.

On the other hand, for Rails developers who have made the choice to embrace a frontend framework such as React, Vue, or
Ember.js, this can make Rails upgrades difficult, particularly in recent years with the introduction and then
deprecation of Webpacker. There are even official forks such as [Shakapacker](https://github.com/shakacode/shakapacker)
which aim to provide a smooth path forward for people who built apps on top of Webpacker.

## Going a different way

For me, Rails 7 was the culmination of what I saw as a pattern of decades of efforts by the Rails core team to steer
developers away from writing JavaScript frontends for API-only Rails applications. I tried out both jsbundling-rails
and the import maps path outlined in the "three great answers" blog post, and didn't find either of them to be great
developer experiences in Intercode. (The blog post pretty much says this is the case for import maps in fully
React-based apps, and for me, the lack of webpack-dev-server support in jsbundling-rails made it significantly slower
and more resource-intensive to develop with.)

What Intercode ideally needed was a solution that:

- Decouples Rails from the JavaScript frontend as much as possible
- Supports a single-repo build and deploy strategy, so that the backend and frontend can be deployed in tandem
- Keeps the local development experience responsive and easy to work with
- Works well in both a CDN-backed setup as well as a single-server, non-CDN setup (because NEIL's installation of
  Intercode uses the Amazon CloudFront CDN, but Consequences' uses a single server)
- Allows browser caching to work for compiled JavaScript and CSS bundles

Decoupling Rails from the JavaScript frontend would allow us to continue keeping Rails up to date without having to
rethink our JavaScript build strategy every time the Rails core team changed its mind about the best way to integrate
Rails with JavaScript. This was important for us, because Rails updates often contain urgent security fixes and we want
to be able to take those as quickly as possible.

## Without further ado

Here's how we do it in Intercode.

Intercode uses plain old off-the-shelf Webpack to build its JavaScript bundles. We use Webpack's built-in ability to
add fingerprint hashes to the end of built asset filenames for easy caching, just like what the Rails asset pipeline
does by default.

The only exception to this fingerprint hashing is a small set of JavaScript entry points. Here's a slightly abbreviated
version of the section of our webpack.config.js that sets this up:

```js
entry: {
  application: './app/javascript/packs/applicationEntry.ts',
  'application-styles': './app/javascript/packs/applicationStyles.ts',
},
output: {
  filename: '[name].js',
  chunkFilename: '[name]-[chunkhash].chunk.js',
}
```

Because of this configuration, all built JavaScript files will have a chunk hash in the filename, except the
`application.js` and `application-styles.js` files. Because of this, Rails doesn't need any kind of integration with
Webpack - we can simply hard-code a JavaScript path in our Rails templates. Here's an excerpt from our global template:

```erb
<% if ENV['ASSETS_HOST'].present? -%>
  <script type="application/javascript">
    window.intercodeAssetsHost = <%=raw ENV['ASSETS_HOST'].to_json %>;
  </script>
<% end -%>
<%= javascript_include_tag url_with_possible_host('/packs/application.js', ENV['ASSETS_HOST']), defer: true, type: 'module' %>
```

There are a bunch of shenanigans going on here with the asset host, but let's simplify this and assume that we're using
a simple, single-server Intercode setup. In this setup, the `ASSETS_HOST` environment variable would not be set.
Effectively, this snippet of template code would behave like this code:

```erb
<%= javascript_include_tag '/packs/application.js', defer: true, type: 'module' %>
```

No fingerprint needed - all we need to do is have Webpack compile into `/public/packs/application.js` in the root of the
Rails application, and Rails can hardcode the path to it and serve the files statically.

The actual contents of these entry point files are relatively tiny. Here's the effective version of
`applicationEntry.ts`, with all the code it imports shown inline instead:

```ts
if (window.intercodeAssetsHost) {
  __webpack_public_path__ = `//${window.intercodeAssetsHost}/packs/`;
}

import(/* webpackChunkName: 'applicationStylesheet' */ '../styles/application.scss');
import(/* webpackChunkName: 'bootstrap-js' */ 'bootstrap');
import(/* webpackChunkName: "application-main" */ './application');
```

The heavy lifting here is done by the `import` function, which is specified in the
[ECMAScript Dynamic Import proposal](https://tc39.es/proposal-dynamic-import/) and implemented by Webpack as
[part of its code splitting features](https://webpack.js.org/guides/code-splitting/#dynamic-imports). Behind the
scenes, Webpack adds a small function that allows it to dynamically load other modules on demand, as well as a data
structure that contains the fingerprint hashes of all modules that resulted from this build. This effectively makes
the application entry point into a kind of manifest file that has all the relevant information about the contents of
this Webpack build.

The net effect of this is:

1. Rails renders a hardcoded `<script>` tag into HTML templates that points at a known, non-fingerprinted location.
2. The user's web browser loads the entry point JS file from that location.
3. When the entry point JS executes, its dynamic import statements point it at the fingerprinted URLs for the actual
   asset bundles for the main application code.

### Caching, and not caching

For this setup to perform well, it's very important that two things are true:

1. Asset URLs with fingerprints in them get cached
2. Asset URLs without fingerprints in them don't get cached

The reason for caching URLs with fingerprints in them is straightforward: we don't want the user to be re-downloading
large chunks of JavaScript and CSS on every page load. The reason for _not_ caching URLs without fingerprints in them
is perhaps less obvious, but it's critical for the site to function correctly: if there has been a new deploy of
frontend code, we want users to get the new version the next time they do a page load.

Because the entry point file is effectively a manifest of all built asset hashes, loading the entry point is all that's
needed to let the browser do the right thing for loading the rest of the build. If the fingerprints haven't changed,
and there's already a copy of those files in its local cache, the browser doesn't need to do anything - it can use the
copy it's already got. If they have changed, the URLs they're loaded from have changed and therefore the browser won't
use a cached copy.

The tradeoff here is that the entry point file has to be reloaded on every page load. For that reason, we try to keep
it as small as possible. The [current production version](https://assets.neilhosting.net/packs/application.js) as of
this writing is a little over 9KB, and if the browser supports gzip compression (which
[effectively all browsers do](https://caniuse.com/sr_content-encoding-gzip)) it will only end up transferring around
5KB.

To make sure the entry point files never get cached, we use a small bit of custom Rack middleware in the Rails app:

```ruby
# adapted from https://stackoverflow.com/a/52848885
module Intercode
  class DisableCachingForSpecificAssets
    attr_reader :app, :asset_paths

    def initialize(app, asset_paths)
      @app = app
      @asset_paths = Set.new(asset_paths)
    end

    def call(env)
      # Let the next middleware classes & app do their thing first…
      status, headers, response = app.call(env)

      # …and modify the response if a cache-disabled asset was fetched.
      if asset_paths.include?(env['REQUEST_PATH'])
        headers['Cache-Control'] = 'no-cache'
        headers.except!('Expires')
      end

      [status, headers, response]
    end
  end
end
```

This middleware is loaded in `config/environments/production.rb`:

```ruby
if ENV["RAILS_SERVE_STATIC_FILES"].present?
  config.middleware.insert_before ActionDispatch::Static,
                                  Intercode::DisableCachingForSpecificAssets,
                                  JSON.parse(File.read(File.expand_path("config/nocache-files.json", Rails.root)))
end
```

This code reads a list of paths to disable caching on from `config/nocache-files.json`, which contains this:

```json
["/packs/application.js", "/packs/application-styles.js"]
```

(The reason we split out the list of entry points into a separate JSON file is to support a workflow used by the
Consequences team to support the [Consequences larp conventions](https://www.consequences.org.uk/) as well as other
UK-based larp events. This team runs a separate nginx container to serve assets. That workflow needs to dynamically
generate an nginx config file that says which paths to send the `Cache-Control: no-cache` header on. We want to make
sure that the Rails app and the nginx container stay in sync with one another, so we use the JSON file as a single
source of truth for both of them.)

### Client auto-reload

This setup also enables one other cool feature: it's possible for the frontend code in the browser to check whether or
not it's running out-of-date JavaScript. We can do this by making a HEAD request to the path of the application.js
entry point:

```js
const response = await fetch(`${__webpack_public_path__ ?? '/packs/'}application.js`, {
  method: 'HEAD',
  cache: 'no-store',
});
```

We can then use this response to check whether certain headers are the same as the last time we did this request. In
particular, Intercode checks the `Last-Modified`, `ETag`, and `Content-Length` headers of the entry point. If any of
those have changed, it considers the code it's running to be outdated. The full implementation of this is a little too
long to paste in here, but [here's a link to the full implementation](https://github.com/neinteractiveliterature/intercode/blob/07df0692f1b9473510db5a575268ffa74f75d92c/app/javascript/checkAppEntrypointHeadersMatch.ts).

There are a few situations where Intercode checks whether or not it's running outdated code, but the most common one
is during page transitions. We've set up a hook on the React Router location, and whenever it changes, we run this
check. If the code is outdated, we do a `window.location.reload()`.

Forcing a page reload can be a dangerous operation. If there's unsaved data in memory, reloading the page clears it
out. To ensure this is safe in Intercode, we only change the URL location _after_ data has been successfully saved to
the server. For example, when creating a new staff position, the flow goes like this:

1. Go to `/staff_positions/new`, which renders a blank form for the user to fill out.
2. The user fills out the form and presses "Submit".
3. The frontend code does a GraphQL request using the `createStaffPosition` mutation.
4. Only after it returns a successful response, transition to the `/staff_positions` page.
5. Because the location is changed, check whether we're running outdated code. If so, reload the page.

Reloading the page in the last step is safe because we only change locations after the GraphQL request responds
successfully.

## Conclusion

The approach of using a minimal, uncached, stub entry point with a predictable URL works well for Intercode. With this
strategy, we're able to decouple the backend server from the frontend application, ensuring that it's possible for us to
upgrade Rails without the possibility of breaking our JavaScript stack.

This approach is probably not right for every web application, or even every Rails application, but I do think it's a
useful approach for Rails apps where:

- The frontend code is largely responsible for rendering HTML, and talks to the server over some kind of API (REST,
  GraphQL, etc.)
- The frontend code is built using a bundler, such as Webpack, which supports dynamic imports
