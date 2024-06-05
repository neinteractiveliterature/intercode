/* eslint-disable @typescript-eslint/no-unused-vars */

if (window.sentryFrontendDSN) {
  import('@sentry/browser').then((Sentry) => {
    Sentry.init({ dsn: window.sentryFrontendDSN });
  });
}
