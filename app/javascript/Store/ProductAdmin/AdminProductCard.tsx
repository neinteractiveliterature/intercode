import classNames from 'classnames';
import { ErrorDisplay, useConfirm } from '@neinteractiveliterature/litform';

import AdminProductVariantsTable from './AdminProductVariantsTable';
import { EditingProductWithRealId } from './EditingProductTypes';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { useFetcher } from 'react-router-dom';
import { AdminPricingStructureDescription } from 'Store/describePricingStructure';
import { AdminProductsQueryData } from './queries.generated';

export type AdminProductCardProps = {
  currentAbility: AdminProductsQueryData['currentAbility'];
  startEditing: () => void;
  product: EditingProductWithRealId;
};

function describePaymentOption(paymentOption: string, t: TFunction): string {
  if (paymentOption === 'stripe') {
    return t('admin.store.paymentOptions.stripe');
  }

  if (paymentOption === 'pay_at_convention') {
    return t('admin.store.paymentOptions.payAtConvention');
  }

  return paymentOption;
}

function AdminProductCard({ currentAbility, startEditing, product }: AdminProductCardProps): JSX.Element {
  const confirm = useConfirm();
  const { t } = useTranslation();
  const fetcher = useFetcher();

  const deleteClicked = () => {
    confirm({
      prompt: t('admin.store.products.deleteConfirmation', { productName: product.name }),
      action: () => fetcher.submit({}, { method: 'DELETE', action: `/admin_store/products/${product.id}` }),
      renderError: (error) => <ErrorDisplay graphQLError={error} />,
    });
  };

  return (
    <div className="mb-4 card bg-light" id={`product-${product.id}`}>
      <div className="card-header">
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">
            <div className="lead">{product.name}</div>
          </div>
          <div className="ms-2">
            {currentAbility.can_update_products && (
              <ul className="list-inline m-0">
                {product.id != null && (
                  <li className="list-inline-item">
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={deleteClicked}
                      aria-label={t('admin.store.products.deleteLabel')}
                    >
                      <i className="bi-trash" />
                    </button>
                  </li>
                )}
                <li className="list-inline-item">
                  <button type="button" className="btn btn-sm btn-secondary" onClick={startEditing}>
                    {t('buttons.edit')}
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
        <div>
          <span className={classNames('badge', product.available ? 'bg-success' : 'bg-danger')}>
            {product.available ? t('admin.store.products.available') : t('admin.store.products.unavailable')}
          </span>
          {product.payment_options.map((paymentOption) => (
            <i
              key={paymentOption}
              className={classNames('ms-2', {
                'bi-credit-card': paymentOption === 'stripe',
                'bi-briefcase-fill': paymentOption === 'pay_at_convention',
              })}
              title={describePaymentOption(paymentOption, t)}
            />
          ))}
        </div>
        {product.provides_ticket_type && (
          <div>
            <i className="bi-person-badge-fill" /> {product.provides_ticket_type.description}
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="d-lg-flex justify-content-lg-start align-items-lg-start">
          {product.image && <img src={product.image.url} style={{ maxWidth: '200px' }} alt={product.name} />}

          <div className="ml-lg-4 col-lg">
            <p>
              <strong>{t('admin.store.products.basePrice')}</strong>{' '}
              <AdminPricingStructureDescription pricingStructure={product.pricing_structure} />
            </p>
            {}
            <div dangerouslySetInnerHTML={{ __html: product.description_html ?? '' }} />
            <AdminProductVariantsTable product={product} editing={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProductCard;
