import React, { useMemo, useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';
import moment from 'moment-timezone';

import { EventProposalHistoryQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import AppRootContext from '../AppRootContext';

function EventProposalHistory() {
  const { timezoneName } = useContext(AppRootContext);
  const match = useRouteMatch();
  const { data, loading, error } = useQuery(EventProposalHistoryQuery, {
    variables: { id: Number.parseInt(match.params.id, 10) },
  });

  const sortedChanges = useMemo(
    () => (
      loading || error
        ? []
        : [...data.eventProposal.form_response_changes].sort((a, b) => (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ))
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
    <ul>
      {sortedChanges.map((change, index) => (
        <li key={index}>
          {moment.tz(change.created_at, timezoneName).format()}
        </li>
      ))}
    </ul>
  );
}

export default EventProposalHistory;
