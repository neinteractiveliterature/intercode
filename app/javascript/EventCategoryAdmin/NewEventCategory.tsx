import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { ActionFunction, Form, redirect, useActionData, useNavigation } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import EventCategoryForm, { EventCategoryForForm } from './EventCategoryForm';
import usePageTitle from '../usePageTitle';
import { EventCategoryFieldsFragmentDoc } from './queries.generated';
import { useEventCategoryAdminLoader } from './loaders';
import { client } from '../useIntercodeApolloClient';
import { CreateEventCategoryDocument } from './mutations.generated';
import { buildEventCategoryFromFormData } from './buildEventCategoryInput';
import { Convention } from '../graphqlTypes.generated';

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    await client.mutate({
      mutation: CreateEventCategoryDocument,
      variables: {
        eventCategory: buildEventCategoryFromFormData(formData),
      },
      update: (cache, result) => {
        const eventCategory = result.data?.createEventCategory.event_category;
        if (eventCategory) {
          const ref = cache.writeFragment({ fragment: EventCategoryFieldsFragmentDoc, data: eventCategory });
          cache.modify<Convention>({
            id: cache.identify(eventCategory.convention),
            fields: {
              event_categories: (value) => [...value, ref],
            },
          });
        }
      },
    });
    return redirect('..');
  } catch (error) {
    return error;
  }
};

function NewEventCategory(): JSX.Element {
  const data = useEventCategoryAdminLoader();
  const navigation = useNavigation();
  const createError = useActionData();

  const [eventCategory, setEventCategory] = useState<EventCategoryForForm>({
    name: '',
    team_member_name: 'team member',
    scheduling_ui: undefined,
    can_provide_tickets: false,
    default_color: '#d4f5fa',
    full_color: 'rgba(23, 162, 184, 0.7)',
    signed_up_color: '#17a2b8',
  });

  usePageTitle('New Event Category');

  const { forms, departments, ticketNamePlural, ticket_mode: ticketMode } = data.convention;

  return (
    <>
      <h1 className="mb-4">New event category</h1>

      <Form action="." method="POST">
        <EventCategoryForm
          value={eventCategory}
          onChange={setEventCategory}
          forms={forms}
          ticketNamePlural={ticketNamePlural}
          ticketMode={ticketMode}
          disabled={navigation.state !== 'idle'}
          departments={departments}
        />

        <ErrorDisplay graphQLError={createError as ApolloError} />

        <button type="submit" className="btn btn-primary" disabled={navigation.state !== 'idle'}>
          Create event category
        </button>
      </Form>
    </>
  );
}

export default NewEventCategory;
