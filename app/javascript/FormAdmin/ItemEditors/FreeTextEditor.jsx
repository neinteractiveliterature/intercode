import React from 'react';
import PropTypes from 'prop-types';

import BootstrapFormSelect from '../../BuiltInFormControls/BootstrapFormSelect';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import useUniqueId from '../../useUniqueId';
import { formItemPropertyUpdater } from '../FormItemUtils';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import { Transforms } from '../../ComposableFormUtils';

function FreeTextEditor({ formItem, onChange, disabled }) {
  const captionInputId = useUniqueId('static-text-caption-');
  const responseFormat = (
    formItem.properties.format === 'markdown'
      ? 'markdown'
      : formItem.properties.free_text_type || 'text'
  );
  const setResponseFormat = (newResponseFormat) => {
    onChange((prevFormItem) => ({
      ...prevFormItem,
      properties: {
        ...prevFormItem.properties,
        format: newResponseFormat === 'markdown' ? 'markdown' : 'text',
        free_text_type: newResponseFormat === 'markdown' ? null : newResponseFormat,
      },
    }));
  };

  // identifier: : required,
  // required: : optional,

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
          onChange={formItemPropertyUpdater('caption', onChange)}
        />
      </div>
      <BootstrapFormInput
        disabled={disabled}
        value={formItem.properties.lines.toString()}
        onTextChange={(value) => formItemPropertyUpdater('lines', onChange)(Transforms.integer(value))}
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

FreeTextEditor.propTypes = {
  disabled: PropTypes.bool,
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      caption: PropTypes.string,
      lines: PropTypes.number.isRequired,
      format: PropTypes.string,
      free_text_type: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

FreeTextEditor.defaultProps = {
  disabled: false,
};

export default FreeTextEditor;
