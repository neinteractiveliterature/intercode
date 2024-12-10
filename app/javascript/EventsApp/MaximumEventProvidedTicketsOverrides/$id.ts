import { ActionFunction, data } from 'react-router';
import {
  DeleteMaximumEventProvidedTicketsOverrideDocument,
  UpdateMaximumEventProvidedTicketsOverrideDocument,
} from '../../EventAdmin/mutations.generated';
import { Route } from './+types/$id';

export const action: ActionFunction = async ({ request, params: { id }, context }: Route.ActionArgs) => {
  try {
    if (request.method === 'DELETE') {
      const result = await context.client.mutate({
        mutation: DeleteMaximumEventProvidedTicketsOverrideDocument,
        variables: {
          input: { id: id ?? '' },
        },
        update: (cache) => {
          cache.modify({
            id: cache.identify({ __typename: 'MaximumEventProvidedTicketsOverride', id }),
            fields(fieldValue, details) {
              return details.INVALIDATE;
            },
          });
        },
      });

      return data(result.data);
    } else if (request.method === 'PATCH') {
      const formData = await request.formData();
      const result = await context.client.mutate({
        mutation: UpdateMaximumEventProvidedTicketsOverrideDocument,
        variables: {
          input: {
            id: id ?? '',
            override_value: Number.parseInt(formData.get('override_value')?.toString() ?? ''),
          },
        },
      });

      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};
