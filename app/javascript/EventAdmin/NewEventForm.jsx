import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';

import CommonEventFormFields from '../BuiltInForms/CommonEventFormFields';
import getFormForEventCategory from './getFormForEventCategory';
import ErrorDisplay from '../ErrorDisplay';
import { EventAdminEventsQuery } from './queries.gql';
import { CreateEvent } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import useFormValidation from '../FormPresenter/useFormValidation';
import { useItemInteractionTracking, ItemInteractionProvider } from '../FormPresenter/ItemInteractionTracker';

function NewEventForm({
  event, convention, setEvent, onExit,
}) {
  const [mutate, error] = useAsyncFunction(useMutation(CreateEvent));
  const formRef = useRef();
  const { interactWithItem, hasInteractedWithItem } = useItemInteractionTracking();

  const form = getFormForEventCategory(event, convention);
  const validate = useFormValidation(
    formRef.current ? formRef.current.scrollToItem : null,
    interactWithItem,
  );

  const createEvent = useCallback(
    async () => {
      if (!validate(form.getAllItems(), event.form_response_attrs)) {
        return;
      }

      const { total_slots: totalSlots, ...formResponseAttrs } = event.form_response_attrs;

      await mutate({
        variables: {
          input: {
            event: {
              event_category_id: event.event_category.id,
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
    [event.event_category, event.form_response_attrs, form, onExit, mutate, validate],
  );

  return (
    <>
      <ItemInteractionProvider
        interactWithItem={interactWithItem}
        hasInteractedWithItem={hasInteractedWithItem}
      >
        <CommonEventFormFields
          event={event}
          convention={convention}
          form={form}
          onChange={(newEventData) => { setEvent({ ...event, ...newEventData }); }}
          ref={formRef}
        >
          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={createEvent}
              disabled={!(event.event_category || {}).id}
            >
              Create event
            </button>
            <button className="btn btn-link" onClick={onExit} type="button">
              Cancel
            </button>
            <ErrorDisplay graphQLError={error} />
          </div>
        </CommonEventFormFields>
      </ItemInteractionProvider>
    </>
  );
}

NewEventForm.propTypes = {
  convention: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  onExit: PropTypes.func.isRequired,
  event: PropTypes.shape({}).isRequired,
  setEvent: PropTypes.func.isRequired,
};

export default NewEventForm;
