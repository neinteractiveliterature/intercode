import { ApolloError } from '@apollo/client';
import {
  LoaderFunction,
  useLoaderData,
  replace,
  ActionFunction,
  redirect,
  useSubmit,
  useNavigation,
  useActionData,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { parseCmsContent } from '../parseCmsContent';
import useLoginRequired from '../Authentication/useLoginRequired';
import { ClickwrapAgreementQueryData, ClickwrapAgreementQueryDocument } from './queries.generated';
import AuthenticityTokensManager from '../AuthenticityTokensContext';
import { client } from '../useIntercodeApolloClient';
import { AcceptClickwrapAgreementDocument } from './mutations.generated';

export const action: ActionFunction = async () => {
  try {
    await client.mutate({ mutation: AcceptClickwrapAgreementDocument });
    return redirect('/my_profile/setup');
  } catch (err) {
    await AuthenticityTokensManager.instance.refresh();
    await client.resetStore();
    return err;
  }
};

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<ClickwrapAgreementQueryData>({ query: ClickwrapAgreementQueryDocument });
  if (data.convention.my_profile?.accepted_clickwrap_agreement) {
    return replace('/');
  }

  return data;
};

function ClickwrapAgreement() {
  const data = useLoaderData() as ClickwrapAgreementQueryData;
  const { t } = useTranslation();
  const loginRequired = useLoginRequired();
  const submit = useSubmit();
  const navigation = useNavigation();
  const acceptInProgress = navigation.state !== 'idle';
  const acceptError = useActionData() as ApolloError | undefined;

  if (loginRequired) {
    return <></>;
  }

  const { convention } = data;

  return (
    <>
      <p className="my-4">{t('clickwrap.disclosureMessage', { conventionName: convention.name })}</p>
      <div className="px-4">
        <div className="card">
          <div className="card-header">
            {t('clickwrap.header', {
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
              onClick={() => submit({}, { method: 'POST' })}
              disabled={acceptInProgress}
            >
              {t('clickwrap.agreeButton')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export const Component = ClickwrapAgreement;
