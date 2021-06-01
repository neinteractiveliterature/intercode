import { useContext } from 'react';
import {
  BootstrapFormInput,
  BootstrapFormSelect,
  useUniqueId,
  parseIntOrNull,
  BooleanInput,
  HelpPopover,
} from '@neinteractiveliterature/litform';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { formItemPropertyUpdater, FreeTextFormItem } from '../FormItemUtils';
import { FormEditorContext, FormItemEditorContext } from '../FormEditorContexts';
import { FormItemEditorProps } from '../FormItemEditorProps';

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
      <div className="mb-3">
        <label htmlFor={captionInputId} className="form-label form-item-label">
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
          formItemPropertyUpdater('lines', setFormItem)(parseIntOrNull(value))
        }
        type="number"
        min="1"
        label="Lines"
      />

      <fieldset className="card bg-light">
        <div className="card-header">
          <legend className="col-form-label pt-0">Advisory limits</legend>
          <small className="helptext">
            You can specify an advisory character or word limit for this field. These limits won’t
            be enforced, but will appear when filling out the form along with a word or character
            counter.
          </small>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-6">
              <BootstrapFormInput
                disabled={disabled}
                value={(formItem.properties.advisory_character_limit || '').toString()}
                onTextChange={(value) =>
                  formItemPropertyUpdater(
                    'advisory_character_limit',
                    setFormItem,
                  )(parseIntOrNull(value))
                }
                type="number"
                min="1"
                label="Advisory character limit"
              />
            </div>

            <div className="col-6">
              <BootstrapFormInput
                disabled={disabled}
                value={(formItem.properties.advisory_word_limit || '').toString()}
                onTextChange={(value) =>
                  formItemPropertyUpdater('advisory_word_limit', setFormItem)(parseIntOrNull(value))
                }
                type="number"
                min="1"
                label="Advisory word limit"
              />
            </div>
          </div>
        </div>
      </fieldset>

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
