import React from 'react';
import PropTypes from 'prop-types';

import BootstrapFormSelect from '../../BuiltInFormControls/BootstrapFormSelect';

function StaticTextMetadataEditor({ formItem, onChange, disabled }) {
  return (
    <BootstrapFormSelect
      disabled={disabled}
      value={formItem.properties.style}
      onValueChange={(style) => onChange((prevFormItem) => ({
        ...prevFormItem,
        properties: {
          ...prevFormItem.properties,
          style,
        },
      }))}
      label="Text style"
    >
      <option value="normal">Normal</option>
      <option value="subhead">Subhead</option>
    </BootstrapFormSelect>
  );
}

StaticTextMetadataEditor.propTypes = {
  disabled: PropTypes.bool,
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      style: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

StaticTextMetadataEditor.defaultProps = {
  disabled: false,
};

export default StaticTextMetadataEditor;
