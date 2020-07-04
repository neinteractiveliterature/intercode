import { useMemo } from 'react';

import { breakValueIntoUnitQuantities } from '../TimespanItemUtils';
import pluralizeWithCount from '../../pluralizeWithCount';

export function describeTimespan(value: number) {
  return breakValueIntoUnitQuantities(value)
    .map(({ unit, quantity }) => pluralizeWithCount(unit.name, quantity))
    .join(' ');
}

function TimespanItemDisplay({ value }: { value: number }) {
  const description = useMemo(() => describeTimespan(value), [value]);
  return description;
}

export default TimespanItemDisplay;
