export default function buildEmailRouteInput(emailRoute) {
  return {
    receiver_address: emailRoute.receiver_address,
    forward_addresses: emailRoute.forward_addresses,
  };
}
