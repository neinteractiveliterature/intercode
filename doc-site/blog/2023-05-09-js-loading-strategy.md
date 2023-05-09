---
title: How Intercode builds and loads JavaScript
tags: ['tech']
authors: ['nbudin']
---

Intercode is a Ruby on Rails application with a (mostly) single-page app frontend. Virtually all "pages" in the web
application are resolved and rendered on the frontend using [react-router](https://reactrouter.com/). These pages then
load the data they need using Intercode's GraphQL API, which is implemented on the Rails server side using
[graphql-ruby](https://graphql-ruby.org).

Intercode doesn't follow the recommended strategy for JavaScript loading in Rails applications. This blog post is an
attempt to explain why, and what we do instead.

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

Decoupling Rails from the JavaScript frontend would allow us to continue keeping Rails up to date without having to
rethink our JavaScript build strategy every time the Rails core team changed its mind about the best way to integrate
Rails with JavaScript. This was important for us, because Rails updates often contain urgent security fixes and we want
to be able to take those as quickly as possible.
