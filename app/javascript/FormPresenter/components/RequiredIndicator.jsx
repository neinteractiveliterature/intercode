import React from 'react';
import PropTypes from 'prop-types';

const RequiredIndicator = ({ formItem }) => {
  if (formItem.properties.required) {
    return (<span className="text-danger ml-1">*</span>);
  }

  return <span />;
};

RequiredIndicator.propTypes = {
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      required: PropTypes.bool,
    }).isRequired,
  }).isRequired,
};

export default RequiredIndicator;
