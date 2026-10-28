import cf from 'cloudfront';

// CloudFront Function, viewer-request, JavaScript runtime 2.0, for distributions whose default origin is the static
// shell bucket (the framework-mode build; see static_shell_bucket_domain_name in variables.tf). Attached to the default
// cache behavior, which only sees SPA routes: the more specific behaviors take precedence.
//
//   - Rails paths and known crawler User-Agents  ->  the Rails origin (crawlers get /og-shell?path=<original-path>)
//   - Everyone else                              ->  /index.html in the bucket
//
// This runs before the cache lookup, so the rewritten URI and query string are what key the cache. A crawler's response
// can therefore never be served to a browser, or the reverse. Rails picks the convention from the Host header, which an
// S3 origin can't be sent, so the viewer's Host is passed to the Rails origin explicitly.

// BEGIN GENERATED from routing.json by script/genRouting.mjs (yarn routing:codegen). Do not edit.
var CRAWLER_UA_RE =
  /Googlebot|bingbot|DuckDuckBot|YandexBot|Baiduspider|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Discordbot|Slackbot|Applebot|Embedly|Pinterest/i;

// Paths that Rails answers: its own routes and the shells
var RAILS_PATH_RE =
  /^(?:\/authenticity_tokens|\/client_configuration|\/graphql|\/graphiql|\/sns_notifications|\/healthz|\/sitemap\.xml|\/cdn-spa-shell|\/og-shell)$|^(?:\/users\/|\/oauth\/|\/oauth_session\/|\/email_forwarders\/|\/stripe_webhook\/|\/stripe_account\/|\/reports\/|\/calendars\/|\/csv_exports\/|\/user_con_profiles\/|\/rails\/active_storage\/|\/uploads\/)/;

// Paths that the default origin (the static shell bucket) answers as they are
var ASSET_PATH_RE = /^(?:\/packs\/|\/assets\/)/;
// END GENERATED

function toRails(request) {
  var host = request.headers.host ? request.headers.host.value : '';
  cf.selectRequestOriginById('rails', host ? { hostHeader: host } : {});
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- CloudFront calls this entry point
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (RAILS_PATH_RE.test(uri)) {
    toRails(request);
    return request;
  }

  if (ASSET_PATH_RE.test(uri)) {
    return request;
  }

  var userAgent = request.headers['user-agent'] ? request.headers['user-agent'].value : '';

  if (CRAWLER_UA_RE.test(userAgent)) {
    toRails(request);
    request.uri = '/og-shell';
    request.querystring = { path: { value: encodeURIComponent(uri) } };
  } else {
    // Dropping the query string keeps tracking parameters from fragmenting the cache
    request.uri = '/index.html';
    request.querystring = {};
  }

  return request;
}
