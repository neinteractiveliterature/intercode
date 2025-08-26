import { useMemo, useCallback, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChoiceSet, notEmpty } from '@neinteractiveliterature/litform';

import { getValidTimeblockColumns } from '../../FormPresenter/TimeblockUtils';
import Timespan from '../../Timespan';
import { timespanFromConvention } from '../../TimespanUtils';
import { TimeblockDefinition } from '../../FormPresenter/TimeblockTypes';
import { FormEditorContext } from '../FormEditorContexts';
import { FormItemEditorProps } from '../FormItemEditorProps';
import { TimeblockPreferenceFormItem } from '../FormItemUtils';
import { useAppDateTimeFormat } from '../../TimeUtils';

export type TimeblockPreferenceEditorOmissionsRowProps = FormItemEditorProps<TimeblockPreferenceFormItem> & {
  timeblock: TimeblockDefinition;
};
function TimeblockPreferenceEditorOmissionsRow({
  formItem,
  setFormItem,
  timeblock,
}: TimeblockPreferenceEditorOmissionsRowProps): React.JSX.Element {
  const { convention } = useContext(FormEditorContext);
  const format = useAppDateTimeFormat();

  const conventionTimespan = useMemo(() => timespanFromConvention(convention), [convention]);

  const omissionDates = useMemo(
    () =>
      (formItem.properties.omit_timeblocks || [])
        .filter((omission) => omission.label === timeblock.label)
        .map((omission) => omission.date),
    [formItem.properties.omit_timeblocks, timeblock.label],
  );

  const omissionDatesChanged = useCallback(
    (newOmissionDates: string[]) => {
      setFormItem((prevFormItem) => {
        const prevOmissions = prevFormItem.properties.omit_timeblocks || [];
        const newOmissions = [
          ...prevOmissions.filter((omission) => omission.label !== timeblock.label),
          ...newOmissionDates.map((date) => ({
            generatedId: uuidv4(),
            label: timeblock.label,
            date,
          })),
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

  const columns = useMemo(() => getValidTimeblockColumns(convention, formItem), [convention, formItem]);

  const choices = useMemo(
    () =>
      columns
        .map((column) => {
          const { dayStart } = column;
          const start = dayStart.plus({
            hours: timeblock.start.hour,
            minutes: timeblock.start.minute,
            seconds: timeblock.start.second,
          });
          const finish = dayStart.plus({
            hours: timeblock.finish.hour,
            minutes: timeblock.finish.minute,
            seconds: timeblock.finish.second,
          });
          if (start > finish) {
            return undefined;
          }
          const timespan = Timespan.fromDateTimes(start, finish);

          return {
            label: format(dayStart, 'longWeekday'),
            value: dayStart.toISODate() ?? '',
            disabled: !timespan.overlapsTimespan(conventionTimespan),
          };
        })
        .filter(notEmpty),
    [columns, conventionTimespan, timeblock.finish, timeblock.start, format],
  );

  const inclusionDates = useMemo(
    () =>
      choices.filter(({ value, disabled }) => !disabled && !omissionDates.includes(value)).map(({ value }) => value),
    [choices, omissionDates],
  );

  const inclusionDatesChanged = useCallback(
    (newInclusionDates: string[]) => {
      omissionDatesChanged(choices.filter(({ value }) => !newInclusionDates.includes(value)).map(({ value }) => value));
    },
    [choices, omissionDatesChanged],
  );

  return (
    <tr>
      <td className="border-top-0 pt-0" />
      <td colSpan={4} className="border-top-0 pt-0">
        <div className="d-flex">
          <span className="me-2">Offer on:</span>
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
