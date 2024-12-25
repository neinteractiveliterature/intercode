import { useMemo, useContext } from 'react';

import { AuthenticityTokensContext } from '../AuthenticityTokensContext';
import PermissionsPrompt from './PermissionsPrompt';
import AuthenticationModalContext from '../Authentication/AuthenticationModalContext';
import usePageTitle from '../usePageTitle';
import { OAuthAuthorizationPromptQueryData, OAuthAuthorizationPromptQueryDocument } from './queries.generated';

type AuthorizationParams = {
  client_id?: string;
  redirect_uri?: string;
  state?: string;
  response_type?: string;
  scope?: string;
  nonce?: string;
  code_challenge?: string;
  code_challenge_method?: string;
};

type PreAuth = AuthorizationParams & {
  client_name: string;
  scope: string;
};

export async function loader({ request }) {
  const url = new URL(request.url);
  const preAuthParamsJSON = JSON.stringify(
    [...url.searchParams].reduce((object, [field, value]) => ({ ...object, [field]: value }), {}),
  );

  const { data } = await client.query({
    query: OAuthAuthorizationPromptQueryDocument,
    variables: { queryParams: preAuthParamsJSON },
  });

  return data;
}

function AuthorizationPrompt() {
  const data = useLoaderData() as OAuthAuthorizationPromptQueryData;
  const preAuth = useMemo(() => JSON.parse(data.oauthPreAuth) as PreAuth, [data]);
  const scopes = useMemo(() => preAuth.scope.split(' '), [preAuth]);
  const manager = useContext(AuthenticityTokensContext);

  const authorizationParams: AuthorizationParams | null = useMemo(
    () =>
      (
        [
          'client_id',
          'redirect_uri',
          'state',
          'response_type',
          'scope',
          'nonce',
          'code_challenge',
          'code_challenge_method',
        ] as const
      ).reduce(
        (params, field) => ({
          ...params,
          [field]: preAuth[field],
        }),
        {},
      ),
    [preAuth],
  );
  const authenticationModal = useContext(AuthenticationModalContext);

  usePageTitle('Authorization required');

  if (!data.currentUser) {
    if (!authenticationModal.visible) {
      authenticationModal.open({ currentView: 'signIn' });
      authenticationModal.setAfterSignInPath(window.location.href);
    }

    return <></>;
  }

  // doing this with a hidden form we create and submit because fetch will try to follow the
  // redirect and probably fail because of CORS
  const buildHiddenInput = (name: string, value: string) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', name);
    input.setAttribute('value', value);
    return input;
  };

  const buildAndSubmitForm = (method: string, authenticityToken: string, params: AuthorizationParams) => {
    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', '/oauth/authorize');
    form.appendChild(buildHiddenInput('_method', method));
    form.appendChild(buildHiddenInput('authenticity_token', authenticityToken));
    Object.entries(params).forEach(([field, value]) => {
      if (value != null) {
        form.appendChild(buildHiddenInput(field, value));
      }
    });
    document.body.appendChild(form);
    form.submit();
  };

  const grantAuthorization = async () => {
    buildAndSubmitForm('POST', (await manager.getTokens()).grantAuthorization ?? '', authorizationParams);
  };

  const denyAuthorization = async () => {
    buildAndSubmitForm('DELETE', (await manager.getTokens()).denyAuthorization ?? '', authorizationParams);
  };

  return (
    <div className="d-flex mt-4 justify-content-center">
      <main role="main" className="card flex-grow-1" style={{ maxWidth: '600px' }}>
        <header className="card-header">
          <h2 className="m-0">Authorization required</h2>
        </header>

        <div className="card-body">
          <p className="h4">
            {'Authorize '}
            <strong>{preAuth?.client_name}</strong>
            {' to use your account?'}
          </p>

          <p>
            This will allow {preAuth?.client_name} to access{' '}
            {scopes?.includes('read_profile') || scopes?.includes('profile')
              ? 'all information in your convention profiles'
              : 'the public information in your convention profiles'}{' '}
            as well as information about events you can access.
          </p>

          {scopes && scopes.length > 0 && <PermissionsPrompt scopeNames={scopes} />}
        </div>

        <div className="card-footer">
          <div className="actions d-flex justify-content-end">
            <button className="btn btn-outline-danger me-2" type="button" onClick={denyAuthorization}>
              Deny
            </button>
            <button className="btn btn-success" type="button" onClick={grantAuthorization}>
              Authorize
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AuthorizationPrompt;
