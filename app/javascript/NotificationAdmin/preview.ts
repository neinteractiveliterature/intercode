import { data } from 'react-router';
import { SendNotificationPreviewDocument } from './mutations.generated';
import { Route } from './+types/preview';

export async function action({ params: { eventKey }, request, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString() === 'true';
    const sms = formData.get('sms')?.toString() === 'true';

    const result = await context.client.mutate({
      mutation: SendNotificationPreviewDocument,
      variables: { email, eventKey, sms },
    });

    return data(result.data);
  } catch (error) {
    return error;
  }
}
