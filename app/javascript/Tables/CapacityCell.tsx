import { TFunction } from 'i18next';
import { RegistrationPolicy } from '../graphqlTypes.generated';
import { useTranslation } from 'react-i18next';

function formatCapacity(
  registrationPolicy: Pick<RegistrationPolicy, 'slots_limited' | 'total_slots' | 'minimum_slots'>,
  t: TFunction,
) {
  if (!registrationPolicy.slots_limited) {
    return t('events.runCapacity.unlimitedSimple');
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
  const { t } = useTranslation();

  if (value == null) {
    return <></>;
  }

  return <div className="text-nowrap text-end">{formatCapacity(value, t)}</div>;
}
