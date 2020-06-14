import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import useStatePropertyUpdater from '../../useStatePropertyUpdater';
import MultipleChoiceInput from '../../BuiltInFormControls/MultipleChoiceInput';
import MoneyInput from '../MoneyInput';
import FormGroupWithLabel from '../../BuiltInFormControls/FormGroupWithLabel';
import ProductSelect from '../../BuiltInFormControls/ProductSelect';
import DateTimeInput from '../../BuiltInFormControls/DateTimeInput';
import HelpText from '../../BuiltInFormControls/HelpText';
import { parseIntOrNull } from '../../ComposableFormUtils';

const DISCOUNT_MODE_CHOICES = [
  { label: 'Fixed amount discount', value: 'fixed_amount' },
  { label: 'Percent discount', value: 'percent_discount' },
  { label: 'Provide a product', value: 'provides_product' },
];

const DISCOUNT_MODES = DISCOUNT_MODE_CHOICES.map((choice) => choice.value);

const BLANK_VALUES = {
  fixed_amount: {
    fractional: 0,
    currency_code: 'USD',
  },
  percent_discount: 0.0,
  provides_product: {},
};

function CouponForm({ value, onChange }) {
  const setCouponField = useStatePropertyUpdater(onChange);
  const discountMode = useMemo(
    () => DISCOUNT_MODES.find((mode) => value[mode] != null),
    [value],
  );

  const setDiscountMode = (newDiscountMode) => {
    const discountFields = DISCOUNT_MODES.reduce(
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
        value={value.code || ''}
        onTextChange={setCouponField('code')}
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
                setCouponField('fixed_amount')(newFixedAmount ?? BLANK_VALUES.fixed_amount);
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
          value={value.percent_discount.toString()}
          onTextChange={setCouponField('percent_discount')}
        />
      )}

      {discountMode === 'provides_product' && (
        <FormGroupWithLabel label="Product to provide">
          {(id) => (
            <ProductSelect
              isClearable
              id={id}
              value={value.provides_product}
              onChange={(newProduct) => {
                setCouponField('provides_product')(newProduct ?? BLANK_VALUES.provides_product);
              }}
            />
          )}
        </FormGroupWithLabel>
      )}

      <FormGroupWithLabel label="Expiration date">
        {(id) => (
          <>
            <DateTimeInput
              id={id}
              value={value.expires_at}
              onChange={setCouponField('expires_at')}
            />
            <HelpText>If blank, coupon never expires.</HelpText>
          </>
        )}
      </FormGroupWithLabel>

      <BootstrapFormInput
        label="Usage limit"
        value={value.usage_limit || ''}
        type="number"
        onTextChange={(newLimit) => setCouponField('usage_limit')(parseIntOrNull(newLimit))}
        helpText="If blank, coupon can be used an unlimited number of times."
      />
    </>
  );
}

CouponForm.propTypes = {
  value: PropTypes.shape({
    code: PropTypes.string,
    fixed_amount: PropTypes.shape({}),
    percent_discount: PropTypes.number,
    provides_product: PropTypes.shape({}),
    expires_at: PropTypes.string,
    usage_limit: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CouponForm;
