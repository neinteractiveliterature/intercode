import React, { useMemo } from 'react';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import { usePartialState, usePartialStateFactory } from '../../usePartialState';
import MultipleChoiceInput from '../../BuiltInFormControls/MultipleChoiceInput';
import MoneyInput from '../MoneyInput';
import FormGroupWithLabel from '../../BuiltInFormControls/FormGroupWithLabel';
import ProductSelect from '../../BuiltInFormControls/ProductSelect';
import DateTimeInput from '../../BuiltInFormControls/DateTimeInput';
import HelpText from '../../BuiltInFormControls/HelpText';
import { parseIntOrNull } from '../../ComposableFormUtils';
import { AdminCouponFieldsFragment } from './queries.generated';

const DISCOUNT_MODE_CHOICES = [
  { label: 'Fixed amount discount', value: 'fixed_amount' },
  { label: 'Percent discount', value: 'percent_discount' },
  { label: 'Provide a product', value: 'provides_product' },
] as const;

const DISCOUNT_MODES = DISCOUNT_MODE_CHOICES.map((choice) => choice.value);
type DiscountMode = typeof DISCOUNT_MODES[0];

const blankProduct: NonNullable<AdminCouponFieldsFragment['provides_product']> = {
  __typename: 'Product',
  name: '',
};

const BLANK_VALUES: {
  fixed_amount: NonNullable<AdminCouponFieldsFragment['fixed_amount']>;
  percent_discount: NonNullable<AdminCouponFieldsFragment['percent_discount']>;
  provides_product: NonNullable<AdminCouponFieldsFragment['provides_product']>;
} = {
  fixed_amount: {
    __typename: 'Money',
    fractional: 0,
    currency_code: 'USD',
  },
  percent_discount: '0',
  provides_product: blankProduct,
} as const;

export type CouponFormProps<T extends Omit<AdminCouponFieldsFragment, 'id'>> = {
  value: T;
  onChange: React.Dispatch<React.SetStateAction<T>>;
};

function CouponForm<T extends Omit<AdminCouponFieldsFragment, 'id'>>({
  value,
  onChange,
}: CouponFormProps<T>) {
  const factory = usePartialStateFactory(value, onChange);
  const [code, setCode] = usePartialState(factory, 'code');
  const [fixedAmount, setFixedAmount] = usePartialState(factory, 'fixed_amount');
  const [percentDiscount, setPercentDiscount] = usePartialState(factory, 'percent_discount');
  const [providesProduct, setProvidesProduct] = usePartialState(factory, 'provides_product');
  const [expiresAt, setExpiresAt] = usePartialState(factory, 'expires_at');
  const [usageLimit, setUsageLimit] = usePartialState(factory, 'usage_limit');
  const discountMode = useMemo(() => DISCOUNT_MODES.find((mode) => value[mode] != null), [value]);

  const setDiscountMode = <F extends DiscountMode>(newDiscountMode: F) => {
    const discountFields = DISCOUNT_MODES.reduce<Pick<AdminCouponFieldsFragment, DiscountMode>>(
      (fields, mode) => ({ ...fields, [mode]: null }),
      {},
    );
    discountFields[newDiscountMode] = BLANK_VALUES[newDiscountMode];
    onChange((prevValue) => ({ ...prevValue, ...discountFields }));
  };

  return (
    <>
      <BootstrapFormInput
        label="Coupon code"
        value={code ?? ''}
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
              value={fixedAmount}
              onChange={(newFixedAmount) => {
                setFixedAmount(newFixedAmount ?? BLANK_VALUES.fixed_amount);
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
          value={percentDiscount ?? ''}
          onTextChange={setPercentDiscount}
        />
      )}

      {discountMode === 'provides_product' && (
        <FormGroupWithLabel label="Product to provide">
          {(id) => (
            <ProductSelect
              isClearable
              id={id}
              value={providesProduct}
              onChange={(newProduct: typeof providesProduct) => {
                setProvidesProduct(newProduct ?? BLANK_VALUES.provides_product);
              }}
            />
          )}
        </FormGroupWithLabel>
      )}

      <FormGroupWithLabel label="Expiration date">
        {(id) => (
          <>
            <DateTimeInput id={id} value={expiresAt} onChange={setExpiresAt} />
            <HelpText>If blank, coupon never expires.</HelpText>
          </>
        )}
      </FormGroupWithLabel>

      <BootstrapFormInput
        label="Usage limit"
        value={usageLimit ?? ''}
        type="number"
        onTextChange={(newLimit) => setUsageLimit(parseIntOrNull(newLimit))}
        helpText="If blank, coupon can be used an unlimited number of times."
      />
    </>
  );
}

export default CouponForm;
