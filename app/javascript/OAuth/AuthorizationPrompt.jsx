import React, { useMemo, useContext } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { useLocation } from 'react-router-dom';

import AuthenticityTokensContext from '../AuthenticityTokensContext';
import { OAuthAuthorizationPromptQuery } from './queries.gql';
import PermissionsPrompt from './PermissionsPrompt';
import ErrorDisplay from '../ErrorDisplay';
import AuthenticationModalContext from '../Authentication/AuthenticationModalContext';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function AuthorizationPrompt() {
  const location = useLocation();
  const preAuthParamsJSON = useMemo(
    () => JSON.stringify(
      [...(new URLSearchParams(location.search))]
        .reduce((object, [field, value]) => ({ ...object, [field]: value }), {}),
    ),
    [location.search],
  );
  const { data, loading, error } = useQuery(
    OAuthAuthorizationPromptQuery,
    { variables: { queryParams: preAuthParamsJSON } },
  );
  const preAuth = useMemo(
    () => {
      if (error || loading) {
        return null;
      }

      return JSON.parse(data.oauthPreAuth);
    },
    [data, loading, error],
  );
  const scopes = useMemo(
    () => {
      if (!preAuth) {
        return null;
      }

      return preAuth.scope.split(' ');
    },
    [preAuth],
  );

  const authenticityTokens = useContext(AuthenticityTokensContext);
  const authorizationParams = useMemo(
    () => {
      if (!preAuth) {
        return null;
      }

      return ['client_id', 'redirect_uri', 'state', 'response_type', 'scope', 'nonce', 'code_challenge', 'code_challenge_method'].reduce((params, field) => ({
        ...params, [field]: preAuth[field],
      }), {});
    },
    [preAuth],
  );
  const authenticationModal = useContext(AuthenticationModalContext);

  usePageTitle('Authorization required');

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data.currentUser) {
    if (!authenticationModal.visible) {
      authenticationModal.open({ currentView: 'signIn' });
      authenticationModal.setAfterSignInPath(window.location.href);
    }

    return null;
  }

  // doing this with a hidden form we create and submit because fetch will try to follow the
  // redirect and probably fail because of CORS
  const buildHiddenInput = (name, value) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', name);
    input.setAttribute('value', value);
    return input;
  };

  const buildAndSubmitForm = (method, authenticityToken, params) => {
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

  const grantAuthorization = () => {
    buildAndSubmitForm('POST', authenticityTokens.grantAuthorization, authorizationParams);
  };

  const denyAuthorization = async () => {
    buildAndSubmitForm('DELETE', authenticityTokens.denyAuthorization, authorizationParams);
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
            <strong>{preAuth.client_name}</strong>
            {' to use your account?'}
          </p>

          <p>
            This will allow
            {' '}
            {preAuth.client_name}
            {' '}
            to access your convention profile and information
            about events you can access.
          </p>

          {scopes.length > 0 && <PermissionsPrompt scopeNames={scopes} />}
        </div>

        <div className="card-footer">
          <div className="actions d-flex justify-content-end">
            <button className="btn btn-outline-danger mr-2" type="button" onClick={denyAuthorization}>
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
