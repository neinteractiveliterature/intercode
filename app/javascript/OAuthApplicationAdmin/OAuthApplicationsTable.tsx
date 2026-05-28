import { Link, LoaderFunction, RouterContextProvider, useFetcher, useLoaderData } from 'react-router';
import { useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import usePageTitle from '../usePageTitle';
import { apolloClientContext } from '../AppContexts';
import { OAuthApplicationsQueryData, OAuthApplicationsQueryDocument } from './queries.generated';

type LoaderResult = {
  applications: OAuthApplicationsQueryData['oauth_applications'];
};

export const loader: LoaderFunction<RouterContextProvider> = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<OAuthApplicationsQueryData>({ query: OAuthApplicationsQueryDocument });
  return { applications: data.oauth_applications } satisfies LoaderResult;
};

function OAuthApplicationsTable() {
  const { applications } = useLoaderData() as LoaderResult;
  const fetcher = useFetcher();
  const confirm = useConfirm();
  const deleteError = fetcher.data instanceof Error ? fetcher.data : undefined;

  usePageTitle('OAuth2 applications');

  const deleteClicked = (application: OAuthApplicationsQueryData['oauth_applications'][number]) => {
    confirm({
      prompt: `Are you sure you want to delete "${application.name}"? This will invalidate all existing tokens for this application.`,
      action: () =>
        fetcher.submit(
          {},
          {
            method: 'DELETE',
            action: `/admin_oauth_applications/${application.id}`,
            encType: 'application/json',
          },
        ),
      renderError: (err) => <ErrorDisplay graphQLError={err} />,
    });
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <h1 className="flex-grow-1">OAuth2 applications</h1>
        <Link to="new" className="btn btn-success">
          New application
        </Link>
      </div>

      <ErrorDisplay graphQLError={deleteError} />

      {applications.length === 0 ? (
        <p className="text-secondary">No applications yet.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Redirect URI(s)</th>
              <th>Confidential</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td className="align-middle">{application.name}</td>
                <td className="align-middle">
                  <pre className="mb-0 small">{application.redirect_uri}</pre>
                </td>
                <td className="align-middle">{application.confidential ? 'Yes' : 'No'}</td>
                <td className="align-middle text-end">
                  <Link to={`${application.id}/edit`} className="btn btn-sm btn-outline-primary me-2">
                    Edit
                  </Link>
                  {!application.is_intercode_frontend && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteClicked(application)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export const Component = OAuthApplicationsTable;
