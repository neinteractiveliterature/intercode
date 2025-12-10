import { ActionFunction, RouterContextProvider, data } from 'react-router';
import { apolloClientContext } from '~/AppContexts';
import { AttachImageToEventDocument } from '../EventAdmin/mutations.generated';

export const action: ActionFunction<RouterContextProvider> = async ({ context, params: { eventId }, request }) => {
  const client = context.get(apolloClientContext);
  try {
    const formData = await request.formData();
    const result = await client.mutate({
      mutation: AttachImageToEventDocument,
      variables: {
        id: eventId ?? '',
        signedBlobId: formData.get('signed_blob_id')?.toString() ?? '',
      },
    });

    return data(result.data);
  } catch (error) {
    return error;
  }
};
