import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { AddOrderEntryToCurrentPendingOrder } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import formatMoney from '../formatMoney';
import LoadingIndicator from '../LoadingIndicator';
import { OrderFormProductQuery } from './queries.gql';
import { useMutator, Transforms } from '../ComposableFormUtils';
import sortProductVariants from './sortProductVariants';
import useQuerySuspended from '../useQuerySuspended';
import useMutationCallback from '../useMutationCallback';
import useAsyncFunction from '../useAsyncFunction';

function ProductOrderForm({ productId, cartUrl }) {
  const { data, error } = useQuerySuspended(OrderFormProductQuery, { variables: { productId } });
  const addOrderEntryToCurrentPendingOrder = useMutationCallback(
    AddOrderEntryToCurrentPendingOrder,
  );

  const [{ productVariantId, quantity }, formMutator] = useMutator(
    { productVariantId: null, quantity: 1 },
    {
      productVariantId: Transforms.inputChange(Transforms.integer),
      quantity: Transforms.inputChange(Transforms.integer),
    },
  );

  const dataComplete = useMemo(
    () => (
      !error
      && (
        data.product.product_variants.length < 1
        || productVariantId != null
      )
      && quantity > 0
    ),
    [data, error, productVariantId, quantity],
  );

  const [addToCartClicked, addToCartError, addToCartInProgress] = useAsyncFunction(async () => {
    await addOrderEntryToCurrentPendingOrder({
      variables: { productId, productVariantId, quantity },
    });
    window.location.href = cartUrl;
  });

  const renderVariantSelect = () => {
    if (data.product.product_variants.length < 1) {
      return null;
    }

    const variants = sortProductVariants(data.product.product_variants);
    const options = variants.map((variant) => {
      const { id, name, override_price: overridePrice } = variant;

      let overridePriceDescription = '';
      if (overridePrice && overridePrice.fractional !== data.product.price.fractional) {
        const diff = overridePrice.fractional - data.product.price.fractional;
        const sign = Math.sign(diff) < 0 ? '-' : '+';
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
        className="form-control mb-3"
        value={productVariantId || ''}
        onChange={formMutator.productVariantId}
      >
        <option disabled value="">Select...</option>
        {options}
      </select>
    );
  };

  const renderQuantity = () => (
    <label className="form-group d-flex mb-4 align-items-baseline">
      <div className="mr-2">Quantity:</div>
      <input
        type="number"
        min="1"
        className="form-control"
        value={quantity == null ? '' : quantity}
        onChange={formMutator.quantity}
      />
    </label>
  );

  const renderTotalAmount = () => {
    if (!dataComplete) {
      return null;
    }

    let pricePerItem = data.product.price.fractional;
    if (productVariantId) {
      const productVariant = data.product.product_variants
        .find(variant => variant.id === productVariantId);

      if (productVariant.override_price != null) {
        pricePerItem = productVariant.override_price.fractional;
      }
    }

    const totalPrice = {
      fractional: pricePerItem * quantity,
      currency_code: data.product.price.currency_code,
    };

    return (
      <strong>
        Total:
        {formatMoney(totalPrice)}
      </strong>
    );
  };

  return (
    <div className="card bg-light">
      <div className="card-body">
        {renderVariantSelect()}
        {renderQuantity()}
        <div className="row align-items-baseline">
          <div className="col-6">
            {renderTotalAmount()}
          </div>
          <div className="col-6 mb-2">
            <button
              type="button"
              className="w-100 btn btn-primary"
              disabled={!dataComplete || addToCartInProgress}
              onClick={addToCartClicked}
            >
              {
                addToCartInProgress
                  ? (<LoadingIndicator />)
                  : (<i className="fa fa-shopping-cart" />)
              }
              {' '}
              Add to cart
            </button>
          </div>
        </div>
        <ErrorDisplay graphQLError={addToCartError} />
      </div>
    </div>
  );
}

ProductOrderForm.propTypes = {
  productId: PropTypes.number.isRequired,
  cartUrl: PropTypes.string.isRequired,
};

export default ProductOrderForm;
