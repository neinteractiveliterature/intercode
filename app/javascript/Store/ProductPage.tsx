import { useNavigate } from 'react-router';

import ProductOrderForm from './ProductOrderForm';
import SignInButton from '../Authentication/SignInButton';
import usePageTitle from '../usePageTitle';
import { OrderFormProductQueryDocument } from './queries.generated';
import { UserPricingStructureDescription } from './describePricingStructure';
import { parseCmsContent } from 'parseCmsContent';
import { Route } from './+types/ProductPage';
import { apolloClientContext } from 'AppContexts';

export async function loader({ params: { id }, context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({
    query: OrderFormProductQueryDocument,
    variables: { productId: id ?? '' },
  });
  return data;
}

function ProductPage({
  loaderData: {
    convention: { product },
    currentUser,
  },
}: Route.ComponentProps) {
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
