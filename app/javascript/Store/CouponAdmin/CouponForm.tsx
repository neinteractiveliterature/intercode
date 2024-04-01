import { useContext, useMemo } from 'react';
import * as React from 'react';
import {
  BootstrapFormInput,
  usePropertySetters,
  MultipleChoiceInput,
  FormGroupWithLabel,
  HelpText,
  parseIntOrNull,
} from '@neinteractiveliterature/litform';

import MoneyInput from '../MoneyInput';
import ProductSelect from '../../BuiltInFormControls/ProductSelect';
import DateTimeInput from '../../BuiltInFormControls/DateTimeInput';
import { AdminCouponFieldsFragment } from './queries.generated';
import { Money } from '../../graphqlTypes.generated';
import AppRootContext from '../../AppRootContext';

const DISCOUNT_MODE_CHOICES = [
  { label: 'Fixed amount discount', value: 'fixed_amount' },
  { label: 'Percent discount', value: 'percent_discount' },
  { label: 'Provide a product', value: 'provides_product' },
] as const;

const DISCOUNT_MODES = DISCOUNT_MODE_CHOICES.map((choice) => choice.value);
type DiscountMode = (typeof DISCOUNT_MODES)[0];

const blankProduct: NonNullable<AdminCouponFieldsFragment['provides_product']> = {
  __typename: 'Product',
  name: '',
  id: '',
};

function buildBlankFixedAmount(currencyCode: string): Money {
  return {
    __typename: 'Money',
    fractional: 0,
    currency_code: currencyCode,
  };
}

function buildBlankPercentDiscount() {
  return '0';
}

function buildBlankProduct(): typeof blankProduct {
  return blankProduct;
}

export type CouponFormProps<T extends Omit<AdminCouponFieldsFragment, 'id'>> = {
  value: T;
  onChange: React.Dispatch<React.SetStateAction<T>>;
};

function CouponForm<T extends Omit<AdminCouponFieldsFragment, 'id'>>({
  value,
  onChange,
}: CouponFormProps<T>): JSX.Element {
  const { defaultCurrencyCode } = useContext(AppRootContext);
  const [setCode, setFixedAmount, setPercentDiscount, setProvidesProduct, setExpiresAt, setUsageLimit] =
    usePropertySetters(
      onChange,
      'code',
      'fixed_amount',
      'percent_discount',
      'provides_product',
      'expires_at',
      'usage_limit',
    );
  const discountMode = useMemo(() => DISCOUNT_MODES.find((mode) => value[mode] != null), [value]);

  const setDiscountMode = <F extends DiscountMode>(newDiscountMode: F) => {
    const discountFields = DISCOUNT_MODES.reduce<Pick<AdminCouponFieldsFragment, DiscountMode>>(
      (fields, mode) => ({ ...fields, [mode]: null }),
      {},
    );
    if (newDiscountMode === 'fixed_amount') {
      discountFields.fixed_amount = buildBlankFixedAmount(defaultCurrencyCode);
    } else if (newDiscountMode === 'percent_discount') {
      discountFields.percent_discount = buildBlankPercentDiscount();
    } else if (newDiscountMode === 'provides_product') {
      discountFields.provides_product = buildBlankProduct();
    }
    onChange((prevValue) => ({ ...prevValue, ...discountFields }));
  };

  return (
    <>
      <BootstrapFormInput
        label="Coupon code"
        value={value.code ?? ''}
        onTextChange={setCode}
        helpText="If you leave this blank, a random coupon code will be generated automatically."
      />

      <MultipleChoiceInput
        caption="Discount mode"
        value={discountMode}
        onChange={setDiscountMode}
        choices={DISCOUNT_MODE_CHOICES}
      />

      {discountMode === 'fixed_amount' && (
        <FormGroupWithLabel label="Fixed discount amount">
          {(id) => (
            <MoneyInput
              id={id}
              value={value.fixed_amount}
              onChange={(newFixedAmount) => {
                setFixedAmount(newFixedAmount ?? buildBlankFixedAmount(defaultCurrencyCode));
              }}
            />
          )}
        </FormGroupWithLabel>
      )}

      {discountMode === 'percent_discount' && (
        <BootstrapFormInput
          label="Percent discount"
          type="number"
          min={0}
          max={100}
          value={value.percent_discount ?? ''}
          onTextChange={setPercentDiscount}
        />
      )}

      {discountMode === 'provides_product' && (
        <FormGroupWithLabel label="Product to provide">
          {(id) => (
            <ProductSelect
              isClearable
              id={id}
              value={value.provides_product}
              isMulti={false}
              onChange={(newProduct) => {
                setProvidesProduct(newProduct ?? buildBlankProduct());
              }}
            />
          )}
        </FormGroupWithLabel>
      )}

      <FormGroupWithLabel label="Expiration date">
        {(id) => (
          <>
            <DateTimeInput id={id} value={value.expires_at} onChange={setExpiresAt} />
            <HelpText>If blank, coupon never expires.</HelpText>
          </>
        )}
      </FormGroupWithLabel>

      <BootstrapFormInput
        label="Usage limit"
        value={value.usage_limit ?? ''}
        type="number"
        onTextChange={(newLimit) => setUsageLimit(parseIntOrNull(newLimit))}
        helpText="If blank, coupon can be used an unlimited number of times."
      />
    </>
  );
}

export default CouponForm;
