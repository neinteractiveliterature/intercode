import React, { useMemo } from 'react';

import { breakValueIntoUnitQuantities } from '../TimespanItemUtils';
import pluralizeWithCount from '../../pluralizeWithCount';
import { FormItemValueType, TimespanFormItem } from '../../FormAdmin/FormItemUtils';

export function describeTimespan(value: number) {
  return breakValueIntoUnitQuantities(value)
    .map(({ unit, quantity }) => pluralizeWithCount(unit.name, quantity))
    .join(' ');
}

export type TimespanItemDisplayProps = {
  value: FormItemValueType<TimespanFormItem>,
};

function TimespanItemDisplay({ value }: TimespanItemDisplayProps) {
  const description = useMemo(() => describeTimespan(value), [value]);
  return <>{description}</>;
}

export default TimespanItemDisplay;
