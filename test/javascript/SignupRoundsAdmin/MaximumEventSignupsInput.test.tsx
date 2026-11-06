import { useState } from 'react';
import { vi } from 'vitest';

import { render, userEvent } from '../testUtils';
import MaximumEventSignupsInput from '../../../app/javascript/SignupRoundsAdmin/MaximumEventSignupsInput';
import { MaximumEventSignupsValue } from '../../../app/javascript/SignupRoundUtils';

function StatefulMaximumEventSignupsInput({
  initialValue,
  externalValue,
  onChangeSpy,
}: {
  initialValue: MaximumEventSignupsValue | undefined;
  externalValue?: MaximumEventSignupsValue;
  onChangeSpy: (value: MaximumEventSignupsValue | undefined) => void;
}) {
  const [value, setValue] = useState<MaximumEventSignupsValue | undefined>(initialValue);

  return (
    <>
      <MaximumEventSignupsInput
        value={value}
        onChange={(newValue) => {
          onChangeSpy(newValue);
          setValue(newValue);
        }}
      />
      <button type="button" onClick={() => setValue(externalValue)}>
        Set from outside
      </button>
    </>
  );
}

describe('MaximumEventSignupsInput', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it('shows a numeric value as a limit with a count', async () => {
    const { getByRole } = await render(<StatefulMaximumEventSignupsInput initialValue={5} onChangeSpy={vi.fn()} />);

    expect(getByRole('combobox')).toHaveValue('limited');
    expect(getByRole('spinbutton')).toHaveValue(5);
  });

  it('shows a non-numeric value without a count', async () => {
    const { getByRole, queryByRole } = await render(
      <StatefulMaximumEventSignupsInput initialValue="unlimited" onChangeSpy={vi.fn()} />,
    );

    expect(getByRole('combobox')).toHaveValue('unlimited');
    expect(queryByRole('spinbutton')).toBeNull();
  });

  it('emits the selected non-numeric value', async () => {
    const onChange = vi.fn();
    const { getByRole } = await render(<StatefulMaximumEventSignupsInput initialValue={5} onChangeSpy={onChange} />);

    await user.selectOptions(getByRole('combobox'), 'not_now');

    expect(onChange.mock.lastCall?.[0]).toEqual('not_now');
  });

  it('emits the typed limit', async () => {
    const onChange = vi.fn();
    const { getByRole } = await render(
      <StatefulMaximumEventSignupsInput initialValue="unlimited" onChangeSpy={onChange} />,
    );

    await user.selectOptions(getByRole('combobox'), 'limited');
    await user.type(getByRole('spinbutton'), '12');

    expect(onChange.mock.lastCall?.[0]).toEqual(12);
  });

  it('switches to a different value type when the value changes from outside', async () => {
    const { getByRole, queryByRole } = await render(
      <StatefulMaximumEventSignupsInput initialValue={5} externalValue="not_now" onChangeSpy={vi.fn()} />,
    );

    await user.click(getByRole('button', { name: 'Set from outside' }));

    expect(getByRole('combobox')).toHaveValue('not_now');
    expect(queryByRole('spinbutton')).toBeNull();
  });

  it('updates the limit when the numeric value changes from outside', async () => {
    const { getByRole } = await render(
      <StatefulMaximumEventSignupsInput initialValue={5} externalValue={8} onChangeSpy={vi.fn()} />,
    );

    await user.click(getByRole('button', { name: 'Set from outside' }));

    expect(getByRole('spinbutton')).toHaveValue(8);
  });

  it('calls the latest onChange rather than the one from the first render', async () => {
    const firstOnChange = vi.fn();
    const secondOnChange = vi.fn();

    function SwappingOnChange() {
      const [useSecond, setUseSecond] = useState(false);

      return (
        <>
          <MaximumEventSignupsInput value={5} onChange={useSecond ? secondOnChange : firstOnChange} />
          <button type="button" onClick={() => setUseSecond(true)}>
            Swap onChange
          </button>
        </>
      );
    }

    const { getByRole } = await render(<SwappingOnChange />);
    await user.click(getByRole('button', { name: 'Swap onChange' }));
    await user.selectOptions(getByRole('combobox'), 'unlimited');

    expect(secondOnChange).toHaveBeenLastCalledWith('unlimited');
    expect(firstOnChange).not.toHaveBeenCalledWith('unlimited');
  });
});
