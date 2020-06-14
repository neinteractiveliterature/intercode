import React from 'react';
import PropTypes from 'prop-types';

import useUniqueId from '../useUniqueId';
import HelpText from './HelpText';

function FormGroupWithLabel({
  children, label, name, helpText, className, labelClassName,
}) {
  const id = useUniqueId(`${name || 'input'}-`);

  return (
    <div className={className ?? 'form-group'}>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      {children(id)}
      <HelpText>{helpText}</HelpText>
    </div>
  );
}

FormGroupWithLabel.propTypes = {
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  children: PropTypes.func.isRequired,
  label: PropTypes.node.isRequired,
  name: PropTypes.string,
  helpText: PropTypes.node,
};

FormGroupWithLabel.defaultProps = {
  className: null,
  labelClassName: null,
  name: null,
  helpText: null,
};

export default FormGroupWithLabel;
