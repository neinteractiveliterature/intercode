import { useState } from 'react';
import { vi } from 'vitest';

import { fireEvent, render, userEvent } from '../testUtils';
import DateTimeInput from '../../../app/javascript/BuiltInFormControls/DateTimeInput';

function StatefulDateTimeInput({
  initialValue,
  externalValue,
  onChangeSpy,
}: {
  initialValue: string | null;
  externalValue?: string | null;
  onChangeSpy: (value: string) => void;
}) {
  const [value, setValue] = useState<string | null>(initialValue);

  return (
    <>
      <DateTimeInput
        value={value}
        timezoneName="Etc/UTC"
        onChange={(newValue) => {
          onChangeSpy(newValue);
          setValue(newValue);
        }}
      />
      <button type="button" onClick={() => setValue(externalValue ?? null)}>
        Set from outside
      </button>
    </>
  );
}

describe('DateTimeInput', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it('shows the date and time of the incoming value', async () => {
    const { getByLabelText } = await render(
      <StatefulDateTimeInput initialValue="2024-03-05T14:30:00Z" onChangeSpy={vi.fn()} />,
    );

    expect(getByLabelText('Date')).toHaveValue('2024-03-05');
    expect(getByLabelText('Time')).toHaveValue('14:30:00');
  });

  it('emits an ISO timestamp when the time is edited', async () => {
    const onChange = vi.fn();
    const { getByLabelText } = await render(
      <StatefulDateTimeInput initialValue="2024-03-05T14:30:00Z" onChangeSpy={onChange} />,
    );

    // userEvent types into time inputs one segment at a time, which jsdom doesn't model faithfully
    fireEvent.change(getByLabelText('Time'), { target: { value: '16:45:00' } });

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.lastCall?.[0]).toMatch(/^2024-03-05T16:45:00/);
  });

  it('emits an ISO timestamp when the date is edited', async () => {
    const onChange = vi.fn();
    const { getByLabelText } = await render(
      <StatefulDateTimeInput initialValue="2024-03-05T14:30:00Z" onChangeSpy={onChange} />,
    );

    await user.clear(getByLabelText('Date'));
    await user.type(getByLabelText('Date'), '2024-04-01');

    expect(onChange.mock.lastCall?.[0]).toMatch(/^2024-04-01T14:30:00/);
  });

  it('updates the inputs when the value changes from outside', async () => {
    const { getByLabelText, getByRole } = await render(
      <StatefulDateTimeInput
        initialValue="2024-03-05T14:30:00Z"
        externalValue="2025-12-25T08:15:00Z"
        onChangeSpy={vi.fn()}
      />,
    );

    await user.click(getByRole('button', { name: 'Set from outside' }));

    expect(getByLabelText('Date')).toHaveValue('2025-12-25');
    expect(getByLabelText('Time')).toHaveValue('08:15:00');
  });

  it('keeps what the user has typed when the incoming value becomes invalid', async () => {
    const { getByLabelText, getByRole } = await render(
      <StatefulDateTimeInput initialValue="2024-03-05T14:30:00Z" externalValue="not a date" onChangeSpy={vi.fn()} />,
    );

    await user.click(getByRole('button', { name: 'Set from outside' }));

    expect(getByLabelText('Date')).toHaveValue('2024-03-05');
    expect(getByLabelText('Time')).toHaveValue('14:30:00');
  });
});
