import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import DateTimeInput from './DateTimeInput';
import { convertDatetimeValue } from '../ComposableFormUtils';
import { TimespanPropType } from '../ScheduledValuePropTypes';

function ScheduledValueTimespanRowDatepicker({
  fieldName, timespan, rowAttributeDidChange, timezoneName,
}) {
  const stringValue = useMemo(
    () => convertDatetimeValue(timespan[fieldName], timezoneName),
    [fieldName, timespan, timezoneName],
  );

  const datetimeValueChanged = useCallback(
    newValue => rowAttributeDidChange(fieldName, newValue),
    [fieldName, rowAttributeDidChange],
  );

  return (
    <div className="d-flex">
      <DateTimeInput
        value={stringValue}
        timezoneName={timezoneName}
        onChange={datetimeValueChanged}
      />
    </div>
  );
}

ScheduledValueTimespanRowDatepicker.propTypes = {
  fieldName: PropTypes.string.isRequired,
  timespan: TimespanPropType.isRequired,
  rowAttributeDidChange: PropTypes.func.isRequired,
  timezoneName: PropTypes.string.isRequired,
};

export default React.memo(ScheduledValueTimespanRowDatepicker);
