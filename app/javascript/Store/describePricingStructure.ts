import { DateTime } from 'luxon';
import { TFunction } from 'i18next';

import { findCurrentValue, findCurrentTimespanIndex } from '../ScheduledValueUtils';
import { PricingStructure, ScheduledMoneyValue } from '../graphqlTypes.generated';

export function describeAdminPricingStructure(
  pricingStructure: Pick<PricingStructure, 'pricing_strategy' | 'value'> | null | undefined,
  t: TFunction,
): string | null {
  if (!pricingStructure) {
    return null;
  }

  if (pricingStructure.pricing_strategy === 'fixed') {
    return t('pricingStructure.fixedPrice', '{{ price, money }} (fixed price)', { price: pricingStructure.value });
  }

  if (pricingStructure.pricing_strategy === 'scheduled_value') {
    const scheduledValue = pricingStructure.value as ScheduledMoneyValue;
    const pricePointCount = scheduledValue.timespans.length;
    const currentValue = findCurrentValue(scheduledValue);
    return t('pricingStructure.scheduledValueSummary', '{{ price, money }} ({{ count }} scheduled price points)', {
      price: currentValue,
      count: pricePointCount,
    });
  }

  return null;
}

export function describeUserPricingStructure(
  pricingStructure: Pick<PricingStructure, 'pricing_strategy' | 'value'> | undefined | null,
  timezoneName: string,
  t: TFunction,
): string | null {
  if (!pricingStructure) {
    return null;
  }

  if (pricingStructure.pricing_strategy === 'fixed') {
    return t('pricingStructure.price', '{{ price, money }}', { price: pricingStructure.value });
  }

  if (pricingStructure.pricing_strategy === 'scheduled_value') {
    const scheduledValue = pricingStructure.value as ScheduledMoneyValue;
    const currentTimespanIndex = findCurrentTimespanIndex(scheduledValue);
    if (currentTimespanIndex === -1) {
      return t('pricingStructure.unavailable', 'Currently unavailable');
    }

    const currentValue = scheduledValue.timespans[currentTimespanIndex].value;
    const nextTimespan = scheduledValue.timespans[currentTimespanIndex + 1];
    if (nextTimespan && nextTimespan.start) {
      const nextValue = nextTimespan.value;
      const nextChange = DateTime.fromISO(nextTimespan.start, { zone: timezoneName });
      return t(
        'pricingStructure.scheduledValueWithNext',
        '{{ price, money }} ({{ nextPrice, money }} starting {{ nextChange, dateTimeNamed(format: shortDateTime) }})',
        {
          price: currentValue,
          nextPrice: nextValue,
          nextChange,
        },
      );
    }
    return t('pricingStructure.price', '{{ price, money }}', { price: currentValue });
  }

  return null;
}

export function describeCurrentPrice(
  pricingStructure: Pick<PricingStructure, 'pricing_strategy' | 'value'> | null | undefined,
  t: TFunction,
): string | null {
  if (!pricingStructure) {
    return null;
  }

  if (pricingStructure.pricing_strategy === 'fixed') {
    return t('pricingStructure.price', '{{ price, money }}', { price: pricingStructure.value });
  }

  if (pricingStructure.pricing_strategy === 'scheduled_value') {
    const currentValue = findCurrentValue(pricingStructure.value as ScheduledMoneyValue);
    if (currentValue == null) {
      return t('pricingStructure.unavailable', 'Currently unavailable');
    }

    return t('pricingStructure.price', '{{ price, money }}', { price: currentValue });
  }

  return null;
}
