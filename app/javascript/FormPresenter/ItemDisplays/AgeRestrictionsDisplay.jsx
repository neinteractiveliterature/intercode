import React from 'react';
import PropTypes from 'prop-types';

import MarkdownDisplay from './MarkdownDisplay';

function AgeRestrictionsDisplay(props) {
  const value = props.value || {};

  if (props.displayMode === 'public') {
    return <MarkdownDisplay markdown={value.age_restrictions_description} />;
  }

  return (
    <ul className="list-unstyled">
      <li>
        <strong>Minimum age:</strong>
        {' '}
        {value.minimum_age || <em>none set</em>}
      </li>

      <li>
        <strong>Public description:</strong>
        {' '}
        <MarkdownDisplay markdown={value.age_restrictions_description} />
      </li>
    </ul>
  );
}

AgeRestrictionsDisplay.propTypes = {
  displayMode: PropTypes.string.isRequired,
  value: PropTypes.shape({}),
};

AgeRestrictionsDisplay.defaultProps = {
  value: null,
};

export default AgeRestrictionsDisplay;
