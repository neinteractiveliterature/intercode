import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import buildEventCategoryInput from './buildEventCategoryInput';
import { CreateEventCategory } from './mutations';
import { EventCategoryAdminQuery } from './queries';
import EventCategoryForm, { EventCategoryForForm } from './EventCategoryForm';
import useAsyncFunction from '../useAsyncFunction';
import { useCreateMutation } from '../MutationUtils';
import usePageTitle from '../usePageTitle';
import { useEventCategoryAdminQuery } from './queries.generated';

function NewEventCategory() {
  const history = useHistory();
  const { data, loading, error } = useEventCategoryAdminQuery();
  const [create, createError, createInProgress] = useAsyncFunction(
    useCreateMutation(CreateEventCategory, {
      query: EventCategoryAdminQuery,
      arrayPath: ['convention', 'event_categories'],
      newObjectPath: ['createEventCategory', 'event_category'],
    }),
  );

  const [eventCategory, setEventCategory] = useState<EventCategoryForForm>({
    name: '',
    team_member_name: 'team member',
    scheduling_ui: undefined,
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

  const { forms, departments, ticket_name: ticketName, ticket_mode: ticketMode } = data!.convention;

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
        departments={departments}
      />

      <ErrorDisplay graphQLError={createError as ApolloError} />

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
