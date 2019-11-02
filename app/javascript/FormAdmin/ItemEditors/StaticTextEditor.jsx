import React from 'react';
import PropTypes from 'prop-types';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';

function StaticTextEditor({ formItem, onChange, disabled }) {
  return (
    <LiquidInput
      disabled={disabled}
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
  disabled: PropTypes.bool,
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      content: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

StaticTextEditor.defaultProps = {
  disabled: false,
};

export default StaticTextEditor;
