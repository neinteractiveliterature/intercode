import { ActionFunction, redirect, RouterContextProvider } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { UpdateEventAdminNotesDocument } from './mutations.generated';
import { EventAdminEventsQueryDocument } from './queries.generated';

export const action: ActionFunction<RouterContextProvider> = async ({ request, params: { eventId }, context }) => {
  const client = context.get(apolloClientContext);
  try {
    const formData = await request.formData();
    await client.mutate({
      mutation: UpdateEventAdminNotesDocument,
      variables: {
        eventId: eventId ?? '',
        adminNotes: formData.get('admin_notes')?.toString() ?? '',
      },
      refetchQueries: [{ query: EventAdminEventsQueryDocument }],
      awaitRefetchQueries: true,
    });
    return redirect('../..');
  } catch (error) {
    return error;
  }
};
