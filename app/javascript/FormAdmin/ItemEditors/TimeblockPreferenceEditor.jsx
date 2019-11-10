import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import useUniqueId from '../../useUniqueId';
import { formItemPropertyUpdater } from '../FormItemUtils';
import CommonQuestionFields from './CommonQuestionFields';
import { FuzzyTimePropType } from '../../FormPresenter/TimeblockTypes';
import TimeblockPreferenceEditorTimeblockRow from './TimeblockPreferenceEditorTimeblockRow';
import BooleanInput from '../../BuiltInFormControls/BooleanInput';
import TimeblockPreferenceEditorOmissionsRow from './TimeblockPreferenceEditorOmissionsRow';
import useArrayProperty from './useArrayProperty';

function TimeblockPreferenceEditor({
  convention, form, formItem, onChange, disabled, renderedFormItem,
}) {
  const captionInputId = useUniqueId('timeblock-preference-');

  const generateNewTimeblock = useCallback(
    () => ({ label: '', start: {}, finish: {} }),
    [],
  );

  const [addTimeblock, timeblockChanged, deleteTimeblock, moveTimeblock] = useArrayProperty(
    'timeblocks',
    onChange,
    generateNewTimeblock,
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
      <div className="form-group">
        <label htmlFor={captionInputId} className="form-item-label">
          Caption
        </label>
        <LiquidInput
          id={captionInputId}
          lines={3}
          disabled={disabled}
          disablePreview
          value={formItem.properties.caption || ''}
          onChange={formItemPropertyUpdater('caption', onChange)}
        />
        <BooleanInput
          caption="Timestamp visibility"
          value={formItem.properties.hide_timestamps || false}
          onChange={formItemPropertyUpdater('hide_timestamps', onChange)}
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
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
              {formItem.properties.timeblocks.map((timeblock, index) => (
                <React.Fragment key={timeblock.generatedId}>
                  <TimeblockPreferenceEditorTimeblockRow
                    index={index}
                    timeblock={timeblock}
                    onChange={timeblockChanged}
                    timezoneName={convention.timezone_name}
                    deleteTimeblock={deleteTimeblock}
                    moveTimeblock={moveTimeblock}
                  />

                  <TimeblockPreferenceEditorOmissionsRow
                    timeblock={timeblock}
                    formItem={formItem}
                    convention={convention}
                    onChange={onChange}
                  />
                </React.Fragment>
              ))}
            </DndProvider>
          </tbody>
          <tfoot>
            <tr>
              <td />
              <td colSpan={4}>
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={addTimeblock}>
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

TimeblockPreferenceEditor.propTypes = {
  convention: PropTypes.shape({
    timezone_name: PropTypes.string.isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
  form: PropTypes.shape({}).isRequired,
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      caption: PropTypes.string,
      timeblocks: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        start: FuzzyTimePropType,
        finish: FuzzyTimePropType,
      })).isRequired,
      hide_timestamps: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  renderedFormItem: PropTypes.shape({}).isRequired,
};

TimeblockPreferenceEditor.defaultProps = {
  disabled: false,
};

export default TimeblockPreferenceEditor;
