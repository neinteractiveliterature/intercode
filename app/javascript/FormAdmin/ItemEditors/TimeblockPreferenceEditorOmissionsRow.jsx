import React, { useMemo, useCallback, useContext } from 'react';
import moment from 'moment-timezone';

import { getValidTimeblockColumns } from '../../FormPresenter/TimeblockUtils';
import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';
import Timespan from '../../Timespan';
import { timespanFromConvention } from '../../TimespanUtils';
import { TimeblockPropType } from '../../FormPresenter/TimeblockTypes';
import { FormEditorContext, FormItemEditorContext } from '../FormEditorContexts';

function TimeblockPreferenceEditorOmissionsRow({ timeblock }) {
  const { convention } = useContext(FormEditorContext);
  const { formItem, setFormItem } = useContext(FormItemEditorContext);

  const conventionTimespan = useMemo(
    () => timespanFromConvention(convention),
    [convention],
  );

  const omissionDates = useMemo(
    () => (formItem.properties.omit_timeblocks || []).filter((omission) => (
      omission.label === timeblock.label
    )).map((omission) => omission.date),
    [formItem.properties.omit_timeblocks, timeblock.label],
  );

  const omissionDatesChanged = useCallback(
    (newOmissionDates) => {
      setFormItem((prevFormItem) => {
        const prevOmissions = prevFormItem.properties.omit_timeblocks || [];
        const newOmissions = [
          ...prevOmissions.filter((omission) => omission.label !== timeblock.label),
          ...newOmissionDates.map((date) => ({ label: timeblock.label, date })),
        ];
        return {
          ...prevFormItem,
          properties: {
            ...prevFormItem.properties,
            omit_timeblocks: newOmissions,
          },
        };
      });
    },
    [setFormItem, timeblock.label],
  );

  const columns = useMemo(
    () => getValidTimeblockColumns(convention, formItem),
    [convention, formItem],
  );

  const choices = useMemo(
    () => columns.map((column) => {
      const dayStart = moment.tz(column.dayStart, convention.timezone_name);
      const timespan = new Timespan(
        moment(dayStart).add(timeblock.start),
        moment(dayStart).add(timeblock.finish),
      );

      return {
        label: dayStart.format('dddd'),
        value: dayStart.format('YYYY-MM-DD'),
        disabled: !timespan.overlapsTimespan(conventionTimespan),
      };
    }),
    [columns, convention.timezone_name, conventionTimespan, timeblock.finish, timeblock.start],
  );

  const inclusionDates = useMemo(
    () => choices
      .filter(({ value, disabled }) => !disabled && !omissionDates.includes(value))
      .map(({ value }) => value),
    [choices, omissionDates],
  );

  const inclusionDatesChanged = useCallback(
    (newInclusionDates) => {
      omissionDatesChanged(
        choices
          .filter(({ value }) => !newInclusionDates.includes(value))
          .map(({ value }) => value),
      );
    },
    [choices, omissionDatesChanged],
  );

  return (
    <tr>
      <td className="border-top-0 pt-0" />
      <td colSpan={4} className="border-top-0 pt-0">
        <div className="d-flex">
          <span className="mr-2">Offer on:</span>
          <ChoiceSet
            choiceClassName="form-check-inline"
            multiple
            choices={choices}
            value={inclusionDates}
            onChange={inclusionDatesChanged}
          />
        </div>
      </td>
    </tr>
  );
}

TimeblockPreferenceEditorOmissionsRow.propTypes = {
  timeblock: TimeblockPropType.isRequired,
};

export default TimeblockPreferenceEditorOmissionsRow;
