import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { useRouteError } from 'react-router';

export default function RouteErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <ErrorDisplay stringError={error.message} />;
  } else if (typeof error === 'object' && error) {
    return <ErrorDisplay stringError={error.toString()} />;
  } else {
    return <ErrorDisplay stringError={error as string} />;
  }
}
