import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';

import ErrorDisplay from '../ErrorDisplay';
import { OrderFormProductQuery } from './queries.gql';
import ProductOrderForm from './ProductOrderForm';
import SignInButton from '../Authentication/SignInButton';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import parseCmsContent from '../parseCmsContent';
import PageLoadingIndicator from '../PageLoadingIndicator';
import { describeUserPricingStructure } from './describePricingStructure';
import AppRootContext from '../AppRootContext';

function ProductPage() {
  const { timezoneName } = useContext(AppRootContext);
  const { id } = useParams();
  const { data, loading, error } = useQuery(
    OrderFormProductQuery,
    { variables: { productId: Number.parseInt(id, 10) } },
  );

  usePageTitle(useValueUnless(() => data.product.name, error || loading));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

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
        <div className="lead">{describeUserPricingStructure(product.pricing_structure, timezoneName)}</div>
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

export default ProductPage;
