import { useContext } from 'react';
import { LoaderFunction, useLoaderData, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ProductOrderForm from './ProductOrderForm';
import SignInButton from '../Authentication/SignInButton';
import usePageTitle from '../usePageTitle';
import parseCmsContent from '../parseCmsContent';
import { describeUserPricingStructure } from './describePricingStructure';
import AppRootContext from '../AppRootContext';
import {
  OrderFormProductQueryData,
  OrderFormProductQueryDocument,
  OrderFormProductQueryVariables,
} from './queries.generated';
import { client } from '../useIntercodeApolloClient';

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data } = await client.query<OrderFormProductQueryData, OrderFormProductQueryVariables>({
    query: OrderFormProductQueryDocument,
    variables: { productId: id ?? '' },
  });
  return data;
};

function ProductPage() {
  const {
    convention: { product },
    currentUser,
  } = useLoaderData() as OrderFormProductQueryData;
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const navigate = useNavigate();

  usePageTitle(product.name);

  return (
    <>
      {product.image && (
        <div className="float-end d-none d-lg-block ms-4" style={{ maxWidth: '50%' }}>
          <img style={{ maxWidth: '100%' }} src={product.image.url} alt={product.name} />
        </div>
      )}

      <div className="mb-4">
        <h1>{product.name}</h1>
        <div className="lead">{describeUserPricingStructure(product.pricing_structure, timezoneName, t)}</div>
      </div>

      {product.image && <img className="d-lg-none w-100" src={product.image.url} alt={product.name} />}

      {product.description_html && (
        <div className="mb-4">{parseCmsContent(product.description_html).bodyComponents}</div>
      )}

      {currentUser ? (
        <ProductOrderForm productId={product.id} onAddedToCart={() => navigate('/cart')} />
      ) : (
        <SignInButton caption="Log in to order" className="btn btn-primary" afterSignInPath={window.location.href} />
      )}
    </>
  );
}

export const Component = ProductPage;
