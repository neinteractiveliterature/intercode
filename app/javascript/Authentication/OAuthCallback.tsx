import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { Route } from './+types/OAuthCallback';
import { sessionContext } from '~/AppContexts';
import { commitSessionToBrowser } from '~/sessions';
import { discoverOpenidConfig, exchangeCodeForToken } from './openid';

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const session = context.get(sessionContext);
  return { session };
}

function OAuthCallback({ loaderData }: Route.ComponentProps) {
  const { session } = loaderData;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
        const pkceChallenge = session.get('pkceChallenge');

        const storedState = pkceChallenge?.state;
        if (!storedState) {
          throw new Error('No stored state found - authorization flow corrupted');
        }

        const codeVerifier = pkceChallenge?.verifier;
        if (!codeVerifier) {
          throw new Error('No code verifier found - authorization flow corrupted');
        }

        const tokenResponse = await exchangeCodeForToken(await discoverOpenidConfig(), codeVerifier, storedState);

        session.set('jwtToken', tokenResponse.access_token);
        if (tokenResponse.refresh_token) {
          session.set('jwtRefreshToken', tokenResponse.refresh_token);
        }

        const returnPath = sessionStorage.getItem('oauth_return_path') || '/';
        sessionStorage.removeItem('oauth_return_path');

        window.location.href = returnPath;
      } catch (e) {
        console.error('OAuth callback error:', e);
        setError(e instanceof Error ? e.message : 'Authentication failed');
        setProcessing(false);
      } finally {
        session.unset('pkceChallenge');
        await commitSessionToBrowser(session);
      }
    };

    handleCallback();
  }, [searchParams, navigate, session]);

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
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default OAuthCallback;
