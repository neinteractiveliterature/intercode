import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';

import { AcceptClickwrapAgreement } from './mutations.gql';
import { ClickwrapAgreementQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import parsePageContent from '../parsePageContent';
import useAsyncFunction from '../useAsyncFunction';

function ClickwrapAgreement({ history }) {
  const { data, error } = useQuerySuspended(ClickwrapAgreementQuery);
  const [acceptMutate] = useMutation(AcceptClickwrapAgreement);
  const [accept, acceptError, acceptInProgress] = useAsyncFunction(acceptMutate);

  const acceptClicked = async () => {
    await accept();
    history.push('/my_profile/setup');
  };

  if (error) {
    return <ErrorDisplay graphqlError={error} />;
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
            {parsePageContent(convention.clickwrap_agreement_html).bodyComponents}

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
