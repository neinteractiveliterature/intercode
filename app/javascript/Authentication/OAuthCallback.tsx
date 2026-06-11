import { useEffect, useState, useRef, useContext } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { AuthenticationManagerContext } from './authenticationManager';

function OAuthCallback() {
  const { t } = useTranslation();
  const authenticationManager = useContext(AuthenticationManagerContext);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (hasRun.current) {
      return;
    }
    hasRun.current = true;

    const handleCallback = async () => {
      try {
        const { returnPath } = await authenticationManager.handleOauthCallback(new URL(window.location.href));
        window.location.href = returnPath;
      } catch (e) {
        console.error('OAuth callback error:', e);
        setError(e instanceof Error ? e.message : 'Authentication failed');
        setProcessing(false);
      }
    };

    handleCallback();
  }, [authenticationManager]);

  const handleRetry = async () => {
    setProcessing(true);
    setError(null);
    try {
      const { redirectUrl } = await authenticationManager.initiateAuthentication('/');
      window.location.href = redirectUrl.toString();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Authentication failed');
      setProcessing(false);
    }
  };

  if (processing) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">{t('authentication.oauthCallback.completingLogin')}</span>
          </div>
          <p className="mt-3">{t('authentication.oauthCallback.completingLogin')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="alert alert-danger">
        <h4>{t('authentication.oauthCallback.authenticationError')}</h4>
        <ErrorDisplay stringError={error} />
        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary" onClick={handleRetry}>
            {t('authentication.oauthCallback.retryLogin')}
          </button>
          <Link className="btn btn-outline-secondary" to="/">
            {t('authentication.oauthCallback.returnToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OAuthCallback;
export const Component = OAuthCallback;
