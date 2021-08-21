import { useCallback, useContext } from 'react';
import { BootstrapFormCheckbox } from '@neinteractiveliterature/litform';

import RegistrationPolicyItemEditorPresetRow from './RegistrationPolicyItemEditorPresetRow';
import useArrayProperty from './useArrayProperty';
import usePropertyUpdater from './usePropertyUpdater';
import { FormItemEditorContext } from '../FormEditorContexts';
import { FormItemEditorProps } from '../FormItemEditorProps';
import { RegistrationPolicyFormItem, RegistrationPolicyPreset } from '../FormItemUtils';
import { WithGeneratedId } from '../../GeneratedIdUtils';

export type RegistrationPolicyItemEditorProps = FormItemEditorProps<RegistrationPolicyFormItem>;
function RegistrationPolicyItemEditor({
  formItem,
  setFormItem,
}: RegistrationPolicyItemEditorProps) {
  const { disabled } = useContext(FormItemEditorContext);

  const generateNewPreset: () => RegistrationPolicyPreset = useCallback(
    () => ({
      name: '',
      policy: {
        __typename: 'RegistrationPolicy',
        prevent_no_preference_signups: false,
        buckets: [],
      },
    }),
    [],
  );

  const allowCustomChanged = usePropertyUpdater(setFormItem, 'allow_custom');

  const [addPreset, presetChanged, deletePreset, movePreset] = useArrayProperty<
    WithGeneratedId<RegistrationPolicyPreset, string>,
    typeof formItem,
    'presets'
  >('presets', setFormItem, generateNewPreset);

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th />
            <th>Policy preset</th>
            <th>Buckets</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(formItem.properties.presets || []).map((preset, index) => (
            <RegistrationPolicyItemEditorPresetRow
              key={preset.generatedId}
              preset={preset}
              index={index}
              movePreset={movePreset}
              deletePreset={deletePreset}
              onChange={presetChanged}
            />
          ))}
          <tr>
            <td />
            <td colSpan={2}>
              <BootstrapFormCheckbox
                label="Allow users to create custom policies"
                checked={formItem.properties.allow_custom}
                onCheckedChange={allowCustomChanged}
                disabled={disabled}
                type="checkbox"
              />
            </td>
            <td />
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td />
            <td colSpan={4}>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={addPreset}
                disabled={disabled}
              >
                <i className="bi-plus" /> Add policy preset
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

export default RegistrationPolicyItemEditor;
