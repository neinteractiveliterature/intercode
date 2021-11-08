ARG RUBY_VERSION=3.0.2

### dev

FROM neinteractiveliterature/base-ruby-build:${RUBY_VERSION} as dev

USER root
WORKDIR /usr/src/intercode

RUN apk add --no-cache shared-mime-info npm
RUN npm install -g yarn

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

COPY --chown=www:www package.json yarn.lock .yarnrc.yml /usr/src/intercode/
COPY --chown=www:www doc-site/package.json /usr/src/intercode/doc-site/
COPY --chown=www:www ./.yarn /usr/src/intercode/.yarn
RUN yarn install

COPY --chown=www:www . /usr/src/intercode

### build

FROM dev AS build

ENV RAILS_ENV production
ENV NODE_ENV production
ENV AWS_ACCESS_KEY_ID dummy
ENV AWS_SECRET_ACCESS_KEY dummy

RUN yarn run build
RUN DATABASE_URL=postgresql://fakehost/not_a_real_database bundle exec rails assets:precompile

### test

FROM build AS test

ENV RAILS_ENV test
ENV NODE_ENV test

USER root
RUN apk add --no-cache postgresql-client

### pre-production

FROM build AS pre-production

RUN rm -rf node_modules
RUN yarn cache clean

### production

FROM neinteractiveliterature/base-ruby-production:${RUBY_VERSION} as production

USER root
RUN apk add --no-cache shared-mime-info

COPY --from=pre-production /usr/local/bundle /usr/local/bundle
COPY --from=pre-production --chown=www /usr/src/intercode /usr/src/intercode
WORKDIR /usr/src/intercode

USER www
CMD bundle exec bin/rails server -p $PORT -b 0.0.0.0
