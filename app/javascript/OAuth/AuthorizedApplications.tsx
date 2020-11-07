import { OAuthAuthorizedApplicationsQuery } from './queries';
import { useGraphQLConfirm } from '../ModalDialogs/Confirm';
import PermissionsPrompt from './PermissionsPrompt';
import { RevokeAuthorizedApplication } from './mutations';
import { useDeleteMutation } from '../MutationUtils';
import { LoadQueryWrapper } from '../GraphqlLoadingWrappers';
import {
  OAuthAuthorizedApplicationsQueryQuery,
  useOAuthAuthorizedApplicationsQueryQuery,
} from './queries.generated';

export default LoadQueryWrapper(
  useOAuthAuthorizedApplicationsQueryQuery,
  function AuthorizedApplications({ data }) {
    const revokeAuthorizedApplication = useDeleteMutation(RevokeAuthorizedApplication, {
      query: OAuthAuthorizedApplicationsQuery,
      arrayPath: ['myAuthorizedApplications'],
      idVariablePath: ['uid'],
      idAttribute: 'uid',
    });
    const confirm = useGraphQLConfirm();

    const revokeClicked = (
      authorizedApplication: OAuthAuthorizedApplicationsQueryQuery['myAuthorizedApplications'][0],
    ) => {
      confirm({
        prompt: `Are you sure you want to revoke the authorization for ${authorizedApplication.name}?`,
        action: () =>
          revokeAuthorizedApplication({ variables: { uid: authorizedApplication.uid } }),
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
                <td className="text-right">
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
  },
);
