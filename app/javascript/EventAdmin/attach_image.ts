import { ActionFunction, redirect } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { AttachImageToEventDocument } from './mutations.generated';

export const action: ActionFunction = async ({ params: { eventCategoryId, eventId }, request }) => {
  try {
    const formData = await request.formData();
    await client.mutate({
      mutation: AttachImageToEventDocument,
      variables: {
        id: eventId ?? '',
        signedBlobId: formData.get('signed_blob_id')?.toString(),
      },
    });

    return redirect(`/admin_events/${eventCategoryId}/events/${eventId}/edit`);
  } catch (error) {
    return error;
  }
};
