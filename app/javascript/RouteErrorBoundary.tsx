import { isRouteErrorResponse, useRouteError } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';
import FourOhFourPage from './FourOhFourPage';

export default function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <FourOhFourPage />;
  }

  if (error instanceof Error) {
    return <ErrorDisplay stringError={error.message} />;
  } else if (typeof error === 'object' && error) {
    return <ErrorDisplay stringError={error.toString()} />;
  } else {
    return <ErrorDisplay stringError={error as string} />;
  }
}
