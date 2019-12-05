import React from 'react';
import { render, fireEvent } from '../testUtils';
import ChoiceSet from '../../../app/javascript/BuiltInFormControls/ChoiceSet';

describe('ChoiceSet', () => {
  const onChange = jest.fn();
  beforeEach(onChange.mockReset);

  const renderChoiceSet = (props) => render(<ChoiceSet
    name="pickSomething"
    onChange={onChange}
    choices={[
      { label: 'a', value: '1' },
      { label: 'b', value: '2' },
      { label: 'c', value: '3' },
    ]}
    {...props}
  />);

  test('by default it renders radio buttons', () => {
    const { getAllByRole } = renderChoiceSet();
    expect(getAllByRole('radio')).toHaveLength(3);
  });

  test('the value is selected', () => {
    const { getByLabelText } = renderChoiceSet({ value: '2' });
    expect(getByLabelText('a')).not.toBeChecked();
    expect(getByLabelText('b')).toBeChecked();
    expect(getByLabelText('c')).not.toBeChecked();
  });

  test('it calls onChange when a new value is selected', () => {
    const { getByLabelText } = renderChoiceSet();
    fireEvent.click(getByLabelText('c'));
    expect(onChange.mock.calls[0][0]).toEqual('3');
  });

  describe('multiple', () => {
    test('it renders checkboxes', () => {
      const { getAllByRole } = renderChoiceSet({ multiple: true });
      expect(getAllByRole('checkbox')).toHaveLength(3);
    });

    test('the values are selected', () => {
      const { getByLabelText } = renderChoiceSet({ multiple: true, value: ['2', '3'] });
      expect(getByLabelText('a')).not.toBeChecked();
      expect(getByLabelText('b')).toBeChecked();
      expect(getByLabelText('c')).toBeChecked();
    });

    test('it calls onChange when a new value is selected', () => {
      const { getByLabelText } = renderChoiceSet({ multiple: true, value: ['1'] });
      fireEvent.click(getByLabelText('c'));
      expect(onChange.mock.calls[0][0]).toEqual(['1', '3']);
    });

    test('it calls onChange when an old value is deselected', () => {
      const { getByLabelText } = renderChoiceSet({ multiple: true, value: ['1'] });
      fireEvent.click(getByLabelText('a'));
      expect(onChange.mock.calls[0][0]).toEqual([]);
    });
  });
});
