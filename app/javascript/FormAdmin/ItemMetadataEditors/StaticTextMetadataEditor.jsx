import React from 'react';

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

export default StaticTextMetadataEditor;
