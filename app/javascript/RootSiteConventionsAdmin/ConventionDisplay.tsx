import { useEffect } from 'react';
import { Link, LoaderFunction, useLoaderData, useLocation } from 'react-router-dom';
import { useModal, ErrorDisplay, useConfirm } from '@neinteractiveliterature/litform';

import ConventionFormHeader from '../ConventionAdmin/ConventionFormHeader';
import NewConventionModal from './NewConventionModal';
import usePageTitle from '../usePageTitle';
import { useSetConventionCanceledMutation } from './mutations.generated';
import humanize from '../humanize';
import { client } from '../useIntercodeApolloClient';
import {
  ConventionDisplayQueryData,
  ConventionDisplayQueryDocument,
  ConventionDisplayQueryVariables,
} from './queries.generated';

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
  const cloneModal = useModal();
  const [setConventionCanceled] = useSetConventionCanceledMutation();
  const location = useLocation();

  const { close: closeCloneModal } = cloneModal;

  usePageTitle(data.convention.name);
  useEffect(() => {
    closeCloneModal();
  }, [closeCloneModal, location.pathname]);

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

        <button type="button" className="btn btn-outline-secondary me-2" onClick={cloneModal.open}>
          Clone convention
        </button>

        {convention.canceled ? (
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() =>
              confirm({
                prompt: `Are you sure you want to uncancel ${convention.name}?`,
                action: () =>
                  setConventionCanceled({
                    variables: { id: convention.id, canceled: false },
                  }),
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
                action: () =>
                  setConventionCanceled({
                    variables: { id: convention.id, canceled: true },
                  }),
                renderError: (e) => <ErrorDisplay graphQLError={e} />,
              })
            }
          >
            Cancel convention
          </button>
        )}
      </div>

      <NewConventionModal visible={cloneModal.visible} close={cloneModal.close} cloneConvention={convention} />
    </>
  );
}

export const Component = ConventionDisplay;
