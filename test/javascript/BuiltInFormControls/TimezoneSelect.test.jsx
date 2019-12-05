import React from 'react';

import { render } from '../testUtils';
import TimezoneSelect, { loadOptions } from '../../../app/javascript/BuiltInFormControls/TimezoneSelect';

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

  test('option filtering', () => {
    const options = loadOptions('');
    expect(options.length).toBeGreaterThan(0);

    const utcOptions = loadOptions('UTC');
    // we also get Etc/UTC back in the list and can't necessarily expect UTC first
    expect(utcOptions.map((option) => option.label)).toContain('[UTC-00:00] UTC');

    const kolkataOptions = loadOptions('Asia/Kolkata');
    expect(kolkataOptions[0].label).toEqual('[UTC+05:30] Asia/Kolkata');
  });
});
