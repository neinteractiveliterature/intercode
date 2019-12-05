import React from 'react';
import moment from 'moment-timezone';

import { render, fireEvent, queries } from '../testUtils';
import TimeSelect from '../../../app/javascript/BuiltInFormControls/TimeSelect';

describe('TimeSelect', () => {
  const renderTimeSelect = (props) => render((
    <TimeSelect
      value={{}}
      onChange={() => {}}
      timespan={{
        start: moment.tz('2017-01-01T00:00:00Z', 'UTC'),
        finish: moment.tz('2017-01-02T00:00:00Z', 'UTC'),
      }}
      {...props}
    />
  ));

  test('it renders the correct options', () => {
    const { getByLabelText } = renderTimeSelect();
    const hourSelect = getByLabelText(/Hour/);
    const hourOptions = queries.getAllByRole(hourSelect, 'option');
    expect(hourOptions.map((option) => option.innerHTML)).toEqual([
      '',
      ...([...Array(24).keys()].map((hour) => moment().set({ hour }).format('ha'))),
    ]);
    const minuteSelect = getByLabelText(/Minute/);
    const minuteOptions = queries.getAllByRole(minuteSelect, 'option');
    expect(minuteOptions.map((option) => option.innerHTML)).toEqual([
      '', '00', '15', '30', '45',
    ]);
  });

  test('it renders +days options', () => {
    const { getByLabelText } = renderTimeSelect({
      timespan: {
        start: moment.tz('2017-01-01T00:00:00Z', 'UTC'),
        finish: moment.tz('2017-01-04T00:00:00Z', 'UTC'),
      },
    });
    const hourSelect = getByLabelText(/Hour/);
    const hourOptions = queries.getAllByRole(hourSelect, 'option');
    expect(hourOptions.map((option) => option.innerHTML)).toEqual([
      '',
      ...([...Array(24).keys()].map((hour) => moment().set({ hour }).format('ha'))),
      ...([...Array(24).keys()].map((hour) => `${moment().set({ hour }).format('ha')} (+1 day)`)),
      ...([...Array(24).keys()].map((hour) => `${moment().set({ hour }).format('ha')} (+2 days)`)),
    ]);
  });

  test('it renders a given value', () => {
    const { getByLabelText } = renderTimeSelect({ value: { hour: 4, minute: 45 } });
    expect(getByLabelText(/Hour/)).toHaveValue('4');
    expect(getByLabelText(/Minute/)).toHaveValue('45');
  });

  describe('onChange', () => {
    test('it defaults to 0 minutes', () => {
      const onChange = jest.fn();
      const { getByLabelText } = renderTimeSelect({ onChange });
      const hourSelect = getByLabelText(/Hour/);
      fireEvent.change(hourSelect, { target: { value: '3', name: hourSelect.getAttribute('name') } });
      expect(onChange).toHaveBeenCalledWith({ hour: 3, minute: 0 });
    });

    test('it does not clear minutes', () => {
      const onChange = jest.fn();
      const { getByLabelText } = renderTimeSelect({ onChange, value: { hour: 1, minute: 15 } });
      const hourSelect = getByLabelText(/Hour/);
      fireEvent.change(hourSelect, { target: { value: '3', name: hourSelect.getAttribute('name') } });
      expect(onChange).toHaveBeenCalledWith({ hour: 3, minute: 15 });
    });

    test('it clears a field', () => {
      const onChange = jest.fn();
      const { getByLabelText } = renderTimeSelect({ value: { hour: 3, minute: 45 }, onChange });
      const hourSelect = getByLabelText(/Hour/);
      fireEvent.change(hourSelect, { target: { value: '', name: hourSelect.getAttribute('name') } });
      expect(onChange).toHaveBeenCalledWith({ hour: null, minute: 45 });
    });
  });
});
