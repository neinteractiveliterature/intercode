import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

import CommonQuestionFields from './CommonQuestionFields';
import RegistrationPolicyItemEditorPresetRow from './RegistrationPolicyItemEditorPresetRow';
import useArrayProperty from './useArrayProperty';
import BootstrapFormCheckbox from '../../BuiltInFormControls/BootstrapFormCheckbox';
import usePropertyUpdater from './usePropertyUpdater';

function RegistrationPolicyItemEditor({
  convention, form, formItem, onChange, renderedFormItem,
}) {
  const generateNewPreset = useCallback(
    () => ({
      name: '',
      policy: {
        buckets: [],
      },
    }),
    [],
  );

  const allowCustomChanged = usePropertyUpdater(onChange, 'allow_custom');

  const [addPreset, presetChanged, deletePreset, movePreset] = useArrayProperty(
    'presets',
    onChange,
    generateNewPreset,
  );

  return (
    <>
      <CommonQuestionFields
        convention={convention}
        form={form}
        formItem={formItem}
        onChange={onChange}
        renderedFormItem={renderedFormItem}
      />

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

RegistrationPolicyItemEditor.propTypes = {
  convention: PropTypes.shape({}).isRequired,
  form: PropTypes.shape({}).isRequired,
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      allow_custom: PropTypes.bool,
      presets: PropTypes.array,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  renderedFormItem: PropTypes.shape({}).isRequired,
};

export default RegistrationPolicyItemEditor;
