import { DateTime } from 'luxon';
import { render, fireEvent } from '../testUtils';
import buildTestScheduledValueInput from './buildTestScheduledValueInput';
import ScheduledValueEditor, {
  ScheduledValueEditorProps,
  scheduledValueIsValid,
} from '../../../app/javascript/BuiltInFormControls/ScheduledValueEditor';
import { vi } from 'vitest';

describe('ScheduledValueEditor', () => {
  const renderScheduledValueEditor = (props: Partial<ScheduledValueEditorProps<number | string>>) =>
    render(
      <ScheduledValueEditor
        scheduledValue={{ timespans: [] }}
        timezone="UTC"
        dispatch={() => {}}
        buildValueInput={buildTestScheduledValueInput}
        {...props}
      />,
    );

  test('it renders the correct values', async () => {
    const cutoff = DateTime.utc();
    const { getAllByRole, getAllByTestId } = await renderScheduledValueEditor({
      scheduledValue: {
        timespans: [
          { value: 1, start: null, finish: cutoff.toISO() },
          { value: 2, start: cutoff.toISO(), finish: null },
        ],
      },
    });

    // two value rows plus a footer
    expect(getAllByRole('row')).toHaveLength(3);
    expect(getAllByTestId('testInput').map((input) => (input as HTMLInputElement).value)).toEqual(['1', '2']);
  });

  test('adding a row', async () => {
    const dispatch = vi.fn();
    const { getByText } = await renderScheduledValueEditor({ dispatch });
    fireEvent.click(getByText('Add row'));
    expect(dispatch).toHaveBeenCalledWith({ type: 'addTimespan' });
  });

  test('deleting a row', async () => {
    const dispatch = vi.fn();
    const { getByText } = await renderScheduledValueEditor({
      scheduledValue: {
        timespans: [{ value: 'something', start: null, finish: null }],
      },
      dispatch,
    });
    fireEvent.click(getByText('Delete timespan'));
    expect(dispatch).toHaveBeenCalledWith({ type: 'deleteTimespan', index: 0 });
  });

  test('changing something in a row', async () => {
    const dispatch = vi.fn();
    const { getByTestId } = await renderScheduledValueEditor({
      scheduledValue: {
        timespans: [{ value: 'something', start: null, finish: null }],
      },
      dispatch,
    });
    fireEvent.change(getByTestId('testInput'), { target: { value: 'something else' } });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'updateTimespanValue',
      index: 0,
      value: 'something else',
    });
  });

  describe('scheduledValueIsValid', () => {
    test('it requires at least one timespan', () => {
      // @ts-expect-error Deliberately invalid input
      expect(scheduledValueIsValid({ timespans: null })).toBeFalsy();
      expect(scheduledValueIsValid({ timespans: [] })).toBeFalsy();
      expect(scheduledValueIsValid({})).toBeFalsy();
    });

    test('it requires every timespan have a value', () => {
      expect(
        scheduledValueIsValid({
          timespans: [{ start: null, finish: null, value: null }],
        }),
      ).toBeFalsy();

      expect(
        scheduledValueIsValid({
          timespans: [
            { start: null, finish: null, value: null },
            { start: null, finish: null, value: 6 },
          ],
        }),
      ).toBeFalsy();
    });

    test('it passes if every timespan has a value', () => {
      expect(
        scheduledValueIsValid({
          timespans: [{ start: null, finish: null, value: 6 }],
        }),
      ).toBeTruthy();
    });
  });
});
