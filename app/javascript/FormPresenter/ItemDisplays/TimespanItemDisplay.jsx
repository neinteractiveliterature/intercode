import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { breakValueIntoUnitQuantities } from '../TimespanItemUtils';
import pluralizeWithCount from '../../pluralizeWithCount';

function TimespanItemDisplay({ value }) {
  const unitQuantities = useMemo(() => breakValueIntoUnitQuantities(value), [value]);

  return (
    <>
      {unitQuantities.map(({ unit, quantity }) => pluralizeWithCount(unit.name, quantity)).join(' ')}
    </>
  );
}

TimespanItemDisplay.propTypes = {
  value: PropTypes.number.isRequired,
};

export default TimespanItemDisplay;
