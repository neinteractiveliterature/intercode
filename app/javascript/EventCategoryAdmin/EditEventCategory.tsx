import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import EventCategoryForm from './EventCategoryForm';
import usePageTitle from '../usePageTitle';
import { UpdateEventCategoryDocument } from './mutations.generated';
import { buildEventCategoryFromFormData } from './buildEventCategoryInput';
import { useTranslation } from 'react-i18next';
import { Route } from './+types/EditEventCategory';
import { loader as routeLoader } from './route';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    await context.client.mutate({
      mutation: UpdateEventCategoryDocument,
      variables: {
        id,
        eventCategory: buildEventCategoryFromFormData(formData),
      },
    });
    return redirect('../..');
  } catch (error) {
    return error;
  }
}

export async function loader({ params, context, request }: Route.LoaderArgs) {
  const data = await routeLoader({ params, context, request });
  const { convention } = data;
  const eventCategory = convention.event_categories.find((eventCategory) => eventCategory.id === params.id);
  if (!eventCategory) {
    throw new Response('Not Found', { status: 404 });
  }

  return { convention, initialEventCategory: eventCategory };
}

function EditEventCategoryForm({ loaderData: { initialEventCategory, convention } }: Route.ComponentProps) {
  const navigation = useNavigation();
  const updateError = useActionData();
  const { t } = useTranslation();

  const [eventCategory, setEventCategory] = useState(initialEventCategory);

  usePageTitle(`Editing “${initialEventCategory.name}”`);

  return (
    <>
      <h1 className="mb-4">Edit event category</h1>

      <Form action="." method="PATCH">
        <EventCategoryForm
          value={eventCategory}
          onChange={setEventCategory}
          departments={convention.departments}
          forms={convention.forms}
          ticketNamePlural={convention.ticketNamePlural}
          ticketMode={convention.ticket_mode}
          disabled={navigation.state !== 'idle'}
        />

        <ErrorDisplay graphQLError={updateError as ApolloError} />

        <button type="submit" className="btn btn-primary" disabled={navigation.state !== 'idle'}>
          {t('buttons.saveChanges')}
        </button>
      </Form>
    </>
  );
}

export default EditEventCategoryForm;
