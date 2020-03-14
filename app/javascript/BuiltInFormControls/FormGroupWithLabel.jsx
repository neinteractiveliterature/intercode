import React from 'react';
import PropTypes from 'prop-types';

import useUniqueId from '../useUniqueId';
import HelpText from './HelpText';

function FormGroupWithLabel({
  children, label, name, helpText,
}) {
  const id = useUniqueId(`${name || 'input'}-`);

  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label}
      </label>
      {children(id)}
      <HelpText>{helpText}</HelpText>
    </div>
  );
}

FormGroupWithLabel.propTypes = {
  children: PropTypes.func.isRequired,
  label: PropTypes.node.isRequired,
  name: PropTypes.string,
  helpText: PropTypes.node,
};

FormGroupWithLabel.defaultProps = {
  name: null,
  helpText: null,
};

export default FormGroupWithLabel;
