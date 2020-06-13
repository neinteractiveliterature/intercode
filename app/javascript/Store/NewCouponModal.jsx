import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import useStatePropertyUpdater from '../useStatePropertyUpdater';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import MoneyInput from './MoneyInput';
import FormGroupWithLabel from '../BuiltInFormControls/FormGroupWithLabel';
import ProductSelect from '../BuiltInFormControls/ProductSelect';

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
        value={value.code}
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
    </>
  );
}

function NewCouponModal({ visible, close }) {
  const [coupon, setCoupon] = useState({
    code: '',
    fixed_amount: null,
    percent_discount: null,
    provides_product: null,
    usage_limit: null,
    expires_at: null,
  });

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">New coupon</div>
      <div className="modal-body">
        <CouponForm value={coupon} onChange={setCoupon} />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
      </div>
    </Modal>
  );
}

NewCouponModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default NewCouponModal;
