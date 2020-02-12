import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import buildEventCategoryUrl from './buildEventCategoryUrl';
import ErrorDisplay from '../ErrorDisplay';
import { EventAdminEventsQuery } from './queries.gql';
import RunFormFields from '../BuiltInForms/RunFormFields';
import useAsyncFunction from '../useAsyncFunction';
import useEventFormWithCategorySelection, { EventFormWithCategorySelection } from './useEventFormWithCategorySelection';
import useCreateEvent from './useCreateEvent';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function NewEventForm({ data }) {
  const { convention } = data;
  const history = useHistory();
  const { eventCategoryId: eventCategoryIdParam } = useParams();
  const initialEventCategory = useMemo(
    () => data.convention.event_categories
      .find((c) => c.id.toString() === eventCategoryIdParam),
    [data, eventCategoryIdParam],
  );
  const [createMutate, createError] = useAsyncFunction(useCreateEvent());
  const [formProps, {
    event, eventCategory, eventCategoryId, validateForm,
  }] = useEventFormWithCategorySelection({
    convention,
    schedulingUi: initialEventCategory ? initialEventCategory.scheduling_ui : null,
    initialEvent: initialEventCategory ? { event_category: initialEventCategory } : null,
  });
  const [run, setRun] = useState({});

  const donePath = convention.site_mode === 'single_event' ? '/' : buildEventCategoryUrl(eventCategory);

  const createEvent = async () => {
    if (!validateForm()) {
      return;
    }

    await createMutate({
      event, eventCategory, eventCategoryId, run, setRun,
    });
    history.push(donePath);
  };

  const warningMessage = (
    (eventCategory || {}).scheduling_ui === 'single_run' && !event.form_response_attrs.length_seconds
      ? 'Please specify a length of time for this event.'
      : null
  );

  return (
    <>
      <h2 className="mb-4 mt-2">New event</h2>
      <EventFormWithCategorySelection {...formProps}>
        {(eventCategory || {}).scheduling_ui === 'single_run' && event.form_response_attrs.length_seconds && (
          <RunFormFields
            run={run}
            event={{
              title: event.form_response_attrs.title,
              length_seconds: event.form_response_attrs.length_seconds,
              event_category: eventCategory,
            }}
            convention={convention}
            onChange={setRun}
          />
        )}

        {warningMessage && (
          <div className="alert alert-warning">{warningMessage}</div>
        )}

        <ErrorDisplay graphQLError={createError} />

        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={createEvent}
            disabled={!eventCategoryId || warningMessage}
          >
            Create event
          </button>
          <Link className="btn btn-link" to={donePath}>
            Cancel
          </Link>
        </div>
      </EventFormWithCategorySelection>
    </>
  );
}

NewEventForm.propTypes = {
  data: PropTypes.shape({
    convention: PropTypes.shape({
      site_mode: PropTypes.string.isRequired,
      event_categories: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    }).isRequired,
  }).isRequired,
};

function NewEvent() {
  const { data, loading, error } = useQuery(EventAdminEventsQuery);

  usePageTitle('New event');

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return <NewEventForm data={data} />;
}

export default NewEvent;
