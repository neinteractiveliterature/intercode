import { useGraphQLConfirm } from '@neinteractiveliterature/litform';

import PermissionsPrompt from './PermissionsPrompt';
import { OAuthAuthorizedApplicationsQueryData, OAuthAuthorizedApplicationsQueryDocument } from './queries.generated';
import { LoaderFunction, useLoaderData } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { useFetcher } from 'react-router';

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<OAuthAuthorizedApplicationsQueryData>({
    query: OAuthAuthorizedApplicationsQueryDocument,
  });
  return data;
};

function AuthorizedApplications() {
  const data = useLoaderData() as OAuthAuthorizedApplicationsQueryData;
  const confirm = useGraphQLConfirm();
  const fetcher = useFetcher();

  const revokeClicked = (
    authorizedApplication: OAuthAuthorizedApplicationsQueryData['myAuthorizedApplications'][0],
  ) => {
    confirm({
      prompt: `Are you sure you want to revoke the authorization for ${authorizedApplication.name}?`,
      action: () => fetcher.submit({}, { action: `./${authorizedApplication.uid}`, method: 'DELETE' }),
    });
  };

  return (
    <>
      <h1 className="mb-4">Authorized applications</h1>

      <table className="table table-striped">
        <thead>
          <th>Name</th>
          <th>Permissions</th>
          <th />
        </thead>
        <tbody>
          {data.myAuthorizedApplications.map((authorizedApplication) => (
            <tr key={authorizedApplication.uid}>
              <td>{authorizedApplication.name}</td>
              <td>
                <PermissionsPrompt scopeNames={authorizedApplication.scopes} />
              </td>
              <td className="text-end">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => revokeClicked(authorizedApplication)}
                >
                  Revoke
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export const Component = AuthorizedApplications;
