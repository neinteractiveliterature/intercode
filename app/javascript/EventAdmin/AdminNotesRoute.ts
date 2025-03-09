import { redirect } from 'react-router';
import { UpdateEventAdminNotesDocument } from './mutations.generated';
import { Route } from './+types/AdminNotesRoute';

export async function action({ request, params: { eventId }, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    await context.client.mutate({
      mutation: UpdateEventAdminNotesDocument,
      variables: {
        eventId,
        adminNotes: formData.get('admin_notes')?.toString(),
      },
    });
    await context.client.resetStore();
    return redirect('../..');
  } catch (error) {
    return error;
  }
}
