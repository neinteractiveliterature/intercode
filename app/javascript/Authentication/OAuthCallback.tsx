import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { Route } from './+types/OAuthCallback';
import { authenticationManagerContext } from '~/AppContexts';

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const authenticationManager = context.get(authenticationManagerContext);
  return { authenticationManager };
}

function OAuthCallback({ loaderData }: Route.ComponentProps) {
  const { authenticationManager } = loaderData;
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

  if (processing) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Completing login...</span>
          </div>
          <p className="mt-3">Completing login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="alert alert-danger">
        <h4>Authentication Error</h4>
        <ErrorDisplay stringError={error} />
        <Link className="btn btn-primary mt-3" to="/">
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default OAuthCallback;
