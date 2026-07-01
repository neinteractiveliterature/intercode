import { isRouteErrorResponse, useRouteError } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';
import FourOhFourPage from './FourOhFourPage';
import { AuthorizationError } from './Authentication/useAuthorizationRequired';
import useLoginRequired from './Authentication/useLoginRequired';

function LoginRequired() {
  const loginRequired = useLoginRequired();
  return loginRequired || null;
}

export default function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 401) return <LoginRequired />;
    if (error.status === 403) return <AuthorizationError />;
    if (error.status === 404) return <FourOhFourPage />;
  }

  if (error instanceof Error) {
    return <ErrorDisplay stringError={error.message} />;
  } else if (typeof error === 'object' && error) {
    return <ErrorDisplay stringError={error.toString()} />;
  } else {
    return <ErrorDisplay stringError={error as string} />;
  }
}
