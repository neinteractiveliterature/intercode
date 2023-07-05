import { useState, useEffect, useContext } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import capitalize from 'lodash/capitalize';

import AppRootContext from '../AppRootContext';
import Checkmark from '../EventsApp/TeamMemberAdmin/Checkmark';
import { describeUserPricingStructure } from '../Store/describePricingStructure';
import ProductOrderForm, { ProductOrderFormProps } from '../Store/ProductOrderForm';
import { PricingStructure, Product, Run } from '../graphqlTypes.generated';

export type TicketPurchaseFormProps = {
  availableProducts: (Pick<Product, 'id' | 'name' | 'description_html'> & {
    pricing_structure: Pick<PricingStructure, 'pricing_strategy' | 'value'>;
  })[];
  run?: Pick<Run, 'id'>;
  onAddedToCart: ProductOrderFormProps['onAddedToCart'];
};

export default function TicketPurchaseForm({ availableProducts, onAddedToCart, run }: TicketPurchaseFormProps) {
  const { t } = useTranslation();
  const { timezoneName, ticketName } = useContext(AppRootContext);
  const [product, setProduct] = useState<TicketPurchaseFormProps['availableProducts'][number]>();
  const [focusedProduct, setFocusedProduct] = useState<TicketPurchaseFormProps['availableProducts'][number]>();

  useEffect(() => {
    if (availableProducts.length === 1) {
      setProduct(availableProducts[0]);
    }
  }, [availableProducts]);

  const renderProductSelect = () => (
    <div
      className={classNames('row g-4 btn-group-toggle justify-content-center', {
        'row-cols-1': availableProducts.length === 1,
        'row-cols-1 row-cols-md-2': availableProducts.length > 1,
      })}
      role="group"
      aria-label={`${capitalize(ticketName)} type`}
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
    <>
      {availableProducts.length > 1 && <p className="lead">Please select a {ticketName} type:</p>}
      {renderProductSelect()}
      {product && (
        <div className="mt-4">
          <ProductOrderForm runId={run?.id} productId={product.id} onAddedToCart={onAddedToCart} />
        </div>
      )}
    </>
  );
}
