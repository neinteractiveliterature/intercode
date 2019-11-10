import React, { useContext } from 'react';

import BootstrapFormSelect from '../../BuiltInFormControls/BootstrapFormSelect';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import useUniqueId from '../../useUniqueId';
import { formItemPropertyUpdater } from '../FormItemUtils';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import { Transforms } from '../../ComposableFormUtils';
import { FormItemEditorContext } from '../FormEditorContexts';

function FreeTextEditor() {
  const { disabled, formItem, setFormItem } = useContext(FormItemEditorContext);
  const captionInputId = useUniqueId('static-text-caption-');
  const responseFormat = (
    formItem.properties.format === 'markdown'
      ? 'markdown'
      : formItem.properties.free_text_type || 'text'
  );
  const setResponseFormat = (newResponseFormat) => {
    setFormItem((prevFormItem) => ({
      ...prevFormItem,
      properties: {
        ...prevFormItem.properties,
        format: newResponseFormat === 'markdown' ? 'markdown' : 'text',
        free_text_type: newResponseFormat === 'markdown' ? null : newResponseFormat,
      },
    }));
  };

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
      <BootstrapFormInput
        disabled={disabled}
        value={formItem.properties.lines.toString()}
        onTextChange={(value) => formItemPropertyUpdater('lines', setFormItem)(Transforms.integer(value))}
        type="number"
        min="1"
        label="Lines"
      />
      <BootstrapFormSelect
        disabled={disabled}
        value={responseFormat}
        onValueChange={setResponseFormat}
        label="Response format"
      >
        <option value="text">Plain text</option>
        <option value="email">Email address</option>
        <option value="markdown">Markdown</option>
        <option value="number">Number</option>
        <option value="tel">Telephone number</option>
        <option value="url">URL</option>
      </BootstrapFormSelect>
    </>
  );
}

export default FreeTextEditor;
