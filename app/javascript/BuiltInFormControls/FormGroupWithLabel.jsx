import React from 'react';
import PropTypes from 'prop-types';

import useUniqueId from '../useUniqueId';

function FormGroupWithLabel({ children, label, name }) {
  const id = useUniqueId(`${name || 'input'}-`);

  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label}
      </label>
      {children(id)}
    </div>
  );
}

FormGroupWithLabel.propTypes = {
  children: PropTypes.func.isRequired,
  label: PropTypes.node.isRequired,
  name: PropTypes.string,
};

FormGroupWithLabel.defaultProps = {
  name: null,
};

export default FormGroupWithLabel;
