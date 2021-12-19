import { render, fireEvent, waitFor } from '../testUtils';
import TimezoneSelect, { TimezoneSelectProps } from '../../../app/javascript/BuiltInFormControls/TimezoneSelect';

describe('TimezoneSelect', () => {
  const renderComponent = (overrideProps?: Partial<TimezoneSelectProps>) =>
    render(<TimezoneSelect label="Timezone" onChange={() => {}} {...overrideProps} />);

  test('it renders', async () => {
    const { getAllByText } = await renderComponent();
    expect(getAllByText(/Timezone/)).toHaveLength(1);
  });

  test('option filtering', async () => {
    const { getByRole, getByText } = await renderComponent();
    const input = getByRole('combobox');

    fireEvent.change(input, { target: { value: 'coordinated' } });
    await waitFor(() => expect(getByText(/Etc\/UTC/)).toBeTruthy());

    fireEvent.change(input, { target: { value: 'kolkata' } });
    await waitFor(() => expect(getByText(/Asia\/Kolkata/)).toBeTruthy());
  });
});
