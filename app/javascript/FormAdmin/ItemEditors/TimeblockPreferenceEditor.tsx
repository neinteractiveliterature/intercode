import { Fragment, useCallback, useContext } from 'react';
import { BooleanInput, useUniqueId } from '@neinteractiveliterature/litform';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { formItemPropertyUpdater, TimeblockPreferenceFormItem } from '../FormItemUtils';
import TimeblockPreferenceEditorTimeblockRow from './TimeblockPreferenceEditorTimeblockRow';
import TimeblockPreferenceEditorOmissionsRow from './TimeblockPreferenceEditorOmissionsRow';
import useArrayProperty from './useArrayProperty';
import { FormItemEditorContext } from '../FormEditorContexts';
import { FormItemEditorProps } from '../FormItemEditorProps';

export type TimeblockPreferenceEditorProps = FormItemEditorProps<TimeblockPreferenceFormItem>;
function TimeblockPreferenceEditor({ formItem, setFormItem }: TimeblockPreferenceEditorProps) {
  const { disabled } = useContext(FormItemEditorContext);
  const captionInputId = useUniqueId('timeblock-preference-');

  const generateNewTimeblock = useCallback(() => ({ label: '', start: {}, finish: {} }), []);

  const [addTimeblock, timeblockChanged, deleteTimeblock, moveTimeblock] = useArrayProperty<
    typeof formItem['properties']['timeblocks'][0],
    typeof formItem,
    'timeblocks'
  >('timeblocks', setFormItem, generateNewTimeblock);

  return (
    <>
      <div className="mb-3">
        <label htmlFor={captionInputId} className="form-label form-item-label">
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
              <Fragment key={timeblock.generatedId}>
                <TimeblockPreferenceEditorTimeblockRow
                  index={index}
                  timeblock={timeblock}
                  onChange={timeblockChanged}
                  deleteTimeblock={deleteTimeblock}
                  moveTimeblock={moveTimeblock}
                />

                <TimeblockPreferenceEditorOmissionsRow
                  timeblock={timeblock}
                  formItem={formItem}
                  setFormItem={setFormItem}
                />
              </Fragment>
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
                  <i className="fa fa-plus" /> Add timeblock
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
