import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { breakValueIntoUnitQuantities } from '../TimespanItemUtils';
import pluralizeWithCount from '../../pluralizeWithCount';

export function describeTimespan(value) {
  return breakValueIntoUnitQuantities(value)
    .map(({ unit, quantity }) => pluralizeWithCount(unit.name, quantity))
    .join(' ');
}

function TimespanItemDisplay({ value }) {
  const description = useMemo(() => describeTimespan(value), [value]);
  return description;
}

TimespanItemDisplay.propTypes = {
  value: PropTypes.number.isRequired,
};

export default TimespanItemDisplay;
