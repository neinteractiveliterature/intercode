import { useContext } from 'react';
import { useApolloClient } from '@apollo/client';
import { useHistory, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoadQueryWrapper, ErrorDisplay } from '@neinteractiveliterature/litform';

import parseCmsContent from '../parseCmsContent';
import AuthenticityTokensContext from '../AuthenticityTokensContext';
import useLoginRequired from '../Authentication/useLoginRequired';
import { useAcceptClickwrapAgreementMutation } from './mutations.generated';
import { useClickwrapAgreementQuery } from './queries.generated';

export default LoadQueryWrapper(useClickwrapAgreementQuery, function ClickwrapAgreement({ data }) {
  const { t } = useTranslation();
  const history = useHistory();
  const [accept, { error: acceptError, loading: acceptInProgress }] =
    useAcceptClickwrapAgreementMutation();
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

  if (loginRequired) {
    return <></>;
  }

  if (data.convention.my_profile?.accepted_clickwrap_agreement) {
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
            {t('clickwrap.header', '{{ conventionName }} terms of service', {
              conventionName: convention.name,
            })}
          </div>
          <div className="card-body">
            {parseCmsContent(convention.clickwrap_agreement_html ?? 'p').bodyComponents}

            <ErrorDisplay graphQLError={acceptError} />
          </div>
          <div className="card-footer text-end">
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
});
