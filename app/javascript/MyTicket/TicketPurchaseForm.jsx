import React, { useState, useEffect, useContext } from 'react';
import classNames from 'classnames';
import { Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { capitalize } from 'inflected';

import AppRootContext from '../AppRootContext';
import ErrorDisplay from '../ErrorDisplay';
import { TicketPurchaseFormQuery } from './queries.gql';
import Checkmark from '../EventsApp/TeamMemberAdmin/Checkmark';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import PageLoadingIndicator from '../PageLoadingIndicator';
import { describeUserPricingStructure } from '../Store/describePricingStructure';
import ProductOrderForm from '../Store/ProductOrderForm';

function TicketPurchaseForm() {
  const { timezoneName } = useContext(AppRootContext);
  const { data, loading, error: queryError } = useQuery(TicketPurchaseFormQuery);
  const availableProducts = (queryError || loading ? [] : data.convention.products);
  const [product, setProduct] = useState(null);

  useEffect(
    () => {
      if (!loading) {
        if (availableProducts.length === 1) {
          setProduct(availableProducts[0]);
        }
      }
    },
    [availableProducts, loading],
  );

  usePageTitle(useValueUnless(() => `Buy a ${data.convention.ticket_name}`, queryError || loading));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (queryError) {
    return <ErrorDisplay graphQLError={queryError} />;
  }

  if (data.myProfile && data.myProfile.ticket) {
    return <Redirect to="/" />;
  }

  const renderProductSelect = () => (
    <div className="btn-group-vertical btn-group-toggle w-100" role="group" aria-label={`${capitalize(data.convention.ticket_name)} type`}>
      {availableProducts.map((availableProduct) => {
        const { pricing_structure: pricingStructure, id, name: productName } = availableProduct;
        return (
          <label
            className={classNames(
              'btn text-left btn-outline-primary',
              {
                active: product?.id === id,
              },
            )}
            onClick={() => { setProduct(availableProduct); }}
          >
            <input
              type="radio"
              name="product"
              checked={product?.id === id}
              onChange={() => { setProduct(availableProduct); }}
              aria-labelledby={`product-label-${id}`}
            />
            <div className="d-flex align-items-center" id={`product-label-${id}`}>
              <div className="flex-grow-1">
                <strong>{productName}</strong>
                {' '}
                &mdash;
                {' '}
                {describeUserPricingStructure(pricingStructure, timezoneName)}
              </div>
              <Checkmark value={(product || {}).id === id} className="ml-2" />
            </div>
          </label>
        );
      })}
    </div>
  );

  return (
    <>
      <h1 className="mb-4">
        Buy a
        {' '}
        {data.convention.ticket_name}
        {' '}
        for
        {' '}
        {data.convention.name}
      </h1>
      {renderProductSelect()}
      {product && (
        <div className="mt-4">
          <ProductOrderForm productId={product.id} />
        </div>
      )}
    </>
  );
}

export default TicketPurchaseForm;
