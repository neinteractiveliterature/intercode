import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import buildEventCategoryInput from './buildEventCategoryInput';
import { CreateEventCategory } from './mutations.gql';
import { EventCategoryAdminQuery } from './queries.gql';
import EventCategoryForm from './EventCategoryForm';
import ErrorDisplay from '../ErrorDisplay';
import useAsyncFunction from '../useAsyncFunction';
import { useCreateMutation } from '../MutationUtils';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function NewEventCategory() {
  const history = useHistory();
  const { data, loading, error } = useQuery(EventCategoryAdminQuery);
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
    default_color: '#d4f5fa',
    full_color: 'rgba(23, 162, 184, 0.7)',
    signed_up_color: '#17a2b8',
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

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

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

export default NewEventCategory;
