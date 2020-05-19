import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import TextDiffDisplay from './TextDiffDisplay';

import { describeDate } from '../ItemDisplays/DateItemDisplay';
import AppRootContext from '../../AppRootContext';

function DateItemChangeDisplay({ change }) {
  const { timezoneName } = useContext(AppRootContext);
  const before = useMemo(
    () => describeDate(change.previous_value || '', timezoneName),
    [change.previous_value, timezoneName],
  );
  const after = useMemo(
    () => describeDate(change.new_value || '', timezoneName),
    [change.new_value, timezoneName],
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
