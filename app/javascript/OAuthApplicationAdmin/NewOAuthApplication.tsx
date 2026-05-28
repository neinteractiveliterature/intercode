import { useState } from 'react';
import { ActionFunction, RouterContextProvider, useFetcher } from 'react-router';
import { CopyToClipboardButton, ErrorDisplay } from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';

import usePageTitle from '../usePageTitle';
import { apolloClientContext } from '../AppContexts';
import { OAuthApplicationsQueryDocument } from './queries.generated';
import { CreateOAuthApplicationDocument, CreateOAuthApplicationMutationData } from './mutations.generated';
import OAuthApplicationForm, { EditingOAuthApplication } from './OAuthApplicationForm';

type CreatedApplication = {
  id: string;
  uid: string;
  name: string;
  secret: string;
};

export const action: ActionFunction<RouterContextProvider> = async ({ context, request }) => {
  const client = context.get(apolloClientContext);
  if (request.method !== 'POST') return new Response(null, { status: 404 });

  try {
    const oauth_application = (await request.json()) as EditingOAuthApplication;
    const { data } = await client.mutate<CreateOAuthApplicationMutationData>({
      mutation: CreateOAuthApplicationDocument,
      variables: { input: { oauth_application } },
      refetchQueries: [{ query: OAuthApplicationsQueryDocument }],
      awaitRefetchQueries: true,
    });
    return {
      id: data!.createOAuthApplication.oauth_application.id,
      uid: data!.createOAuthApplication.oauth_application.uid,
      name: data!.createOAuthApplication.oauth_application.name,
      secret: data!.createOAuthApplication.secret,
    } satisfies CreatedApplication;
  } catch (error) {
    return error;
  }
};

function NewOAuthApplication() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const created = fetcher.data && !(fetcher.data instanceof Error) ? (fetcher.data as CreatedApplication) : undefined;
  const inProgress = fetcher.state !== 'idle';

  const [application, setApplication] = useState<EditingOAuthApplication>({
    name: '',
    redirect_uri: '',
    scopes: ['public'],
    confidential: true,
  });

  usePageTitle(t('admin.oauthApplications.newApplicationTitle'));

  const saveClicked = () => {
    fetcher.submit(application, { method: 'POST', encType: 'application/json' });
  };

  if (created) {
    return (
      <div>
        <h1 className="mb-4">{t('admin.oauthApplications.applicationCreated')}</h1>
        <div className="alert alert-success mb-4">
          <p>
            <strong>{created.name}</strong> {t('admin.oauthApplications.createSuccessSuffix')}
          </p>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <div className="mb-3">
              <div className="fw-bold mb-1">{t('admin.oauthApplications.applicationId')}</div>
              <div className="d-flex align-items-center gap-2">
                <code className="bg-light px-2 py-1 rounded flex-grow-1">{created.uid}</code>
                <CopyToClipboardButton
                  className="btn btn-sm btn-outline-secondary"
                  text={created.uid}
                  copiedProps={{ className: 'btn btn-sm btn-outline-success' }}
                  defaultText={t('copyToClipboard.defaultText')}
                  copiedText={t('copyToClipboard.defaultSuccess')}
                  iconSet="bootstrap-icons"
                />
              </div>
            </div>
            <div>
              <div className="fw-bold mb-1">{t('admin.oauthApplications.clientSecret')}</div>
              <div className="d-flex align-items-center gap-2">
                <code className="bg-light px-2 py-1 rounded flex-grow-1">{created.secret}</code>
                <CopyToClipboardButton
                  className="btn btn-sm btn-outline-secondary"
                  text={created.secret}
                  copiedProps={{ className: 'btn btn-sm btn-outline-success' }}
                  defaultText={t('copyToClipboard.defaultText')}
                  copiedText={t('copyToClipboard.defaultSuccess')}
                  iconSet="bootstrap-icons"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex gap-2">
          <a href={`/admin_oauth_applications/${created.id}/edit`} className="btn btn-primary">
            {t('admin.oauthApplications.editApplication')}
          </a>
          <a href="/admin_oauth_applications" className="btn btn-secondary">
            {t('admin.oauthApplications.backToList')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">{t('admin.oauthApplications.newApplicationTitle')}</h1>
      <OAuthApplicationForm value={application} onChange={setApplication} />
      <ErrorDisplay graphQLError={error} />
      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={inProgress}>
        {t('admin.oauthApplications.createButton')}
      </button>
    </div>
  );
}

export const Component = NewOAuthApplication;
