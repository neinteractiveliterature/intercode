import { useState } from 'react';
import { vi } from 'vitest';

import { render, userEvent } from '../testUtils';
import MoneyInput from '../../../app/javascript/Store/MoneyInput';
import { Money } from '../../../app/javascript/graphqlTypes.generated';
import { buildMoney } from '../fixtures/store';

describe('MoneyInput', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const changed = vi.fn<(value: Money | undefined) => void>();

  beforeEach(() => {
    user = userEvent.setup();
    changed.mockReset();
  });

  // The input is controlled, so (like the form it lives in) it needs something holding its value
  function Harness({ initialValue, allowedCurrencyCodes }: { initialValue?: Money; allowedCurrencyCodes?: string[] }) {
    const [value, setValue] = useState<Money | undefined>(initialValue);

    return (
      <MoneyInput
        value={value}
        allowedCurrencyCodes={allowedCurrencyCodes}
        onChange={(newValue) =>
          setValue((prev) => {
            const next = typeof newValue === 'function' ? newValue(prev) : newValue;
            changed(next);
            return next;
          })
        }
      />
    );
  }

  const renderInput = (props: React.ComponentProps<typeof Harness> = {}, supportedCurrencyCodes = ['USD']) =>
    render(<Harness {...props} />, { appRootContextValue: { defaultCurrencyCode: 'USD', supportedCurrencyCodes } });

  describe('typing an amount', () => {
    it('reports the amount in the smallest unit of the currency', async () => {
      const { getByRole } = await renderInput();

      await user.type(getByRole('textbox'), '25');

      expect(changed).toHaveBeenLastCalledWith({ __typename: 'Money', fractional: 2500, currency_code: 'USD' });
    });

    // 19.99 * 100 is 1998.9999999999998 in floating point, so truncating it gives a price a cent short
    it.each([
      ['19.99', 1999],
      ['0.29', 29],
      ['1.15', 115],
      ['4.35', 435],
      ['8.2', 820],
      ['10.10', 1010],
    ])('turns %s into %i without losing a cent to rounding', async (typed, expected) => {
      const { getByRole } = await renderInput();

      await user.type(getByRole('textbox'), typed);

      expect(changed).toHaveBeenLastCalledWith(expect.objectContaining({ fractional: expected }));
    });

    it('uses the currency’s own number of decimal places', async () => {
      const { getByRole } = await renderInput({ initialValue: buildMoney(100, 'JPY') }, ['JPY']);

      await user.type(getByRole('textbox'), '5');

      expect(changed).toHaveBeenLastCalledWith({ __typename: 'Money', fractional: 1005, currency_code: 'JPY' });
    });

    it('reports no value when the box is cleared or isn’t a number', async () => {
      const { getByRole } = await renderInput({ initialValue: buildMoney(2500) });

      await user.clear(getByRole('textbox'));
      expect(changed).toHaveBeenLastCalledWith(undefined);

      await user.type(getByRole('textbox'), 'abc');
      expect(changed).toHaveBeenLastCalledWith(undefined);
    });
  });

  it('shows the starting amount, without the currency symbol inside the box', async () => {
    const { getByRole, getByText } = await renderInput({ initialValue: buildMoney(1999) });

    expect(getByRole('textbox')).toHaveValue('19.99');
    expect(getByText('$')).toBeTruthy();
  });

  describe('the currency choice', () => {
    it('is only offered when more than one currency is supported', async () => {
      const single = await renderInput();
      expect(single.queryByRole('combobox', { name: 'Currency' })).toBeNull();
      single.unmount();

      const several = await renderInput({}, ['USD', 'EUR']);
      expect(several.getByRole('combobox', { name: 'Currency' })).toBeTruthy();
    });

    it('is limited to the allowed currencies when there are some', async () => {
      const { getByRole } = await renderInput({ allowedCurrencyCodes: ['USD', 'GBP'] }, ['USD', 'EUR', 'GBP']);

      const options = Array.from(getByRole('combobox', { name: 'Currency' }).querySelectorAll('option')).map(
        (option) => option.value,
      );
      expect(options).toEqual(expect.arrayContaining(['GBP', 'USD']));
      expect(options).not.toContain('EUR');
    });

    it('changes the currency of the amount that is already there', async () => {
      const { getByRole } = await renderInput({ initialValue: buildMoney(2500) }, ['USD', 'EUR']);

      await user.selectOptions(getByRole('combobox', { name: 'Currency' }), 'EUR');

      expect(changed).toHaveBeenLastCalledWith({ __typename: 'Money', fractional: 2500, currency_code: 'EUR' });
    });

    it('starts a new amount in the first allowed currency if the default one isn’t allowed', async () => {
      const { getByRole } = await renderInput({ allowedCurrencyCodes: ['EUR', 'GBP'] }, ['USD', 'EUR', 'GBP']);

      await user.type(getByRole('textbox'), '5');

      expect(changed).toHaveBeenLastCalledWith(expect.objectContaining({ currency_code: 'EUR' }));
    });
  });
});
