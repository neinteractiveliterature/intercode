// CloudFront Function, viewer-request, JavaScript runtime 2.0. Attached to the distribution's default cache behavior,
// which only sees SPA routes: more specific behaviors (Rails routes, /packs/*, /og-shell, /cdn-spa-shell) take
// precedence.
//
//   - Known crawler User-Agents  ->  /og-shell?path=<original-path>
//   - Everyone else              ->  /cdn-spa-shell
//
// This runs before the cache lookup, so the rewritten URI and query string are what key the cache (see the
// default_router cache policy). A crawler's response can therefore never be served to a browser, or the reverse.

// BEGIN GENERATED from routing.json by script/genRouting.mjs (yarn routing:codegen). Do not edit.
var CRAWLER_UA_RE =
  /Googlebot|bingbot|DuckDuckBot|YandexBot|Baiduspider|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Discordbot|Slackbot|Applebot|Embedly|Pinterest/i;

// Paths that belong to Rails, the assets origin or the shells, and must never be rewritten
var BYPASS_PATH_RE =
  /^(?:\/authenticity_tokens|\/client_configuration|\/graphql|\/graphiql|\/sns_notifications|\/healthz|\/sitemap\.xml|\/cdn-spa-shell|\/og-shell)$|^(?:\/users\/|\/oauth\/|\/oauth_session\/|\/email_forwarders\/|\/stripe_webhook\/|\/stripe_account\/|\/reports\/|\/calendars\/|\/csv_exports\/|\/user_con_profiles\/|\/rails\/active_storage\/|\/uploads\/|\/packs\/|\/assets\/)/;
// END GENERATED

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- CloudFront calls this entry point
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (BYPASS_PATH_RE.test(uri)) {
    return request;
  }

  var userAgent = request.headers['user-agent'] ? request.headers['user-agent'].value : '';

  if (CRAWLER_UA_RE.test(userAgent)) {
    request.uri = '/og-shell';
    request.querystring = { path: { value: encodeURIComponent(uri) } };
  } else {
    // Dropping the query string keeps tracking parameters from fragmenting the cache
    request.uri = '/cdn-spa-shell';
    request.querystring = {};
  }

  return request;
}
