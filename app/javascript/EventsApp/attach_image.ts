import { data } from 'react-router';
import { AttachImageToEventDocument } from '../EventAdmin/mutations.generated';
import { Route } from './+types/attach_image';

export const action = async ({ params: { eventId }, request, context }: Route.ActionArgs) => {
  try {
    const formData = await request.formData();
    const result = await context.client.mutate({
      mutation: AttachImageToEventDocument,
      variables: {
        id: eventId ?? '',
        signedBlobId: formData.get('signed_blob_id')?.toString(),
      },
    });

    return data(result.data);
  } catch (error) {
    return error;
  }
};
