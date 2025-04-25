import { redirect } from 'react-router';
import { DeleteEventCategoryDocument, UpdateEventCategoryDocument } from './mutations.generated';
import { buildEventCategoryFromFormData } from './buildEventCategoryInput';
import { EventCategory } from '../graphqlTypes.generated';
import { Route } from './+types/$id';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  try {
    if (request.method === 'DELETE') {
      await context.get(apolloClientContext).mutate({
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
      await context.get(apolloClientContext).mutate({
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
}
