/* eslint-disable i18next/no-literal-string -- a developer-facing placeholder page, removed once real routes move over */
import { useQuery } from '@apollo/client/react';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { AppRootQueryDocument } from '../../appRootQueries.generated';

// A placeholder route that shows the framework-mode build boots with the existing authentication: it runs the same
// query the app root does and reports who is signed in.
export default function FrameworkCheck() {
  const { data, error } = useQuery(AppRootQueryDocument);

  if (error) {
    throw error;
  }

  if (!data) {
    return <PageLoadingIndicator visible />;
  }

  return (
    <div className="container mt-4">
      <h1>Framework mode</h1>
      <p>{data.currentUser ? `Signed in as ${data.currentUser.name}` : 'Not signed in'}</p>
    </div>
  );
}
