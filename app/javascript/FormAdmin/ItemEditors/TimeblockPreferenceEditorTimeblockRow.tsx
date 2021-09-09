import { useCallback, useMemo, useContext } from 'react';
import * as React from 'react';
import { DateTime } from 'luxon';
import { useConfirm } from '@neinteractiveliterature/litform';

import TimeSelect from '../../BuiltInFormControls/TimeSelect';
import Timespan from '../../Timespan';
import useSortable from '../../useSortable';
import AppRootContext from '../../AppRootContext';
import { TimeblockDefinition } from '../../FormPresenter/TimeblockTypes';
import { WithGeneratedId } from '../../GeneratedIdUtils';
import { getTimeblockTimespanForDisplay } from '../../FormPresenter/TimeblockUtils';

function useTimeblockPropertyUpdater(
  onChange: (generatedId: string, updater: React.SetStateAction<TimeblockDefinition>) => void,
  generatedId: string,
  property: keyof TimeblockDefinition,
) {
  return useCallback(
    (value) =>
      onChange(generatedId, (prevTimeblock) => ({
        ...prevTimeblock,
        [property]: value,
      })),
    [generatedId, onChange, property],
  );
}

export type TimeblockPreferenceEditorTimeblockRowProps = {
  timeblock: WithGeneratedId<TimeblockDefinition, string>;
  index: number;
  onChange: (generatedId: string, updater: React.SetStateAction<TimeblockDefinition>) => void;
  deleteTimeblock: (generatedId: string) => void;
  moveTimeblock: (dragIndex: number, hoverIndex: number) => void;
};

function TimeblockPreferenceEditorTimeblockRow({
  timeblock,
  index,
  onChange,
  deleteTimeblock,
  moveTimeblock,
}: TimeblockPreferenceEditorTimeblockRowProps) {
  const { timezoneName } = useContext(AppRootContext);
  const confirm = useConfirm();
  const startChanged = useTimeblockPropertyUpdater(onChange, timeblock.generatedId, 'start');
  const finishChanged = useTimeblockPropertyUpdater(onChange, timeblock.generatedId, 'finish');
  const labelChanged = useTimeblockPropertyUpdater(onChange, timeblock.generatedId, 'label');
  const [rowRef, drag, { isDragging }] = useSortable<HTMLTableRowElement>(
    index,
    moveTimeblock,
    'timeblock',
  );

  const selectTimespan = useMemo(
    () =>
      Timespan.finiteFromDateTimes(
        DateTime.fromObject({ hour: 0 }, { zone: timezoneName }),
        DateTime.fromObject({ hour: 0 }, { zone: timezoneName }).plus({ hours: 31 }),
      ),
    [timezoneName],
  );

  const timespanError = useMemo(() => {
    if (!timeblock.start || !timeblock.finish) {
      return null;
    }

    try {
      // eslint-disable-next-line no-new
      getTimeblockTimespanForDisplay(timeblock);
    } catch (e) {
      return e.message;
    }

    return null;
  }, [timeblock]);

  return (
    <tr ref={rowRef}>
      <td style={{ cursor: isDragging ? 'grabbing' : 'grab' }} ref={drag}>
        <span className="visually-hidden">Drag to reorder</span>
        <i className="bi-list" />
      </td>
      <td>
        <TimeSelect
          value={timeblock.start}
          onChange={(value) => startChanged(value)}
          timespan={selectTimespan}
        />
        {timespanError && (
          <div className="small text-danger mt-1">
            <i className="bi-exclamation-triangle-fill" /> {timespanError}
          </div>
        )}
      </td>
      <td>
        <TimeSelect
          value={timeblock.finish}
          onChange={(value) => finishChanged(value)}
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
          onClick={() =>
            confirm({
              prompt: 'Are you sure you want to delete this timeblock?',
              action: () => deleteTimeblock(timeblock.generatedId),
            })
          }
        >
          <i className="bi-trash" />
        </button>
      </td>
    </tr>
  );
}

export default TimeblockPreferenceEditorTimeblockRow;
