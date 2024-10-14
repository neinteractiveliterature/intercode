import { useState } from 'react';
import { ActionFunction, Form, redirect, useActionData, useLoaderData, useNavigation } from 'react-router';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import EventCategoryForm from './EventCategoryForm';
import usePageTitle from '../usePageTitle';
import { singleEventCategoryAdminLoader, SingleEventCategoryAdminLoaderResult } from './loaders';
import { client } from '../useIntercodeApolloClient';
import { UpdateEventCategoryDocument } from './mutations.generated';
import { buildEventCategoryFromFormData } from './buildEventCategoryInput';
import { useTranslation } from 'react-i18next';

export const action: ActionFunction = async ({ request, params: { id } }) => {
  try {
    const formData = await request.formData();
    await client.mutate({
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
};

export const loader = singleEventCategoryAdminLoader;

function EditEventCategoryForm() {
  const {
    eventCategory: initialEventCategory,
    data: { convention },
  } = useLoaderData() as SingleEventCategoryAdminLoaderResult;
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

export const Component = EditEventCategoryForm;
