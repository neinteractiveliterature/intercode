import React from 'react';
import PropTypes from 'prop-types';

const PlainTextDisplay = ({ value }) => {
  let stringValue = value || '';
  if (Array.isArray(value)) {
    stringValue = value.join(', ');
  }

  return stringValue.split(/\r?\n/).map((line, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <React.Fragment key={i}>
      {i > 0 ? <br /> : null}
      {line}
    </React.Fragment>
  ));
};

PlainTextDisplay.propTypes = {
  value: PropTypes.string.isRequired,
};

export default PlainTextDisplay;
