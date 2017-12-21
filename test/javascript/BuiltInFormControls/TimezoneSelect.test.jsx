import React from 'react';
import Select from 'react-select';
import { shallow } from 'enzyme';
import TimezoneSelect from '../../../app/javascript/BuiltInFormControls/TimezoneSelect';

describe('TimezoneSelect', () => {
  const component = shallow((
    <TimezoneSelect label="Timezone" />
  ));

  const options = component.find(Select).prop('options');

  test('timezone options', () => {
    expect(options.length > 500).toBeTruthy();

    const utcOption = options.find(option => option.value === 'UTC');
    expect(utcOption.label).toEqual('[UTC+00:00] UTC');

    const kolkataOption = options.find(option => option.value === 'Asia/Kolkata');
    expect(kolkataOption.label).toEqual('[UTC-05:30] Asia/Kolkata');
  });
});
