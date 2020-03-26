import formatMoney from '../formatMoney';
import { findCurrentValue, findCurrentTimespanIndex } from '../ScheduledValueUtils';
import pluralizeWithCount from '../pluralizeWithCount';

export function describeAdminPricingStructure(pricingStructure) {
  if (!pricingStructure) {
    return null;
  }

  if (pricingStructure.pricing_strategy === 'fixed') {
    return `${formatMoney(pricingStructure.value)} (fixed price)`;
  }

  if (pricingStructure.pricing_strategy === 'scheduled_value') {
    const pricePointCount = pricingStructure.value.timespans.length;
    const currentValue = findCurrentValue(pricingStructure.value);
    return `${formatMoney(currentValue)} (${pricePointCount} scheduled price ${pluralizeWithCount('point', pricePointCount, true)})`;
  }

  return null;
}

export function describeUserPricingStructure(pricingStructure) {
  if (!pricingStructure) {
    return null;
  }

  if (pricingStructure.pricing_strategy === 'fixed') {
    return `${formatMoney(pricingStructure.value)}`;
  }

  if (pricingStructure.pricing_strategy === 'scheduled_value') {
    const currentTimespanIndex = findCurrentTimespanIndex(pricingStructure.value);
    if (currentTimespanIndex === -1) {
      return 'Currently unavailable';
    }

    const currentValue = pricingStructure.value.timespans[currentTimespanIndex].value;
    const nextTimespan = pricingStructure.value.timespans[currentTimespanIndex + 1];
    if (nextTimespan) {
      const nextValue = nextTimespan.value;
      return `${formatMoney(currentValue)} (${formatMoney(nextValue)} starting ${nextValue.format('MMM DD, YYYY [at] h:mma')})`;
    }
    return formatMoney(currentValue);
  }

  return null;
}
