import { ActionFunction, RouterContextProvider } from 'react-router';
import { apolloClientContext } from '../../AppContexts';
import { UpdateEventProposalAdminNotesDocument } from '../mutations.generated';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ context, request, params: { id } }) => {
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
