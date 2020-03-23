import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { humanize } from 'inflected';
import { useMutation } from '@apollo/react-hooks';

import ErrorDisplay from '../ErrorDisplay';
import ConventionFormHeader from '../ConventionAdmin/ConventionFormHeader';
import PageLoadingIndicator from '../PageLoadingIndicator';
import { useConventionQueryFromIdParam } from './conventionQueryHooks';
import useModal from '../ModalDialogs/useModal';
import NewConventionModal from './NewConventionModal';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import { useConfirm } from '../ModalDialogs/Confirm';
import { SetConventionCanceled } from './mutations.gql';

function ConventionDisplay() {
  const confirm = useConfirm();
  const cloneModal = useModal();
  const { id } = useParams();
  const { data, loading, error } = useConventionQueryFromIdParam();
  const [setConventionCanceled] = useMutation(SetConventionCanceled);

  const { close: closeCloneModal } = cloneModal;

  usePageTitle(useValueUnless(() => data.convention.name, error || loading));
  useEffect(
    () => {
      closeCloneModal();
    },
    [closeCloneModal, id],
  );

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

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
          {organization
            ? <Link to={`/organizations/${organization.id}`}>{organization.name}</Link>
            : 'None'}
        </dd>

        <dt className="col-md-3">Web site</dt>
        <dd className="col-md-9">
          <a href={conventionUrl.toString()}>{conventionUrl.toString()}</a>
        </dd>

        <dt className="col-md-3">Email from</dt>
        <dd className="col-md-9">{convention.email_from}</dd>
      </dl>

      <div>
        <a href={editConventionSettingsUrl.toString()} className="btn btn-outline-secondary mr-2">
          Edit convention settings
        </a>

        <button type="button" className="btn btn-outline-secondary mr-2" onClick={cloneModal.open}>
          Clone convention
        </button>

        {convention.canceled
          ? (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => confirm({
                prompt: `Are you sure you want to uncancel ${convention.name}?`,
                action: () => setConventionCanceled({
                  variables: { id: convention.id, canceled: false },
                }),
                renderError: (e) => <ErrorDisplay graphQLError={e} />,
              })}
            >
              Uncancel convention
            </button>
          )
          : (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => confirm({
                prompt: `Are you sure you want to cancel ${convention.name}?`,
                action: () => setConventionCanceled({
                  variables: { id: convention.id, canceled: true },
                }),
                renderError: (e) => <ErrorDisplay graphQLError={e} />,
              })}
            >
              Cancel convention
            </button>
          )}
      </div>

      <NewConventionModal
        visible={cloneModal.visible}
        close={cloneModal.close}
        cloneConvention={convention}
      />
    </>
  );
}

export default ConventionDisplay;
