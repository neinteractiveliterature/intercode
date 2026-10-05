import { useState } from 'react';
import { vi } from 'vitest';

import { render, userEvent } from '../testUtils';
import CouponForm from '../../../app/javascript/Store/CouponAdmin/CouponForm';
import { AdminCouponFieldsFragment } from '../../../app/javascript/Store/CouponAdmin/queries.generated';
import { buildMoney } from '../fixtures/store';

// The product picker has its own tests; here it's a stand-in that picks a product (or clears the choice).
vi.mock('../../../app/javascript/BuiltInFormControls/ProductSelect', () => ({
  default: ({ onChange }: { onChange: (product: unknown) => void }) => (
    <>
      <button type="button" onClick={() => onChange({ __typename: 'Product', id: '1', name: 'T-shirt' })}>
        Choose T-shirt
      </button>
      <button type="button" onClick={() => onChange(null)}>
        Clear product
      </button>
    </>
  ),
}));

type CouponValue = Omit<AdminCouponFieldsFragment, 'id'>;

describe('CouponForm', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const changed = vi.fn<(coupon: CouponValue) => void>();

  beforeEach(() => {
    user = userEvent.setup();
    changed.mockReset();
  });

  const blankCoupon: CouponValue = {
    __typename: 'Coupon',
    code: '',
    fixed_amount: null,
    percent_discount: null,
    provides_product: null,
    usage_limit: null,
    expires_at: null,
  };

  // The form is controlled, so (like the modals around it) it needs something holding the coupon
  function Harness({ initial }: { initial: CouponValue }) {
    const [coupon, setCoupon] = useState(initial);

    return (
      <CouponForm
        value={coupon}
        onChange={(update) =>
          setCoupon((prev) => {
            const next = typeof update === 'function' ? update(prev) : update;
            changed(next);
            return next;
          })
        }
      />
    );
  }

  const renderForm = (overrides: Partial<CouponValue> = {}, supportedCurrencyCodes = ['USD']) =>
    render(<Harness initial={{ ...blankCoupon, ...overrides }} />, {
      appRootContextValue: { defaultCurrencyCode: 'USD', supportedCurrencyCodes },
    });

  const lastCoupon = () => changed.mock.lastCall?.[0];

  it('takes a code', async () => {
    const { getByLabelText } = await renderForm();

    await user.type(getByLabelText('Coupon code'), 'SAVE5');

    expect(lastCoupon()?.code).toBe('SAVE5');
  });

  it('takes a usage limit as a whole number, and no limit when emptied', async () => {
    const { getByLabelText } = await renderForm({ usage_limit: 10 });

    await user.clear(getByLabelText('Usage limit'));
    expect(lastCoupon()?.usage_limit).toBeNull();

    await user.type(getByLabelText('Usage limit'), '25');
    expect(lastCoupon()?.usage_limit).toBe(25);
  });

  it('shows the existing code and usage limit', async () => {
    const { getByLabelText } = await renderForm({ code: 'SAVE5', usage_limit: 10 });

    expect(getByLabelText('Coupon code')).toHaveValue('SAVE5');
    expect(getByLabelText('Usage limit')).toHaveValue(10);
  });

  describe('the discount mode', () => {
    it('is none until one is chosen, with no discount fields shown', async () => {
      const { getByRole, queryByRole } = await renderForm();

      expect(getByRole('radio', { name: 'Fixed amount discount' })).not.toBeChecked();
      expect(queryByRole('spinbutton', { name: 'Percent discount' })).toBeNull();
      expect(queryByRole('textbox', { name: 'Fixed amount discount' })).toBeNull();
    });

    it.each([
      ['Fixed amount discount', 'fixed_amount', { percent_discount: '10' }],
      ['Percent discount', 'percent_discount', { fixed_amount: buildMoney(500) }],
      ['Provide a product', 'provides_product', { percent_discount: '10' }],
    ] as const)(
      'starts a blank %s when chosen, and clears whichever other kind of discount there was',
      async (label, field, initial) => {
        const { getByRole } = await renderForm({ ...initial });

        await user.click(getByRole('radio', { name: label }));

        const coupon = lastCoupon();
        expect(coupon?.[field]).not.toBeNull();
        expect(
          (['fixed_amount', 'percent_discount', 'provides_product'] as const).filter(
            (other) => coupon?.[other] != null,
          ),
        ).toEqual([field]);
      },
    );

    it('starts a fixed amount at zero in the default currency, and a percentage at 0', async () => {
      const { getByRole } = await renderForm();

      await user.click(getByRole('radio', { name: 'Fixed amount discount' }));
      expect(lastCoupon()?.fixed_amount).toEqual({ __typename: 'Money', fractional: 0, currency_code: 'USD' });

      await user.click(getByRole('radio', { name: 'Percent discount' }));
      expect(lastCoupon()?.percent_discount).toBe('0');
      expect(lastCoupon()?.fixed_amount).toBeNull();
    });
  });

  describe('a fixed amount', () => {
    it('takes the amount typed in', async () => {
      const { getByRole } = await renderForm({ fixed_amount: buildMoney(0) });

      await user.clear(getByRole('textbox', { name: 'Fixed amount discount' }));
      await user.type(getByRole('textbox', { name: 'Fixed amount discount' }), '5.25');

      expect(lastCoupon()?.fixed_amount).toMatchObject({ fractional: 525, currency_code: 'USD' });
    });

    it('goes back to zero if the amount is cleared', async () => {
      const { getByRole } = await renderForm({ fixed_amount: buildMoney(500) });

      await user.clear(getByRole('textbox', { name: 'Fixed amount discount' }));

      expect(lastCoupon()?.fixed_amount).toEqual({ __typename: 'Money', fractional: 0, currency_code: 'USD' });
    });

    it('changes the currency without losing the amount', async () => {
      const { getByRole } = await renderForm({ fixed_amount: buildMoney(500) }, ['USD', 'EUR']);

      await user.selectOptions(getByRole('combobox', { name: 'Currency' }), 'EUR');

      expect(lastCoupon()?.fixed_amount).toMatchObject({ fractional: 500, currency_code: 'EUR' });
    });
  });

  describe('a percent discount', () => {
    it('takes the percentage typed in', async () => {
      const { getByRole } = await renderForm({ percent_discount: '0' });

      await user.clear(getByRole('spinbutton', { name: 'Percent discount' }));
      await user.type(getByRole('spinbutton', { name: 'Percent discount' }), '15');

      expect(lastCoupon()?.percent_discount).toBe('15');
    });
  });

  describe('a product to provide', () => {
    it('takes the product chosen', async () => {
      const { getByRole } = await renderForm({ provides_product: { __typename: 'Product', id: '', name: '' } });

      await user.click(getByRole('button', { name: 'Choose T-shirt' }));

      expect(lastCoupon()?.provides_product).toMatchObject({ id: '1', name: 'T-shirt' });
    });

    it('goes back to the blank product (id "") when the choice is cleared', async () => {
      const { getByRole } = await renderForm({ provides_product: { __typename: 'Product', id: '1', name: 'T-shirt' } });

      await user.click(getByRole('button', { name: 'Clear product' }));

      expect(lastCoupon()?.provides_product).toEqual({ __typename: 'Product', name: '', id: '' });
    });
  });
});
