FROM ruby:2.5.1 as dependencies
ARG RAILS_ENV=production

RUN mkdir -p /tmp
WORKDIR /tmp

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y nodejs yarn cmake flex

RUN curl -sL https://github.com/graphql/libgraphqlparser/archive/v0.7.0.tar.gz >libgraphqlparser-0.7.0.tar.gz
RUN tar xfz libgraphqlparser-0.7.0.tar.gz
WORKDIR /tmp/libgraphqlparser-0.7.0
RUN cmake .
RUN make install

FROM dependencies as build-common

RUN mkdir -p /usr/src/build
WORKDIR /usr/src/build

ENV RAILS_ENV $RAILS_ENV
ENV AWS_ACCESS_KEY_ID dummy
ENV AWS_SECRET_ACCESS_KEY dummy

FROM build-common as build-ruby

COPY Gemfile /usr/src/build/
COPY Gemfile.lock /usr/src/build/
RUN bundle config --global frozen 1
RUN bundle install --deployment

FROM build-common as build-js

COPY package.json yarn.lock /usr/src/build/
RUN yarn install

FROM build-common as build-app

ENV RAILS_ENV $RAILS_ENV

COPY . /usr/src/build
COPY --from=build-js /usr/src/build .
COPY --from=build-ruby /usr/src/build .

# Both bundler and yarn do some magic outside the src directory that I don't want to depend on,
# so rerun these.  They'll run fast since all the packages are already here.
RUN bundle install --deployment
RUN yarn install

RUN mv config/database.yml.docker config/database.yml
RUN bundle exec rake assets:precompile

FROM dependencies

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV RAILS_ENV $RAILS_ENV
ENV RAILS_SERVE_STATIC_FILES true
ENV RAILS_LOG_TO_STDOUT true

COPY --from=build-app /usr/src/build .

# Whyyyyyyyy
RUN bundle install --deployment
RUN yarn install

EXPOSE 3000
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
