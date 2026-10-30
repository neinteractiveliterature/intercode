---
sidebar_position: 1
---

# Deploying Intercode

This is for people running their own Intercode, with the published Docker images. It covers the framework-mode build
(the React Router single-page app that `yarn build:framework` makes) and the nginx configuration that serves it.
[`docker-compose.example.yml`](pathname:///deploying/docker-compose.example.yml) (with its [`example.env`](pathname:///deploying/example.env)) is a complete working example.

For CloudFront and S3 instead of nginx, see [terraform/modules/cloudfront_intercode](https://github.com/neinteractiveliterature/intercode/blob/main/terraform/modules/cloudfront_intercode/README.md).
Both are built from the same route list (`terraform/modules/cloudfront_intercode/routing.json`), so they send the same
requests to the same places.

## What runs

| Piece      | Image                                                        | What it does                                                                                                                                   |
| ---------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Rails**  | `ghcr.io/neinteractiveliterature/intercode`                  | The API (`/graphql`), sign-in, uploads, and the pages that need per-page metadata for link previews (`/og-shell`). It needs PostgreSQL and S3. |
| **web**    | `ghcr.io/neinteractiveliterature/intercode-assets-framework` | nginx. Serves the static build (`index.html` and the hashed files in `assets/`), proxies Rails' routes to Rails, and sends crawlers to Rails.  |
| PostgreSQL | `postgres`                                                   | The database.                                                                                                                                  |

Visitors talk to **web**, never to Rails directly. Intercode only works over HTTPS (Rails forces SSL, and the refresh-token
cookie has a `__Host-` prefix), so put a TLS-terminating proxy or load balancer in front of web that sends
`X-Forwarded-Proto: https`. web passes that header on, and passes the original `Host` header on too, which is how Rails
picks the convention for a request.

## Images and tags

Every commit on `main` is built as a `:<commit sha>` tag. A GitHub release adds `:<release name>` (for example `:8.7.0`)
and `:latest`.

| Image                        | Tags                              | Notes                                                                                                                                                                                       |
| ---------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `intercode`                  | `:<sha>`, `:<release>`, `:latest` | The Rails app.                                                                                                                                                                              |
| `intercode-assets-framework` | `:<sha>`, `:<release>`, `:latest` | The framework-mode build and nginx. Only built when the repository variable `BUILD_FRAMEWORK` is set. **This image is renamed `intercode-assets` when framework mode becomes the default.** |
| `intercode-assets`           | `:<sha>`, `:<release>`, `:latest` | The previous, non-framework build's assets, until that cutover.                                                                                                                             |

Run both images at the **same tag**. The shell and the Rails API are released together, and mixing versions is not
supported.

## Configuration

| Variable                                                                       | Container                         | Meaning                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------ | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ASSETS_HOST`                                                                  | **Rails and web, the same value** | Where browsers load the build's files from: a bare host name, optionally with a port (`assets.example.org`), no scheme. **Empty or unset serves the files from the same domain as the app**, which is what nginx does on its own. See below. |
| `RAILS_UPSTREAM`                                                               | web                               | `host:port` of Rails (for example `rails:3000`). Turns the container into the front server described below. Without it, the container only serves the build.                                                                                 |
| `INTERCODE_HOST`                                                               | Rails                             | The domain the root site is served from.                                                                                                                                                                                                     |
| `DATABASE_URL`                                                                 | Rails                             | The PostgreSQL connection URL.                                                                                                                                                                                                               |
| `SECRET_KEY_BASE`, `DEVISE_SECRET_KEY`                                         | Rails                             | Random secrets (`openssl rand -hex 64`). Changing them signs everyone out.                                                                                                                                                                   |
| `OPENID_CONNECT_SIGNING_KEY`                                                   | Rails                             | An RSA private key for signing OpenID Connect tokens, on one line with `\n` for line breaks.                                                                                                                                                 |
| `AWS_S3_BUCKET`, `AWS_S3_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Rails                             | Where uploaded files are stored. Rails won't boot without a bucket name.                                                                                                                                                                     |

`example.env` lists these with comments. Rails reads more variables (error reporting, email, Stripe and so on); see the
configuration files for them.

### `ASSETS_HOST` has to match on both

The build is made against a placeholder host, because the real one is only known when the container starts. When the web
container starts it takes a fresh copy of the build and replaces the placeholder in every file that mentions it
(`index.html`, the route manifest, the CSS) with `https://$ASSETS_HOST/`, or with `/` if `ASSETS_HOST` is empty. So:

- **One server, same-origin assets (the example).** Leave `ASSETS_HOST` empty everywhere.
- **A separate asset host.** Run the image a second time on that host, without `RAILS_UPSTREAM`, and give **both**
  containers the same `ASSETS_HOST`. If the asset host's container starts without it, its manifest points at the wrong
  place and the app won't boot. The asset host also answers with `Access-Control-Allow-Origin: *`, which convention
  domains need to load module scripts from it.

Forgetting `ASSETS_HOST` doesn't fail loudly: the files are just requested from the app's own domain.

## What the front server does

With `RAILS_UPSTREAM` set, web renders `docker-assets-framework/front-proxy.conf.template` into its nginx configuration
when it starts (`docker-assets-framework/40-substitute-assets-host.sh`).

| Request                                                                                                                                       | Goes to                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| The Rails routes in `routing.json` (`/graphql`, `/oauth_session/*`, `/client_configuration`, `/users/*`, `/rails/active_storage/*` and so on) | Rails, with `Host`, `X-Forwarded-For`, `X-Real-IP` and `X-Forwarded-Proto` set                                       |
| `/assets/*`                                                                                                                                   | Disk, with `Cache-Control: max-age` of 180 days and `Access-Control-Allow-Origin: *`. A missing file is a plain 404. |
| Any other path, from a user agent in the crawler list                                                                                         | Rails' `/og-shell?path=<the path>`, which returns a small HTML document with Open Graph tags for that event or page  |
| Any other path                                                                                                                                | `index.html`, with `Cache-Control: no-cache`                                                                         |

The crawler list (Googlebot, Slackbot, facebookexternalhit and so on) and the Rails route list are generated into
`terraform/modules/cloudfront_intercode/nginx/` by `yarn routing:codegen`; the image copies them in. To use the same
rules in your own nginx instead of this image, include `crawler-map.conf` in the `http` block and
`rails-locations.conf` in the `server` block, with an upstream called `rails` and a `proxy_params.conf`; the template
shows how they fit together.

### Differences from CloudFront

- **`og:url` is decoded.** nginx passes the path on percent-encoded and Rails decodes it, so `/events/a%20b/c` shows up
  as `/events/a b/c` in `og:url`. CloudFront keeps the `%20`. It makes no difference to the previews.
- **Special characters in crawled paths.** The path goes into the `path` query parameter as it arrived, so a path
  containing a literal `&` or `+` is cut short or read with a space. Such paths are not expected in practice.
- **No compression** is configured. Compress at the TLS proxy or CDN in front of web.
- **nginx looks up `RAILS_UPSTREAM` once, when it starts.** If Rails comes back at a different address, restart web.

## Moving a CloudFront deployment over

[the staged rollout guide](staged-rollout.md) describes switching convention domains from the Rails-rendered shell to the
static shell one at a time: the order, what to check, what to watch and how to roll back.

## Releases and stale pages

Everything in `assets/` is named by a hash of its contents and cached for 180 days. `index.html` is the one file whose
name doesn't change, so it isn't cached: browsers revalidate it, and a new release is picked up on the next page load.

A browser tab opened before a release may still ask for files that the new image doesn't have. The app recovers: when a
file the shell names fails to load it reloads once to get the current shell, and then shows a message with a reload
button if that doesn't help. The image can carry earlier releases' files forward to avoid even that (build it with
`--build-arg PREVIOUS_ASSETS_IMAGE=<an earlier image>`; `PREVIOUS_ASSETS_RETENTION_DAYS`, default 30, sets how long
they're kept), but the published images are not built that way, so **they contain only their own release's files**.
Deployers who care can build the image themselves with that argument, or keep the files in a bucket as the
CloudFront setup does.

The old non-framework build had a `nocache-files.json` list of files to serve uncached. That doesn't apply to the
framework build; `index.html` is the only such file.

## The example

Download [`docker-compose.example.yml`](pathname:///deploying/docker-compose.example.yml) and [`example.env`](pathname:///deploying/example.env) into an empty directory, then:

```sh
cp example.env .env          # fill it in: see the comments in the file
docker compose -f docker-compose.example.yml up
```

It runs PostgreSQL, loads the schema into an empty database, runs migrations, then starts Rails and web, which
listens on port 8080. Use a TLS-terminating proxy in front of it; to try it from the command line without one, send
the header yourself:

```sh
curl -H 'X-Forwarded-Proto: https' -H 'Host: intercode.example.org' http://localhost:8080/client_configuration
curl -A 'Twitterbot/1.0' -H 'X-Forwarded-Proto: https' -H 'Host: intercode.example.org' http://localhost:8080/events/1
```

The first is proxied to Rails and the second is the Open Graph document for a crawler; a browser's user agent on
the second gets the static shell.

Setting up a brand-new database is the one time the Rails image needs `psql`: on an empty database, `db:migrate` first
loads `db/structure.sql`, which Rails does by running `psql`. The image leaves `psql` out on purpose (it would add about
60 MB, mostly Perl), and upgrades don't need it because `db:migrate` then only applies pending migrations. So the
`schema` and `init-db` steps in the example do the one-time load with the `postgres` image, and do nothing on later
starts. You can drop them if your database already has its tables, such as a restored backup.

Creating the first convention and site admin is not covered here; use the Rails console in the Rails container, as in
the main [README](https://github.com/neinteractiveliterature/intercode/blob/main/README.md#getting-started).
