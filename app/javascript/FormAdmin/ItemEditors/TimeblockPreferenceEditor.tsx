import { Fragment, useCallback, useContext, useId } from 'react';
import { BooleanInput, useMatchWidthStyle } from '@neinteractiveliterature/litform';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { formItemPropertyUpdater, TimeblockPreferenceFormItem } from '../FormItemUtils';
import TimeblockPreferenceEditorTimeblockRow from './TimeblockPreferenceEditorTimeblockRow';
import TimeblockPreferenceEditorOmissionsRow from './TimeblockPreferenceEditorOmissionsRow';
import useArrayProperty from './useArrayProperty';
import { FormItemEditorContext } from '../FormEditorContexts';
import { FormItemEditorProps } from '../FormItemEditorProps';
import { useSortableDndSensors } from '../../SortableUtils';
import TimeblockPreferenceEditorTimeblockRowDragOverlay from './TimeblockPreferenceEditorTimeblockRowDragOverlay';

export type TimeblockPreferenceEditorProps = FormItemEditorProps<TimeblockPreferenceFormItem>;
function TimeblockPreferenceEditor({ formItem, setFormItem }: TimeblockPreferenceEditorProps): React.JSX.Element {
  const { disabled } = useContext(FormItemEditorContext);
  const captionInputId = useId();
  const generateNewTimeblock = useCallback(() => ({ label: '', start: {}, finish: {} }), []);
  const [matchWidthRef, matchWidthStyle] = useMatchWidthStyle<HTMLTableElement>();

  const sensors = useSortableDndSensors();
  const [addTimeblock, timeblockChanged, deleteTimeblock, draggingTimeblock, sortableHandlers] = useArrayProperty<
    (typeof formItem)['properties']['timeblocks'][0],
    typeof formItem,
    'timeblocks'
  >(formItem.properties.timeblocks, 'timeblocks', setFormItem, generateNewTimeblock);

  return (
    <DndContext sensors={sensors} {...sortableHandlers}>
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
        <table className="table" ref={matchWidthRef}>
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
            <SortableContext
              items={formItem.properties.timeblocks.map((timeblock) => timeblock.generatedId)}
              strategy={verticalListSortingStrategy}
            >
              {formItem.properties.timeblocks.map((timeblock) => (
                <Fragment key={timeblock.generatedId}>
                  <TimeblockPreferenceEditorTimeblockRow
                    timeblock={timeblock}
                    onChange={timeblockChanged}
                    deleteTimeblock={deleteTimeblock}
                  />

                  <TimeblockPreferenceEditorOmissionsRow
                    timeblock={timeblock}
                    formItem={formItem}
                    setFormItem={setFormItem}
                  />
                </Fragment>
              ))}
            </SortableContext>
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
                  <i className="bi-plus" /> Add timeblock
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <DragOverlay>
        {draggingTimeblock && (
          <table className="table" style={matchWidthStyle}>
            <tbody>
              <TimeblockPreferenceEditorTimeblockRowDragOverlay timeblock={draggingTimeblock} />
            </tbody>
          </table>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default TimeblockPreferenceEditor;
