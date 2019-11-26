import React, { useCallback, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import TimeSelect from '../../BuiltInFormControls/TimeSelect';
import { useConfirm } from '../../ModalDialogs/Confirm';
import Timespan from '../../Timespan';
import useSortable from '../../useSortable';
import { FuzzyTimePropType } from '../../FormPresenter/TimeblockTypes';
import { FormEditorContext } from '../FormEditorContexts';

function useTimeblockPropertyUpdater(onChange, generatedId, property) {
  return useCallback(
    (value) => onChange(generatedId, (prevTimeblock) => ({
      ...prevTimeblock,
      [property]: value,
    })),
    [generatedId, onChange, property],
  );
}

function TimeblockPreferenceEditorTimeblockRow({
  timeblock, index, onChange, deleteTimeblock, moveTimeblock,
}) {
  const { convention } = useContext(FormEditorContext);
  const timezoneName = convention.timezone_name;
  const confirm = useConfirm();
  const startChanged = useTimeblockPropertyUpdater(onChange, timeblock.generatedId, 'start');
  const finishChanged = useTimeblockPropertyUpdater(onChange, timeblock.generatedId, 'finish');
  const labelChanged = useTimeblockPropertyUpdater(onChange, timeblock.generatedId, 'label');
  const [rowRef, drag, { isDragging }] = useSortable(index, moveTimeblock, 'timeblock');

  const selectTimespan = useMemo(
    () => new Timespan(
      moment.tz({ hour: 0 }, timezoneName),
      moment.tz({ hour: 0 }, timezoneName).add(31, 'hours'),
    ),
    [timezoneName],
  );

  const timespanError = useMemo(
    () => {
      if (!timeblock.start || !timeblock.finish) {
        return null;
      }

      try {
        // eslint-disable-next-line no-new
        new Timespan(
          moment.tz(timeblock.start, timezoneName),
          moment.tz(timeblock.finish, timezoneName),
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
          onChange={(value) => startChanged(value)}
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

TimeblockPreferenceEditorTimeblockRow.propTypes = {
  timeblock: PropTypes.shape({
    generatedId: PropTypes.string.isRequired,
    label: PropTypes.string,
    start: FuzzyTimePropType,
    finish: FuzzyTimePropType,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  deleteTimeblock: PropTypes.func.isRequired,
  moveTimeblock: PropTypes.func.isRequired,
};

export default TimeblockPreferenceEditorTimeblockRow;
