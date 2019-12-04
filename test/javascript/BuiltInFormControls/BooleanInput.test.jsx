import React from 'react';

import { render, fireEvent } from '../testUtils';
import BooleanInput from '../../../app/javascript/BuiltInFormControls/BooleanInput';

describe('BooleanInput', () => {
  const onChange = jest.fn();
  const renderInput = (overrideProps = {}) => render(
    <BooleanInput
      caption="Is this a test?"
      onChange={onChange}
      value={false}
      {...overrideProps}
    />,
  );

  beforeEach(onChange.mockReset);

  test('it renders', () => {
    const { getByText } = renderInput();
    expect(getByText('Is this a test?')).toBeTruthy();
  });

  test('it calls onChange for true boolean value', () => {
    const { getByLabelText } = renderInput();
    const yesInput = getByLabelText('Yes');
    fireEvent.click(yesInput);
    expect(onChange.mock.calls[0][0]).toBeTruthy();
  });

  test('it calls onChange for false boolean value', () => {
    const { getByLabelText } = renderInput({ value: true });
    const noInput = getByLabelText('No');
    fireEvent.click(noInput);
    expect(onChange.mock.calls[0][0]).toBeFalsy();
  });
});
