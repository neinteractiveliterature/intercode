import { render, fireEvent } from '../testUtils';
import buildTestScheduledValueInput from './buildTestScheduledValueInput';
import ScheduledValueTimespanRow, {
  scheduledValueTimespanIsValid,
  ScheduledValueTimespanRowProps,
} from '../../../app/javascript/BuiltInFormControls/ScheduledValueTimespanRow';
import { EditingTimespan } from '../../../app/javascript/BuiltInFormControls/ScheduledValueEditor';
import { vi } from 'vitest';

describe('ScheduledValueTimespanRow', () => {
  const finishDidChange = vi.fn();
  const valueDidChange = vi.fn();
  const deleteClicked = vi.fn();

  const timespanStart = '2017-01-01T00:00:00Z';
  const timespanFinish = '2017-01-02T00:00:00Z';

  beforeEach(() => {
    finishDidChange.mockReset();
    valueDidChange.mockReset();
    deleteClicked.mockReset();
  });

  const renderScheduledValueTimespanRow = (
    props: Partial<ScheduledValueTimespanRowProps<string | number>> = {},
    timespanProps: Partial<EditingTimespan<string | number>> = {},
  ) => {
    const timespan = {
      start: timespanStart,
      finish: timespanFinish,
      value: '',
      ...timespanProps,
    };

    return render(
      <table>
        <tbody>
          <ScheduledValueTimespanRow
            buildInput={buildTestScheduledValueInput}
            rowIdentifier={42}
            timespan={timespan}
            timezone="UTC"
            finishDidChange={finishDidChange}
            valueDidChange={valueDidChange}
            deleteClicked={deleteClicked}
            isLastTimespan={false}
            {...props}
          />
        </tbody>
      </table>,
    );
  };

  test('it renders with a value', async () => {
    const value = 'blooblah';
    const { getByTestId } = await renderScheduledValueTimespanRow({}, { value });
    expect(getByTestId('testInput')).toHaveValue(value);
  });

  test('changing value', async () => {
    const { getByTestId } = await renderScheduledValueTimespanRow();
    fireEvent.change(getByTestId('testInput'), { target: { value: 'newvalue' } });
    expect(valueDidChange).toHaveBeenCalledWith(42, 'newvalue');
  });

  describe('isValid', () => {
    test('it requires a value', () => {
      expect(scheduledValueTimespanIsValid({ value: undefined })).toBeFalsy();
      expect(scheduledValueTimespanIsValid({ value: null })).toBeFalsy();
      expect(scheduledValueTimespanIsValid({ value: 6 })).toBeTruthy();
    });

    test('it does not require a start or a finish', () => {
      expect(
        scheduledValueTimespanIsValid({
          value: 6,
          start: null,
          finish: null,
        }),
      ).toBeTruthy();
    });
  });
});
