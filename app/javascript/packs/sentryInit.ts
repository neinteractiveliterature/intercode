 

if (window.sentryFrontendDSN) {
  import('@sentry/browser').then((Sentry) => {
    Sentry.init({ dsn: window.sentryFrontendDSN });
  });
}
