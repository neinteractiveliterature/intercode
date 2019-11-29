import React from 'react';
import { useApolloClient, useMutation } from 'react-apollo-hooks';
import { Redirect, useHistory, useRouteMatch } from 'react-router-dom';

import { DeleteEventProposal } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import EventProposalForm from './EventProposalForm';
import { EventProposalQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import { useConfirm } from '../ModalDialogs/Confirm';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';

function EditEventProposal() {
  const history = useHistory();
  const match = useRouteMatch();
  const eventProposalId = Number.parseInt(match.params.id, 10);
  const { data, error } = useQuerySuspended(EventProposalQuery, { variables: { eventProposalId } });
  const [deleteProposal] = useMutation(DeleteEventProposal);
  const confirm = useConfirm();
  const apolloClient = useApolloClient();

  usePageTitle(
    useValueUnless(() => `Editing “${data.eventProposal.title}”`, error),
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (data.eventProposal.event) {
    return <Redirect to={`/events/${data.eventProposal.event.id}/edit`} />;
  }

  const canDelete = data.currentAbility.can_delete_event_proposal;
  const deleteButtonProps = {
    children: 'Delete proposal',
    className: 'btn btn-danger',
    onClick: () => confirm({
      prompt: 'Are you sure?  This will erase your proposal along with everything you’ve written here.',
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
          <h1>Propose an event</h1>
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
        exitButton={{ caption: 'Return to proposals page', url: '/pages/new-proposal' }}
      />
    </>
  );
}

export default EditEventProposal;
