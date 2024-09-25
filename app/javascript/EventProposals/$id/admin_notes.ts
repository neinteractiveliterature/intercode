import { UpdateEventProposalAdminNotesDocument } from '../mutations.generated';
import { Route } from './+types/admin_notes';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  try {
    if (request.method === 'PATCH') {
      const formData = await request.formData();
      return await context.client.mutate({
        mutation: UpdateEventProposalAdminNotesDocument,
        variables: {
          eventProposalId: id,
          adminNotes: formData.get('admin_notes')?.toString(),
        },
      });
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}
