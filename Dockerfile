ARG RUBY_VERSION
ARG NODE_VERSION

### dev

FROM ruby:${RUBY_VERSION}-slim as dev
ARG NODE_VERSION

USER root
RUN useradd www
WORKDIR /usr/src/intercode

RUN apt-get update && apt-get install -y libvips42 git build-essential shared-mime-info libpq-dev && rm -rf /var/lib/apt/lists/*

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

### build

FROM dev AS build

ENV RAILS_ENV production
ENV NODE_ENV production
ENV AWS_ACCESS_KEY_ID dummy
ENV AWS_SECRET_ACCESS_KEY dummy

RUN bundle exec bootsnap precompile --gemfile app/ lib/
RUN DATABASE_URL=postgresql://fakehost/not_a_real_database AWS_S3_BUCKET=fakebucket bundle exec rails assets:precompile
RUN rm -r doc-site

### ld_preload trickery

FROM ruby:${RUBY_VERSION}-slim as amd64_jemalloc
ENV LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2

FROM ruby:${RUBY_VERSION}-slim as arm64_jemalloc
ENV LD_PRELOAD=/usr/lib/aarch64-linux-gnu/libjemalloc.so.2

### production

FROM ${TARGETARCH}_jemalloc as production
ARG NODE_VERSION
ARG TARGETARCH
ARG REVISION

ENV RAILS_ENV production
ENV NODE_ENV production
ENV REVISION ${REVISION}

USER root
# iproute2, curl: generally useful network utilities that don't take much space
# python3, xz-utils: node dependencies
# libvips43, poppler-utils: activestorage dependencies
# libjemalloc2: more efficient memory allocation in Ruby and Node
# shared-mime-info: Rails dependency
# libpq5: pg gem dependency
RUN apt-get update && apt-get install -y --no-install-recommends iproute2 curl python3 libvips42 poppler-utils xz-utils libjemalloc2 shared-mime-info libpq5 && rm -rf /var/lib/apt/lists/*
RUN useradd -ms $(which bash) www
RUN mkdir /opt/node && \
  cd /opt/node && \
  curl https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-$(echo ${TARGETARCH} | sed 's/amd64/x64/').tar.xz | tar xJ --strip-components=1
ENV PATH="/opt/node/bin:$PATH"

# Set up flyctl
RUN curl -L https://fly.io/install.sh | sh
ENV FLYCTL_INSTALL="/root/.fly"
ENV PATH="$FLYCTL_INSTALL/bin:$PATH"

COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build --chown=www /usr/src/intercode /usr/src/intercode

WORKDIR /usr/src/intercode

USER www
ENV PATH=/opt/node/bin:$PATH
CMD bundle exec bin/rails server -p $PORT -b 0.0.0.0
