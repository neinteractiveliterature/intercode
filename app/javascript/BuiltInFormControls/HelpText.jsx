import React from 'react';
import PropTypes from 'prop-types';

function HelpText({ children }) {
  if (!children) {
    return null;
  }

  return <small className="form-text text-muted">{children}</small>;
}

HelpText.propTypes = {
  children: PropTypes.node,
};

HelpText.defaultProps = {
  children: null,
};

export default HelpText;
