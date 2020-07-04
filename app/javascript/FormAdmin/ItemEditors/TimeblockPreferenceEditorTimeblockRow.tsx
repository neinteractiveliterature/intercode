import React, {
  useCallback, useMemo, useContext, SetStateAction,
} from 'react';
import { DateTime } from 'luxon';

import TimeSelect from '../../BuiltInFormControls/TimeSelect';
import { useConfirm } from '../../ModalDialogs/Confirm';
import Timespan from '../../Timespan';
import useSortable from '../../useSortable';
import { TimeblockDefinition } from '../../FormPresenter/TimeblockTypes';
import AppRootContext from '../../AppRootContext';
import { WithGeneratedId } from '../FormItemUtils';

function useTimeblockPropertyUpdater<P extends keyof TimeblockDefinition>(
  onChange: (generatedId: string, setter: SetStateAction<TimeblockDefinition>) => void,
  generatedId: string,
  property: P,
) {
  return useCallback(
    (value: TimeblockDefinition[P]) => onChange(generatedId, (prevTimeblock) => ({
      ...prevTimeblock,
      [property]: value,
    })),
    [generatedId, onChange, property],
  );
}

export type TimeblockPreferenceEditorTimeblockRowProps = {
  timeblock: WithGeneratedId<TimeblockDefinition>,
  index: number,
  onChange: (generatedId: string, setter: SetStateAction<TimeblockDefinition>) => void,
  deleteTimeblock: (generatedId: string) => void,
  moveTimeblock: (dragIndex: number, hoverIndex: number) => void,
};

function TimeblockPreferenceEditorTimeblockRow({
  timeblock, index, onChange, deleteTimeblock, moveTimeblock,
}: TimeblockPreferenceEditorTimeblockRowProps) {
  const { timezoneName } = useContext(AppRootContext);
  const confirm = useConfirm();
  const startChanged = useTimeblockPropertyUpdater(onChange, timeblock.generatedId, 'start');
  const finishChanged = useTimeblockPropertyUpdater(onChange, timeblock.generatedId, 'finish');
  const labelChanged = useTimeblockPropertyUpdater(onChange, timeblock.generatedId, 'label');
  const [rowRef, drag, { isDragging }] = useSortable<HTMLTableRowElement>(
    index, moveTimeblock, 'timeblock',
  );

  const selectTimespan = useMemo(
    () => Timespan.fromDateTimes(
      DateTime.fromObject({ hour: 0 }).setZone(timezoneName),
      DateTime.fromObject({ hour: 0 }).setZone(timezoneName).plus({ hours: 31 }),
    ),
    [timezoneName],
  );

  const timespanError: string | null = useMemo(
    () => {
      if (!timeblock.start || !timeblock.finish) {
        return null;
      }

      try {
        Timespan.fromDateTimes(
          DateTime.fromObject(timeblock.start).setZone(timezoneName),
          DateTime.fromObject(timeblock.finish).setZone(timezoneName),
        );
      } catch (e) {
        return e.message;
      }

      return null;
    },
    [timeblock, timezoneName],
  );

  return (
    <tr ref={rowRef}>
      <td style={{ cursor: isDragging ? 'grabbing' : 'grab' }} ref={drag}>
        <span className="sr-only">Drag to reorder</span>
        <i className="fa fa-bars" />
      </td>
      <td>
        <TimeSelect
          value={timeblock.start}
          onChange={startChanged}
          timespan={selectTimespan}
        />
        {timespanError && (
          <div className="small text-danger mt-1">
            <i className="fa fa-warning" />
            {' '}
            {timespanError}
          </div>
        )}
      </td>
      <td>
        <TimeSelect
          value={timeblock.finish}
          onChange={finishChanged}
          timespan={selectTimespan}
        />
      </td>
      <td>
        <input
          aria-label="Timeblock label"
          value={timeblock.label || ''}
          className="form-control"
          onChange={(event) => labelChanged(event.target.value)}
        />
      </td>
      <td>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          aria-label="Delete timeblock"
          onClick={() => confirm({
            prompt: 'Are you sure you want to delete this timeblock?',
            action: () => deleteTimeblock(timeblock.generatedId),
          })}
        >
          <i className="fa fa-trash-o" />
        </button>
      </td>
    </tr>
  );
}

export default TimeblockPreferenceEditorTimeblockRow;
