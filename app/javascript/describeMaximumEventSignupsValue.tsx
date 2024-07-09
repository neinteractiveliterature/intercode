import { TFunction } from 'i18next';
import assertNever from 'assert-never';
import { MaximumEventSignupsValue } from './SignupRoundUtils';

export function describeMaximumEventSignupsValue(
  value: MaximumEventSignupsValue | null | undefined,
  t: TFunction,
): string | null | undefined {
  if (!value) {
    return t('signups.maximumSignups.notYet', 'No signups yet');
  }

  if (typeof value === 'number') {
    return t('signups.maximumSignups.limitedCount', 'Up to {{ count }} event(s)', { count: value });
  }

  switch (value) {
    case 'not_yet':
      return t('signups.maximumSignups.notYet', 'No signups yet');
    case 'unlimited':
      return t('signups.maximumSignups.unlimited', 'Signups fully open');
    case 'not_now':
      return t('signups.maximumSignups.notNow', 'Signups frozen');
    default:
      assertNever(value, true);
      return value?.toString();
  }
}
