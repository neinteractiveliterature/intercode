import { useContext, useId } from 'react';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { formItemPropertyUpdater, DateFormItem } from '../FormItemUtils';
import { FormItemEditorContext } from '../FormEditorContexts';
import { FormItemEditorProps } from '../FormItemEditorProps';

export type DateEditorProps = FormItemEditorProps<DateFormItem>;
function DateEditor({ formItem, setFormItem }: DateEditorProps): JSX.Element {
  const { disabled } = useContext(FormItemEditorContext);
  const captionInputId = useId();

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
