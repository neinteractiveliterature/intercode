import React from 'react';
import PropTypes from 'prop-types';

import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import { OrderFormProductQuery } from './queries.gql';
import formatMoney from '../formatMoney';
import ProductOrderForm from './ProductOrderForm';
import SignInButton from '../Authentication/SignInButton';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import parseCmsContent from '../parseCmsContent';

function ProductPage({ match }) {
  const { data, error } = useQuerySuspended(
    OrderFormProductQuery,
    { variables: { productId: Number.parseInt(match.params.id, 10) } },
  );

  usePageTitle(useValueUnless(() => data.product.name, error));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { product, currentUser } = data;

  return (
    <>
      {product.image_url && (
        <div className="float-right d-none d-lg-block ml-4" style={{ maxWidth: '50%' }}>
          <img style={{ maxWidth: '100%' }} src={product.image_url} alt={product.name} />
        </div>
      )}

      <div className="mb-4">
        <h1>{product.name}</h1>
        <div className="lead">{formatMoney(product.price)}</div>
      </div>

      {product.image_url && (
        <img className="d-lg-none w-100" src={product.image_url} alt={product.name} />
      )}

      {product.description_html && (
        <div className="mb-4">{parseCmsContent(product.description_html).bodyComponents}</div>
      )}

      {
        currentUser
          ? <ProductOrderForm productId={product.id} />
          : <SignInButton caption="Log in to order" className="btn btn-primary" afterSignInPath={window.location.href} />
      }
    </>
  );
}

ProductPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ProductPage;
