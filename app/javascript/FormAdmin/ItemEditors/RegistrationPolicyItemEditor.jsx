import React, { useCallback, useContext } from 'react';

import RegistrationPolicyItemEditorPresetRow from './RegistrationPolicyItemEditorPresetRow';
import useArrayProperty from './useArrayProperty';
import BootstrapFormCheckbox from '../../BuiltInFormControls/BootstrapFormCheckbox';
import usePropertyUpdater from './usePropertyUpdater';
import { FormItemEditorContext } from '../FormEditorContexts';

function RegistrationPolicyItemEditor() {
  const { disabled, formItem, setFormItem } = useContext(FormItemEditorContext);

  const generateNewPreset = useCallback(
    () => ({
      name: '',
      policy: {
        buckets: [],
      },
    }),
    [],
  );

  const allowCustomChanged = usePropertyUpdater(setFormItem, 'allow_custom');

  const [addPreset, presetChanged, deletePreset, movePreset] = useArrayProperty(
    'presets', setFormItem, generateNewPreset,
  );

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
                <i className="fa fa-plus" />
                {' '}
                Add policy preset
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

export default RegistrationPolicyItemEditor;
