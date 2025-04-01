import { ActionFunction, json } from 'react-router';
import { client } from 'useIntercodeApolloClient';
import { SendNotificationPreviewDocument } from './mutations.generated';

export const action: ActionFunction = async ({ params: { eventKey }, request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString() === 'true';
    const sms = formData.get('sms')?.toString() === 'true';

    const { data } = await client.mutate({
      mutation: SendNotificationPreviewDocument,
      variables: { email, eventKey, sms },
    });

    return json(data);
  } catch (error) {
    return error;
  }
};
