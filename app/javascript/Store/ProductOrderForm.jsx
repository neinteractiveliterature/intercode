import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { AddOrderEntryToCurrentPendingOrder } from './mutations.gql';
import { CartQuery, OrderFormProductQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import formatMoney from '../formatMoney';
import LoadingIndicator from '../LoadingIndicator';
import { Transforms, useTransformedState } from '../ComposableFormUtils';
import sortProductVariants from './sortProductVariants';
import useAsyncFunction from '../useAsyncFunction';
import PageLoadingIndicator from '../PageLoadingIndicator';

function ProductOrderForm({ productId }) {
  const history = useHistory();
  const { data, loading, error } = useQuery(OrderFormProductQuery, { variables: { productId } });
  const [addOrderEntryToCurrentPendingOrder] = useMutation(
    AddOrderEntryToCurrentPendingOrder,
    { refetchQueries: [{ query: CartQuery }] },
  );

  const [productVariantId, productVariantIdChanged] = useTransformedState(null, Transforms.integer);
  const [quantity, quantityChanged] = useTransformedState(1, Transforms.integer);

  const dataComplete = useMemo(
    () => (
      !error && !loading
      && (
        data.product.product_variants.length < 1
        || productVariantId != null
      )
      && quantity > 0
    ),
    [data, error, loading, productVariantId, quantity],
  );

  const [addToCartClicked, addToCartError, addToCartInProgress] = useAsyncFunction(async () => {
    await addOrderEntryToCurrentPendingOrder({
      variables: { productId, productVariantId, quantity },
    });
    history.push('/cart');
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <PageLoadingIndicator visible />;
  }

  const renderVariantSelect = () => {
    if (data.product.product_variants.length < 1) {
      return null;
    }

    const variants = sortProductVariants(data.product.product_variants);
    const options = variants.map((variant) => {
      const { id, name, override_pricing_structure: overridePricingStructure } = variant;
      const { price } = data.product.pricing_structure;
      const overridePrice = overridePricingStructure?.price;

      let overridePriceDescription = '';
      if (overridePrice && overridePrice.fractional !== price.fractional) {
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
        className="form-control mb-3"
        value={productVariantId || ''}
        onChange={(event) => productVariantIdChanged(event.target.value)}
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
        onChange={(event) => quantityChanged(event.target.value)}
        aria-label="Quantity"
      />
    </label>
  );

  const renderTotalAmount = () => {
    if (!dataComplete) {
      return null;
    }

    let pricePerItem = data.product.pricing_structure.price.fractional;
    if (productVariantId) {
      const productVariant = data.product.product_variants
        .find((variant) => variant.id === productVariantId);

      if (productVariant.override_pricing_structure != null) {
        pricePerItem = productVariant.override_pricing_structure.price.fractional;
      }
    }

    const totalPrice = {
      fractional: pricePerItem * quantity,
      currency_code: data.product.pricing_structure.price.currency_code,
    };

    return (
      <strong>
        Total:
        {' '}
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
};

export default ProductOrderForm;
