import React, { useCallback } from 'react';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import useUniqueId from '../../useUniqueId';
import { formItemPropertyUpdater, WithGeneratedId } from '../FormItemUtils';
import TimeblockPreferenceEditorTimeblockRow from './TimeblockPreferenceEditorTimeblockRow';
import BooleanInput from '../../BuiltInFormControls/BooleanInput';
import TimeblockPreferenceEditorOmissionsRow from './TimeblockPreferenceEditorOmissionsRow';
import useArrayProperty from './useArrayProperty';
import { useFormItemEditorContext } from '../FormEditorContexts';
import { TimeblockPreferenceFormItem } from '../FormItemTypes';
import { TimeblockDefinition } from '../../FormPresenter/TimeblockTypes';

function TimeblockPreferenceEditor() {
  const {
    disabled, formItem, setFormItem,
  } = useFormItemEditorContext<TimeblockPreferenceFormItem>();
  const captionInputId = useUniqueId('timeblock-preference-');

  const generateNewTimeblock: (() => TimeblockDefinition) = useCallback(
    () => ({ label: '', start: {}, finish: {} }),
    [],
  );

  const [
    addTimeblock, timeblockChanged, deleteTimeblock, moveTimeblock,
  ] = useArrayProperty<WithGeneratedId<TimeblockDefinition>>(
    'timeblocks', setFormItem, generateNewTimeblock,
  );

  return (
    <>
      <div className="form-group">
        <label htmlFor={captionInputId} className="form-item-label">
          Caption
        </label>
        <LiquidInput
          lines={3}
          disabled={disabled}
          disablePreview
          value={formItem.properties.caption || ''}
          onChange={formItemPropertyUpdater('caption', setFormItem)}
        />
        <BooleanInput
          caption="Timestamp visibility"
          value={formItem.properties.hide_timestamps || false}
          disabled={disabled}
          onChange={formItemPropertyUpdater('hide_timestamps', setFormItem)}
          trueLabel="Hidden"
          falseLabel="Visible"
          falseBeforeTrue
        />
        <table className="table">
          <thead>
            <tr>
              <th />
              <th>Start</th>
              <th>Finish</th>
              <th>Label</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {formItem.properties.timeblocks.map((timeblock, index) => (
              <React.Fragment key={timeblock.generatedId}>
                <TimeblockPreferenceEditorTimeblockRow
                  index={index}
                  timeblock={timeblock}
                  onChange={timeblockChanged}
                  deleteTimeblock={deleteTimeblock}
                  moveTimeblock={moveTimeblock}
                />

                <TimeblockPreferenceEditorOmissionsRow timeblock={timeblock} />
              </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td />
              <td colSpan={4}>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={addTimeblock}
                  disabled={disabled}
                >
                  <i className="fa fa-plus" />
                  {' '}
                  Add timeblock
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default TimeblockPreferenceEditor;
