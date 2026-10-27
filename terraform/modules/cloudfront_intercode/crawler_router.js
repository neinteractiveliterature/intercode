// CloudFront Function, viewer-request, JavaScript runtime 2.0. Attached to the distribution's default cache behavior,
// which only sees SPA routes: more specific behaviors (Rails routes, /packs/*, /og-shell, /cdn-spa-shell) take
// precedence.
//
//   - Known crawler User-Agents  ->  /og-shell?path=<original-path>
//   - Everyone else              ->  /cdn-spa-shell
//
// This runs before the cache lookup, so the rewritten URI and query string are what key the cache (see the
// default_router cache policy). A crawler's response can therefore never be served to a browser, or the reverse.

var CRAWLER_UA_RE =
  /Googlebot|bingbot|DuckDuckBot|YandexBot|Baiduspider|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Discordbot|Slackbot|Applebot|Embedly|Pinterest/i;

// Paths that belong to the underlying Rails app and must never be rewritten. This mirrors the specific CloudFront
// behaviors defined in main.tf and acts as a safety net if a new route is added without a corresponding behavior.
var RAILS_PATH_RE =
  /^\/(users|oauth|oauth_session|authenticity_tokens|client_configuration|graphql|graphiql|email_forwarders|sns_notifications|stripe_webhook|stripe_account|healthz|sitemap\.xml|reports|calendars|csv_exports|user_con_profiles|rails|uploads|packs|cdn-spa-shell|og-shell)(\/|$)/;

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- CloudFront calls this entry point
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (RAILS_PATH_RE.test(uri)) {
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
