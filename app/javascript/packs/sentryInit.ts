if (window.sentryFrontendDSN) {
  import(/* webpackChunkName: 'sentry-browser' */ '@sentry/browser').then((Sentry) => {
    Sentry.init({ dsn: window.sentryFrontendDSN });
  });
}
