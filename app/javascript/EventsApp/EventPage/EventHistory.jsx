import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import { EventHistoryQuery } from './queries.gql';
import Form from '../../Models/Form';
import LoadingIndicator from '../../LoadingIndicator';
import ErrorDisplay from '../../ErrorDisplay';
import FormResponseChangeHistory from '../../FormPresenter/ItemChangeDisplays/FormResponseChangeHistory';
import RouteActivatedBreadcrumbItem from '../../Breadcrumbs/RouteActivatedBreadcrumbItem';
import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';

const EXCLUDE_FIELDS = new Set([
  'minimum_age', 'age_restrictions_description',
  'con_mail_destination', 'email', 'team_mailing_list_name',
]);

function EventHistory({ eventId, eventPath }) {
  const { t } = useTranslation();
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
          <BreadcrumbItem to={eventPath} active={false}>{data.event.title}</BreadcrumbItem>
          <RouteActivatedBreadcrumbItem
            matchProps={{ path: `${eventPath}/history`, exact: true }}
            to={`${eventPath}/history`}
          >
            {t('events.history.title', 'History')}
          </RouteActivatedBreadcrumbItem>
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
