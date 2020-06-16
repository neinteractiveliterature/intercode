import React from 'react';

import { render, fireEvent } from '../testUtils';
import ConventionDaySelect from '../../../app/javascript/BuiltInFormControls/ConventionDaySelect';
import AppRootContext from '../../../app/javascript/AppRootContext';

describe('ConventionDaySelect', () => {
  const onChange = jest.fn();
  beforeEach(onChange.mockReset);

  const renderConventionDaySelect = (props) => render(
    <AppRootContext.Provider value={{ timezoneName: 'Etc/UTC' }}>
      <ConventionDaySelect
        convention={{
          starts_at: '2017-01-01T00:00:00.000Z',
          ends_at: '2017-01-04T00:00:00.000Z',
        }}
        onChange={onChange}
        {...props}
      />
    </AppRootContext.Provider>,
  );

  test('it renders an option for each convention day', () => {
    const { getAllByRole } = renderConventionDaySelect();
    expect(getAllByRole('radio').map((input) => input.value)).toEqual([
      '2017-01-01T06:00:00.000+00:00',
      '2017-01-02T06:00:00.000+00:00',
      '2017-01-03T06:00:00.000+00:00',
    ]);
  });

  test('the value is selected', () => {
    const { getByLabelText } = renderConventionDaySelect({ value: '2017-01-02T06:00:00.000Z' });
    expect(getByLabelText('Sunday')).not.toBeChecked();
    expect(getByLabelText('Monday')).toBeChecked();
    expect(getByLabelText('Tuesday')).not.toBeChecked();
  });

  test('it calls onChange when a value is selected', () => {
    const { getByLabelText } = renderConventionDaySelect();
    fireEvent.click(getByLabelText('Tuesday'));
    expect(onChange.mock.calls).toHaveLength(1);
    expect(onChange.mock.calls[0][0]).toEqual('2017-01-03T06:00:00.000+00:00');
  });
});
