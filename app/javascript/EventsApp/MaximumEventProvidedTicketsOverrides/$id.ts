import { ActionFunction, redirect } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import {
  DeleteMaximumEventProvidedTicketsOverrideDocument,
  UpdateMaximumEventProvidedTicketsOverrideDocument,
} from '../../EventAdmin/mutations.generated';

export const action: ActionFunction = async ({ request, params: { id } }) => {
  try {
    if (request.method === 'DELETE') {
      await client.mutate({
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
    } else if (request.method === 'PATCH') {
      const formData = await request.formData();
      await client.mutate({
        mutation: UpdateMaximumEventProvidedTicketsOverrideDocument,
        variables: {
          input: {
            id: id ?? '',
            override_value: Number.parseInt(formData.get('override_value')?.toString() ?? ''),
          },
        },
      });
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }

  return redirect(request.referrer);
};
