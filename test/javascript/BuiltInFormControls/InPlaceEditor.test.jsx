import React from 'react';

import { render, fireEvent } from '../testUtils';
import InPlaceEditor from '../../../app/javascript/BuiltInFormControls/InPlaceEditor';

describe('InPlaceEditor', () => {
  const onChange = jest.fn();
  beforeEach(onChange.mockReset);

  const renderEditor = (props) => render(<InPlaceEditor
    value="someValue"
    onChange={onChange}
    {...props}
  />);

  test('it renders just the value by default', () => {
    const { getAllByText, queryAllByRole } = renderEditor();
    expect(getAllByText('someValue')).toHaveLength(1);
    expect(queryAllByRole('textbox')).toHaveLength(0);
  });

  test('it renders children rather than the value if they are passed', () => {
    const { queryAllByText, queryAllByRole } = renderEditor({ children: (<a href="http://homestarrunner.com">its dot net</a>) });
    expect(queryAllByText('its dot net')).toHaveLength(1);
    expect(queryAllByText('someValue')).toHaveLength(0);
    expect(queryAllByRole('link')).toHaveLength(1);
    expect(queryAllByRole('textbox')).toHaveLength(0);
  });

  test('it goes to editing mode when the edit button is clicked', () => {
    const { getByLabelText, queryAllByRole } = renderEditor();
    fireEvent.click(getByLabelText('Edit'));
    expect(queryAllByRole('textbox')).toHaveLength(1);
  });

  test('editing the text works', () => {
    const { getByLabelText, getByRole } = renderEditor();
    fireEvent.click(getByLabelText('Edit'));
    fireEvent.change(getByRole('textbox'), { target: { value: 'someOtherValue' } });
    fireEvent.click(getByLabelText('Commit changes'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('someOtherValue');
  });

  test('reverting the changes works', () => {
    const { getByLabelText, getByRole, queryAllByRole } = renderEditor();
    fireEvent.click(getByLabelText('Edit'));
    fireEvent.change(getByRole('textbox'), { target: { value: 'someOtherValue' } });
    fireEvent.click(getByLabelText('Cancel editing'));
    expect(onChange).not.toHaveBeenCalled();
    expect(queryAllByRole('textbox')).toHaveLength(0);
  });

  test('pressing enter commits the changes', () => {
    const { getByLabelText, getByRole } = renderEditor();
    fireEvent.click(getByLabelText('Edit'));
    fireEvent.change(getByRole('textbox'), { target: { value: 'someOtherValue' } });
    fireEvent.keyDown(getByRole('textbox'), { key: 'Enter' });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('someOtherValue');
  });

  test('pressing escape reverts the changes', () => {
    const { getByLabelText, getByRole, queryAllByRole } = renderEditor();
    fireEvent.click(getByLabelText('Edit'));
    fireEvent.change(getByRole('textbox'), { target: { value: 'someOtherValue' } });
    fireEvent.keyDown(getByRole('textbox'), { key: 'Escape' });
    expect(onChange).not.toHaveBeenCalled();
    expect(queryAllByRole('textbox')).toHaveLength(0);
  });
});
