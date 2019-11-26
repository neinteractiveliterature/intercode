import React, { useContext } from 'react';

import BootstrapFormSelect from '../../BuiltInFormControls/BootstrapFormSelect';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import useUniqueId from '../../useUniqueId';
import { formItemPropertyUpdater } from '../FormItemUtils';
import { FormItemEditorContext } from '../FormEditorContexts';

function StaticTextEditor() {
  const { disabled, formItem, setFormItem } = useContext(FormItemEditorContext);
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
          onChange={formItemPropertyUpdater('content', setFormItem)}
        />
      </div>
      <BootstrapFormSelect
        disabled={disabled}
        value={formItem.properties.style}
        onValueChange={formItemPropertyUpdater('style', setFormItem)}
        label="Text style"
      >
        <option value="normal">Normal</option>
        <option value="subhead">Subhead</option>
      </BootstrapFormSelect>
    </>
  );
}

export default StaticTextEditor;
