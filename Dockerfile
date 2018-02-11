FROM ruby:2.4.2 as build

RUN mkdir -p /usr/src/build
WORKDIR /usr/src/build

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y nodejs yarn

ENV RAILS_ENV production
ENV AWS_ACCESS_KEY_ID dummy
ENV AWS_SECRET_ACCESS_KEY dummy

COPY package.json yarn.lock /usr/src/build/
RUN yarn install

COPY Gemfile /usr/src/build/
COPY Gemfile.lock /usr/src/build/
RUN bundle config --global frozen 1
RUN bundle install --deployment --without development test intercode1_import

COPY . /usr/src/build
RUN mv config/database.yml.docker config/database.yml

RUN bundle exec rake assets:precompile
RUN rm -rf node_modules

FROM ruby:2.4.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV RAILS_ENV production
ENV RAILS_SERVE_STATIC_FILES true
ENV RAILS_LOG_TO_STDOUT true

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

COPY --from=build /usr/src/build .
RUN bundle install --deployment --without development test intercode1_import

EXPOSE 3000
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
