import { useMemo, useState } from 'react';
import { ApolloError } from '@apollo/client';
import { LoadingIndicator, ErrorDisplay, parseIntOrNull, FormGroupWithLabel } from '@neinteractiveliterature/litform';

import formatMoney from '../formatMoney';
import sortProductVariants from './sortProductVariants';
import useAsyncFunction from '../useAsyncFunction';
import { CartQueryDocument, useOrderFormProductQuery } from './queries.generated';
import {
  AddOrderEntryToCurrentPendingOrderMutationData,
  useAddOrderEntryToCurrentPendingOrderMutation,
} from './mutations.generated';
import { Money, PricingStrategy } from '../graphqlTypes.generated';
import { LoadQueryWithVariablesWrapper } from '../GraphqlLoadingWrappers';
import { describePayWhatYouWantRange } from './describePricingStructure';
import { Trans, useTranslation } from 'react-i18next';
import MoneyInput from './MoneyInput';
import buildMoneyInput from './buildMoneyInput';

export type ProductOrderFormProps = {
  productId: string;
  onAddedToCart: (
    orderEntry: AddOrderEntryToCurrentPendingOrderMutationData['addOrderEntryToCurrentPendingOrder']['order_entry'],
  ) => void;
  runId?: string;
};

export default LoadQueryWithVariablesWrapper(
  useOrderFormProductQuery,
  ({ productId }: ProductOrderFormProps) => ({ productId }),
  function ProductOrderForm({ data, onAddedToCart, runId }) {
    const { product } = data.convention;
    const [addOrderEntryToCurrentPendingOrder] = useAddOrderEntryToCurrentPendingOrderMutation({
      refetchQueries: [{ query: CartQueryDocument }],
    });
    const { t } = useTranslation();

    const [productVariantId, setProductVariantId] = useState<string>();
    const [quantity, setQuantity] = useState(1);
    const [payWhatYouWantAmount, setPayWhatYouWantAmount] = useState<Money>();
    const [payWhatYouWantAmountForcedKey, setPayWhatYouWantAmountForcedKey] = useState<number>();
    const payWhatYouWantValue =
      product.pricing_structure.value.__typename === 'PayWhatYouWantValue'
        ? product.pricing_structure.value
        : undefined;

    const dataComplete = useMemo(
      () =>
        product.product_variants != null &&
        (product.product_variants.length < 1 || productVariantId != null) &&
        (product.pricing_structure.value.__typename !== 'PayWhatYouWantValue' || payWhatYouWantAmount != null) &&
        quantity > 0,
      [product, productVariantId, quantity, payWhatYouWantAmount],
    );

    const [addToCartClicked, addToCartError, addToCartInProgress] = useAsyncFunction(async () => {
      const result = await addOrderEntryToCurrentPendingOrder({
        variables: {
          productId: product.id,
          productVariantId,
          quantity,
          payWhatYouWantAmount:
            product.pricing_structure.pricing_strategy === PricingStrategy.PayWhatYouWant
              ? buildMoneyInput(payWhatYouWantAmount)
              : undefined,
          runId,
        },
      });
      const orderEntry = result.data?.addOrderEntryToCurrentPendingOrder.order_entry;
      if (orderEntry) {
        onAddedToCart(orderEntry);
      }
      // navigate('/cart');
    });

    const renderVariantSelect = () => {
      if (product.product_variants.length < 1) {
        return null;
      }

      const variants = sortProductVariants(product.product_variants);
      const options = variants.map((variant) => {
        const { id, name, override_pricing_structure: overridePricingStructure } = variant;
        const { price } = product.pricing_structure;
        const overridePrice = overridePricingStructure?.price;

        let overridePriceDescription = '';
        if (overridePrice && price && overridePrice.fractional !== price.fractional) {
          const diff = {
            ...price,
            fractional: overridePrice.fractional - price.fractional,
          };
          const sign = Math.sign(diff.fractional) < 0 ? '-' : '+';
          overridePriceDescription = ` (${sign}${formatMoney(diff)})`;
        }

        return (
          <option key={id} value={id}>
            {name}
            {overridePriceDescription}
          </option>
        );
      });

      return (
        <select
          className="form-select mb-3"
          value={productVariantId ?? ''}
          onChange={(event) => setProductVariantId(event.target.value)}
        >
          <option disabled value="">
            Select...
          </option>
          {options}
        </select>
      );
    };

    const renderQuantity = () => (
      <label className="form-label mb-3 d-flex mb-4 align-items-baseline">
        <div className="me-2">Quantity:</div>
        <input
          type="number"
          min="1"
          className="form-control"
          value={quantity == null ? '' : quantity}
          onChange={(event) => {
            const newQuantity = parseIntOrNull(event.target.value);
            if (newQuantity != null) {
              setQuantity(newQuantity);
            }
          }}
          aria-label="Quantity"
        />
      </label>
    );

    const renderTotalAmount = () => {
      if (product.pricing_structure.value.__typename === 'PayWhatYouWantValue') {
        return (
          <>
            <FormGroupWithLabel
              label={
                <>
                  {t('pricingStructure.selectAmount', 'Amount')} (
                  {describePayWhatYouWantRange(product.pricing_structure.value, t)})
                </>
              }
            >
              {(id) => (
                <div className="d-flex">
                  <MoneyInput
                    id={id}
                    value={payWhatYouWantAmount}
                    onChange={setPayWhatYouWantAmount}
                    key={payWhatYouWantAmountForcedKey}
                  />
                </div>
              )}
            </FormGroupWithLabel>
          </>
        );
      }

      if (!dataComplete || product.pricing_structure.price == null) {
        return null;
      }

      let pricePerItem = product.pricing_structure.price.fractional;
      if (productVariantId) {
        const productVariant = product.product_variants.find((variant) => variant.id === productVariantId);

        if (productVariant?.override_pricing_structure?.price != null) {
          pricePerItem = productVariant.override_pricing_structure.price.fractional;
        }
      }

      const totalPrice: Money = {
        __typename: 'Money',
        fractional: pricePerItem * quantity,
        currency_code: product.pricing_structure.price.currency_code,
      };

      return (
        <p>
          <strong>{t('store.totalPrice', 'Total: {{ totalPrice, money }}', { totalPrice })}</strong>
        </p>
      );
    };

    return (
      <div className="card bg-light">
        <div className="card-body">
          {renderVariantSelect()}
          {!product.provides_ticket_type && renderQuantity()}
          <div>{renderTotalAmount()}</div>
          <div className="mb-2 d-flex">
            {payWhatYouWantValue?.suggested_amount && (
              <button
                type="button"
                className="btn btn-outline-primary me-2"
                onClick={() => {
                  setPayWhatYouWantAmount(payWhatYouWantValue.suggested_amount ?? undefined);
                  // force a re-render on the MoneyInput because it uses an internal string state for the input
                  setPayWhatYouWantAmountForcedKey(new Date().getTime());
                }}
              >
                <Trans
                  i18nKey="payWhatYouWant.useSuggestedAmount"
                  defaults="Use suggested amount (<bold>{{ amount, money }}</bold>)"
                  values={{ amount: payWhatYouWantValue.suggested_amount }}
                  components={{ bold: <strong /> }}
                />
              </button>
            )}
            <button
              type="button"
              className="w-100 btn btn-primary"
              disabled={!dataComplete || addToCartInProgress}
              onClick={addToCartClicked}
            >
              {addToCartInProgress ? (
                <LoadingIndicator iconSet="bootstrap-icons" />
              ) : (
                <i className="bi-cart-plus-fill" />
              )}{' '}
              Add to cart
            </button>
          </div>
          <ErrorDisplay graphQLError={addToCartError as ApolloError} />
        </div>
      </div>
    );
  },
);
