import { redirect } from 'react-router';
import { Route } from './+types/AdminNotesRoute';
import { apolloClientContext } from '../AppContexts';
import { UpdateEventAdminNotesDocument } from './mutations.generated';
import { EventAdminEventsQueryDocument } from './queries.generated';

export const clientAction = async ({ request, params: { eventId }, context }: Route.ClientActionArgs) => {
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
