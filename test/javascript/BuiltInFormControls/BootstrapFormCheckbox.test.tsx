import { render, fireEvent } from '../testUtils';
import BootstrapFormCheckbox from '../../../app/javascript/BuiltInFormControls/BootstrapFormCheckbox';

describe('BootstrapFormCheckbox', () => {
  const onChange = jest.fn();

  const renderComponent = (overrideProps = {}) =>
    render(
      <BootstrapFormCheckbox
        type="checkbox"
        name="my_checkbox"
        label="check me"
        checked={false}
        onChange={onChange}
        {...overrideProps}
      />,
    );

  beforeEach(onChange.mockReset);

  test('it passes change events', () => {
    const { getByLabelText } = renderComponent();
    fireEvent.click(getByLabelText('check me'));
    expect(onChange.mock.calls).toHaveLength(1);
  });

  test('it renders as a checkbox', () => {
    const { getByLabelText } = renderComponent();
    expect(getByLabelText('check me')).toHaveAttribute('type', 'checkbox');
  });

  test('it will also render as a radio button', () => {
    const { getByLabelText } = renderComponent({ type: 'radio' });
    expect(getByLabelText('check me')).toHaveAttribute('type', 'radio');
  });
});
