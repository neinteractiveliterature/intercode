import React from 'react';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';

function StaticTextEditor({ formItem, onChange }) {
  return (
    <LiquidInput
      value={formItem.properties.content}
      onChange={(content) => onChange((prevFormItem) => ({
        ...prevFormItem,
        properties: {
          ...prevFormItem.properties,
          content,
        },
      }))}
    />
  );
}

export default StaticTextEditor;
