import React, { useState } from 'react';
import PropTypes from 'prop-types';

import buildEventCategoryInput from './buildEventCategoryInput';
import { CreateEventCategory } from './mutations.gql';
import { EventCategoryAdminQuery } from './queries.gql';
import EventCategoryForm from './EventCategoryForm';
import ErrorDisplay from '../ErrorDisplay';
import useQuerySuspended from '../useQuerySuspended';
import useAsyncFunction from '../useAsyncFunction';
import { useCreateMutation } from '../MutationUtils';
import usePageTitle from '../usePageTitle';

function NewEventCategory({ history }) {
  const { data, error } = useQuerySuspended(EventCategoryAdminQuery);
  const [create, createError, createInProgress] = useAsyncFunction(
    useCreateMutation(CreateEventCategory, {
      query: EventCategoryAdminQuery,
      arrayPath: ['convention', 'event_categories'],
      newObjectPath: ['createEventCategory', 'event_category'],
    }),
  );

  const [eventCategory, setEventCategory] = useState({
    name: '',
    team_member_name: 'team member',
    scheduling_ui: null,
    can_provide_tickets: false,
  });

  const createClicked = async () => {
    await create({
      variables: {
        eventCategory: buildEventCategoryInput(eventCategory),
      },
    });

    history.push('/event_categories');
  };

  usePageTitle('New Event Category');

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { forms, ticket_name: ticketName, ticket_mode: ticketMode } = data.convention;

  return (
    <>
      <h1 className="mb-4">New event category</h1>

      <EventCategoryForm
        value={eventCategory}
        onChange={setEventCategory}
        forms={forms}
        ticketName={ticketName}
        ticketMode={ticketMode}
        disabled={createInProgress}
      />

      <ErrorDisplay graphQLError={createError} />

      <button
        type="button"
        className="btn btn-primary"
        onClick={createClicked}
        disabled={createInProgress}
      >
        Create event category
      </button>
    </>
  );
}

NewEventCategory.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default NewEventCategory;
