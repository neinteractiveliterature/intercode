import React from 'react';
import PropTypes from 'prop-types';

import BootstrapFormSelect from '../../BuiltInFormControls/BootstrapFormSelect';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import useUniqueId from '../../useUniqueId';
import { formItemPropertyUpdater } from '../FormItemUtils';

function StaticTextEditor({ formItem, onChange, disabled }) {
  const contentInputId = useUniqueId('static-text-content-');

  return (
    <>
      <div className="form-group">
        <label htmlFor={contentInputId} className="form-item-label">
          Content
        </label>
        <LiquidInput
          id={contentInputId}
          disabled={disabled}
          disablePreview
          value={formItem.properties.content || ''}
          onChange={formItemPropertyUpdater('content', onChange)}
        />
      </div>
      <BootstrapFormSelect
        disabled={disabled}
        value={formItem.properties.style}
        onValueChange={formItemPropertyUpdater('style', onChange)}
        label="Text style"
      >
        <option value="normal">Normal</option>
        <option value="subhead">Subhead</option>
      </BootstrapFormSelect>
    </>
  );
}

StaticTextEditor.propTypes = {
  disabled: PropTypes.bool,
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      content: PropTypes.string,
      style: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

StaticTextEditor.defaultProps = {
  disabled: false,
};

export default StaticTextEditor;
