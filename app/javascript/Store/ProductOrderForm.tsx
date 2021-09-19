import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import {
  LoadingIndicator,
  ErrorDisplay,
  parseIntOrNull,
  PageLoadingIndicator,
} from '@neinteractiveliterature/litform';

import { CartQuery } from './queries';
import formatMoney from '../formatMoney';
import sortProductVariants from './sortProductVariants';
import useAsyncFunction from '../useAsyncFunction';
import { useOrderFormProductQuery } from './queries.generated';
import { useAddOrderEntryToCurrentPendingOrderMutation } from './mutations.generated';
import { Money } from '../graphqlTypes.generated';

export type ProductOrderFormProps = {
  productId: number;
};

function ProductOrderForm({ productId }: ProductOrderFormProps) {
  const history = useHistory();
  const { data, loading, error } = useOrderFormProductQuery({ variables: { productId } });
  const [addOrderEntryToCurrentPendingOrder] = useAddOrderEntryToCurrentPendingOrderMutation({
    refetchQueries: [{ query: CartQuery }],
  });

  const [productVariantId, setProductVariantId] = useState<number>();
  const [quantity, setQuantity] = useState(1);

  const dataComplete = useMemo(
    () =>
      !error &&
      !loading &&
      data?.product.product_variants != null &&
      (data.product.product_variants.length < 1 || productVariantId != null) &&
      quantity > 0,
    [data, error, loading, productVariantId, quantity],
  );

  const [addToCartClicked, addToCartError, addToCartInProgress] = useAsyncFunction(async () => {
    await addOrderEntryToCurrentPendingOrder({
      variables: { productId, productVariantId, quantity },
    });
    history.push('/cart');
  });

  if (loading) {
    return <LoadingIndicator iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  const { product } = data!;

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
        onChange={(event) => setProductVariantId(parseIntOrNull(event.target.value) ?? undefined)}
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
    if (!dataComplete || product.pricing_structure.price == null) {
      return null;
    }

    let pricePerItem = product.pricing_structure.price.fractional;
    if (productVariantId) {
      const productVariant = product.product_variants.find(
        (variant) => variant.id === productVariantId,
      );

      if (productVariant?.override_pricing_structure?.price != null) {
        pricePerItem = productVariant.override_pricing_structure.price.fractional;
      }
    }

    const totalPrice: Money = {
      __typename: 'Money',
      fractional: pricePerItem * quantity,
      currency_code: product.pricing_structure.price.currency_code,
    };

    return <strong>Total: {formatMoney(totalPrice)}</strong>;
  };

  return (
    <div className="card bg-light">
      <div className="card-body">
        {renderVariantSelect()}
        {!product.provides_ticket_type && renderQuantity()}
        <div className="row align-items-baseline">
          <div className="col-6">{renderTotalAmount()}</div>
          <div className="col-6 mb-2">
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
        </div>
        <ErrorDisplay graphQLError={addToCartError as ApolloError} />
      </div>
    </div>
  );
}

export default ProductOrderForm;
