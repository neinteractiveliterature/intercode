import { ActionFunction, data } from 'react-router';
import { client } from 'useIntercodeApolloClient';
import { SendNotificationPreviewDocument } from './mutations.generated';

export const action: ActionFunction = async ({ params: { eventKey }, request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString() === 'true';
    const sms = formData.get('sms')?.toString() === 'true';

    const result = await client.mutate({
      mutation: SendNotificationPreviewDocument,
      variables: { email, eventKey, sms },
    });

    return data(result.data);
  } catch (error) {
    return error;
  }
};
