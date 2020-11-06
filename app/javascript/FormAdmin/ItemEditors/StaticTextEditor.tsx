import { useContext } from 'react';

import BootstrapFormSelect from '../../BuiltInFormControls/BootstrapFormSelect';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import useUniqueId from '../../useUniqueId';
import { formItemPropertyUpdater, StaticTextFormItem } from '../FormItemUtils';
import { FormItemEditorContext } from '../FormEditorContexts';
import { FormItemEditorProps } from '../FormItemEditorProps';

export type StaticTextEditorProps = FormItemEditorProps<StaticTextFormItem>;
function StaticTextEditor({ formItem, setFormItem }: StaticTextEditorProps) {
  const { disabled } = useContext(FormItemEditorContext);
  const contentInputId = useUniqueId('static-text-content-');

  return (
    <>
      <div className="form-group">
        <label htmlFor={contentInputId} className="form-item-label">
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
