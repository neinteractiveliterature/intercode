import { apolloClientContext } from '../../AppContexts';
import { UpdateEventProposalAdminNotesDocument } from '../mutations.generated';
import { Route } from './+types/admin_notes';

export const clientAction = async ({ context, request, params: { id } }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'PATCH') {
      const formData = await request.formData();
      return await client.mutate({
        mutation: UpdateEventProposalAdminNotesDocument,
        variables: {
          eventProposalId: id ?? '',
          adminNotes: formData.get('admin_notes')?.toString() ?? '',
        },
      });
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};
