import React from 'react';
import PropTypes from 'prop-types';

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

StaticTextEditor.propTypes = {
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      content: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default StaticTextEditor;
