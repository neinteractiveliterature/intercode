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
import { useTranslation } from 'react-i18next';

const DISCOUNT_MODES = ['fixed_amount', 'percent_discount', 'provides_product'] as const;
type DiscountMode = (typeof DISCOUNT_MODES)[number];

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
}: CouponFormProps<T>): React.JSX.Element {
  const { t } = useTranslation();
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
        label={t('admin.store.coupons.code.label')}
        value={value.code ?? ''}
        onTextChange={setCode}
        helpText={t('admin.store.coupons.code.helpText')}
      />

      <MultipleChoiceInput
        caption={t('admin.store.coupons.discountMode.label')}
        value={discountMode}
        onChange={setDiscountMode}
        choices={DISCOUNT_MODES.map((mode) => ({
          label: t(`admin.store.coupons.discountMode.${mode}`),
          value: mode,
        }))}
      />

      {discountMode === 'fixed_amount' && (
        <FormGroupWithLabel label={t('admin.store.coupons.discountMode.fixed_amount')}>
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
          label={t('admin.store.coupons.discountMode.percent_discount')}
          type="number"
          min={0}
          max={100}
          value={value.percent_discount ?? ''}
          onTextChange={setPercentDiscount}
        />
      )}

      {discountMode === 'provides_product' && (
        <FormGroupWithLabel label={t('admin.store.coupons.providesProduct.label')}>
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

      <FormGroupWithLabel label={t('admin.store.coupons.expirationDate.label')}>
        {(id) => (
          <>
            <DateTimeInput id={id} value={value.expires_at} onChange={setExpiresAt} />
            <HelpText>{t('admin.store.coupons.expirationDate.helpText')}</HelpText>
          </>
        )}
      </FormGroupWithLabel>

      <BootstrapFormInput
        label={t('admin.store.coupons.usageLimit.label')}
        value={value.usage_limit ?? ''}
        type="number"
        onTextChange={(newLimit) => setUsageLimit(parseIntOrNull(newLimit))}
        helpText={t('admin.store.coupons.usageLimit.helpText')}
      />
    </>
  );
}

export default CouponForm;
