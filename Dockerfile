FROM rails:4.2.4

# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY Gemfile /usr/src/app/
COPY Gemfile.lock /usr/src/app/
RUN bundle install

COPY . /usr/src/app
RUN mv config/database.yml.docker config/database.yml

EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]