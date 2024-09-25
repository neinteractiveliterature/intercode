import { ApolloError } from '@apollo/client';
import { replace, redirect, useSubmit, useNavigation, useActionData } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { parseCmsContent } from '../parseCmsContent';
import useLoginRequired from '../Authentication/useLoginRequired';
import { ClickwrapAgreementQueryDocument } from './queries.generated';
import { AcceptClickwrapAgreementDocument } from './mutations.generated';
import { Route } from './+types/index';

export async function action({ context }: Route.ActionArgs) {
  try {
    await context.client.mutate({ mutation: AcceptClickwrapAgreementDocument });
    return redirect('/my_profile/setup');
  } catch (err) {
    await context.authenticityTokensManager.refresh();
    await context.client.resetStore();
    return err;
  }
}

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: ClickwrapAgreementQueryDocument });
  if (data.convention.my_profile?.accepted_clickwrap_agreement) {
    throw replace('/');
  }

  return data;
}

function ClickwrapAgreement({ loaderData: data }: Route.ComponentProps) {
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

export default ClickwrapAgreement;
