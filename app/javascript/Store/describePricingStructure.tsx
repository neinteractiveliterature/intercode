import { DateTime } from 'luxon';
import { TFunction } from 'i18next';

import { findCurrentValue, findCurrentTimespanIndex } from '../ScheduledValueUtils';
import { PayWhatYouWantValue, PricingStrategy, PricingStructure, ScheduledMoneyValue } from '../graphqlTypes.generated';
import assertNever from 'assert-never';
import { Trans } from 'react-i18next';
import React from 'react';

export function describePayWhatYouWantRange(value: PayWhatYouWantValue | undefined | null, t: TFunction) {
  if (!value) {
    return '';
  }

  if (value.minimum_amount && value.maximum_amount) {
    return (
      <Trans
        i18nKey="payWhatYouWant.minAndMax"
        defaults="<bold>{{ minimumAmount, money }}</bold> to <bold>{{ maximumAmount, money }}</bold>"
        values={{
          minimumAmount: value.minimum_amount,
          maximumAmount: value.maximum_amount,
        }}
        components={{ bold: <strong /> }}
      />
    );
  } else if (value.minimum_amount) {
    return (
      <Trans
        i18nKey="payWhatYouWant.minOnly"
        defaults="at least <bold>{{ minimumAmount, money }}</bold>"
        values={{
          minimumAmount: value.minimum_amount,
        }}
        components={{ bold: <strong /> }}
      />
    );
  } else if (value.maximum_amount) {
    return (
      <Trans
        i18nKey="payWhatYouWant.maxOnly"
        defaults="up to <bold>{{ maximumAmount, money }}</bold>"
        values={{
          maximumAmount: value.maximum_amount,
        }}
        components={{ bold: <strong /> }}
      />
    );
  } else {
    return t('payWhatYouWant.noBounds');
  }
}

export function describePayWhatYouWantValue(value: PayWhatYouWantValue | undefined | null, t: TFunction) {
  if (!value) {
    return '';
  }

  if (value.suggested_amount) {
    return (
      <>
        {describePayWhatYouWantRange(value, t)}
        <br />
        <Trans
          i18nKey="payWhatYouWant.suggestedAmount"
          defaults="Suggested amount: <bold>{{ suggestedAmount, money }}</bold>"
          values={{ suggestedAmount: value.suggested_amount }}
          components={{ bold: <strong /> }}
        />
      </>
    );
  } else {
    return describePayWhatYouWantRange(value, t);
  }
}

export function describeAdminPricingStructure(
  pricingStructure: Pick<PricingStructure, 'pricing_strategy' | 'value'> | null | undefined,
  t: TFunction,
): React.ReactNode {
  if (!pricingStructure) {
    return null;
  }

  if (pricingStructure.pricing_strategy === 'fixed') {
    return (
      <Trans
        i18nKey="pricingStructure.fixedPrice"
        defaults="<bold>{{ price, money }}</bold> (fixed price)"
        values={{ price: pricingStructure.value }}
        components={{ bold: <strong /> }}
      />
    );
  }

  if (pricingStructure.pricing_strategy === 'scheduled_value') {
    const scheduledValue = pricingStructure.value as ScheduledMoneyValue;
    const pricePointCount = scheduledValue.timespans.length;
    const currentValue = findCurrentValue(scheduledValue);
    return (
      <Trans
        i18nKey="pricingStructure.scheduledValueSummary"
        defaults="<bold>{{ price, money }}</bold> ({{ count }} scheduled price points)"
        values={{ price: currentValue, count: pricePointCount }}
        components={{ bold: <strong /> }}
        count={pricePointCount}
      />
    );
  }

  if (pricingStructure.pricing_strategy === PricingStrategy.PayWhatYouWant) {
    return (
      <>
        {t('pricingStructure.payWhatYouWant')}(
        {describePayWhatYouWantRange(pricingStructure.value as PayWhatYouWantValue, t)})
      </>
    );
  }

  assertNever(pricingStructure.pricing_strategy, true);

  return null;
}

export function describeUserPricingStructure(
  pricingStructure: Pick<PricingStructure, 'pricing_strategy' | 'value'> | undefined | null,
  timezoneName: string,
  t: TFunction,
): React.ReactNode {
  if (!pricingStructure) {
    return null;
  }

  if (pricingStructure.pricing_strategy === 'fixed') {
    return (
      <Trans
        i18nKey="pricingStructure.price"
        defaults="<bold>{{ price, money }}</bold>"
        values={{ price: pricingStructure.value }}
        components={{ bold: <strong /> }}
      />
    );
  }

  if (pricingStructure.pricing_strategy === 'scheduled_value') {
    const scheduledValue = pricingStructure.value as ScheduledMoneyValue;
    const currentTimespanIndex = findCurrentTimespanIndex(scheduledValue);
    if (currentTimespanIndex === -1) {
      return <>{t('pricingStructure.unavailable')}</>;
    }

    const currentValue = scheduledValue.timespans[currentTimespanIndex].value;
    const nextTimespan = scheduledValue.timespans[currentTimespanIndex + 1];
    if (nextTimespan && nextTimespan.start) {
      const nextValue = nextTimespan.value;
      const nextChange = DateTime.fromISO(nextTimespan.start, { zone: timezoneName });
      return (
        <Trans
          i18nKey="pricingStructure.scheduledValueWithNext"
          defaults="<bold>{{ price, money }}</bold><break/><sm>(<bold>{{ nextPrice, money }}</bold> starting {{ nextChange, dateTimeNamed(format: shortDateTime) }})</sm>"
          values={{ price: currentValue, nextPrice: nextValue, nextChange }}
          components={{ bold: <strong />, sm: <small />, break: <br /> }}
        />
      );
    }
    return (
      <Trans
        i18nKey="pricingStructure.price"
        defaults="<bold>{{ price, money }}</bold>"
        values={{ price: pricingStructure.value }}
        components={{ bold: <strong /> }}
      />
    );
  }

  if (pricingStructure.pricing_strategy === PricingStrategy.PayWhatYouWant) {
    return describePayWhatYouWantValue(pricingStructure.value as PayWhatYouWantValue, t);
  }

  assertNever(pricingStructure.pricing_strategy, true);

  return null;
}

export function describeCurrentPrice(
  pricingStructure: Pick<PricingStructure, 'pricing_strategy' | 'value'> | null | undefined,
  t: TFunction,
): React.ReactNode {
  if (!pricingStructure) {
    return null;
  }

  if (pricingStructure.pricing_strategy === 'fixed') {
    return (
      <Trans
        i18nKey="pricingStructure.price"
        defaults="<bold>{{ price, money }}</bold>"
        values={{ price: pricingStructure.value }}
        components={{ bold: <strong /> }}
      />
    );
  }

  if (pricingStructure.pricing_strategy === 'scheduled_value') {
    const currentValue = findCurrentValue(pricingStructure.value as ScheduledMoneyValue);
    if (currentValue == null) {
      return <>{t('pricingStructure.unavailable')}</>;
    }

    return (
      <Trans
        i18nKey="pricingStructure.price"
        defaults="<bold>{{ price, money }}</bold>"
        values={{ price: currentValue }}
        components={{ bold: <strong /> }}
      />
    );
  }

  if (pricingStructure.pricing_strategy === PricingStrategy.PayWhatYouWant) {
    return (
      <>
        {t('pricingStructure.payWhatYouWant')}(
        {describePayWhatYouWantRange(pricingStructure.value as PayWhatYouWantValue, t)})
      </>
    );
  }

  assertNever(pricingStructure.pricing_strategy, true);

  return null;
}
