import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LoadingIndicator, ErrorDisplay, LoadQueryWrapper } from '@neinteractiveliterature/litform';

import AdminNotes from '../BuiltInFormControls/AdminNotes';
import EventProposalDisplay from './EventProposalDisplay';
import EventProposalStatusUpdater from './EventProposalStatusUpdater';
import usePageTitle from '../usePageTitle';
import {
  EventProposalAdminNotesQueryData,
  EventProposalAdminNotesQueryDocument,
  useEventProposalAdminNotesQuery,
  useEventProposalQueryWithOwner,
} from './queries.generated';
import { useUpdateEventProposalAdminNotesMutation } from './mutations.generated';
import humanize from '../humanize';

export type EventProposalAdminNotesProps = {
  eventProposalId: string;
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
            query: EventProposalAdminNotesQueryDocument,
            variables: { eventProposalId },
          });
          if (!queryData) {
            return;
          }
          cache.writeQuery<EventProposalAdminNotesQueryData>({
            query: EventProposalAdminNotesQueryDocument,
            variables: { eventProposalId },
            data: {
              ...queryData,
              convention: {
                ...queryData.convention,
                event_proposal: {
                  ...queryData.convention.event_proposal,
                  admin_notes: adminNotes,
                },
              },
            },
          });
        },
      }),
    [eventProposalId, updateAdminNotesMutate],
  );

  if (loading) {
    return <LoadingIndicator iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return <AdminNotes value={data?.convention.event_proposal.admin_notes ?? ''} mutate={updateAdminNotes} />;
}

function useLoadEventProposal() {
  const eventProposalId = useParams<{ id: string }>().id;
  if (eventProposalId == null) {
    throw new Error('id not found in URL params');
  }
  return useEventProposalQueryWithOwner({ variables: { eventProposalId } });
}

export default LoadQueryWrapper(useLoadEventProposal, function EventProposalAdminDisplay({ data }) {
  usePageTitle(data.convention.event_proposal.title);

  const eventProposalId = data.convention.event_proposal.id;

  return (
    <>
      <div className="d-flex justify-space-between align-items-baseline">
        <div className="col">
          <h1>
            {data.convention.event_proposal.title}{' '}
            <small className="text-muted">({data.convention.event_proposal.event_category.name})</small>
          </h1>
        </div>

        {data.currentAbility.can_update_event_proposal ? (
          <EventProposalStatusUpdater eventProposal={data.convention.event_proposal} />
        ) : (
          <div>
            <strong>Status: </strong>
            {humanize(data.convention.event_proposal.status)}
          </div>
        )}
      </div>

      <div className="my-4 d-flex align-items-end">
        {data.convention.event_proposal.event ? (
          <Link to={`/events/${data.convention.event_proposal.event.id}`} className="btn btn-link">
            Go to event
          </Link>
        ) : null}
        {!data.convention.event_proposal.event && data.currentAbility.can_update_event_proposal ? (
          <Link to={`/admin_event_proposals/${eventProposalId}/edit`} className="btn btn-outline-primary">
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
