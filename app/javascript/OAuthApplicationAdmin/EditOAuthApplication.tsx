import { useState } from 'react';
import {
  ActionFunction,
  LoaderFunction,
  RouterContextProvider,
  redirect,
  useLoaderData,
  useFetcher,
} from 'react-router';
import { CopyToClipboardButton, ErrorDisplay, useConfirm } from '@neinteractiveliterature/litform';

import usePageTitle from '../usePageTitle';
import { apolloClientContext } from '../AppContexts';
import { OAuthApplicationsQueryData, OAuthApplicationsQueryDocument } from './queries.generated';
import {
  UpdateOAuthApplicationDocument,
  RegenerateOAuthApplicationSecretDocument,
  RegenerateOAuthApplicationSecretMutationData,
} from './mutations.generated';
import OAuthApplicationForm, { EditingOAuthApplication } from './OAuthApplicationForm';

type LoaderResult = {
  initialApplication: OAuthApplicationsQueryData['oauth_applications'][number];
};

export const loader: LoaderFunction<RouterContextProvider> = async ({ context, params: { id } }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<OAuthApplicationsQueryData>({ query: OAuthApplicationsQueryDocument });
  if (!data) return new Response(null, { status: 404 });

  const initialApplication = data.oauth_applications.find((app) => app.id === id);
  if (!initialApplication) return new Response(null, { status: 404 });

  return { initialApplication } satisfies LoaderResult;
};

export const action: ActionFunction<RouterContextProvider> = async ({ context, params: { id }, request }) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'PATCH') {
      const oauth_application = (await request.json()) as EditingOAuthApplication;
      await client.mutate({
        mutation: UpdateOAuthApplicationDocument,
        variables: { input: { id, oauth_application } },
      });
      return redirect('/admin_oauth_applications');
    }

    if (request.method === 'POST') {
      const { data } = await client.mutate<RegenerateOAuthApplicationSecretMutationData>({
        mutation: RegenerateOAuthApplicationSecretDocument,
        variables: { input: { id } },
      });
      return { secret: data!.regenerateOAuthApplicationSecret.secret };
    }

    return new Response(null, { status: 404 });
  } catch (error) {
    return error;
  }
};

function EditOAuthApplication() {
  const { initialApplication } = useLoaderData() as LoaderResult;
  const [application, setApplication] = useState<EditingOAuthApplication>({
    name: initialApplication.name,
    redirect_uri: initialApplication.redirect_uri,
    scopes: initialApplication.scopes,
    confidential: initialApplication.confidential,
  });

  const saveFetcher = useFetcher();
  const regenerateFetcher = useFetcher();
  const confirm = useConfirm();

  const saveError = saveFetcher.data instanceof Error ? saveFetcher.data : undefined;
  const regenerateError = regenerateFetcher.data instanceof Error ? regenerateFetcher.data : undefined;
  const newSecret =
    regenerateFetcher.data && !(regenerateFetcher.data instanceof Error)
      ? (regenerateFetcher.data as { secret: string }).secret
      : undefined;
  const saveInProgress = saveFetcher.state !== 'idle';

  usePageTitle(`Editing "${initialApplication.name}"`);

  const saveClicked = () => {
    saveFetcher.submit(application, { encType: 'application/json', method: 'PATCH' });
  };

  const regenerateClicked = () => {
    confirm({
      prompt:
        'Are you sure you want to regenerate the secret for this application? Any existing integrations using the old secret will break.',
      action: () => regenerateFetcher.submit({}, { encType: 'application/json', method: 'POST' }),
      renderError: (err) => <ErrorDisplay graphQLError={err} />,
    });
  };

  const readOnlyFields = initialApplication.is_intercode_frontend ? ['redirect_uri', 'scopes'] : [];

  return (
    <div>
      <h1 className="mb-4">Editing {initialApplication.name}</h1>

      <div className="mb-4">
        <div className="fw-bold mb-1">Application ID (Client ID)</div>
        <div className="d-flex align-items-center gap-2">
          <code className="bg-light px-2 py-1 rounded">{initialApplication.uid}</code>
          <CopyToClipboardButton
            className="btn btn-sm btn-outline-secondary"
            text={initialApplication.uid}
            copiedProps={{ className: 'btn btn-sm btn-outline-success' }}
            defaultText="Copy"
            copiedText="Copied!"
            iconSet="bootstrap-icons"
          />
        </div>
      </div>

      {newSecret ? (
        <div className="alert alert-warning mb-4">
          <p className="fw-bold">New secret generated — copy it now, it will not be shown again.</p>
          <div className="d-flex align-items-center gap-2">
            <code className="bg-light px-2 py-1 rounded flex-grow-1">{newSecret}</code>
            <CopyToClipboardButton
              className="btn btn-sm btn-outline-secondary"
              text={newSecret}
              copiedProps={{ className: 'btn btn-sm btn-outline-success' }}
              defaultText="Copy"
              copiedText="Copied!"
              iconSet="bootstrap-icons"
            />
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <div className="fw-bold mb-1">Client Secret</div>
          <p className="text-secondary mb-1">
            The secret is not displayed after creation. If you&apos;ve lost it, regenerate it below.
          </p>
          <ErrorDisplay graphQLError={regenerateError} />
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={regenerateClicked}>
            Regenerate secret
          </button>
        </div>
      )}

      <OAuthApplicationForm value={application} onChange={setApplication} readOnlyFields={readOnlyFields} />
      <ErrorDisplay graphQLError={saveError} />
      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={saveInProgress}>
        Save changes
      </button>
    </div>
  );
}

export const Component = EditOAuthApplication;
