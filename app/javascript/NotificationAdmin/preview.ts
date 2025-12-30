import { data } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { SendNotificationPreviewDocument } from './mutations.generated';
import { NotificationEventKey } from '~/graphqlTypes.generated';
import { Route } from './+types/preview';

export const clientAction = async ({ context, params: { eventKey }, request }: Route.ClientActionArgs) => {
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
