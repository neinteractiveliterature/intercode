FROM ruby:2.5.1
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

RUN bundle config --global frozen 1

RUN mkdir -p /usr/src/app
RUN useradd -m www
RUN chown www /usr/src/app
USER www

WORKDIR /usr/src/app

ENV RAILS_ENV $RAILS_ENV
ENV AWS_ACCESS_KEY_ID dummy
ENV AWS_SECRET_ACCESS_KEY dummy

COPY Gemfile Gemfile.lock /usr/src/app/
RUN bundle install --deployment

COPY package.json yarn.lock /usr/src/app/
RUN yarn install

COPY --chown=www . /usr/src/app

RUN mv config/database.yml.docker config/database.yml
RUN bundle exec rake assets:precompile

EXPOSE 3000
CMD ["bundle", "exec", "rails", "server", "-p", "$PORT", "-b", "0.0.0.0"]
