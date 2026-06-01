// Lambda@Edge origin-request handler for Intercode CloudFront distribution.
//
// CloudFront behaviour: attach to the default cache behaviour (catches all SPA
// routes after more-specific behaviours for /packs/*, /client_configuration,
// /authenticity_tokens, /oauth_session/*, /og-shell, /cdn-spa-shell, etc. have
// already been defined).
//
// Logic:
//   - Known crawler User-Agents  →  /og-shell?path=<original-path>
//   - Everyone else              →  /cdn-spa-shell

const CRAWLER_UA_RE =
  /Googlebot|bingbot|DuckDuckBot|YandexBot|Baiduspider|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Discordbot|Slackbot|Applebot|Embedly|Pinterest/i;

export const handler = async (event) => {
  const { request } = event.Records[0].cf;
  const ua = request.headers["user-agent"]?.[0]?.value ?? "";
  const originalPath = request.uri;

  if (CRAWLER_UA_RE.test(ua)) {
    request.uri = "/og-shell";
    request.querystring = `path=${encodeURIComponent(originalPath)}`;
  } else {
    request.uri = "/cdn-spa-shell";
    request.querystring = "";
  }

  return request;
};
