import React from 'react';
import { shallow } from 'enzyme';
import TimezoneSelect, { loadOptions } from '../../../app/javascript/BuiltInFormControls/TimezoneSelect';

describe('TimezoneSelect', () => {
  const component = shallow((
    <TimezoneSelect label="Timezone" />
  ));

  test('it renders', () => {
    expect(component.text()).toMatch(/Timezone/);
  });

  test('option filtering', () => {
    const options = loadOptions('');
    expect(options.length).toEqual(50);

    const utcOptions = loadOptions('UTC');
    // we also get Etc/UTC back in the list and can't necessarily expect UTC first
    expect(utcOptions.map(option => option.label)).toContain('[UTC+00:00] UTC');

    const kolkataOptions = loadOptions('Asia/Kolkata');
    expect(kolkataOptions[0].label).toEqual('[UTC-05:30] Asia/Kolkata');
  });
});
