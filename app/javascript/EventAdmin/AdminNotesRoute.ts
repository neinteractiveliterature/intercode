import { ActionFunction, redirect } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { UpdateEventAdminNotesDocument } from './mutations.generated';
import { EventAdminEventsQueryDocument } from './queries.generated';

export const action: ActionFunction = async ({ request, params: { eventId } }) => {
  try {
    const formData = await request.formData();
    await client.mutate({
      mutation: UpdateEventAdminNotesDocument,
      variables: {
        eventId,
        adminNotes: formData.get('admin_notes')?.toString(),
      },
      refetchQueries: [{ query: EventAdminEventsQueryDocument }],
      awaitRefetchQueries: true,
    });
    return redirect('../..');
  } catch (error) {
    return error;
  }
};
