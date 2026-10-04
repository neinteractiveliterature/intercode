import { vi } from 'vitest';
import {
  AdminPricingStructureDescription,
  CurrentPriceDescription,
  PayWhatYouWantRangeDescription,
  PayWhatYouWantValueDescription,
  UserPricingStructureDescription,
} from '../../../app/javascript/Store/describePricingStructure';
import {
  Money,
  PayWhatYouWantValue,
  PricingStrategy,
  ScheduledMoneyValue,
} from '../../../app/javascript/graphqlTypes.generated';
import { render } from '../testUtils';

function money(fractional: number): Money {
  return { __typename: 'Money', fractional, currency_code: 'USD' };
}

function payWhatYouWant(value: Partial<PayWhatYouWantValue>): PayWhatYouWantValue {
  return { __typename: 'PayWhatYouWantValue', ...value };
}

// "Now" is 2026-04-15, in the middle of the "regular" price period below
const scheduledPrices: ScheduledMoneyValue = {
  __typename: 'ScheduledMoneyValue',
  timespans: [
    { __typename: 'TimespanWithMoneyValue', start: null, finish: '2026-03-01T00:00:00Z', value: money(1000) },
    {
      __typename: 'TimespanWithMoneyValue',
      start: '2026-03-01T00:00:00Z',
      finish: '2026-06-01T00:00:00Z',
      value: money(1500),
    },
    { __typename: 'TimespanWithMoneyValue', start: '2026-06-01T00:00:00Z', finish: null, value: money(2000) },
  ],
};

async function textOf(element: React.JSX.Element): Promise<string> {
  const { container } = await render(element, { appRootContextValue: { timezoneName: 'America/New_York' } });
  return container.textContent ?? '';
}

describe('describePricingStructure', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-04-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('PayWhatYouWantRangeDescription', () => {
    it('describes a minimum and maximum', async () => {
      expect(
        await textOf(
          <PayWhatYouWantRangeDescription
            value={payWhatYouWant({ minimum_amount: money(500), maximum_amount: money(5000) })}
          />,
        ),
      ).toBe('$5.00 to $50.00');
    });

    it('describes just a minimum', async () => {
      expect(
        await textOf(<PayWhatYouWantRangeDescription value={payWhatYouWant({ minimum_amount: money(500) })} />),
      ).toBe('at least $5.00');
    });

    it('describes just a maximum', async () => {
      expect(
        await textOf(<PayWhatYouWantRangeDescription value={payWhatYouWant({ maximum_amount: money(5000) })} />),
      ).toBe('up to $50.00');
    });

    it('says any amount works when there are no bounds', async () => {
      expect(await textOf(<PayWhatYouWantRangeDescription value={payWhatYouWant({})} />)).toBe('any amount');
    });

    it('renders nothing without a value', async () => {
      expect(await textOf(<PayWhatYouWantRangeDescription value={null} />)).toBe('');
      expect(await textOf(<PayWhatYouWantRangeDescription />)).toBe('');
    });
  });

  describe('PayWhatYouWantValueDescription', () => {
    it('adds the suggested amount to the range, if there is one', async () => {
      expect(
        await textOf(
          <PayWhatYouWantValueDescription
            value={payWhatYouWant({
              minimum_amount: money(500),
              maximum_amount: money(5000),
              suggested_amount: money(2000),
            })}
          />,
        ),
      ).toBe('$5.00 to $50.00Suggested amount: $20.00');
    });

    it('is just the range without a suggested amount', async () => {
      expect(
        await textOf(<PayWhatYouWantValueDescription value={payWhatYouWant({ maximum_amount: money(5000) })} />),
      ).toBe('up to $50.00');
    });

    it('renders nothing without a value', async () => {
      expect(await textOf(<PayWhatYouWantValueDescription value={null} />)).toBe('');
    });
  });

  describe('AdminPricingStructureDescription', () => {
    it('labels a fixed price as fixed', async () => {
      expect(
        await textOf(
          <AdminPricingStructureDescription
            pricingStructure={{ pricing_strategy: PricingStrategy.Fixed, value: money(2000) }}
          />,
        ),
      ).toBe('$20.00 (fixed price)');
    });

    it('summarizes a schedule by the current price and the number of price points', async () => {
      expect(
        await textOf(
          <AdminPricingStructureDescription
            pricingStructure={{ pricing_strategy: PricingStrategy.ScheduledValue, value: scheduledPrices }}
          />,
        ),
      ).toBe('$15.00 (3 scheduled price points)');
    });

    it('uses the singular for a one-point schedule', async () => {
      const single: ScheduledMoneyValue = {
        __typename: 'ScheduledMoneyValue',
        timespans: [{ __typename: 'TimespanWithMoneyValue', start: null, finish: null, value: money(1000) }],
      };

      expect(
        await textOf(
          <AdminPricingStructureDescription
            pricingStructure={{ pricing_strategy: PricingStrategy.ScheduledValue, value: single }}
          />,
        ),
      ).toBe('$10.00 (1 scheduled price point)');
    });

    it('describes pay-what-you-want pricing with its range', async () => {
      expect(
        await textOf(
          <AdminPricingStructureDescription
            pricingStructure={{
              pricing_strategy: PricingStrategy.PayWhatYouWant,
              value: payWhatYouWant({ minimum_amount: money(500) }),
            }}
          />,
        ),
      ).toBe('Pay what you want(at least $5.00)');
    });

    it('renders nothing without a pricing structure or a strategy', async () => {
      expect(await textOf(<AdminPricingStructureDescription pricingStructure={null} />)).toBe('');
      expect(await textOf(<AdminPricingStructureDescription pricingStructure={{}} />)).toBe('');
    });
  });

  describe('UserPricingStructureDescription', () => {
    it('shows a fixed price as just the price', async () => {
      expect(
        await textOf(
          <UserPricingStructureDescription
            pricingStructure={{ pricing_strategy: PricingStrategy.Fixed, value: money(2000) }}
          />,
        ),
      ).toBe('$20.00');
    });

    it('shows the current price and the next one coming up, for a schedule', async () => {
      const text = await textOf(
        <UserPricingStructureDescription
          pricingStructure={{ pricing_strategy: PricingStrategy.ScheduledValue, value: scheduledPrices }}
        />,
      );

      expect(text).toMatch(/^\$15\.00\(\$20\.00 starting .+\)$/);
    });

    it('shows just the price when the current period is the last one', async () => {
      vi.setSystemTime(new Date('2026-08-01T12:00:00Z'));

      expect(
        await textOf(
          <UserPricingStructureDescription
            pricingStructure={{ pricing_strategy: PricingStrategy.ScheduledValue, value: scheduledPrices }}
          />,
        ),
      ).toBe('$20.00');
    });

    it('says the price is unavailable when no period covers the current time', async () => {
      const past: ScheduledMoneyValue = {
        __typename: 'ScheduledMoneyValue',
        timespans: [
          { __typename: 'TimespanWithMoneyValue', start: null, finish: '2026-03-01T00:00:00Z', value: money(1000) },
        ],
      };

      expect(
        await textOf(
          <UserPricingStructureDescription
            pricingStructure={{ pricing_strategy: PricingStrategy.ScheduledValue, value: past }}
          />,
        ),
      ).toBe('Currently unavailable');
    });

    it('describes pay-what-you-want pricing with its suggested amount', async () => {
      expect(
        await textOf(
          <UserPricingStructureDescription
            pricingStructure={{
              pricing_strategy: PricingStrategy.PayWhatYouWant,
              value: payWhatYouWant({ maximum_amount: money(5000), suggested_amount: money(2000) }),
            }}
          />,
        ),
      ).toBe('up to $50.00Suggested amount: $20.00');
    });

    it('renders nothing without a pricing structure', async () => {
      expect(await textOf(<UserPricingStructureDescription pricingStructure={null} />)).toBe('');
    });
  });

  describe('CurrentPriceDescription', () => {
    it('shows a fixed price', async () => {
      expect(
        await textOf(
          <CurrentPriceDescription
            pricingStructure={{ pricing_strategy: PricingStrategy.Fixed, value: money(2000) }}
          />,
        ),
      ).toBe('$20.00');
    });

    it('shows the price in effect now, for a schedule', async () => {
      expect(
        await textOf(
          <CurrentPriceDescription
            pricingStructure={{ pricing_strategy: PricingStrategy.ScheduledValue, value: scheduledPrices }}
          />,
        ),
      ).toBe('$15.00');
    });

    it('says the price is unavailable when no period covers the current time', async () => {
      const future: ScheduledMoneyValue = {
        __typename: 'ScheduledMoneyValue',
        timespans: [
          { __typename: 'TimespanWithMoneyValue', start: '2026-12-01T00:00:00Z', finish: null, value: money(1000) },
        ],
      };

      expect(
        await textOf(
          <CurrentPriceDescription
            pricingStructure={{ pricing_strategy: PricingStrategy.ScheduledValue, value: future }}
          />,
        ),
      ).toBe('Currently unavailable');
    });

    it('describes pay-what-you-want pricing as a range', async () => {
      expect(
        await textOf(
          <CurrentPriceDescription
            pricingStructure={{
              pricing_strategy: PricingStrategy.PayWhatYouWant,
              value: payWhatYouWant({ minimum_amount: money(500), maximum_amount: money(5000) }),
            }}
          />,
        ),
      ).toBe('Pay what you want($5.00 to $50.00)');
    });

    it('renders nothing without a pricing structure', async () => {
      expect(await textOf(<CurrentPriceDescription pricingStructure={null} />)).toBe('');
    });
  });
});
