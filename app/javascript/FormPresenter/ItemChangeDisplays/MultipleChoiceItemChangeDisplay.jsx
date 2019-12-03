import React from 'react';
import PropTypes from 'prop-types';
import TextDiffDisplay from './TextDiffDisplay';

function MultipleChoiceItemChangeDisplay({ change }) {
  const { previous_value: before, new_value: after } = change;

  if (Array.isArray(before) || Array.isArray(after)) {
    const beforeArray = Array.isArray(before) ? before : [before];
    const afterArray = Array.isArray(after) ? after : [after];

    return <TextDiffDisplay before={beforeArray.join(', ')} after={afterArray.join(', ')} />;
  }

  return <TextDiffDisplay before={before} after={after} />;
}

MultipleChoiceItemChangeDisplay.propTypes = {
  change: PropTypes.shape({
    previous_value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    new_value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  }).isRequired,
};

export default MultipleChoiceItemChangeDisplay;
