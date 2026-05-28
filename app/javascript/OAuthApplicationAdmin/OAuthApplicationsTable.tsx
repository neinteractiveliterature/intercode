import { useState } from 'react';
import { Link, LoaderFunction, RouterContextProvider, useFetcher, useLoaderData } from 'react-router';
import { useConfirm, ErrorDisplay, DisclosureTriangle } from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';

import usePageTitle from '../usePageTitle';
import { apolloClientContext } from '../AppContexts';
import { OAuthApplicationsQueryData, OAuthApplicationsQueryDocument } from './queries.generated';

const COLLAPSED_URI_COUNT = 1;

type RedirectUriListProps = {
  redirectUri: string | null | undefined;
};

function RedirectUriList({ redirectUri }: RedirectUriListProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const uris = (redirectUri ?? '').split(/\s+/).filter(Boolean);

  if (uris.length === 0) return null;
  if (uris.length <= COLLAPSED_URI_COUNT) {
    return <code className="small">{uris[0]}</code>;
  }

  return (
    <>
      <button className="hidden-button text-start" type="button" onClick={() => setExpanded((prev) => !prev)}>
        <DisclosureTriangle expanded={expanded} /> <code className="small">{uris[0]}</code>
        {!expanded && (
          <span className="text-secondary ms-1">
            {t('general.moreCount', { count: uris.length - COLLAPSED_URI_COUNT })}
          </span>
        )}
      </button>
      {expanded && (
        <ul className="list-unstyled mb-0 mt-1">
          {uris.slice(1).map((uri) => (
            <li key={uri}>
              <code className="small">{uri}</code>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

type LoaderResult = {
  applications: OAuthApplicationsQueryData['oauth_applications'];
};

export const loader: LoaderFunction<RouterContextProvider> = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<OAuthApplicationsQueryData>({ query: OAuthApplicationsQueryDocument });
  return { applications: data?.oauth_applications ?? [] } satisfies LoaderResult;
};

function OAuthApplicationsTable() {
  const { t } = useTranslation();
  const { applications } = useLoaderData() as LoaderResult;
  const fetcher = useFetcher();
  const confirm = useConfirm();
  const deleteError = fetcher.data instanceof Error ? fetcher.data : undefined;

  usePageTitle(t('navigation.admin.oauth2Applications'));

  const deleteClicked = (application: OAuthApplicationsQueryData['oauth_applications'][number]) => {
    confirm({
      prompt: t('admin.oauthApplications.deletePrompt', { name: application.name }),
      action: () =>
        fetcher.submit(
          {},
          {
            method: 'DELETE',
            action: `/admin_oauth_applications/${application.id}`,
            encType: 'application/json',
          },
        ),
      renderError: (err) => <ErrorDisplay graphQLError={err} />,
    });
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <h1 className="flex-grow-1">{t('navigation.admin.oauth2Applications')}</h1>
        <Link to="new" className="btn btn-success">
          {t('admin.oauthApplications.newApplication')}
        </Link>
      </div>

      <ErrorDisplay graphQLError={deleteError} />

      {applications.length === 0 ? (
        <p className="text-secondary">{t('admin.oauthApplications.noApplications')}</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>{t('admin.oauthApplications.tableHeaders.name')}</th>
              <th>{t('admin.oauthApplications.tableHeaders.redirectUris')}</th>
              <th>{t('admin.oauthApplications.tableHeaders.confidential')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td className="align-middle">{application.name}</td>
                <td className="align-middle">
                  <RedirectUriList redirectUri={application.redirect_uri} />
                </td>
                <td className="align-middle">
                  {application.confidential ? (
                    <i className="bi-lock-fill text-success">
                      <span className="visually-hidden">{t('general.booleans.yes')}</span>
                    </i>
                  ) : (
                    <i className="bi-unlock text-secondary">
                      <span className="visually-hidden">{t('general.booleans.no')}</span>
                    </i>
                  )}
                </td>
                <td className="align-middle text-end">
                  <Link to={`${application.id}/edit`} className="btn btn-sm btn-outline-primary me-2">
                    {t('buttons.edit')}
                  </Link>
                  {!application.is_intercode_frontend && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteClicked(application)}
                    >
                      {t('buttons.delete')}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export const Component = OAuthApplicationsTable;
