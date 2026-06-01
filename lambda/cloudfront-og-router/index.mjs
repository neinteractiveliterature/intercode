// Lambda@Edge origin-request handler for Intercode CloudFront distribution.
//
// CloudFront behaviour: attach to the default cache behaviour, which only
// fires after all more-specific behaviours (Rails routes, /packs/*, /og-shell,
// /cdn-spa-shell, etc.) have already been evaluated and not matched.
//
// Logic:
//   - Known crawler User-Agents  →  /og-shell?path=<original-path>
//   - Everyone else              →  /cdn-spa-shell

const CRAWLER_UA_RE =
  /Googlebot|bingbot|DuckDuckBot|YandexBot|Baiduspider|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Discordbot|Slackbot|Applebot|Embedly|Pinterest/i;

// Paths that belong to the underlying Rails app and must never be rewritten.
// This mirrors the specific CloudFront behaviours defined in the Terraform
// module and acts as a safety net if a new route is added without a
// corresponding behaviour.
const RAILS_PATH_RE =
  /^\/(users|oauth|oauth_session|authenticity_tokens|client_configuration|graphql|graphiql|email_forwarders|sns_notifications|stripe_webhook|stripe_account|healthz|sitemap\.xml|reports|calendars|csv_exports|user_con_profiles|rails|uploads|packs|cdn-spa-shell|og-shell)(\/|$)/;

export const handler = async (event) => {
  const { request } = event.Records[0].cf;
  const ua = request.headers["user-agent"]?.[0]?.value ?? "";
  const originalPath = request.uri;

  if (RAILS_PATH_RE.test(originalPath)) {
    return request;
  }

  if (CRAWLER_UA_RE.test(ua)) {
    request.uri = "/og-shell";
    request.querystring = `path=${encodeURIComponent(originalPath)}`;
  } else {
    request.uri = "/cdn-spa-shell";
    request.querystring = "";
  }

  return request;
};
