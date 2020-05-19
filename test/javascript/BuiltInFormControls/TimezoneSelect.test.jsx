import React from 'react';

import { render, fireEvent, waitFor } from '../testUtils';
import TimezoneSelect from '../../../app/javascript/BuiltInFormControls/TimezoneSelect';

describe('TimezoneSelect', () => {
  const renderComponent = (overrideProps) => render((
    <TimezoneSelect
      label="Timezone"
      onChange={() => {}}
      {...overrideProps}
    />
  ));

  test('it renders', () => {
    const { getAllByText } = renderComponent();
    expect(getAllByText(/Timezone/)).toHaveLength(1);
  });

  test('option filtering', async () => {
    const { getByRole, getByText } = renderComponent();
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: 'coordinated' } });
    await waitFor(() => expect(getByText(/Etc\/UTC/)).toBeTruthy());

    fireEvent.change(input, { target: { value: 'kolkata' } });
    await waitFor(() => expect(getByText(/Asia\/Kolkata/)).toBeTruthy());
  });
});
