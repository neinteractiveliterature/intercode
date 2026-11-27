/* eslint-disable i18next/no-literal-string -- This boundary is the last line of
   defense for a broken boot; it must not depend on i18n (which may be exactly
   what failed to load), so its copy is intentionally hard-coded English. */
import { Component, ErrorInfo, ReactNode, CSSProperties } from 'react';
import errorReporting from 'ErrorReporting';

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

// Catches failures during the SPA's initial boot/render — a rejected bootstrap promise, or an uncaught error rendering
// the route tree — that would otherwise leave a blank white page with no recovery. It reports the error and shows a
// visible fallback with a reload button. (A stale deploy that breaks the entry files is handled earlier, by the shell:
// see shellRecovery.ts.)
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
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <BootErrorFallback />;
    }
    return this.props.children;
  }
}
