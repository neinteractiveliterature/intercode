ARG RUBY_VERSION=4
ARG NODE_VERSION=24.11.1
ARG CHAMBER_VERSION=3.1.5
# Optional, for the assets target: an earlier intercode-assets image (for example the last release's) whose hashed files
# are carried over, so that tabs and cached pages from the previous release can still load their chunks. The default,
# an empty image, carries nothing over.
ARG PREVIOUS_ASSETS_IMAGE=scratch
# Carried-over files are pruned this many days after the release that dropped them. Files that are part of this
# release are never pruned, however old.
ARG PREVIOUS_ASSETS_RETENTION_DAYS=30

### dev

FROM ruby:${RUBY_VERSION}-slim AS dev
ARG NODE_VERSION

USER root
RUN useradd www
WORKDIR /usr/src/intercode

RUN apt-get update && apt-get install -y libvips42 git build-essential shared-mime-info libpq-dev libyaml-dev && rm -rf /var/lib/apt/lists/*

COPY --chown=www:www Gemfile Gemfile.lock .ruby-version /usr/src/intercode/
RUN bundle config set without 'development test' \
  && bundle install -j4 \
  && echo 'Running bundle clean --force' \
  && bundle clean --force \
  && echo 'Copying /usr/local/bundle to /usr/local/bundle-tmp' \
  && cp -R /usr/local/bundle /usr/local/bundle-tmp \
  && echo 'Cleaning cached gems and intermediate build files from /usr/local/bundle-tmp' \
  && rm -rf /usr/local/bundle-tmp/cache/*.gem \
  && find /usr/local/bundle-tmp/gems -name '*.c' -delete \
  && find /usr/local/bundle-tmp/gems -name '*.o' -delete \
  && echo 'Switching the bundle directory for the cleaned one, Raiders of the Lost Ark-style' \
  && rm -rf /usr/local/bundle \
  && mv /usr/local/bundle-tmp /usr/local/bundle

COPY --chown=www:www . /usr/src/intercode

### frontend (the framework-mode build, which the Rails app serves as its shell and the assets image serves from nginx)

FROM node:${NODE_VERSION}-slim AS frontend
ARG REVISION
ENV REVISION=${REVISION}
# husky, which wants a git repository
ENV HUSKY=0
WORKDIR /usr/src/intercode
RUN apt-get update && apt-get install -y --no-install-recommends python3 build-essential && rm -rf /var/lib/apt/lists/*
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY doc-site/package.json doc-site/package.json
RUN yarn install --immutable
COPY . .
RUN yarn run build:framework

### assets (docker build --target assets): the frontend served by nginx, as the intercode-assets image
#
# The build is made against a placeholder asset host. When the container starts it takes a fresh copy of the build and
# swaps in $ASSETS_HOST (or nothing, for same-origin assets), so one image serves any deployment. The app container
# needs the same ASSETS_HOST. With RAILS_UPSTREAM set, the container also proxies the Rails routes and crawlers to Rails.
# See https://intercode.interactiveliterature.org/docs/deploying

FROM ${PREVIOUS_ASSETS_IMAGE} AS previous

FROM nginx AS assets
ARG PREVIOUS_ASSETS_RETENTION_DAYS
# The pristine build. The entrypoint copies it into the web root on every start, before substituting ASSETS_HOST.
COPY --from=frontend /usr/src/intercode/build/framework/client /usr/share/intercode-assets
RUN rm /usr/share/nginx/html/index.*
RUN --mount=type=bind,from=previous,target=/previous \
    --mount=type=bind,source=script/mergePreviousAssets.sh,target=/mergePreviousAssets.sh \
    /mergePreviousAssets.sh /previous ${PREVIOUS_ASSETS_RETENTION_DAYS} /usr/share/intercode-assets assets
COPY script/substituteAssetsHost.sh /usr/local/bin/substituteAssetsHost.sh
COPY docker-assets/40-substitute-assets-host.sh /docker-entrypoint.d/40-substitute-assets-host.sh
COPY docker-assets/nginx.conf /etc/nginx/conf.d/default.conf
# The reference front server configuration, used when RAILS_UPSTREAM is set. The crawler map and the Rails locations are
# generated from the same route list as the CloudFront module.
COPY docker-assets/front-proxy.conf.template /etc/nginx/intercode/front-proxy.conf.template
COPY docker-assets/proxy_params.conf /etc/nginx/proxy_params.conf
COPY terraform/modules/cloudfront_intercode/nginx/crawler-map.conf terraform/modules/cloudfront_intercode/nginx/rails-locations.conf /etc/nginx/intercode/

### build

FROM dev AS build

ENV RAILS_ENV=production
ENV NODE_ENV=production

RUN bundle exec bootsnap precompile --gemfile app/ lib/
RUN DATABASE_URL=postgresql://fakehost/not_a_real_database AWS_S3_BUCKET=fakebucket AWS_ACCESS_KEY_ID=dummy AWS_SECRET_ACCESS_KEY=dummy bundle exec rails assets:precompile
RUN rm -r doc-site

# The pristine framework-mode build. It is made against a placeholder asset host, because ASSETS_HOST is only known when
# the container starts; bin/with_static_shell makes the copy that Rails serves, with the real host substituted in.
COPY --from=frontend --chown=www:www /usr/src/intercode/build/framework/client /usr/src/intercode/build/framework/client

### ld_preload trickery

FROM ruby:${RUBY_VERSION}-slim AS amd64_jemalloc
ENV LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2

FROM ruby:${RUBY_VERSION}-slim AS arm64_jemalloc
ENV LD_PRELOAD=/usr/lib/aarch64-linux-gnu/libjemalloc.so.2

### production

FROM ${TARGETARCH}_jemalloc AS production
ARG NODE_VERSION
ARG TARGETARCH
ARG REVISION
ARG CHAMBER_VERSION

ENV RAILS_ENV=production
ENV NODE_ENV=production
ENV REVISION=${REVISION}

USER root
# iproute2, curl: generally useful network utilities that don't take much space
# libvips43, poppler-utils: activestorage dependencies
# libjemalloc2: more efficient memory allocation in Ruby and Node
# shared-mime-info: Rails dependency
# libpq5: pg gem dependency
# xz-utils: installed temporarily to extract the node tarball, then removed
# ca-certificates: listed explicitly so an exact-tag base image (e.g. ruby:4.0.6-slim) that stopped receiving
#   rebuilds still gets the current CA bundle from Debian security updates
RUN apt-get update \
  && apt-get install -y --no-install-recommends iproute2 curl libvips42 poppler-utils xz-utils libjemalloc2 shared-mime-info libpq5 gosu ca-certificates \
  && mkdir /opt/node \
  && cd /opt/node \
  && curl https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-$(echo ${TARGETARCH} | sed 's/amd64/x64/').tar.xz | tar xJ --strip-components=1 \
  && rm -rf /opt/node/include /opt/node/lib/node_modules \
  && apt-get purge -y xz-utils \
  && apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/*
RUN useradd -ms $(which bash) www
ENV PATH="/opt/node/bin:$PATH"

# Set up chamber for SSM-based secrets management
RUN curl -fL "https://github.com/segmentio/chamber/releases/download/v${CHAMBER_VERSION}/chamber-v${CHAMBER_VERSION}-linux-${TARGETARCH}" \
  -o /usr/local/bin/chamber \
  && chmod +x /usr/local/bin/chamber

COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build --chown=www /usr/src/intercode /usr/src/intercode
RUN chmod +x /usr/src/intercode/bin/entrypoint.sh

WORKDIR /usr/src/intercode

# Entrypoint runs as root so it can access /.fly/api for the OIDC token fetch,
# then drops to the www user before exec'ing the app process.
ENV PATH=/opt/node/bin:$PATH
ENTRYPOINT ["/usr/src/intercode/bin/entrypoint.sh"]
CMD ["bundle", "exec", "bin/rails", "server", "-p", "3000", "-b", "0.0.0.0"]
