import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { useRouteError } from 'react-router';

export default function RouteErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return (
      <div className="alert alert-danger m-4">
        <h1>{error.message}</h1>
        <pre>{error.stack}</pre>
      </div>
    );
  } else if (typeof error === 'object' && error) {
    return (
      <div className="m-4">
        <ErrorDisplay stringError={error.toString()} />
      </div>
    );
  } else {
    return (
      <div className="m-4">
        <ErrorDisplay stringError={error as string} />
      </div>
    );
  }
}
