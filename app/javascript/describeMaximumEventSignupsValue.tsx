import { TFunction } from 'i18next';
import assertNever from 'assert-never';
import { MaximumEventSignupsValue } from './SignupRoundUtils';

export function describeMaximumEventSignupsValue(
  value: MaximumEventSignupsValue | null | undefined,
  t: TFunction,
): string | null | undefined {
  if (!value) {
    return t('signups.maximumSignups.notYet');
  }

  if (typeof value === 'number') {
    return t('signups.maximumSignups.limitedCount', { count: value });
  }

  switch (value) {
    case 'not_yet':
      return t('signups.maximumSignups.notYet');
    case 'unlimited':
      return t('signups.maximumSignups.unlimited');
    case 'not_now':
      return t('signups.maximumSignups.notNow');
    default:
      assertNever(value, true);
      return value?.toString();
  }
}
