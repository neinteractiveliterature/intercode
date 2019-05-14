import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import fetch from 'unfetch';

import AuthenticityTokensContext from '../AuthenticityTokensContext';
import { OAuthAuthorizationPromptQuery } from './queries.gql';
import PermissionsPrompt from './PermissionsPrompt';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';

function AuthorizationPrompt({ location }) {
  const preAuthParamsJSON = useMemo(
    () => JSON.stringify(
      [...(new URLSearchParams(location.search))]
        .reduce((object, [field, value]) => ({ ...object, [field]: value }), {}),
    ),
    [location.search],
  );
  const { data, error } = useQuerySuspended(
    OAuthAuthorizationPromptQuery,
    { variables: { queryParams: preAuthParamsJSON } },
  );
  const preAuth = useMemo(
    () => {
      if (error) {
        return null;
      }

      return JSON.parse(data.oauthPreAuth);
    },
    [data, error],
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

      return ['client_id', 'redirect_uri', 'state', 'response_type', 'scope', 'nonce', 'code_challenge', 'code_challenge_method'].reduce((params, field) => {
        if (preAuth[field]) {
          params.set(field, preAuth[field]);
        }
        return params;
      }, new URLSearchParams());
    },
    [preAuth],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const grantAuthorization = async () => {
    await fetch('/oauth/authorize', {
      method: 'POST',
      body: authorizationParams,
      credentials: 'same-origin',
      headers: {
        'X-CSRF-Token': authenticityTokens.grantAuthorization,
      },
    });
  };

  const denyAuthorization = async () => {
    await fetch('/oauth/authorize', {
      method: 'DELETE',
      body: authorizationParams,
      credentials: 'same-origin',
      headers: {
        'X-CSRF-Token': authenticityTokens.denyAuthorization,
      },
    });
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

AuthorizationPrompt.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default AuthorizationPrompt;
