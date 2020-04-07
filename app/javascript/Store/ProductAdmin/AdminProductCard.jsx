import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { humanize } from 'inflected';

import { useMutation } from '@apollo/react-hooks';
import { AdminProductsQuery } from '../queries.gql';
import AdminProductVariantsTable from '../AdminProductVariantsTable';
import { DeleteProduct } from '../mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { useConfirm } from '../../ModalDialogs/Confirm';
import { describeAdminPricingStructure } from '../describePricingStructure';

function AdminProductCard({ currentAbility, startEditing, product }) {
  const confirm = useConfirm();
  const [deleteProduct] = useMutation(DeleteProduct);

  const deleteClicked = () => {
    confirm({
      prompt: `Are you sure you want to delete the product ${product.name}?`,
      action: () => deleteProduct({
        variables: { id: product.id },
        update: (cache) => {
          const data = cache.readQuery({ query: AdminProductsQuery });
          data.convention.products = data.convention.products
            .filter((p) => p.id !== product.id);
          cache.writeQuery({ query: AdminProductsQuery, data });
        },
      }),
      renderError: (error) => <ErrorDisplay graphQLError={error} />,
    });
  };

  return (
    <div className="mb-4 card bg-light">
      <div className="card-header">
        <div className="row align-items-center">
          <div className="col">
            <div className="lead">{product.name}</div>
          </div>
          <div className="mr-2">
            {currentAbility.can_update_products && (
              <ul className="list-inline m-0">
                {product.id != null && (
                  <li className="list-inline-item">
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={deleteClicked}
                    >
                      <i className="fa fa-trash-o">
                        <span className="sr-only">Delete product</span>
                      </i>
                    </button>
                  </li>
                )}
                <li className="list-inline-item">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={startEditing}
                  >
                    Edit
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
        <div>
          <span
            className={classNames('badge', product.available ? 'badge-success' : 'badge-danger')}
          >
            {product.available
              ? 'Available for purchase'
              : 'Not available for purchase'}
          </span>
          {product.payment_options.map((paymentOption) => (
            <i
              key={paymentOption}
              className={
                classNames(
                  'ml-2',
                  'fa',
                  {
                    'fa-cc-stripe': paymentOption === 'stripe',
                    'fa-suitcase': paymentOption === 'pay_at_convention',
                  },
                )
              }
              title={humanize(paymentOption)}
            />
          ))}
        </div>
        {product.provides_ticket_type && (
          <div>
            <i className="fa fa-ticket" />
            {' '}
            {product.provides_ticket_type.description}
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="d-lg-flex justify-content-lg-start align-items-lg-start">
          {product.image_url && (
            <img
              src={product.image_url}
              style={{ maxWidth: '200px' }}
              alt={product.name}
            />
          )}

          <div className="ml-lg-4 col-lg">
            <p>
              <strong>
                Base price:
                {' '}
                {describeAdminPricingStructure(product.pricing_structure)}
              </strong>
            </p>
            { /* eslint-disable-next-line react/no-danger */ }
            <div dangerouslySetInnerHTML={{ __html: product.description_html }} />
            <AdminProductVariantsTable
              product={product}
              editing={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

AdminProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    description_html: PropTypes.string.isRequired,
    image_url: PropTypes.string,
    payment_options: PropTypes.arrayOf(PropTypes.string).isRequired,
    pricing_structure: PropTypes.shape({}),
    product_variants: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      override_price: PropTypes.shape({
        fractional: PropTypes.number.isRequired,
        currency_code: PropTypes.string.isRequired,
      }),
    }).isRequired).isRequired,
    available: PropTypes.bool.isRequired,
    provides_ticket_type: PropTypes.shape({
      description: PropTypes.string.isRequired,
    }),
  }).isRequired,
  currentAbility: PropTypes.shape({
    can_update_products: PropTypes.bool.isRequired,
  }).isRequired,
  startEditing: PropTypes.func.isRequired,
};

export default AdminProductCard;
