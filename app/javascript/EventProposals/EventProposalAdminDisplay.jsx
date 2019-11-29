import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-apollo-hooks';

import AdminNotes from '../BuiltInFormControls/AdminNotes';
import EventProposalDisplay from './EventProposalDisplay';
import EventProposalStatusUpdater from './EventProposalStatusUpdater';
import { EventProposalQueryWithOwner, EventProposalAdminNotesQuery } from './queries.gql';
import { UpdateEventProposalAdminNotes } from './mutations.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';

function EventProposalAdminNotes({ eventProposalId }) {
  const { data, error } = useQuerySuspended(EventProposalAdminNotesQuery, {
    variables: { eventProposalId },
  });

  const [updateAdminNotesMutate] = useMutation(UpdateEventProposalAdminNotes);
  const updateAdminNotes = useCallback(
    (adminNotes) => updateAdminNotesMutate({
      variables: { eventProposalId, adminNotes },
      update: (cache) => {
        const { eventProposal } = cache.readQuery({
          query: EventProposalAdminNotesQuery,
          variables: { eventProposalId },
        });
        cache.writeQuery({
          query: EventProposalAdminNotesQuery,
          variables: { eventProposalId },
          data: {
            eventProposal: {
              ...eventProposal,
              admin_notes: adminNotes,
            },
          },
        });
      },
    }),
    [eventProposalId, updateAdminNotesMutate],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <AdminNotes
      value={data.eventProposal.admin_notes}
      mutate={updateAdminNotes}
    />
  );
}

EventProposalAdminNotes.propTypes = {
  eventProposalId: PropTypes.number.isRequired,
};

function EventProposalAdminDisplay({ match }) {
  const eventProposalId = Number.parseInt(match.params.id, 10);
  const { data, error } = useQuerySuspended(EventProposalQueryWithOwner, {
    variables: { eventProposalId },
  });
  usePageTitle(
    useValueUnless(() => data.eventProposal.title, error),
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <div className="d-flex justify-space-between align-items-baseline">
        <div className="col">
          <h1>
            {data.eventProposal.title}
            {' '}
            <small className="text-muted">
              (
              {data.eventProposal.event_category.name}
              )
            </small>
          </h1>
        </div>

        {
          data.currentAbility.can_update_event_proposal
            ? (
              <EventProposalStatusUpdater
                eventProposal={data.eventProposal}
              />
            )
            : (
              <div>
                <strong>Status: </strong>
                {data.eventProposal.status}
              </div>
            )
        }
      </div>

      <div className="my-4 d-flex align-items-end">
        {
          data.eventProposal.event
            ? (
              <Link to={`/events/${data.eventProposal.event.id}`} className="btn btn-outline-primary">
                Go to event
              </Link>
            )
            : null
        }
        {
          !data.eventProposal.event && data.currentAbility.can_update_event_proposal
            ? (
              <Link
                to={`/admin_event_proposals/${eventProposalId}/edit`}
                className="btn btn-outline-primary"
              >
                Edit proposal
              </Link>
            )
            : null
        }
        <div className="flex-grow-1 d-flex justify-content-end">
          {data.currentAbility.can_read_admin_notes_on_event_proposal
            && <EventProposalAdminNotes eventProposalId={eventProposalId} />}
        </div>
      </div>

      <EventProposalDisplay eventProposalId={eventProposalId} />
    </>
  );
}

EventProposalAdminDisplay.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default EventProposalAdminDisplay;
