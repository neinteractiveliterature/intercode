import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import TextDiffDisplay from './TextDiffDisplay';
import { describeTimespan } from '../ItemDisplays/TimespanItemDisplay';

function TimespanItemChangeDisplay({ change }) {
  const before = useMemo(
    () => describeTimespan(change.previous_value || 0),
    [change.previous_value],
  );
  const after = useMemo(
    () => describeTimespan(change.new_value || 0),
    [change.new_value],
  );

  return <TextDiffDisplay before={before} after={after} />;
}

TimespanItemChangeDisplay.propTypes = {
  change: PropTypes.shape({
    previous_value: PropTypes.number,
    new_value: PropTypes.number,
  }).isRequired,
};

export default TimespanItemChangeDisplay;
