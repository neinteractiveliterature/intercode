import { useContext, useId } from 'react';
import { BootstrapFormSelect } from '@neinteractiveliterature/litform';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { formItemPropertyUpdater, StaticTextFormItem } from '../FormItemUtils';
import { FormItemEditorContext } from '../FormEditorContexts';
import { FormItemEditorProps } from '../FormItemEditorProps';

export type StaticTextEditorProps = FormItemEditorProps<StaticTextFormItem>;
function StaticTextEditor({ formItem, setFormItem }: StaticTextEditorProps): React.JSX.Element {
  const { disabled } = useContext(FormItemEditorContext);
  const contentInputId = useId();

  return (
    <>
      <div className="mb-3">
        <label htmlFor={contentInputId} className="form-label form-item-label">
          Content
        </label>
        <LiquidInput
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
