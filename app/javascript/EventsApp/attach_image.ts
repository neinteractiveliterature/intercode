import { data } from 'react-router';
import { Route } from './+types/attach_image';
import { apolloClientContext } from '~/AppContexts';
import { AttachImageToEventDocument } from '../EventAdmin/mutations.generated';

export const clientAction = async ({ context, params: { eventId }, request }: Route.ClientActionArgs) => {
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
