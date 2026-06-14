import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import AppRootContext from '../AppRootContext';
import { AuthenticationManagerContext } from './authenticationManager';
import errorReporting from 'ErrorReporting';

function LoginRedirectError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="container mt-4">
      <div className="alert alert-danger" role="alert">
        <h4>{t('authentication.oauthCallback.authenticationError')}</h4>
        <ErrorDisplay stringError={error.message} />
        <button type="button" className="btn btn-primary mt-3" onClick={onRetry}>
          {t('authentication.oauthCallback.retryLogin')}
        </button>
      </div>
    </div>
  );
}

// Returns the content to render *instead of* the page when the visitor isn't
// signed in (a loading indicator while we redirect to the OAuth flow, or an
// error with a retry if initiating that flow fails), or `false` once they're
// authenticated and the page should render normally.
//
// Initiating authentication is async — it awaits OIDC discovery before it can
// build the redirect URL. While that's in flight we must render *something*
// (the spinner); rendering nothing here is what produced the white-screen-on-
// login. And if discovery fails (blocked/unreachable), we surface it with a
// retry instead of leaving a blank page and a silent unhandled rejection.
export default function useLoginRequired(): React.JSX.Element | false {
  const authenticationManager = useContext(AuthenticationManagerContext);
  const { currentUser } = useContext(AppRootContext);
  const location = useLocation();
  const [authenticationError, setAuthenticationError] = useState<Error | undefined>();
  const initiatedRef = useRef(false);

  const initiateLogin = useCallback(() => {
    setAuthenticationError(undefined);
    authenticationManager
      .initiateAuthentication(location.pathname)
      .then(({ redirectUrl }) => {
        window.location.href = redirectUrl.toString();
      })
      .catch((e: unknown) => {
        const error = e instanceof Error ? e : new Error(String(e));
        errorReporting().error(error, { tags: { context: 'login-redirect' } });
        setAuthenticationError(error);
      });
  }, [authenticationManager, location.pathname]);

  useEffect(() => {
    if (currentUser || initiatedRef.current) {
      return;
    }
    initiatedRef.current = true;
    initiateLogin();
  }, [currentUser, initiateLogin]);

  if (currentUser) {
    return false;
  }

  if (authenticationError) {
    return <LoginRedirectError error={authenticationError} onRetry={initiateLogin} />;
  }

  return <PageLoadingIndicator visible />;
}
