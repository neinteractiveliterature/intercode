import { ActionFunction, RouterContextProvider, redirect } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { DeleteEventCategoryDocument, UpdateEventCategoryDocument } from './mutations.generated';
import { buildEventCategoryFromFormData } from './buildEventCategoryInput';
import { EventCategory } from '../graphqlTypes.generated';

export const action: ActionFunction<RouterContextProvider> = async ({ context, request, params: { id } }) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'DELETE') {
      await client.mutate({
        mutation: DeleteEventCategoryDocument,
        variables: {
          id: id ?? '',
        },
        update: (cache) => {
          cache.modify<EventCategory>({
            id: cache.identify({ __typename: 'EventCategory', id }),
            fields: (_value, { DELETE }) => DELETE,
          });
        },
      });
      return redirect('..');
    } else if (request.method === 'PATCH') {
      const formData = await request.formData();
      await client.mutate({
        mutation: UpdateEventCategoryDocument,
        variables: {
          id: id ?? '',
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
