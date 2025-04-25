import { ActionFunction, data, Link, LoaderFunction, Outlet, useFetcher, useLoaderData } from 'react-router';
import { ErrorDisplay, useConfirm } from '@neinteractiveliterature/litform';

import ConventionFormHeader from '../ConventionAdmin/ConventionFormHeader';
import usePageTitle from '../usePageTitle';
import humanize from '../humanize';
import { client } from '../useIntercodeApolloClient';
import {
  ConventionDisplayQueryData,
  ConventionDisplayQueryDocument,
  ConventionDisplayQueryVariables,
} from './queries.generated';
import { SetConventionCanceledDocument } from './mutations.generated';

export const action: ActionFunction = async ({ params: { id }, request }) => {
  try {
    const formData = await request.formData();
    const canceled = formData.get('canceled')?.toString() === 'true';
    const result = await client.mutate({
      mutation: SetConventionCanceledDocument,
      variables: { id, canceled },
    });
    return data(result.data);
  } catch (error) {
    return error;
  }
};

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data } = await client.query<ConventionDisplayQueryData, ConventionDisplayQueryVariables>({
    query: ConventionDisplayQueryDocument,
    variables: { id: id ?? '' },
  });
  return data;
};

function ConventionDisplay() {
  const data = useLoaderData() as ConventionDisplayQueryData;
  const confirm = useConfirm();
  const fetcher = useFetcher();

  usePageTitle(data.convention.name);

  const { convention } = data;
  const { organization } = convention;
  const conventionUrl = new URL(`//${convention.domain}`, window.location.href);
  conventionUrl.port = window.location.port;
  const editConventionSettingsUrl = new URL(conventionUrl.toString(), window.location.href);
  editConventionSettingsUrl.pathname = '/convention/edit';

  return (
    <>
      <ConventionFormHeader convention={convention} />

      <dl className="row">
        <dt className="col-md-3">Ticket mode</dt>
        <dd className="col-md-9">{humanize(convention.ticket_mode)}</dd>

        <dt className="col-md-3">Organization</dt>
        <dd className="col-md-9">
          {organization ? <Link to={`/organizations/${organization.id}`}>{organization.name}</Link> : 'None'}
        </dd>

        <dt className="col-md-3">Web site</dt>
        <dd className="col-md-9">
          <a href={conventionUrl.toString()}>{conventionUrl.toString()}</a>
        </dd>

        <dt className="col-md-3">Email from</dt>
        <dd className="col-md-9">{convention.email_from}</dd>
      </dl>

      <div>
        <a href={editConventionSettingsUrl.toString()} className="btn btn-outline-secondary me-2">
          Edit convention settings
        </a>

        <Link to="./clone" className="btn btn-outline-secondary me-2">
          Clone convention
        </Link>

        {convention.canceled ? (
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() =>
              confirm({
                prompt: `Are you sure you want to uncancel ${convention.name}?`,
                action: () => fetcher.submit({ canceled: false }, { method: 'PATCH' }),
                renderError: (e) => <ErrorDisplay graphQLError={e} />,
              })
            }
          >
            Uncancel convention
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() =>
              confirm({
                prompt: `Are you sure you want to cancel ${convention.name}?`,
                action: () => fetcher.submit({ canceled: true }, { method: 'PATCH' }),
                renderError: (e) => <ErrorDisplay graphQLError={e} />,
              })
            }
          >
            Cancel convention
          </button>
        )}
      </div>

      <Outlet />
    </>
  );
}

export const Component = ConventionDisplay;
