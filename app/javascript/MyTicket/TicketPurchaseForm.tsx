import { useState, useEffect, useContext } from 'react';
import classNames from 'classnames';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';
import capitalize from 'lodash/capitalize';

import AppRootContext from '../AppRootContext';
import Checkmark from '../EventsApp/TeamMemberAdmin/Checkmark';
import usePageTitle from '../usePageTitle';
import { describeUserPricingStructure } from '../Store/describePricingStructure';
import ProductOrderForm from '../Store/ProductOrderForm';
import { TicketPurchaseFormQueryData, useTicketPurchaseFormQuery } from './queries.generated';
import useLoginRequired from '../Authentication/useLoginRequired';

export default LoadQueryWrapper(useTicketPurchaseFormQuery, function TicketPurchaseForm({ data }) {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const availableProducts = data.convention.products;
  const [product, setProduct] = useState<TicketPurchaseFormQueryData['convention']['products'][0]>();
  const [focusedProduct, setFocusedProduct] = useState<TicketPurchaseFormQueryData['convention']['products'][0]>();

  useEffect(() => {
    if (availableProducts.length === 1) {
      setProduct(availableProducts[0]);
    }
  }, [availableProducts]);

  usePageTitle(`Buy a ${data.convention.ticket_name}`);

  const loginRequired = useLoginRequired();

  if (loginRequired) {
    return <></>;
  }

  if (data.convention.my_profile?.ticket) {
    return <Navigate to="/ticket" replace />;
  }

  const renderProductSelect = () => (
    <div
      className={classNames('row g-4 btn-group-toggle justify-content-center', {
        'row-cols-1': availableProducts.length === 1,
        'row-cols-1 row-cols-md-2': availableProducts.length > 1,
      })}
      role="group"
      aria-label={`${capitalize(data.convention.ticket_name)} type`}
    >
      {availableProducts.map((availableProduct) => {
        const { pricing_structure: pricingStructure, id, name: productName } = availableProduct;
        return (
          <div className="col" key={availableProduct.id}>
            <div className={classNames('card h-100', { 'border-primary': product?.id === id })}>
              <div className="card-header" id={`product-label-${id}`}>
                <strong>{productName}</strong>
              </div>
              <div className="card-body">
                <p>{describeUserPricingStructure(pricingStructure, timezoneName, t)}</p>
                {availableProduct.description_html && (
                  <p
                    className="small"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: availableProduct.description_html }}
                  />
                )}
              </div>
              {availableProducts.length > 1 && (
                <div className="card-footer bg-body border-0">
                  <label
                    className={classNames('form-label btn d-block btn-outline-primary mb-0', {
                      active: product?.id === id,
                      focus: focusedProduct?.id === id,
                    })}
                  >
                    <input
                      type="radio"
                      name="product"
                      className="visually-hidden"
                      checked={product?.id === id}
                      onChange={() => setProduct(availableProduct)}
                      onFocus={() => setFocusedProduct(availableProduct)}
                      onBlur={() => setFocusedProduct((prev) => (prev?.id === availableProduct.id ? undefined : prev))}
                      aria-labelledby={`product-label-${id}`}
                    />
                    <div className="d-flex">
                      <div className="flex-grow-1">{t('store.selectProductLabel', 'Select')}</div>
                      <Checkmark value={product?.id === id} className="ms-2" />
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="container-max-md mt-4">
      <div className="card-body">
        <h1 className="mb-4">
          Buy a {data.convention.ticket_name} for {data.convention.name}
        </h1>
        {availableProducts.length > 1 && <p className="lead">Please select a {data.convention.ticket_name} type:</p>}
        {renderProductSelect()}
        {product && (
          <div className="mt-4">
            <ProductOrderForm productId={product.id} />
          </div>
        )}
      </div>
    </div>
  );
});
