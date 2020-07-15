import React from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import {
  Redirect, useHistory, useParams, Link,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { DeleteEventProposal } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import EventProposalForm from './EventProposalForm';
import { EventProposalQuery } from './queries.gql';
import { useConfirm } from '../ModalDialogs/Confirm';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import PageLoadingIndicator from '../PageLoadingIndicator';

function EditEventProposal() {
  const { t } = useTranslation();
  const history = useHistory();
  const eventProposalId = Number.parseInt(useParams().id, 10);
  const { data, loading, error } = useQuery(EventProposalQuery, { variables: { eventProposalId } });
  const [deleteProposal] = useMutation(DeleteEventProposal);
  const confirm = useConfirm();
  const apolloClient = useApolloClient();

  usePageTitle(
    useValueUnless(
      () => t('general.pageTitles.editing', 'Editing “{{ title }}”', { title: data.eventProposal.title }),
      error || loading,
    ),
  );

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (data.eventProposal.event) {
    return <Redirect to={`/events/${data.eventProposal.event.id}/edit`} />;
  }

  const canDelete = data.currentAbility.can_delete_event_proposal;
  const deleteButtonProps = {
    children: t('eventProposals.edit.deleteButton', 'Delete proposal'),
    className: 'btn btn-danger',
    onClick: () => confirm({
      prompt: t(
        'eventProposals.edit.deleteConfirmation',
        'Are you sure?  This will erase your proposal along with everything you’ve written here.',
      ),
      action: async () => {
        await deleteProposal({ variables: { id: eventProposalId } });
        await apolloClient.clearStore();
        history.replace('/pages/new-proposal');
      },
      renderError: (e) => <ErrorDisplay graphQLError={e} />,
    }),
  };

  return (
    <>
      <div className="row mb-2">
        <div className="col-md-9">
          <h1>{t('navigation.events.newProposal', 'Propose an event')}</h1>
        </div>
        <div className="col-md-3">
          {canDelete && (
            <>
              <div className="d-md-none"><button type="button" {...deleteButtonProps} /></div>
              <div className="d-none d-md-block">
                <div className="text-right"><button type="button" {...deleteButtonProps} /></div>
              </div>
            </>
          )}
        </div>
      </div>
      <EventProposalForm
        eventProposalId={eventProposalId}
        afterSubmit={() => history.push('/pages/new-proposal')}
        exitButton={(
          <Link className="btn btn-outline-secondary mr-2" to="/pages/new-proposal">
            {t('eventProposals.edit.exitButton', 'Return to proposals page')}
          </Link>
        )}
      />
    </>
  );
}

export default EditEventProposal;
