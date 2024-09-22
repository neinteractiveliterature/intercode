import { DateTime } from 'luxon';

import { render, fireEvent, queries } from '../testUtils';
import TimeSelect, { TimeSelectProps } from '../../../app/javascript/BuiltInFormControls/TimeSelect';
import Timespan from '../../../app/javascript/Timespan';
import { formatLCM } from '../../../app/javascript/TimeUtils';
import { vi } from 'vitest';

const START_TIME = DateTime.fromISO('2017-01-01T00:00:00Z', { zone: 'Etc/UTC' });
const FINISH_TIME = DateTime.fromISO('2017-01-02T00:00:00Z', { zone: 'Etc/UTC' });

describe('TimeSelect', () => {
  const renderTimeSelect = (props?: Partial<TimeSelectProps>) =>
    render(
      <TimeSelect
        value={{}}
        onChange={() => {}}
        timespan={Timespan.finiteFromDateTimes(START_TIME, FINISH_TIME)}
        {...props}
      />,
    );

  test('it renders the correct options', async () => {
    const { getByLabelText } = await renderTimeSelect();
    const hourSelect = getByLabelText(/Hour/);
    const hourOptions = queries.getAllByRole(hourSelect, 'option');
    expect(hourOptions.map((option) => option.innerHTML)).toEqual([
      '',
      ...[...Array(24).keys()].map((hour) => formatLCM(START_TIME.set({ hour }), 'haaa')),
    ]);
    const minuteSelect = getByLabelText(/Minute/);
    const minuteOptions = queries.getAllByRole(minuteSelect, 'option');
    expect(minuteOptions.map((option) => option.innerHTML)).toEqual(['', '00', '15', '30', '45']);
  });

  test('it renders +days options', async () => {
    const { getByLabelText } = await renderTimeSelect({
      timespan: Timespan.finiteFromDateTimes(
        DateTime.fromISO('2017-01-01T00:00:00Z', { zone: 'Etc/UTC' }),
        DateTime.fromISO('2017-01-04T00:00:00Z', { zone: 'Etc/UTC' }),
      ),
    });
    const hourSelect = getByLabelText(/Hour/);
    const hourOptions = queries.getAllByRole(hourSelect, 'option');
    expect(hourOptions.map((option) => option.innerHTML)).toEqual([
      '',
      ...[...Array(24).keys()].map((hour) => formatLCM(START_TIME.set({ hour }), 'haaa')),
      ...[...Array(24).keys()].map((hour) => `${formatLCM(START_TIME.set({ hour }), 'haaa')} (+1 day)`),
      ...[...Array(24).keys()].map((hour) => `${formatLCM(START_TIME.set({ hour }), 'haaa')} (+2 days)`),
    ]);
  });

  test('it renders a given value', async () => {
    const { getByLabelText } = await renderTimeSelect({ value: { hour: 4, minute: 45 } });
    expect(getByLabelText(/Hour/)).toHaveValue('4');
    expect(getByLabelText(/Minute/)).toHaveValue('45');
  });

  describe('onChange', () => {
    test('it defaults to 0 minutes', async () => {
      const onChange = vi.fn();
      const { getByLabelText } = await renderTimeSelect({ onChange });
      const hourSelect = getByLabelText(/Hour/);
      fireEvent.change(hourSelect, {
        target: { value: '3', name: hourSelect.getAttribute('name') },
      });
      expect(onChange).toHaveBeenCalledWith({ hour: 3, minute: 0 });
    });

    test('it does not clear minutes', async () => {
      const onChange = vi.fn();
      const { getByLabelText } = await renderTimeSelect({
        onChange,
        value: { hour: 1, minute: 15 },
      });
      const hourSelect = getByLabelText(/Hour/);
      fireEvent.change(hourSelect, {
        target: { value: '3', name: hourSelect.getAttribute('name') },
      });
      expect(onChange).toHaveBeenCalledWith({ hour: 3, minute: 15 });
    });

    test('it clears a field', async () => {
      const onChange = vi.fn();
      const { getByLabelText } = await renderTimeSelect({
        value: { hour: 3, minute: 45 },
        onChange,
      });
      const hourSelect = getByLabelText(/Hour/);
      fireEvent.change(hourSelect, {
        target: { value: '', name: hourSelect.getAttribute('name') },
      });
      expect(onChange).toHaveBeenCalledWith({ hour: null, minute: 45 });
    });
  });
});
