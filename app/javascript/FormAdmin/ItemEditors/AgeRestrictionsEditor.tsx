import { useContext } from 'react';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import useUniqueId from '../../useUniqueId';
import { formItemPropertyUpdater, AgeRestrictionsFormItem } from '../FormItemUtils';
import { FormItemEditorContext } from '../FormEditorContexts';
import { FormItemEditorProps } from '../FormItemEditorProps';

export type AgeRestrictionsEditorProps = FormItemEditorProps<AgeRestrictionsFormItem>;
function AgeRestrictionsEditor({ formItem, setFormItem }: AgeRestrictionsEditorProps) {
  const { disabled } = useContext(FormItemEditorContext);
  const captionInputId = useUniqueId('age-restrictions-caption-');

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
    </>
  );
}

export default AgeRestrictionsEditor;
