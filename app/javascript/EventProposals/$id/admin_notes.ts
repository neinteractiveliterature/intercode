import { ActionFunction } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { UpdateEventProposalAdminNotesDocument } from '../mutations.generated';

export async function action({ request, params: { id } }) {
  try {
    if (request.method === 'PATCH') {
      const formData = await request.formData();
      return await client.mutate({
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
