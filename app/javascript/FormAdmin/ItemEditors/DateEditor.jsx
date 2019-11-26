import React, { useContext } from 'react';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import useUniqueId from '../../useUniqueId';
import { formItemPropertyUpdater } from '../FormItemUtils';
import { FormItemEditorContext } from '../FormEditorContexts';

function DateEditor() {
  const { disabled, formItem, setFormItem } = useContext(FormItemEditorContext);
  const captionInputId = useUniqueId('date-caption-');

  return (
    <>
      <div className="form-group">
        <label htmlFor={captionInputId} className="form-item-label">
          Caption
        </label>
        <LiquidInput
          id={captionInputId}
          disabled={disabled}
          disablePreview
          value={formItem.properties.caption || ''}
          onChange={formItemPropertyUpdater('caption', setFormItem)}
        />
      </div>
    </>
  );
}

export default DateEditor;
