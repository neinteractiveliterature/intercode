import React from 'react';

import { render } from '../testUtils';
import MultipleChoiceInput from '../../../app/javascript/BuiltInFormControls/MultipleChoiceInput';

describe('MultipleChoiceInput', () => {
  const renderMultipleChoiceInput = (props) => render(<MultipleChoiceInput
    name="pickSomething"
    onChange={() => {}}
    choices={[
      { label: 'a', value: '1' },
      { label: 'b', value: '2' },
      { label: 'c', value: '3' },
    ]}
    caption="Hello there"
    {...props}
  />);

  test('it renders the caption', () => {
    const { getByText } = renderMultipleChoiceInput();
    expect(getByText('Hello there').tagName.toUpperCase()).toEqual('LEGEND');
  });

  test('it renders the choices', () => {
    const { getAllByRole } = renderMultipleChoiceInput();
    expect(getAllByRole('radio')).toHaveLength(3);
  });

  // detailed testing for choice behavior is done in ChoiceSet.test.jsx
});
