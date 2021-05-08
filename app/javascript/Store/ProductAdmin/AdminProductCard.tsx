import classNames from 'classnames';
import { humanize } from 'inflected';

import { AdminProductsQuery } from '../queries';
import AdminProductVariantsTable from './AdminProductVariantsTable';
import ErrorDisplay from '../../ErrorDisplay';
import { useConfirm } from '../../ModalDialogs/Confirm';
import { describeAdminPricingStructure } from '../describePricingStructure';
import { useDeleteProductMutation } from '../mutations.generated';
import { AdminProductsQueryData } from '../queries.generated';
import { EditingProductWithRealId } from './EditingProductTypes';

export type AdminProductCardProps = {
  currentAbility: AdminProductsQueryData['currentAbility'];
  startEditing: () => void;
  product: EditingProductWithRealId;
};

function AdminProductCard({ currentAbility, startEditing, product }: AdminProductCardProps) {
  const confirm = useConfirm();
  const [deleteProduct] = useDeleteProductMutation();

  const deleteClicked = () => {
    confirm({
      prompt: `Are you sure you want to delete the product ${product.name}?`,
      action: () =>
        deleteProduct({
          variables: { id: product.id },
          update: (cache) => {
            const data = cache.readQuery<AdminProductsQueryData>({ query: AdminProductsQuery });
            if (!data) {
              return;
            }

            cache.writeQuery({
              query: AdminProductsQuery,
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
        <div className="row align-items-center">
          <div className="col">
            <div className="lead">{product.name}</div>
          </div>
          <div className="me-2">
            {currentAbility.can_update_products && (
              <ul className="list-inline m-0">
                {product.id != null && (
                  <li className="list-inline-item">
                    <button type="button" className="btn btn-sm btn-danger" onClick={deleteClicked}>
                      <i className="fa fa-trash-o">
                        <span className="visually-hidden">Delete product</span>
                      </i>
                    </button>
                  </li>
                )}
                <li className="list-inline-item">
                  <button type="button" className="btn btn-sm btn-secondary" onClick={startEditing}>
                    Edit
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
        <div>
          <span className={classNames('badge', product.available ? 'bg-success' : 'bg-danger')}>
            {product.available ? 'Available for purchase' : 'Not available for purchase'}
          </span>
          {product.payment_options.map((paymentOption) => (
            <i
              key={paymentOption}
              className={classNames('ms-2', 'fa', {
                'fa-cc-stripe': paymentOption === 'stripe',
                'fa-suitcase': paymentOption === 'pay_at_convention',
              })}
              title={humanize(paymentOption)}
            />
          ))}
        </div>
        {product.provides_ticket_type && (
          <div>
            <i className="fa fa-ticket" /> {product.provides_ticket_type.description}
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="d-lg-flex justify-content-lg-start align-items-lg-start">
          {product.image_url && (
            <img src={product.image_url} style={{ maxWidth: '200px' }} alt={product.name} />
          )}

          <div className="ml-lg-4 col-lg">
            <p>
              <strong>
                Base price: {describeAdminPricingStructure(product.pricing_structure)}
              </strong>
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
