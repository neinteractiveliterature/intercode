import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { humanize } from 'inflected';
import { LoadingIndicator, ErrorDisplay, LoadQueryWrapper } from '@neinteractiveliterature/litform';

import AdminNotes from '../BuiltInFormControls/AdminNotes';
import EventProposalDisplay from './EventProposalDisplay';
import EventProposalStatusUpdater from './EventProposalStatusUpdater';
import { EventProposalAdminNotesQuery } from './queries';
import usePageTitle from '../usePageTitle';
import {
  EventProposalAdminNotesQueryData,
  useEventProposalAdminNotesQuery,
  useEventProposalQueryWithOwner,
} from './queries.generated';
import { useUpdateEventProposalAdminNotesMutation } from './mutations.generated';

export type EventProposalAdminNotesProps = {
  eventProposalId: number;
};

function EventProposalAdminNotes({ eventProposalId }: EventProposalAdminNotesProps) {
  const { data, loading, error } = useEventProposalAdminNotesQuery({
    variables: { eventProposalId },
  });

  const [updateAdminNotesMutate] = useUpdateEventProposalAdminNotesMutation();
  const updateAdminNotes = useCallback(
    (adminNotes) =>
      updateAdminNotesMutate({
        variables: { eventProposalId, adminNotes },
        update: (cache) => {
          const queryData = cache.readQuery<EventProposalAdminNotesQueryData>({
            query: EventProposalAdminNotesQuery,
            variables: { eventProposalId },
          });
          if (!queryData) {
            return;
          }
          cache.writeQuery({
            query: EventProposalAdminNotesQuery,
            variables: { eventProposalId },
            data: {
              eventProposal: {
                ...queryData.eventProposal,
                admin_notes: adminNotes,
              },
            },
          });
        },
      }),
    [eventProposalId, updateAdminNotesMutate],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return <AdminNotes value={data?.eventProposal.admin_notes ?? ''} mutate={updateAdminNotes} />;
}

function useLoadEventProposal() {
  const eventProposalId = Number.parseInt(useParams<{ id: string }>().id, 10);
  return useEventProposalQueryWithOwner({ variables: { eventProposalId } });
}

export default LoadQueryWrapper(useLoadEventProposal, function EventProposalAdminDisplay({ data }) {
  usePageTitle(data.eventProposal.title);

  const eventProposalId = data.eventProposal.id;

  return (
    <>
      <div className="d-flex justify-space-between align-items-baseline">
        <div className="col">
          <h1>
            {data.eventProposal.title}{' '}
            <small className="text-muted">({data.eventProposal.event_category.name})</small>
          </h1>
        </div>

        {data.currentAbility.can_update_event_proposal ? (
          <EventProposalStatusUpdater eventProposal={data.eventProposal} />
        ) : (
          <div>
            <strong>Status: </strong>
            {humanize(data.eventProposal.status)}
          </div>
        )}
      </div>

      <div className="my-4 d-flex align-items-end">
        {data.eventProposal.event ? (
          <Link to={`/events/${data.eventProposal.event.id}`} className="btn btn-link">
            Go to event
          </Link>
        ) : null}
        {!data.eventProposal.event && data.currentAbility.can_update_event_proposal ? (
          <Link
            to={`/admin_event_proposals/${eventProposalId}/edit`}
            className="btn btn-outline-primary"
          >
            Edit proposal
          </Link>
        ) : null}
        <Link to={`/admin_event_proposals/${eventProposalId}/history`} className="btn btn-link">
          View edit history
        </Link>
        <div className="flex-grow-1 d-flex justify-content-end">
          {data.currentAbility.can_read_admin_notes_on_event_proposal && (
            <EventProposalAdminNotes eventProposalId={eventProposalId} />
          )}
        </div>
      </div>

      <EventProposalDisplay eventProposalId={eventProposalId} />
    </>
  );
});
