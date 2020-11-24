import moment from 'moment-timezone';

import formatMoney from '../formatMoney';
import { findCurrentValue, findCurrentTimespanIndex } from '../ScheduledValueUtils';
import pluralizeWithCount from '../pluralizeWithCount';
import { Money, PricingStructure, ScheduledMoneyValue } from '../graphqlTypes.generated';

export function describeAdminPricingStructure(
  pricingStructure?: Pick<PricingStructure, 'pricing_strategy' | 'value'> | null,
) {
  if (!pricingStructure) {
    return null;
  }

  if (pricingStructure.pricing_strategy === 'fixed') {
    return `${formatMoney(pricingStructure.value as Money)} (fixed price)`;
  }

  if (pricingStructure.pricing_strategy === 'scheduled_value') {
    const scheduledValue = pricingStructure.value as ScheduledMoneyValue;
    const pricePointCount = scheduledValue.timespans.length;
    const currentValue = findCurrentValue(scheduledValue);
    return `${formatMoney(currentValue)} (${pricePointCount} scheduled price ${pluralizeWithCount(
      'point',
      pricePointCount,
      true,
    )})`;
  }

  return null;
}

export function describeUserPricingStructure(
  pricingStructure: Pick<PricingStructure, 'pricing_strategy' | 'value'> | undefined | null,
  timezoneName: string,
) {
  if (!pricingStructure) {
    return null;
  }

  if (pricingStructure.pricing_strategy === 'fixed') {
    return `${formatMoney(pricingStructure.value as Money)}`;
  }

  if (pricingStructure.pricing_strategy === 'scheduled_value') {
    const scheduledValue = pricingStructure.value as ScheduledMoneyValue;
    const currentTimespanIndex = findCurrentTimespanIndex(scheduledValue);
    if (currentTimespanIndex === -1) {
      return 'Currently unavailable';
    }

    const currentValue = scheduledValue.timespans[currentTimespanIndex].value;
    const nextTimespan = scheduledValue.timespans[currentTimespanIndex + 1];
    if (nextTimespan) {
      const nextValue = nextTimespan.value;
      const nextChange = moment.tz(nextTimespan.start, timezoneName);
      return `${formatMoney(currentValue)} (${formatMoney(nextValue)} starting ${nextChange.format(
        'MMM DD, YYYY [at] h:mmaaa',
      )})`;
    }
    return formatMoney(currentValue);
  }

  return null;
}

export function describeCurrentPrice(
  pricingStructure?: Pick<PricingStructure, 'pricing_strategy' | 'value'> | null,
) {
  if (!pricingStructure) {
    return null;
  }

  if (pricingStructure.pricing_strategy === 'fixed') {
    return `${formatMoney(pricingStructure.value as Money)}`;
  }

  if (pricingStructure.pricing_strategy === 'scheduled_value') {
    const currentValue = findCurrentValue(pricingStructure.value as ScheduledMoneyValue);
    if (currentValue == null) {
      return 'Currently unavailable';
    }

    return `${formatMoney(currentValue)}`;
  }

  return null;
}
