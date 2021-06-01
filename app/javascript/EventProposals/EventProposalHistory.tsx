import { useMemo } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import FormResponseChangeHistory from '../FormPresenter/ItemChangeDisplays/FormResponseChangeHistory';
import { useEventProposalHistoryQuery } from './queries.generated';

const EXCLUDE_FIELDS = new Set([
  'minimum_age',
  'age_restrictions_description',
  'con_mail_destination',
  'email',
  'team_mailing_list_name',
]);

function EventProposalHistory() {
  const match = useRouteMatch<{ id: string }>();
  const { data, loading, error } = useEventProposalHistoryQuery({
    variables: { id: Number.parseInt(match.params.id, 10) },
  });

  const changes = useMemo(
    () =>
      loading || error || !data
        ? []
        : data.eventProposal.form_response_changes.filter(
            (change) => !EXCLUDE_FIELDS.has(change.field_identifier),
          ),
    [data, error, loading],
  );

  const form = useMemo(
    () =>
      loading || error || !data ? null : data.eventProposal.event_category.event_proposal_form,
    [data, error, loading],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <FormResponseChangeHistory
      changes={changes}
      convention={data!.convention!}
      basePath={`/admin_event_proposals/${match.params.id}/history`}
      form={form!}
    />
  );
}

export default EventProposalHistory;
