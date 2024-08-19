import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { ErrorDisplay, useCreateMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform';

import buildEventCategoryInput from './buildEventCategoryInput';
import EventCategoryForm, { EventCategoryForForm } from './EventCategoryForm';
import usePageTitle from '../usePageTitle';
import { EventCategoryFieldsFragmentDoc } from './queries.generated';
import { useCreateEventCategoryMutation } from './mutations.generated';
import { useEventCategoryAdminLoader } from './loaders';

function NewEventCategory(): JSX.Element {
  const data = useEventCategoryAdminLoader();
  const navigate = useNavigate();
  const [create, { error: createError, loading: createInProgress }] = useCreateMutationWithReferenceArrayUpdater(
    useCreateEventCategoryMutation,
    data.convention,
    'event_categories',
    (data) => data.createEventCategory.event_category,
    EventCategoryFieldsFragmentDoc,
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

    navigate('/event_categories');
  };

  usePageTitle('New Event Category');

  const { forms, departments, ticketNamePlural, ticket_mode: ticketMode } = data.convention;

  return (
    <>
      <h1 className="mb-4">New event category</h1>

      <EventCategoryForm
        value={eventCategory}
        onChange={setEventCategory}
        forms={forms}
        ticketNamePlural={ticketNamePlural}
        ticketMode={ticketMode}
        disabled={createInProgress}
        departments={departments}
      />

      <ErrorDisplay graphQLError={createError as ApolloError} />

      <button type="button" className="btn btn-primary" onClick={createClicked} disabled={createInProgress}>
        Create event category
      </button>
    </>
  );
}

export const Component = NewEventCategory;
