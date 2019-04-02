import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { humanize } from 'inflected';
import { useMutation } from 'react-apollo-hooks';

import CommonEventFormFields from '../BuiltInForms/CommonEventFormFields';
import getFormForEventCategory from './getFormForEventCategory';
import ErrorDisplay from '../ErrorDisplay';
import { EventAdminEventsQuery } from './queries.gql';
import { CreateEvent } from './mutations.gql';
import { getIncompleteItems } from '../FormPresenter/FormPresenterUtils';
import BootstrapFormSelect from '../BuiltInFormControls/BootstrapFormSelect';
import ItemInteractionTracker from '../FormPresenter/ItemInteractionTracker';
import useAsyncFunction from '../useAsyncFunction';

function NewEventForm({
  event, convention, setEvent, onExit,
}) {
  const [mutate, error] = useAsyncFunction(useMutation(CreateEvent));

  const form = getFormForEventCategory(event, convention);

  const createEvent = useCallback(
    async (interactWithItem) => {
      const incompleteItems = getIncompleteItems(form.getAllItems(), event.form_response_attrs);

      if (incompleteItems.length > 0) {
        incompleteItems.forEach((item) => {
          if (item.identifier) {
            interactWithItem(item.identifier);
          }
        });
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
    [event.event_category, event.form_response_attrs, form, onExit, mutate],
  );

  return (
    <>
      <CommonEventFormFields
        event={event}
        convention={convention}
        form={form}
        onChange={(newEventData) => { setEvent({ ...event, ...newEventData }); }}
      >
        <div>
          <ItemInteractionTracker.Interactor>
            {({ interactWithItem }) => (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => createEvent(mutate, interactWithItem)}
                disabled={!(event.event_category || {}).id}
              >
                Create event
              </button>
            )}
          </ItemInteractionTracker.Interactor>
          <button className="btn btn-link" onClick={onExit} type="button">
            Cancel
          </button>
          <ErrorDisplay graphQLError={error} />
        </div>
      </CommonEventFormFields>
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

function NewEvent({ convention, onExit }) {
  const [event, setEvent] = useState({
    event_category: null,
    form_response_attrs: {
      can_play_concurrently: false,
      con_mail_destination: 'event_email',
      title: '',
      email: '',
      short_blurb: '',
      description: '',
      length_seconds: null,
      registration_policy: CommonEventFormFields.buildRegistrationPolicyForVolunteerEvent(null),
    },
  });

  const categoryOptions = convention.event_categories
    .map(category => (
      <option value={category.id} key={category.id}>{humanize(category.name)}</option>
    ));

  return (
    <div className="my-4">
      <h2 className="mb-3">New event</h2>

      <BootstrapFormSelect
        label="Category"
        name="category"
        value={(event.event_category || {}).id}
        onChange={
          changeEvent => setEvent({
            ...event,
            event_category: {
              id: changeEvent.target.value ? Number.parseInt(changeEvent.target.value, 10) : null,
            },
          })
        }
      >
        <option />
        {categoryOptions}
      </BootstrapFormSelect>

      <NewEventForm
        convention={convention}
        onExit={onExit}
        event={event}
        setEvent={setEvent}
      />
    </div>
  );
}

NewEvent.propTypes = {
  convention: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  onExit: PropTypes.func.isRequired,
};

export default NewEvent;
