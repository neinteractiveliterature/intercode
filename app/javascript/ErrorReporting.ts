import assertNever from 'assert-never';

export type ErrorReportingLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

class ErrorReporting {
  rollbar: ReturnType<(typeof import('rollbar'))['init']> | undefined;
  sentry:
    | {
        instance: import('@sentry/types').Client;
        newScope: () => import('@sentry/types').Scope;
      }
    | undefined;

  static instance: ErrorReporting | undefined;

  static init(...args: ConstructorParameters<typeof ErrorReporting>) {
    ErrorReporting.instance = new ErrorReporting(...args);
  }

  static get() {
    if (ErrorReporting.instance == null) {
      ErrorReporting.init(undefined);
    }

    return ErrorReporting.instance!;
  }

  constructor(currentUserId: string | undefined) {
    if (window.sentryFrontendDSN) {
      import('@sentry/browser').then((Sentry) => {
        const instance = Sentry.init({ dsn: window.sentryFrontendDSN });
        if (instance != null) {
          this.sentry = {
            instance,
            newScope: () => {
              const scope = new Sentry.Scope();
              scope.setUser({ id: currentUserId });
              return scope;
            },
          };
        }
      });
    }

    if (window.rollbarClientAccessToken) {
      import('rollbar').then((Rollbar) => {
        this.rollbar = Rollbar.default.init({
          accessToken: window.rollbarClientAccessToken,
          captureUncaught: true,
          captureUnhandledRejections: true,
          captureIp: 'anonymize',
          payload: {
            environment: import.meta.env.PROD ? 'production' : 'development',
            client: {
              javascript: {
                source_map_enabled: true,
                guess_uncaught_frames: true,
              },
            },
            person: {
              id: currentUserId ?? null,
            },
          },
        });
      });
    }
  }

  report(level: ErrorReportingLevel, error: Error | string, extra?: Record<string, unknown>) {
    const { rollbar, sentry } = this;

    if (rollbar != null) {
      switch (level) {
        case 'fatal':
          rollbar.critical(error, extra);
          break;
        case 'error':
          rollbar.error(error, extra);
          break;
        case 'warning':
          rollbar.warning(error, extra);
          break;
        case 'log':
          rollbar.info(error, extra);
          break;
        case 'info':
          rollbar.info(error, extra);
          break;
        case 'debug':
          rollbar.debug(error, extra);
          break;
        default:
          assertNever(level, true);
          rollbar?.error(error, extra);
      }
    }

    if (sentry != null) {
      const { tags, ...other } = extra ?? {};
      const scope = sentry.newScope();
      scope.setContext('extra', other);
      scope.setTags(tags as Record<string, string>);

      if (error instanceof Error) {
        sentry.instance.captureException(error, undefined, scope);
      } else {
        sentry.instance.captureMessage(error, level, undefined, scope);
      }
    }
  }

  fatal(error: Error | string, extra?: Record<string, unknown>) {
    this.report('fatal', error, extra);
  }

  error(error: Error | string, extra?: Record<string, unknown>) {
    this.report('error', error, extra);
  }

  warning(error: Error | string, extra?: Record<string, unknown>) {
    this.report('warning', error, extra);
  }

  log(error: Error | string, extra?: Record<string, unknown>) {
    this.report('log', error, extra);
  }

  info(error: Error | string, extra?: Record<string, unknown>) {
    this.report('info', error, extra);
  }

  debug(error: Error | string, extra?: Record<string, unknown>) {
    this.report('debug', error, extra);
  }
}

export const initErrorReporting = ErrorReporting.init;
const errorReporting = ErrorReporting.get;

export default errorReporting;
