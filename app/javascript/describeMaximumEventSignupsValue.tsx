import { MaximumEventSignupsValue } from './MaximumEventSignupsPreview';
import { TFunction } from 'i18next';
import assertNever from 'assert-never';

export function describeMaximumEventSignupsValue(value: MaximumEventSignupsValue | null | undefined, t: TFunction) {
  if (!value) {
    return t('signups.maximumSignups.notYet', 'No signups yet');
  }

  switch (value) {
    case 'not_yet':
      return t('signups.maximumSignups.notYet', 'No signups yet');
    case '1':
    case '2':
    case '3':
      return t('signups.maximumSignups.limitedCount', 'Up to {{ count }} event');
    case 'unlimited':
      return t('signups.maximumSignups.unlimited', 'Signups fully open');
    case 'not_now':
      return t('signups.maximumSignups.notNow', 'Signups frozen');
    default:
      assertNever(value, true);
      return value;
  }
}
