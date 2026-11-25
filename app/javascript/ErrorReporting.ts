import assertNever from 'assert-never';
import { afterContentShown } from './contentShown';

export type ErrorReportingLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

class ErrorReporting {
  rollbar: import('rollbar').default | undefined;
  sentry:
    | {
        instance: import('@sentry/core').Client;
        newScope: () => import('@sentry/browser').Scope;
      }
    | undefined;

  currentUserId: string | undefined;

  // The SDKs load once the page is showing, or as soon as there is something to report. Until then, errors wait here.
  private pending: { level: ErrorReportingLevel; error: Error | string; extra?: Record<string, unknown> }[] = [];
  private loading: Promise<void> | undefined;
  private loaded = false;

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

  constructor(
    currentUserId: string | undefined,
    private sentryDsn?: string | null,
    private rollbarToken?: string | null,
  ) {
    this.currentUserId = currentUserId;

    if (sentryDsn || rollbarToken) {
      // Stand in for the SDKs' own handlers until they have loaded
      window.addEventListener('error', this.onUncaughtError);
      window.addEventListener('unhandledrejection', this.onUnhandledRejection);
      afterContentShown().then(() => this.load());
    }
  }

  private onUncaughtError = (event: ErrorEvent) => {
    if (event.error != null) {
      this.report('error', event.error);
    }
  };

  private onUnhandledRejection = (event: PromiseRejectionEvent) => {
    this.report('error', event.reason instanceof Error ? event.reason : String(event.reason));
  };

  private load(): Promise<void> {
    this.loading ??= Promise.all([this.loadSentry(), this.loadRollbar()])
      .then(() => {
        this.stopListening();
        this.loaded = true;
        this.pending.splice(0).forEach(({ level, error, extra }) => this.report(level, error, extra));
      })
      .catch((error) => {
        // An ad blocker or a lost connection: there is nowhere to report to
        this.stopListening();
        this.pending = [];
        console.warn('Could not load error reporting', error);
      });
    return this.loading;
  }

  private stopListening() {
    window.removeEventListener('error', this.onUncaughtError);
    window.removeEventListener('unhandledrejection', this.onUnhandledRejection);
  }

  private async loadSentry() {
    if (!this.sentryDsn) return;

    const Sentry = await import('@sentry/browser');
    const instance = Sentry.init({ dsn: this.sentryDsn });
    if (instance != null) {
      this.sentry = {
        instance,
        newScope: () => {
          const scope = new Sentry.Scope();
          scope.setUser({ id: this.currentUserId });
          return scope;
        },
      };
    }
  }

  private async loadRollbar() {
    if (!this.rollbarToken) return;

    const Rollbar = await import('rollbar');
    this.rollbar = Rollbar.default.init({
      accessToken: this.rollbarToken,
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
          id: this.currentUserId ?? null,
        },
      },
    });
  }

  // Associate subsequent reports with the signed-in user. The SDKs are
  // initialized once at boot (before the user id is known), so this updates
  // the existing instance rather than re-initializing — re-init would install
  // a second set of global error handlers and double-report.
  setCurrentUser(currentUserId: string | undefined) {
    this.currentUserId = currentUserId;
    this.rollbar?.configure({ payload: { person: { id: currentUserId ?? null } } });
  }

  report(level: ErrorReportingLevel, error: Error | string, extra?: Record<string, unknown>) {
    if (!this.loaded && (this.sentryDsn || this.rollbarToken)) {
      // Bounded, in case something fails in a loop while the SDKs are still on their way
      if (this.pending.length < 20) {
        this.pending.push({ level, error, extra });
      }
      this.load();
      return;
    }

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
