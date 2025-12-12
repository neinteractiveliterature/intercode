import { ActionFunction, RouterContextProvider, data } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { SendNotificationPreviewDocument } from './mutations.generated';
import { NotificationEventKey } from '~/graphqlTypes.generated';

export const action: ActionFunction<RouterContextProvider> = async ({ context, params: { eventKey }, request }) => {
  const client = context.get(apolloClientContext);
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString() === 'true';
    const sms = formData.get('sms')?.toString() === 'true';

    const result = await client.mutate({
      mutation: SendNotificationPreviewDocument,
      variables: { email, eventKey: (eventKey ?? '') as NotificationEventKey, sms },
    });

    return data(result.data);
  } catch (error) {
    return error;
  }
};
