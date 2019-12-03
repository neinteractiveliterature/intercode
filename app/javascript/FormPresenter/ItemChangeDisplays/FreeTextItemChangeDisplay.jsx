import React from 'react';
import PropTypes from 'prop-types';
import TextDiffDisplay from './TextDiffDisplay';

function FreeTextItemChangeDisplay({ formItem, change }) {
  const { previous_value: before, new_value: after } = change;

  if (formItem.properties.format === 'markdown') {
    return (
      <div className="text-monospace small border rounded p-1">
        <TextDiffDisplay before={before} after={after} />
      </div>
    );
  }

  return <TextDiffDisplay before={before} after={after} />;
}

FreeTextItemChangeDisplay.propTypes = {
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      format: PropTypes.string,
    }).isRequired,
  }).isRequired,
  change: PropTypes.shape({
    previous_value: PropTypes.string,
    new_value: PropTypes.string,
  }).isRequired,
};

export default FreeTextItemChangeDisplay;
