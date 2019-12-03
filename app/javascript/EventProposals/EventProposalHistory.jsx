import React, { useMemo } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import { EventProposalHistoryQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import Form from '../Models/Form';
import FormResponseChangeHistory from '../FormPresenter/ItemChangeDisplays/FormResponseChangeHistory';

const EXCLUDE_FIELDS = new Set([
  'minimum_age', 'age_restrictions_description',
  'con_mail_destination', 'email', 'team_mailing_list_name',
]);

function EventProposalHistory() {
  const match = useRouteMatch();
  const { data, loading, error } = useQuery(EventProposalHistoryQuery, {
    variables: { id: Number.parseInt(match.params.id, 10) },
  });

  const changes = useMemo(
    () => ((loading || error)
      ? []
      : data.eventProposal.form_response_changes.filter((change) => (
        !EXCLUDE_FIELDS.has(change.field_identifier)
      ))
    ),
    [data, error, loading],
  );

  const form = useMemo(
    () => (
      loading || error
        ? null
        : Form.fromApiResponse(
          JSON.parse(data.eventProposal.event_category.event_proposal_form.form_api_json),
        )
    ),
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
      convention={data.convention}
      basePath={`/admin_event_proposals/${match.params.id}/history`}
      form={form}
    />
  );
}

export default EventProposalHistory;
