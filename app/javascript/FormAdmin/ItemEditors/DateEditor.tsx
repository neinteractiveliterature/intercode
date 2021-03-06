import { useContext } from 'react';
import { useUniqueId } from '@neinteractiveliterature/litform';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { formItemPropertyUpdater, DateFormItem } from '../FormItemUtils';
import { FormItemEditorContext } from '../FormEditorContexts';
import { FormItemEditorProps } from '../FormItemEditorProps';

export type DateEditorProps = FormItemEditorProps<DateFormItem>;
function DateEditor({ formItem, setFormItem }: DateEditorProps) {
  const { disabled } = useContext(FormItemEditorContext);
  const captionInputId = useUniqueId('date-caption-');

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
    </>
  );
}

export default DateEditor;
