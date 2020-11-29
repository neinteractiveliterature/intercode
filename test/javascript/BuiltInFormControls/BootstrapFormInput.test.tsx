import { render, fireEvent } from '../testUtils';
import BootstrapFormInput from '../../../app/javascript/BuiltInFormControls/BootstrapFormInput';

describe('BootstrapFormInput', () => {
  const renderComponent = (overrideProps = {}) =>
    render(<BootstrapFormInput name="my_input" label="type in me" value="" {...overrideProps} />);

  test('it passes change events', async () => {
    const onChange = jest.fn();
    const { getByLabelText } = await renderComponent({ onChange });
    fireEvent.change(getByLabelText('type in me'), { target: { value: 'asdf' } });
    expect(onChange.mock.calls).toHaveLength(1);
  });

  test('it calls onTextChange', async () => {
    const onTextChange = jest.fn();
    const { getByLabelText } = await renderComponent({ onTextChange });
    fireEvent.change(getByLabelText('type in me'), { target: { value: 'asdf' } });
    expect(onTextChange.mock.calls[0][0]).toEqual('asdf');
  });
});
