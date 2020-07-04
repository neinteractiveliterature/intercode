import React, { useMemo, useCallback, useContext } from 'react';

import { getValidTimeblockColumns } from '../../FormPresenter/TimeblockUtils';
import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';
import Timespan from '../../Timespan';
import { timespanFromConvention } from '../../TimespanUtils';
import { TimeblockDefinition } from '../../FormPresenter/TimeblockTypes';
import { FormEditorContext, useFormItemEditorContext } from '../FormEditorContexts';
import AppRootContext from '../../AppRootContext';
import { TimeblockPreferenceFormItem } from '../FormItemTypes';

export type TimeblockPreferenceEditorOmissionsRowProps = {
  timeblock: TimeblockDefinition,
};

function TimeblockPreferenceEditorOmissionsRow(
  { timeblock }: TimeblockPreferenceEditorOmissionsRowProps,
) {
  const { timezoneName } = useContext(AppRootContext);
  const { convention } = useContext(FormEditorContext);
  const { formItem, setFormItem } = useFormItemEditorContext<TimeblockPreferenceFormItem>();

  const conventionTimespan = useMemo(
    () => timespanFromConvention(convention!),
    [convention],
  );

  const omissionDates = useMemo(
    () => (formItem.properties.omit_timeblocks || []).filter((omission) => (
      omission.label === timeblock.label
    )).map((omission) => omission.date),
    [formItem.properties.omit_timeblocks, timeblock.label],
  );

  const omissionDatesChanged = useCallback(
    (newOmissionDates: string[]) => {
      setFormItem((prevFormItem: TimeblockPreferenceFormItem) => {
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
    () => getValidTimeblockColumns(convention!, formItem),
    [convention, formItem],
  );

  const choices = useMemo(
    () => columns.map((column) => {
      const dayStart = column.dayStart.setZone(timezoneName);
      const timespan = new Timespan(
        dayStart.plus(timeblock.start),
        dayStart.plus(timeblock.finish),
      );

      return {
        label: dayStart.toFormat('EEEE'),
        value: dayStart.toFormat('yyyy-MM-dd'),
        disabled: !timespan.overlapsTimespan(conventionTimespan),
      };
    }),
    [columns, timezoneName, conventionTimespan, timeblock.finish, timeblock.start],
  );

  const inclusionDates = useMemo(
    () => choices
      .filter(({ value, disabled }) => !disabled && !omissionDates.includes(value))
      .map(({ value }) => value),
    [choices, omissionDates],
  );

  const inclusionDatesChanged = useCallback(
    (newInclusionDates: string[]) => {
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

export default TimeblockPreferenceEditorOmissionsRow;
