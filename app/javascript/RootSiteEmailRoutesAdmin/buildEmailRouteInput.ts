import { EmailRoute, EmailRouteInput } from '../graphqlTypes.generated';

export default function buildEmailRouteInput(
  emailRoute: Pick<EmailRoute, 'receiver_address' | 'forward_addresses'>,
): EmailRouteInput {
  return {
    receiver_address: emailRoute.receiver_address,
    forward_addresses: emailRoute.forward_addresses,
  };
}
