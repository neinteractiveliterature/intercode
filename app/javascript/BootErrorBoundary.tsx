/* eslint-disable i18next/no-literal-string -- This boundary is the last line of
   defense for a broken boot; it must not depend on i18n (which may be exactly
   what failed to load), so its copy is intentionally hard-coded English. */
import { Component, ErrorInfo, ReactNode, CSSProperties } from 'react';
import { reloadOnAppEntrypointHeadersMismatch } from './checkAppEntrypointHeadersMatch';
import errorReporting from 'ErrorReporting';

// Guard against an auto-reload loop: if we reloaded very recently, show the
// manual fallback instead of reloading again.
const RELOAD_GUARD_KEY = 'intercode.bootErrorReloadAt';
const RELOAD_GUARD_WINDOW_MS = 15_000;

function reloadedWithinGuardWindow(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_GUARD_KEY));
    return Number.isFinite(last) && last > 0 && Date.now() - last < RELOAD_GUARD_WINDOW_MS;
  } catch {
    return false;
  }
}

function markReloadAttempt(): void {
  try {
    sessionStorage.setItem(RELOAD_GUARD_KEY, String(Date.now()));
  } catch {
    // sessionStorage may be unavailable (private mode / blocked); best effort.
  }
}

const containerStyle: CSSProperties = {
  maxWidth: '32rem',
  margin: '4rem auto',
  padding: '0 1rem',
  fontFamily: 'system-ui, sans-serif',
  textAlign: 'center',
  lineHeight: 1.5,
};

const buttonStyle: CSSProperties = {
  marginTop: '1rem',
  padding: '0.5rem 1.25rem',
  fontSize: '1rem',
  cursor: 'pointer',
};

function BootErrorFallback() {
  return (
    <div style={containerStyle} role="alert">
      <h1 style={{ fontSize: '1.25rem' }}>We couldn’t finish loading this page</h1>
      <p>This is usually temporary and fixed by reloading. If it keeps happening, try again in a few minutes.</p>
      <button type="button" style={buttonStyle} onClick={() => window.location.reload()}>
        Reload the page
      </button>
    </div>
  );
}

type Props = { children: ReactNode };
type State = { hasError: boolean };

// Catches failures during the SPA's initial boot/render — a rejected
// bootstrapPromise, or an uncaught error rendering the route tree — that would
// otherwise leave a blank white page with no recovery. A stale deploy (a chunk
// hash that no longer exists) is the most common cause, so we try to reload
// onto the fresh bundle; anything else gets a visible, reportable error instead
// of a blank screen.
export default class BootErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    try {
      errorReporting().error(error, { tags: { context: 'boot' }, componentStack: info.componentStack });
    } catch {
      // Error reporting itself may be unavailable (e.g. its SDK was the chunk
      // that failed to load); don't let that mask the fallback UI.
    }

    // Very often a blank boot is a stale deploy. If the deployed entrypoint has
    // changed under this tab, reload to pick up the fresh bundle — but only if
    // we didn't just try, so we never get stuck in a reload loop.
    if (!reloadedWithinGuardWindow()) {
      markReloadAttempt();
      void reloadOnAppEntrypointHeadersMismatch();
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <BootErrorFallback />;
    }
    return this.props.children;
  }
}
