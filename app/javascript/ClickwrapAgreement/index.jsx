import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useApolloClient } from 'react-apollo-hooks';
import { Redirect } from 'react-router-dom';

import { AcceptClickwrapAgreement } from './mutations.gql';
import { ClickwrapAgreementQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import useAsyncFunction from '../useAsyncFunction';
import parseCmsContent from '../parseCmsContent';
import AuthenticityTokensContext from '../AuthenticityTokensContext';
import useLoginRequired from '../Authentication/useLoginRequired';

function ClickwrapAgreement({ history }) {
  const { data, error } = useQuerySuspended(ClickwrapAgreementQuery);
  const [acceptMutate] = useMutation(AcceptClickwrapAgreement);
  const [accept, acceptError, acceptInProgress] = useAsyncFunction(acceptMutate);
  const { refresh } = useContext(AuthenticityTokensContext);
  const apolloClient = useApolloClient();
  const loginRequired = useLoginRequired();

  const acceptClicked = async () => {
    try {
      await accept();
      history.push('/my_profile/setup');
    } catch (err) {
      await refresh();
      await apolloClient.resetStore();
      throw err;
    }
  };

  if (error) {
    return <ErrorDisplay graphqlError={error} />;
  }

  if (loginRequired) {
    return <></>;
  }

  // eslint-disable-next-line camelcase
  if (data.myProfile?.accepted_clickwrap_agreement) {
    return <Redirect to="/" />;
  }

  const { convention } = data;

  return (
    <>
      <p className="my-4">
        In order to use the
        {' '}
        {convention.name}
        {' '}
        web site, you must agree to the following terms of service.  If you do not agree, please
        close this browser window.
      </p>

      <div className="px-4">
        <div className="card">
          <div className="card-header">
            {convention.name}
            {' terms of service'}
          </div>
          <div className="card-body">
            {parseCmsContent(convention.clickwrap_agreement_html).bodyComponents}

            <ErrorDisplay graphQLError={acceptError} />
          </div>
          <div className="card-footer text-right">
            <button
              className="btn btn-primary"
              type="button"
              onClick={acceptClicked}
              disabled={acceptInProgress}
            >
              I agree
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

ClickwrapAgreement.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default ClickwrapAgreement;
