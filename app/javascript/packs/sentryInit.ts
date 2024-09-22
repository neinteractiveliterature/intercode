if (window.sentryFrontendDSN) {
  import(/* webpackChunkName: 'sentry-browser', webpackExports: ['init'] */ '@sentry/browser').then((Sentry) => {
    Sentry.init({ dsn: window.sentryFrontendDSN });
  });
}
