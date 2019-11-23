# syntax=docker/dockerfile:1.1.3-experimental
ARG RUBY_VERSION=2.6.5

### build-production

FROM ruby:${RUBY_VERSION} as build-production

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn libjemalloc-dev libjemalloc2 && apt-get clean
ENV LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2

ARG ASSETS_HOST

USER root
WORKDIR /usr/src/intercode

COPY Gemfile Gemfile.lock /usr/src/intercode/
RUN --mount=type=cache,target=/usr/local/bundle,id=bundler \
  bundle install -j4 --without intercode1_import \
  && echo 'Running bundle clean' \
  && bundle clean \
  && echo 'Copying /usr/local/bundle to /usr/local/bundle-tmp' \
  && cp -R /usr/local/bundle /usr/local/bundle-tmp \
  && echo 'Cleaning cached gems and intermediate build files from /usr/local/bundle-tmp' \
  && rm -rf /usr/local/bundle-tmp/cache/*.gem \
  && find /usr/local/bundle-tmp/gems -name '*.c' -delete \
  && find /usr/local/bundle-tmp/gems -name '*.o' -delete
RUN rm -rf /usr/local/bundle && mv /usr/local/bundle-tmp /usr/local/bundle

COPY package.json yarn.lock /usr/src/intercode/
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn,id=yarn \
  yarn install

COPY --chown=www:www . /usr/src/intercode

ENV RAILS_ENV production
ENV AWS_ACCESS_KEY_ID dummy
ENV AWS_SECRET_ACCESS_KEY dummy
ENV ASSETS_HOST ${ASSETS_HOST}

RUN --mount=type=cache,target=/usr/local/share/.cache/yarn,id=yarn \
  --mount=type=cache,target=/usr/src/intercode/tmp/cache,id=rails \
  DATABASE_URL=postgresql://fakehost/not_a_real_database bundle exec rails assets:precompile

### test

FROM build-production AS test

ENV RAILS_ENV test

USER root
RUN apk add --no-cache postgresql-client

RUN mv public/packs public/packs-test \
  && curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter \
  && chmod +x ./cc-test-reporter \
  && ./cc-test-reporter before-build

# Unfortunately all the previous stuff is going to have run yarn install with NODE_ENV=production
# and we need it to be test for this
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn,id=yarn \
  yarn install --production=false

### pre-production

FROM build-production as pre-production
RUN rm -rf /usr/src/intercode/node_modules

### production

FROM ruby:${RUBY_VERSION}-slim as production

RUN apt-get update && apt-get install -y libpq5 libjemalloc2 && apt-get clean
ENV LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2

COPY --from=pre-production /usr/local/bundle /usr/local/bundle
COPY --from=pre-production --chown=www /usr/src/intercode /usr/src/intercode
WORKDIR /usr/src/intercode

CMD bundle exec rails server -p $PORT -b 0.0.0.0
