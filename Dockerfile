ARG RUBY_VERSION=2.5.3

### build

FROM neinteractiveliterature/base-ruby-build:${RUBY_VERSION} as build

COPY Gemfile Gemfile.lock /usr/src/build/
RUN bundle install -j4 --without intercode1_import \
  && rm -rf /usr/local/bundle/cache/*.gem \
  && find /usr/local/bundle/gems -name '*.c' -delete \
  && find /usr/local/bundle/gems -name '*.o' -delete

COPY package.json yarn.lock /usr/src/build/
RUN yarn install --production=false

### dev

FROM build AS dev

ENV RAILS_ENV development

USER www
WORKDIR /usr/src/build

### build-production

FROM build AS build-production
ARG ASSETS_HOST

COPY --chown=www:www . /usr/src/build

ENV RAILS_ENV production
ENV AWS_ACCESS_KEY_ID dummy
ENV AWS_SECRET_ACCESS_KEY dummy
ENV ASSETS_HOST ${ASSETS_HOST}

USER www
WORKDIR /usr/src/build

RUN DATABASE_URL=postgresql://fakehost/not_a_real_database bundle exec rake assets:precompile \
  && rm -rf node_modules tmp/cache

### production

FROM neinteractiveliterature/base-ruby-production:${RUBY_VERSION} as production

COPY --from=build-production /usr/local/bundle /usr/local/bundle
COPY --from=build-production /usr/local/lib/libgraphqlparser.so /usr/local/lib/libgraphqlparser.so
COPY --from=build-production --chown=www /usr/src/build /usr/src/app
WORKDIR /usr/src/app

CMD bundle exec rails server -p $PORT -b 0.0.0.0

### test

FROM production AS test

ENV RAILS_ENV test

USER www
WORKDIR /usr/src/app

COPY --from=build /usr/src/build/node_modules /usr/src/app/node_modules
RUN mv public/packs public/packs-test \
  && curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter \
  && chmod +x ./cc-test-reporter \
  && ./cc-test-reporter before-build
