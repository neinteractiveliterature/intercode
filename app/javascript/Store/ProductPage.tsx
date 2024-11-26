import { LoaderFunction, useLoaderData, useNavigate } from 'react-router';

import ProductOrderForm from './ProductOrderForm';
import SignInButton from '../Authentication/SignInButton';
import usePageTitle from '../usePageTitle';
import {
  OrderFormProductQueryData,
  OrderFormProductQueryDocument,
  OrderFormProductQueryVariables,
} from './queries.generated';
import { client } from '../useIntercodeApolloClient';
import { UserPricingStructureDescription } from './describePricingStructure';
import { parseCmsContent } from 'parseCmsContent';

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
        <div className="lead">
          <UserPricingStructureDescription pricingStructure={product.pricing_structure} />
        </div>
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

export default ProductPage;
