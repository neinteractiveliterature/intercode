import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import TextDiffDisplay from './TextDiffDisplay';

import { describeDate } from '../ItemDisplays/DateItemDisplay';

function DateItemChangeDisplay({ change, convention }) {
  const before = useMemo(
    () => describeDate(change.previous_value || '', convention.timezone_name),
    [change.previous_value, convention.timezone_name],
  );
  const after = useMemo(
    () => describeDate(change.new_value || '', convention.timezone_name),
    [change.new_value, convention.timezone_name],
  );

  return <TextDiffDisplay before={before} after={after} />;
}

DateItemChangeDisplay.propTypes = {
  change: PropTypes.shape({
    previous_value: PropTypes.string,
    new_value: PropTypes.string,
  }).isRequired,
  convention: PropTypes.shape({
    timezone_name: PropTypes.string.isRequired,
  }).isRequired,
};

export default DateItemChangeDisplay;
