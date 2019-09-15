import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import buildEventCategoryUrl from './buildEventCategoryUrl';
import ErrorDisplay from '../ErrorDisplay';
import { EventAdminEventsQuery } from './queries.gql';
import RunFormFields from '../BuiltInForms/RunFormFields';
import useAsyncFunction from '../useAsyncFunction';
import useEventFormWithCategorySelection, { EventFormWithCategorySelection } from './useEventFormWithCategorySelection';
import useCreateEvent from './useCreateEvent';
import useQuerySuspended from '../useQuerySuspended';
import usePageTitle from '../usePageTitle';

function NewEvent({ history, match }) {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);

  const initialEventCategory = useMemo(
    () => (error
      ? null
      : data.convention.event_categories
        .find((c) => c.id === Number.parseInt(match.params.eventCategoryId, 10))
    ),
    [data, error, match],
  );
  const [createMutate, createError] = useAsyncFunction(useCreateEvent());
  const [formProps, {
    event, eventCategory, eventCategoryId, validateForm,
  }] = useEventFormWithCategorySelection({
    convention: error ? {} : data.convention,
    schedulingUi: initialEventCategory ? initialEventCategory.scheduling_ui : null,
    initialEvent: initialEventCategory ? { event_category: initialEventCategory } : null,
  });
  const [run, setRun] = useState({});

  usePageTitle('New event');

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { convention } = data;
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
    eventCategory.scheduling_ui === 'single_run' && !event.form_response_attrs.length_seconds
      ? 'Please specify a length of time for this event.'
      : null
  );

  return (
    <>
      <h2 className="mb-4 mt-2">New event</h2>
      <EventFormWithCategorySelection {...formProps}>
        {eventCategory.scheduling_ui === 'single_run' && event.form_response_attrs.length_seconds && (
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

NewEvent.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      eventCategoryId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default NewEvent;
