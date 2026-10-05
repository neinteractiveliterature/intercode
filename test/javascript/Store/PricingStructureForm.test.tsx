import { useState } from 'react';
import { vi } from 'vitest';

import { render, userEvent, within } from '../testUtils';
import PricingStructureForm from '../../../app/javascript/Store/ProductAdmin/PricingStructureForm';
import EditPricingStructureModal from '../../../app/javascript/Store/ProductAdmin/EditPricingStructureModal';
import { EditingPricingStructure } from '../../../app/javascript/Store/ProductAdmin/EditingProductTypes';
import {
  Money,
  PayWhatYouWantValue,
  PricingStrategy,
  ScheduledMoneyValue,
} from '../../../app/javascript/graphqlTypes.generated';
import { buildMoney } from '../fixtures/store';

describe('PricingStructureForm', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const changed = vi.fn<(pricingStructure: EditingPricingStructure | undefined) => void>();

  beforeEach(() => {
    user = userEvent.setup();
    changed.mockReset();
  });

  // The form is controlled, so (like the modal around it) it needs something holding the pricing structure
  function Harness({ initial }: { initial?: EditingPricingStructure }) {
    const [pricingStructure, setPricingStructure] = useState<EditingPricingStructure | undefined>(initial);

    return (
      <PricingStructureForm
        pricingStructure={pricingStructure}
        setPricingStructure={(update) =>
          setPricingStructure((prev) => {
            const next = typeof update === 'function' ? update(prev) : update;
            changed(next);
            return next;
          })
        }
      />
    );
  }

  const renderForm = (initial?: EditingPricingStructure, supportedCurrencyCodes = ['USD']) =>
    render(<Harness initial={initial} />, {
      appRootContextValue: { defaultCurrencyCode: 'USD', supportedCurrencyCodes, timezoneName: 'America/New_York' },
    });

  const lastValue = () => changed.mock.lastCall?.[0];

  it('offers the three pricing strategies, with no price fields until one is chosen', async () => {
    const { getByRole, queryByLabelText } = await renderForm();

    expect(getByRole('radio', { name: 'Fixed price' })).toBeTruthy();
    expect(getByRole('radio', { name: 'Pay-what-you-want price' })).toBeTruthy();
    expect(getByRole('radio', { name: 'Price that changes over time' })).toBeTruthy();
    expect(queryByLabelText('Price')).toBeNull();
  });

  describe('a fixed price', () => {
    it('starts at zero in the default currency when chosen', async () => {
      const { getByRole } = await renderForm();

      await user.click(getByRole('radio', { name: 'Fixed price' }));

      expect(lastValue()).toMatchObject({
        pricing_strategy: PricingStrategy.Fixed,
        value: { __typename: 'Money', fractional: 0, currency_code: 'USD' },
      });
    });

    it('takes the price typed in', async () => {
      const { getByRole, getByLabelText } = await renderForm();

      await user.click(getByRole('radio', { name: 'Fixed price' }));
      await user.clear(getByLabelText('Price'));
      await user.type(getByLabelText('Price'), '19.99');

      expect(lastValue()?.value).toMatchObject({ fractional: 1999, currency_code: 'USD' });
    });

    it('shows the existing price when editing', async () => {
      const { getByLabelText } = await renderForm({
        pricing_strategy: PricingStrategy.Fixed,
        value: buildMoney(2500),
      });

      expect(getByLabelText('Price')).toHaveValue('25');
    });

    it('changes the currency of the price being edited, not of the last saved price', async () => {
      // the price has been edited to $25 but the saved price (`price`) is still $20
      const { getByRole } = await renderForm(
        { pricing_strategy: PricingStrategy.Fixed, price: buildMoney(2000), value: buildMoney(2500) },
        ['USD', 'EUR'],
      );

      await user.selectOptions(getByRole('combobox', { name: 'Currency' }), 'EUR');

      expect(lastValue()?.value).toMatchObject({ fractional: 2500, currency_code: 'EUR' });
    });
  });

  describe('a pay-what-you-want price', () => {
    it('starts out allowing the default currency', async () => {
      const { getByRole } = await renderForm();

      await user.click(getByRole('radio', { name: 'Pay-what-you-want price' }));

      expect(lastValue()).toMatchObject({
        pricing_strategy: PricingStrategy.PayWhatYouWant,
        value: { __typename: 'PayWhatYouWantValue', allowed_currency_codes: ['USD'] },
      });
    });

    it('takes a minimum, suggested and maximum amount, each separately', async () => {
      const { getByRole, getByLabelText } = await renderForm();

      await user.click(getByRole('radio', { name: 'Pay-what-you-want price' }));
      await user.type(getByLabelText('Minimum amount'), '5');
      await user.type(getByLabelText('Suggested amount'), '10.50');
      await user.type(getByLabelText('Maximum amount'), '100');

      const value = lastValue()?.value as PayWhatYouWantValue;
      expect(value.minimum_amount).toMatchObject({ fractional: 500, currency_code: 'USD' });
      expect(value.suggested_amount).toMatchObject({ fractional: 1050, currency_code: 'USD' });
      expect(value.maximum_amount).toMatchObject({ fractional: 10000, currency_code: 'USD' });
    });

    it('leaves an amount unset when its box is emptied', async () => {
      const { getByLabelText } = await renderForm({
        pricing_strategy: PricingStrategy.PayWhatYouWant,
        value: {
          __typename: 'PayWhatYouWantValue',
          allowed_currency_codes: ['USD'],
          minimum_amount: buildMoney(500),
        },
      });

      await user.clear(getByLabelText('Minimum amount'));

      expect((lastValue()?.value as PayWhatYouWantValue).minimum_amount).toBeUndefined();
    });

    it('shows the amounts already set', async () => {
      const { getByLabelText } = await renderForm({
        pricing_strategy: PricingStrategy.PayWhatYouWant,
        value: {
          __typename: 'PayWhatYouWantValue',
          allowed_currency_codes: ['USD'],
          minimum_amount: buildMoney(500),
          suggested_amount: buildMoney(1050),
        },
      });

      expect(getByLabelText('Minimum amount')).toHaveValue('5');
      expect(getByLabelText('Suggested amount')).toHaveValue('10.5');
      expect(getByLabelText('Maximum amount')).toHaveValue('');
    });
  });

  describe('a price that changes over time', () => {
    it('starts with no timespans, and a place to add them', async () => {
      const { getByRole } = await renderForm();

      await user.click(getByRole('radio', { name: 'Price that changes over time' }));

      expect(lastValue()).toMatchObject({
        pricing_strategy: PricingStrategy.ScheduledValue,
        value: { __typename: 'ScheduledMoneyValue', timespans: [] },
      });
      expect(getByRole('group', { name: 'Pricing schedule' })).toBeTruthy();
    });

    it('adds a timespan to the schedule', async () => {
      const { getByRole } = await renderForm({
        pricing_strategy: PricingStrategy.ScheduledValue,
        value: { __typename: 'ScheduledMoneyValue', timespans: [] },
      });

      await user.click(getByRole('button', { name: /add/i }));

      expect((lastValue()?.value as ScheduledMoneyValue).timespans).toHaveLength(1);
    });
  });

  describe('switching strategies', () => {
    it('keeps the amount already typed when going from a fixed price to pay-what-you-want and back', async () => {
      const { getByRole, getByLabelText } = await renderForm({
        pricing_strategy: PricingStrategy.Fixed,
        value: buildMoney(2500),
      });

      await user.click(getByRole('radio', { name: 'Pay-what-you-want price' }));
      await user.click(getByRole('radio', { name: 'Fixed price' }));

      expect(lastValue()?.pricing_strategy).toBe(PricingStrategy.Fixed);
      expect((lastValue()?.value as Money).fractional).toBe(2500);
      expect(getByLabelText('Price')).toHaveValue('25');
    });
  });
});

describe('EditPricingStructureModal', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const close = vi.fn();
  const onChange = vi.fn<(pricingStructure: EditingPricingStructure | undefined) => void>();

  beforeEach(() => {
    user = userEvent.setup();
    close.mockReset();
    onChange.mockReset();
  });

  const renderModal = (value?: EditingPricingStructure | null) =>
    render(<EditPricingStructureModal visible close={close} state={{ value, onChange, opened: new Date() }} />, {
      appRootContextValue: { defaultCurrencyCode: 'USD', supportedCurrencyCodes: ['USD'] },
    });

  // (the test wrapper's confirm dialog has OK and Cancel buttons of its own, so look within this modal)
  const footerButton = (result: Awaited<ReturnType<typeof renderModal>>, name: string) =>
    within(result.getByText('Pricing structure').closest('.modal-content') as HTMLElement).getByRole('button', {
      name,
      hidden: true,
    });

  it('starts from the pricing structure it was opened with', async () => {
    const result = await renderModal({ pricing_strategy: PricingStrategy.Fixed, value: buildMoney(2500) });

    expect(result.getByRole('radio', { name: 'Fixed price', hidden: true })).toBeChecked();
    expect(result.getByRole('textbox', { name: 'Price', hidden: true })).toHaveValue('25');
  });

  it('gives back the edited pricing structure when OK is clicked, and closes', async () => {
    const result = await renderModal({ pricing_strategy: PricingStrategy.Fixed, value: buildMoney(2500) });

    await user.clear(result.getByRole('textbox', { name: 'Price', hidden: true }));
    await user.type(result.getByRole('textbox', { name: 'Price', hidden: true }), '30');
    await user.click(footerButton(result, 'OK'));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        pricing_strategy: PricingStrategy.Fixed,
        value: expect.objectContaining({ fractional: 3000 }),
      }),
    );
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('gives back nothing, but still closes, if no pricing structure was ever set', async () => {
    const result = await renderModal();

    await user.click(footerButton(result, 'OK'));

    expect(onChange).not.toHaveBeenCalled();
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('discards the changes when cancelled', async () => {
    const result = await renderModal({ pricing_strategy: PricingStrategy.Fixed, value: buildMoney(2500) });

    await user.clear(result.getByRole('textbox', { name: 'Price', hidden: true }));
    await user.type(result.getByRole('textbox', { name: 'Price', hidden: true }), '30');
    await user.click(footerButton(result, 'Cancel'));

    expect(onChange).not.toHaveBeenCalled();
    expect(close).toHaveBeenCalledTimes(1);
  });
});
