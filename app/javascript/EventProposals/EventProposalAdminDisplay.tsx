import { Link, useFetcher, useRouteLoaderData } from 'react-router';

import AdminNotes from '../BuiltInFormControls/AdminNotes';
import EventProposalDisplay from './EventProposalDisplay';
import EventProposalStatusUpdater from './EventProposalStatusUpdater';
import usePageTitle from '../usePageTitle';
import { EventProposalAdminNotesQueryDocument, EventProposalQueryWithOwnerQueryData } from './queries.generated';
import humanize from '../humanize';
import { NamedRoute } from '../AppRouter';
import { ApolloError, useSuspenseQuery } from '@apollo/client';

export type EventProposalAdminNotesProps = {
  eventProposalId: string;
};

function EventProposalAdminNotes({ eventProposalId }: EventProposalAdminNotesProps) {
  const { data } = useSuspenseQuery(EventProposalAdminNotesQueryDocument, {
    variables: { eventProposalId },
  });
  const fetcher = useFetcher();

  return (
    <AdminNotes
      value={data?.convention.event_proposal.admin_notes ?? ''}
      mutate={(value) =>
        fetcher.submit(
          { admin_notes: value },
          { action: `/event_proposals/${eventProposalId}/admin_notes`, method: 'PATCH' },
        )
      }
      inProgress={fetcher.state !== 'idle'}
      error={fetcher.data instanceof ApolloError ? fetcher.data : undefined}
    />
  );
}

function EventProposalAdminDisplay() {
  const data = useRouteLoaderData(NamedRoute.AdminEventProposal) as EventProposalQueryWithOwnerQueryData;
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
}

export const Component = EventProposalAdminDisplay;
