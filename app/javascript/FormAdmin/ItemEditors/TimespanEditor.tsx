import { useContext } from 'react';
import { useUniqueId } from '@neinteractiveliterature/litform';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { formItemPropertyUpdater, TimespanFormItem } from '../FormItemUtils';
import { FormItemEditorContext } from '../FormEditorContexts';
import { FormItemEditorProps } from '../FormItemEditorProps';

export type TimespanEditorProps = FormItemEditorProps<TimespanFormItem>;
function TimespanEditor({ formItem, setFormItem }: TimespanEditorProps): JSX.Element {
  const { disabled } = useContext(FormItemEditorContext);
  const captionInputId = useUniqueId('timespan-caption-');

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

export default TimespanEditor;
