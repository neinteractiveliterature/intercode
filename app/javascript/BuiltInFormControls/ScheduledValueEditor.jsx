import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import maxBy from 'lodash/maxBy';
import moment from 'moment-timezone';
import { ScheduledValuePropType } from '../ScheduledValuePropTypes';
import ScheduledValueTimespanRow, { scheduledValueTimespanIsValid } from './ScheduledValueTimespanRow';

export function scheduledValueIsValid(scheduledValue) {
  if (!scheduledValue.timespans || scheduledValue.timespans.length < 1) {
    return false;
  }

  return scheduledValue.timespans.every((timespan) => {
    if (!scheduledValueTimespanIsValid(timespan)) {
      return false;
    }

    return true;
  });
}

function addTimespanToScheduledValue(scheduledValue) {
  const newTimespans = [...(scheduledValue.timespans || [])];
  const lastTimespan = maxBy(newTimespans, (timespan) => moment(timespan.finish).toDate());
  const everyTimespanFinishes = newTimespans.every((timespan) => timespan.finish);

  let startTime = null;
  if (lastTimespan && everyTimespanFinishes) {
    startTime = lastTimespan.finish;
  }

  newTimespans.push({ start: startTime, finish: null, value: null });

  return { ...scheduledValue, timespans: newTimespans };
}

function updateScheduledValueTimespan(scheduledValue, index, updater) {
  const newTimespans = [...scheduledValue.timespans];
  newTimespans[index] = updater(newTimespans[index]);
  return { ...scheduledValue, timespans: newTimespans };
}

export function scheduledValueReducer(state, action) {
  switch (action.type) {
    case 'addTimespan':
      return addTimespanToScheduledValue(state);
    case 'deleteTimespan':
      return {
        ...state,
        timespans: state.timespans.slice(0, action.index)
          .concat(state.timespans.slice(action.index + 1)),
      };
    case 'updateTimespanField':
      return updateScheduledValueTimespan(
        state,
        action.index,
        (timespan) => ({ ...timespan, [action.field]: action.value }),
      );
    default:
      return state;
  }
}

function ScheduledValueEditor({
  scheduledValue, timezone, dispatch, buildValueInput,
}) {
  const addRowClicked = (e) => {
    e.preventDefault();
    dispatch({ type: 'addTimespan' });
  };

  const deleteRowClicked = (index) => {
    dispatch({ type: 'deleteTimespan', index });
  };

  const timespanAttributeDidChange = useCallback(
    (index, field, value) => dispatch({
      type: 'updateTimespanField', index, field, value,
    }),
    [dispatch],
  );

  const timespans = scheduledValue.timespans || [];

  const timespanRows = timespans.map((timespan, i) => {
    const otherTimespans = timespans.slice(0, i).concat(timespans.slice(i + 1));

    return (
      <ScheduledValueTimespanRow
        timespan={timespan}
        otherTimespans={otherTimespans}
        timezone={timezone}
        key={i} // eslint-disable-line react/no-array-index-key
        rowIdentifier={i}
        deleteClicked={deleteRowClicked}
        attributeDidChange={timespanAttributeDidChange}
        buildInput={buildValueInput}
      />
    );
  });

  return (
    <table className="table table-striped">
      <tbody>
        {timespanRows}
        <tr>
          <td colSpan="4">
            <button className="btn btn-link" onClick={addRowClicked} type="button">
              Add row
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

ScheduledValueEditor.propTypes = {
  scheduledValue: ScheduledValuePropType.isRequired,
  timezone: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  buildValueInput: PropTypes.func.isRequired,
};

export default ScheduledValueEditor;
