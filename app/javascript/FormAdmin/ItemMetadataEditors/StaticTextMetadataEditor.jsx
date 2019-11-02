import React from 'react';
import PropTypes from 'prop-types';

import BootstrapFormSelect from '../../BuiltInFormControls/BootstrapFormSelect';

function StaticTextMetadataEditor({ formItem, onChange }) {
  return (
    <BootstrapFormSelect
      value={formItem.properties.style}
      onChange={(style) => onChange((prevFormItem) => ({
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
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      style: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default StaticTextMetadataEditor;
