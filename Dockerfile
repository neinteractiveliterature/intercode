ARG RUBY_VERSION=3.1.0
ARG NODE_VERSION=16.x

### dev

FROM ruby:${RUBY_VERSION}-slim as dev
ARG NODE_VERSION

USER root
RUN useradd www
WORKDIR /usr/src/intercode

RUN apt-get update && apt-get install -y git build-essential shared-mime-info libpq-dev && rm -rf /var/lib/apt/lists/*

COPY --chown=www:www Gemfile Gemfile.lock .ruby-version /usr/src/intercode/
RUN bundle config set without 'intercode1_import' \
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

### build

FROM dev AS build

ENV RAILS_ENV production
ENV NODE_ENV production
ENV AWS_ACCESS_KEY_ID dummy
ENV AWS_SECRET_ACCESS_KEY dummy

RUN DATABASE_URL=postgresql://fakehost/not_a_real_database bundle exec rails assets:precompile

### test

FROM build AS test

ENV RAILS_ENV test
ENV NODE_ENV test

USER root
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

### production

FROM ruby:${RUBY_VERSION}-slim as production
ARG NODE_VERSION

ENV RAILS_ENV production
ENV NODE_ENV production

USER root
RUN useradd -ms /bin/bash www
RUN apt-get update && apt-get install -y --no-install-recommends libjemalloc2 shared-mime-info nodejs libpq5 && rm -rf /var/lib/apt/lists/*
RUN ruby -e 'require "net/http" ; puts Net::HTTP.get(URI.parse("https://deb.nodesource.com/setup_${NODE_VERSION}"))' | bash -

COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build --chown=www /usr/src/intercode /usr/src/intercode
WORKDIR /usr/src/intercode

USER www
ENV LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2
CMD bundle exec bin/rails server -p $PORT -b 0.0.0.0
