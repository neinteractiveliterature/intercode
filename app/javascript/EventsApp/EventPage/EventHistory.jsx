import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo-hooks';
import { Link } from 'react-router-dom';

import { EventHistoryQuery } from './queries.gql';
import Form from '../../Models/Form';
import LoadingIndicator from '../../LoadingIndicator';
import ErrorDisplay from '../../ErrorDisplay';
import FormResponseChangeHistory from '../../FormPresenter/ItemChangeDisplays/FormResponseChangeHistory';
import BreadcrumbItemWithRoute from '../../Breadcrumbs/BreadcrumbItemWithRoute';

const EXCLUDE_FIELDS = new Set([
  'minimum_age', 'age_restrictions_description',
  'con_mail_destination', 'email', 'team_mailing_list_name',
]);

function EventHistory({ eventId, eventPath }) {
  const { data, loading, error } = useQuery(EventHistoryQuery, {
    variables: { id: eventId },
  });

  const changes = useMemo(
    () => ((loading || error)
      ? []
      : data.event.form_response_changes.filter((change) => (
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
          JSON.parse(data.event.event_category.event_form.form_api_json),
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
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={eventPath}>
              {data.event.title}
            </Link>
          </li>
          <BreadcrumbItemWithRoute
            path={`${eventPath}/history`}
            to={`${eventPath}/history`}
            exact
          >
            History
          </BreadcrumbItemWithRoute>
        </ol>
      </nav>

      <FormResponseChangeHistory
        changes={changes}
        convention={data.convention}
        basePath={`${eventPath}/history`}
        form={form}
      />
    </>
  );
}

EventHistory.propTypes = {
  eventPath: PropTypes.string.isRequired,
  eventId: PropTypes.number.isRequired,
};

export default EventHistory;
