import { DateTime } from 'luxon';

import formatMoney from '../formatMoney';
import { findCurrentValue, findCurrentTimespanIndex } from '../ScheduledValueUtils';
import pluralizeWithCount from '../pluralizeWithCount';
import {
  PricingStructure, PricingStrategy, Money, ScheduledMoneyValue,
} from '../graphqlTypes.generated';
import { lowercaseMeridiem } from '../TimeUtils';

export interface FixedPricingStructure extends PricingStructure {
  pricing_strategy: PricingStrategy.Fixed;
  value: Money;
}

export interface ScheduledValuePricingStructure extends PricingStructure {
  pricing_strategy: PricingStrategy.ScheduledValue;
  value: ScheduledMoneyValue;
}

export type DiscriminatedPricingStructure = FixedPricingStructure | ScheduledValuePricingStructure;

export function describeAdminPricingStructure(pricingStructure: DiscriminatedPricingStructure) {
  if (!pricingStructure) {
    return null;
  }

  if (pricingStructure.pricing_strategy === PricingStrategy.Fixed) {
    return `${formatMoney(pricingStructure.value)} (fixed price)`;
  }

  if (pricingStructure.pricing_strategy === PricingStrategy.ScheduledValue) {
    const pricePointCount = pricingStructure.value.timespans.length;
    const currentValue = findCurrentValue(pricingStructure.value);
    return `${formatMoney(currentValue!)} (${pricePointCount} scheduled price ${pluralizeWithCount('point', pricePointCount, true)})`;
  }

  return null;
}

export function describeUserPricingStructure(pricingStructure: DiscriminatedPricingStructure) {
  if (!pricingStructure) {
    return null;
  }

  if (pricingStructure.pricing_strategy === PricingStrategy.Fixed) {
    return `${formatMoney(pricingStructure.value)}`;
  }

  if (pricingStructure.pricing_strategy === PricingStrategy.ScheduledValue) {
    const currentTimespanIndex = findCurrentTimespanIndex(pricingStructure.value);
    if (currentTimespanIndex === -1) {
      return 'Currently unavailable';
    }

    const currentValue = pricingStructure.value.timespans[currentTimespanIndex].value;
    const nextTimespan = pricingStructure.value.timespans[currentTimespanIndex + 1];
    if (nextTimespan) {
      const nextValue = nextTimespan.value;
      const nextChange = DateTime.fromISO(nextTimespan.start);
      return `${formatMoney(currentValue)} (${formatMoney(nextValue)} starting ${lowercaseMeridiem(nextChange.toFormat('MMM dd, yyyy [at] h:mma'))})`;
    }
    return formatMoney(currentValue);
  }

  return null;
}

export function describeCurrentPrice(pricingStructure: DiscriminatedPricingStructure) {
  if (!pricingStructure) {
    return null;
  }

  if (pricingStructure.pricing_strategy === PricingStrategy.Fixed) {
    return `${formatMoney(pricingStructure.value)}`;
  }

  if (pricingStructure.pricing_strategy === PricingStrategy.ScheduledValue) {
    const currentValue = findCurrentValue(pricingStructure.value);
    if (currentValue == null) {
      return 'Currently unavailable';
    }

    return `${formatMoney(currentValue)}`;
  }

  return null;
}
