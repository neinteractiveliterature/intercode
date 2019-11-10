import React, { useCallback, useContext } from 'react';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

import CommonQuestionFields from './CommonQuestionFields';
import RegistrationPolicyItemEditorPresetRow from './RegistrationPolicyItemEditorPresetRow';
import useArrayProperty from './useArrayProperty';
import BootstrapFormCheckbox from '../../BuiltInFormControls/BootstrapFormCheckbox';
import usePropertyUpdater from './usePropertyUpdater';
import { FormItemEditorContext } from '../FormEditorContexts';

function RegistrationPolicyItemEditor() {
  const { formItem, setFormItem } = useContext(FormItemEditorContext);

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
      <CommonQuestionFields />

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
          <DndProvider backend={MultiBackend} options={HTML5toTouch}>
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
          </DndProvider>
          <tr>
            <td />
            <td colSpan={2}>
              <BootstrapFormCheckbox
                label="Allow users to create custom policies"
                checked={formItem.properties.allow_custom}
                onCheckedChange={allowCustomChanged}
              />
            </td>
            <td />
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td />
            <td colSpan={4}>
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={addPreset}>
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
