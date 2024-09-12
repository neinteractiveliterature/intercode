import { ActionFunction, json } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { AttachImageToEventDocument } from '../EventAdmin/mutations.generated';

export const action: ActionFunction = async ({ params: { eventId }, request }) => {
  try {
    const formData = await request.formData();
    const { data } = await client.mutate({
      mutation: AttachImageToEventDocument,
      variables: {
        id: eventId ?? '',
        signedBlobId: formData.get('signed_blob_id')?.toString(),
      },
    });

    return json(data);
  } catch (error) {
    return error;
  }
};
