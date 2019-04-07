import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';

import ErrorDisplay from '../ErrorDisplay';
import { EventAdminEventsQuery } from './queries.gql';
import { CreateEvent } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import useEventFormWithCategorySelection from './useEventFormWithCategorySelection';

function NewEventForm({
  convention, onExit, schedulingUi,
}) {
  const [mutate, error] = useAsyncFunction(useMutation(CreateEvent));
  const {
    event, renderForm, eventCategoryId, validateForm,
  } = useEventFormWithCategorySelection({ convention, schedulingUi });

  const createEvent = useCallback(
    async () => {
      if (!validateForm()) {
        return;
      }

      const { total_slots: totalSlots, ...formResponseAttrs } = event.form_response_attrs;

      await mutate({
        variables: {
          input: {
            event: {
              event_category_id: eventCategoryId,
              form_response_attrs_json: JSON.stringify(formResponseAttrs),
            },
          },
        },
        update: (store, { data: { createEvent: { event: newEvent } } }) => {
          const eventsData = store.readQuery({ query: EventAdminEventsQuery });
          eventsData.events.push(newEvent);
          store.writeQuery({ query: EventAdminEventsQuery, data: eventsData });
        },
      });

      onExit();
    },
    [eventCategoryId, event.form_response_attrs, onExit, mutate, validateForm],
  );

  return (
    <>
      {renderForm()}

      <ErrorDisplay graphQLError={error} />

      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={createEvent}
          disabled={!eventCategoryId}
        >
          Create event
        </button>
        <button className="btn btn-link" onClick={onExit} type="button">
          Cancel
        </button>
      </div>
    </>
  );
}

NewEventForm.propTypes = {
  convention: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  onExit: PropTypes.func.isRequired,
  event: PropTypes.shape({}).isRequired,
  schedulingUi: PropTypes.string,
};

NewEventForm.defaultProps = {
  schedulingUi: null,
};

export default NewEventForm;
