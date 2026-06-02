# cloudfront-og-router

Lambda@Edge origin-request handler that routes CloudFront traffic to the
appropriate Intercode endpoint based on whether the request is from a crawler.

## How it works

| Request type             | Rewrites to                          |
| ------------------------ | ------------------------------------ |
| Known crawler User-Agent | `GET /og-shell?path=<original-path>` |
| Everyone else            | `GET /cdn-spa-shell`                 |

`/og-shell` returns a minimal HTML document with per-resource Open Graph tags
(event title/description, page `cached_og_description`, convention OG image).

`/cdn-spa-shell` returns a lightweight SPA shell with convention-level OG only
and no per-path DB lookups — suitable for long-term CDN caching.

## CloudFront distribution setup

The function attaches to the **origin request** event of the **default cache
behaviour** (i.e. the catch-all for SPA routes). More-specific behaviours must
be defined first so they take precedence:

| Path pattern            | Origin        | Lambda@Edge                    | Cache TTL                                   |
| ----------------------- | ------------- | ------------------------------ | ------------------------------------------- |
| `/packs/*`              | Assets server | None                           | Long (immutable)                            |
| `/client_configuration` | Rails         | None                           | No cache                                    |
| `/authenticity_tokens`  | Rails         | None                           | No cache                                    |
| `/oauth_session/*`      | Rails         | None                           | No cache                                    |
| `/og-shell`             | Rails         | None                           | Medium (keyed on `path` query param + Host) |
| `/cdn-spa-shell`        | Rails         | None                           | Long (keyed on Host)                        |
| `*` (default)           | Rails         | This function (origin request) | Long (keyed on Host)                        |

### Cache key notes

- `/cdn-spa-shell`: include the `Host` header in the cache key (content varies
  per convention domain). TTL of several hours is fine — cache is busted
  whenever the convention's name or OG image changes by deploying a new
  container.
- `/og-shell`: include `Host` + the `path` query parameter. TTL of ~1 hour is
  reasonable; `cached_og_description` is refreshed in the background on each
  page save.
- Default behaviour: long TTL is fine since the function always rewrites to one
  of the above two cached paths.

## Deployment

The function must be deployed to **us-east-1** (Lambda@Edge requirement) and
associated with the CloudFront distribution. No dependencies — zip just
`index.mjs` and `package.json`.

Runtime: `nodejs22.x`
Handler: `index.handler`
