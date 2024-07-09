import { useMemo } from 'react';

import { breakValueIntoUnitQuantities } from '../TimespanItemUtils';
import { FormItemValueType, TimespanFormItem } from '../../FormAdmin/FormItemUtils';
import { TFunction } from 'i18next';
import assertNever from 'assert-never';
import { useTranslation } from 'react-i18next';

export function describeDuration(value: number, t: TFunction): string {
  return breakValueIntoUnitQuantities(value)
    .map(({ unit, quantity }) => {
      switch (unit.name) {
        case 'hour':
          return t('general.timeUnits.hours', { count: quantity });
        case 'minute':
          return t('general.timeUnits.minutes', { count: quantity });
        default:
          assertNever(unit.name);
      }
    })
    .join(' ');
}

export type TimespanItemDisplayProps = {
  value: FormItemValueType<TimespanFormItem>;
};

function TimespanItemDisplay({ value }: TimespanItemDisplayProps): JSX.Element {
  const { t } = useTranslation();
  const description = useMemo(() => describeDuration(value, t), [value, t]);
  return <>{description}</>;
}

export default TimespanItemDisplay;
