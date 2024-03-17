import { RegistrationPolicy } from '../graphqlTypes.generated';

function formatCapacity(
  registrationPolicy: Pick<RegistrationPolicy, 'slots_limited' | 'total_slots' | 'minimum_slots'>,
) {
  if (!registrationPolicy.slots_limited) {
    return 'unlimited';
  }

  if (registrationPolicy.total_slots === registrationPolicy.minimum_slots) {
    return registrationPolicy.total_slots;
  }

  return `${registrationPolicy.minimum_slots}-${registrationPolicy.total_slots}`;
}

export default function CapacityCell({
  value,
}: {
  value: Pick<RegistrationPolicy, 'slots_limited' | 'total_slots' | 'minimum_slots'> | null | undefined;
}) {
  if (value == null) {
    return <></>;
  }

  return <div className="text-nowrap text-end">{formatCapacity(value)}</div>;
}
