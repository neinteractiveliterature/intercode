import { useState } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import EmailRouteForm from './EmailRouteForm';
import buildEmailRouteInput from './buildEmailRouteInput';
import { EmailRouteFieldsFragment } from './queries.generated';
import { Link, redirect } from 'react-router';
import { CreateEmailRouteDocument } from './mutations.generated';
import { EmailRouteInput } from 'graphqlTypes.generated';
import { useTranslation } from 'react-i18next';
import { useFetcher } from 'react-router';
import { Route, Info } from './+types/NewEmailRouteModal';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, context }: Route.ActionArgs) {
  try {
    if (request.method === 'POST') {
      const emailRoute = (await request.json()) as EmailRouteInput;
      await context.get(apolloClientContext).mutate({
        mutation: CreateEmailRouteDocument,
        variables: { emailRoute },
      });
      await context.get(apolloClientContext).resetStore();
      return redirect('..');
    } else {
      throw new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

function NewEmailRouteModal(): JSX.Element {
  const { t } = useTranslation();
  const [emailRoute, setEmailRoute] = useState<EmailRouteFieldsFragment>({
    __typename: 'EmailRoute',
    id: '',
    receiver_address: '',
    forward_addresses: [],
  });
  const fetcher = useFetcher<Info['actionData']>();
  const createClicked = async () => {
    await fetcher.submit(buildEmailRouteInput(emailRoute), { method: 'POST', encType: 'application/json' });
  };
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const inProgress = fetcher.state !== 'idle';

  return (
    <Modal visible dialogClassName="modal-lg">
      <div className="modal-header">{t('admin.emailRoutes.newEmailRoute.title')}</div>

      <div className="modal-body">
        <EmailRouteForm emailRoute={emailRoute} onChange={setEmailRoute} />

        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>

      <div className="modal-footer">
        <Link className="btn btn-secondary" type="button" to=".." aria-disabled={inProgress}>
          {t('buttons.cancel')}
        </Link>

        <button className="btn btn-primary" type="button" onClick={createClicked} disabled={inProgress}>
          {t('admin.emailRoutes.newEmailRoute.createButton')}
        </button>
      </div>
    </Modal>
  );
}

export default NewEmailRouteModal;
