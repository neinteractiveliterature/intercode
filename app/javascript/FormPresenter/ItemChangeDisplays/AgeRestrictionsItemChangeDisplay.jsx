import React from 'react';
import PropTypes from 'prop-types';
import { humanize } from 'inflected';

import ObjectDiffDisplay from './ObjectDiffDisplay';

function AgeRestrictionsItemChangeDisplay({ change }) {
  const { previous_value: before, new_value: after } = change;

  return (
    <div className="border p-1 rounded">
      <ObjectDiffDisplay
        before={before}
        after={after}
        renderKey={(key) => humanize(key)}
      />
    </div>
  );
}

AgeRestrictionsItemChangeDisplay.propTypes = {
  change: PropTypes.shape({
    previous_value: PropTypes.shape({}),
    new_value: PropTypes.shape({}),
  }).isRequired,
};

export default AgeRestrictionsItemChangeDisplay;
