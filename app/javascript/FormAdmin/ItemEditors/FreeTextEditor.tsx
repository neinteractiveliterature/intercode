import React, { useContext } from 'react';

import BootstrapFormSelect from '../../BuiltInFormControls/BootstrapFormSelect';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import useUniqueId from '../../useUniqueId';
import { formItemPropertyUpdater, FreeTextFormItem } from '../FormItemUtils';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import { Transforms } from '../../ComposableFormUtils';
import { FormEditorContext, FormItemEditorContext } from '../FormEditorContexts';
import { FormItemEditorProps } from '../FormItemEditorProps';
import BooleanInput from '../../BuiltInFormControls/BooleanInput';
import HelpPopover from '../../UIComponents/HelpPopover';

export type FreeTextEditorProps = FormItemEditorProps<FreeTextFormItem>;
function FreeTextEditor({ formItem, setFormItem }: FreeTextEditorProps) {
  const { form } = useContext(FormEditorContext);
  const { disabled } = useContext(FormItemEditorContext);
  const captionInputId = useUniqueId('static-text-caption-');
  const responseFormat =
    formItem.properties.format === 'markdown'
      ? 'markdown'
      : formItem.properties.free_text_type || 'text';
  const setResponseFormat = (newResponseFormat: typeof responseFormat) => {
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
          disabled={disabled}
          disablePreview
          value={formItem.properties.caption || ''}
          onChange={formItemPropertyUpdater('caption', setFormItem)}
        />
      </div>
      <BootstrapFormInput
        disabled={disabled}
        value={(formItem.properties.lines || '').toString()}
        onTextChange={(value) =>
          formItemPropertyUpdater('lines', setFormItem)(Transforms.integer(value))
        }
        type="number"
        min="1"
        label="Lines"
      />
      {form.form_type === 'event' && (
        <BooleanInput
          disabled={disabled}
          caption={
            <>
              Hide value from public view?
              <HelpPopover>
                If selected, this item will only appear on the event page for attendees and staff.
                Typically, you would use this to reveal information only attendees should know, such
                as the URL of a Zoom call for the event.
              </HelpPopover>
            </>
          }
          value={formItem.properties.hide_from_public ?? false}
          onChange={formItemPropertyUpdater('hide_from_public', setFormItem)}
        />
      )}
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
