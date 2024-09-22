import { ActionFunction, redirect } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { DeleteEventCategoryDocument, UpdateEventCategoryDocument } from './mutations.generated';
import { buildEventCategoryFromFormData } from './buildEventCategoryInput';
import { EventCategory } from '../graphqlTypes.generated';

export const action: ActionFunction = async ({ request, params: { id } }) => {
  try {
    if (request.method === 'DELETE') {
      await client.mutate({
        mutation: DeleteEventCategoryDocument,
        variables: {
          id,
        },
        update: (cache) => {
          cache.modify<EventCategory>({
            id: cache.identify({ __typename: 'EventCategory', id }),
            fields: (value, { DELETE }) => DELETE,
          });
        },
      });
      return redirect('..');
    } else if (request.method === 'PATCH') {
      const formData = await request.formData();
      await client.mutate({
        mutation: UpdateEventCategoryDocument,
        variables: {
          id,
          eventCategory: buildEventCategoryFromFormData(formData),
        },
      });
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};
