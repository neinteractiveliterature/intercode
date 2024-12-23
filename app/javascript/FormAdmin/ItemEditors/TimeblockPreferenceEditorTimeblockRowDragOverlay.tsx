import { useMemo, useContext } from 'react';
import { DateTime } from 'luxon';

import TimeSelect from '../../BuiltInFormControls/TimeSelect';
import Timespan from '../../Timespan';
import AppRootContext from '../../AppRootContext';
import { TimeblockDefinition } from '../../FormPresenter/TimeblockTypes';
import { WithGeneratedId } from '../../GeneratedIdUtils';
import { getTimeblockTimespanForDisplay } from '../../FormPresenter/TimeblockUtils';

export type TimeblockPreferenceEditorTimeblockRowDragOverlayProps = {
  timeblock: WithGeneratedId<TimeblockDefinition, string>;
};

function TimeblockPreferenceEditorTimeblockRowDragOverlay({
  timeblock,
}: TimeblockPreferenceEditorTimeblockRowDragOverlayProps): JSX.Element {
  const { timezoneName } = useContext(AppRootContext);

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
      getTimeblockTimespanForDisplay(timeblock);
    } catch (e) {
      return e.message;
    }

    return null;
  }, [timeblock]);

  return (
    <tr>
      <td style={{ cursor: 'grabbing' }}>
        <span className="visually-hidden">Drag to reorder</span>
        <i className="bi-grip-vertical" />
      </td>
      <td>
        <TimeSelect value={timeblock.start} onChange={() => {}} timespan={selectTimespan} />
        {timespanError && (
          <div className="small text-danger mt-1">
            <i className="bi-exclamation-triangle-fill" /> {timespanError}
          </div>
        )}
      </td>
      <td>
        <TimeSelect value={timeblock.finish} onChange={() => {}} timespan={selectTimespan} />
      </td>
      <td>
        <input
          aria-label="Timeblock label"
          value={timeblock.label || ''}
          className="form-control"
          onChange={() => {}}
        />
      </td>
      <td>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          aria-label="Delete timeblock"
          onClick={() => {}}
        >
          <i className="bi-trash" />
        </button>
      </td>
    </tr>
  );
}

export default TimeblockPreferenceEditorTimeblockRowDragOverlay;
