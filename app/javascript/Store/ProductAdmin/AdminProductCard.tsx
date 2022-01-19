import classNames from 'classnames';
import { ErrorDisplay, useConfirm } from '@neinteractiveliterature/litform';

import AdminProductVariantsTable from './AdminProductVariantsTable';
import { describeAdminPricingStructure } from '../describePricingStructure';
import { useDeleteProductMutation } from '../mutations.generated';
import { AdminProductsQueryData, AdminProductsQueryDocument } from '../queries.generated';
import { EditingProductWithRealId } from './EditingProductTypes';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

export type AdminProductCardProps = {
  currentAbility: AdminProductsQueryData['currentAbility'];
  startEditing: () => void;
  product: EditingProductWithRealId;
};

function describePaymentOption(paymentOption: string, t: TFunction): string {
  if (paymentOption === 'stripe') {
    return t('admin.store.paymentOptions.stripe', 'Stripe');
  }

  if (paymentOption === 'pay_at_convention') {
    return t('admin.store.paymentOptions.payAtConvention', 'Pay at convention');
  }

  return paymentOption;
}

function AdminProductCard({ currentAbility, startEditing, product }: AdminProductCardProps): JSX.Element {
  const confirm = useConfirm();
  const [deleteProduct] = useDeleteProductMutation();
  const { t } = useTranslation();

  const deleteClicked = () => {
    confirm({
      prompt: t(
        'admin.store.products.deleteConfirmation',
        'Are you sure you want to delete the product {{ productName }}?',
        { productName: product.name },
      ),
      action: () =>
        deleteProduct({
          variables: { id: product.id },
          update: (cache) => {
            const data = cache.readQuery<AdminProductsQueryData>({ query: AdminProductsQueryDocument });
            if (!data) {
              return;
            }

            cache.writeQuery<AdminProductsQueryData>({
              query: AdminProductsQueryDocument,
              data: {
                ...data,
                convention: {
                  ...data.convention,
                  products: data.convention.products.filter((p) => p.id !== product.id),
                },
              },
            });
          },
        }),
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
                    <button type="button" className="btn btn-sm btn-danger" onClick={deleteClicked}>
                      <i className="bi-trash">
                        <span className="visually-hidden">
                          {t('admin.store.products.deleteLabel', 'Delete product')}
                        </span>
                      </i>
                    </button>
                  </li>
                )}
                <li className="list-inline-item">
                  <button type="button" className="btn btn-sm btn-secondary" onClick={startEditing}>
                    {t('buttons.edit', 'Edit')}
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
        <div>
          <span className={classNames('badge', product.available ? 'bg-success' : 'bg-danger')}>
            {product.available
              ? t('admin.store.products.available', 'Available for purchase')
              : t('admin.store.products.unavailable', 'Not available for purchase')}
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
              <strong>Base price: {describeAdminPricingStructure(product.pricing_structure, t)}</strong>
            </p>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: product.description_html ?? '' }} />
            <AdminProductVariantsTable product={product} editing={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProductCard;
