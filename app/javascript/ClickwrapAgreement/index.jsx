import React, { useContext } from 'react';
import { useMutation, useQuery, useApolloClient } from '@apollo/react-hooks';
import { useHistory, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AcceptClickwrapAgreement } from './mutations.gql';
import { ClickwrapAgreementQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import useAsyncFunction from '../useAsyncFunction';
import parseCmsContent from '../parseCmsContent';
import LoadingIndicator from '../LoadingIndicator';
import AuthenticityTokensContext from '../AuthenticityTokensContext';
import useLoginRequired from '../Authentication/useLoginRequired';

function ClickwrapAgreement() {
  const { t } = useTranslation();
  const history = useHistory();
  const { data, loading, error } = useQuery(ClickwrapAgreementQuery);
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

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphqlError={error} />;
  }

  if (loginRequired) {
    return <></>;
  }

  if (data.myProfile?.accepted_clickwrap_agreement) {
    return <Redirect to="/" />;
  }

  const { convention } = data;

  return (
    <>
      <p className="my-4">
        {t(
          'clickwrap.disclosureMessage',
          'In order to use the {{ conventionName }} web site, you must agree to the following terms of service.  If you do not agree, please close this browser window.',
          { conventionName: convention.name },
        )}
      </p>

      <div className="px-4">
        <div className="card">
          <div className="card-header">
            {t('clickwrap.header', '{{ conventionName }} terms of service', { conventionName: convention.name })}
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
              {t('clickwrap.agreeButton', 'I agree')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClickwrapAgreement;
