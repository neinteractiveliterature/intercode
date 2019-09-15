import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { TimespanPropType } from '../ScheduledValuePropTypes';
import ScheduledValueTimespanRowDatepicker from './ScheduledValueTimespanRowDatepicker';

export function scheduledValueTimespanIsValid(timespan) {
  if (!timespan.value) {
    return false;
  }

  return true;
}

function ScheduledValueTimespanRow({
  buildInput, rowIdentifier, timespan, timezone, attributeDidChange, deleteClicked,
}) {
  const rowAttributeDidChange = useCallback(
    (field, value) => attributeDidChange(rowIdentifier, field, value),
    [attributeDidChange, rowIdentifier],
  );

  const valueChanged = useCallback(
    (value) => rowAttributeDidChange('value', value),
    [rowAttributeDidChange],
  );

  const onDeleteClicked = (e) => {
    e.preventDefault();
    deleteClicked(rowIdentifier);
  };

  return (
    <tr>
      <td className="w-25">
        {buildInput(timespan.value, valueChanged)}
      </td>

      <td className="w-75">
        <div className="d-flex flex-row align-items-center justify-content-stretch">
          <div>from&nbsp;</div>
          <ScheduledValueTimespanRowDatepicker
            fieldName="start"
            timespan={timespan}
            rowAttributeDidChange={rowAttributeDidChange}
            timezoneName={timezone}
          />
          <div className="ml-4">to&nbsp;</div>
          <ScheduledValueTimespanRowDatepicker
            fieldName="finish"
            timespan={timespan}
            rowAttributeDidChange={rowAttributeDidChange}
            timezoneName={timezone}
          />
        </div>
      </td>

      <td className="w-25 text-right" style={{ verticalAlign: 'middle' }}>
        <button className="btn btn-danger btn-sm" onClick={onDeleteClicked} type="button">
          <i className="fa fa-trash-o" />
          <span className="sr-only">Delete timespan</span>
        </button>
      </td>
    </tr>
  );
}

ScheduledValueTimespanRow.propTypes = {
  buildInput: PropTypes.func.isRequired,
  rowIdentifier: PropTypes.number.isRequired,
  timespan: TimespanPropType.isRequired,
  timezone: PropTypes.string.isRequired,
  attributeDidChange: PropTypes.func.isRequired,
  deleteClicked: PropTypes.func.isRequired,
};

export default ScheduledValueTimespanRow;
