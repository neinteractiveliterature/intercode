import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import ProductOrderForm from './ProductOrderForm';
import SignInButton from '../Authentication/SignInButton';
import usePageTitle from '../usePageTitle';
import parseCmsContent from '../parseCmsContent';
import { describeUserPricingStructure } from './describePricingStructure';
import AppRootContext from '../AppRootContext';
import { useOrderFormProductQuery } from './queries.generated';

function useLoadProduct() {
  const { id } = useParams<{ id: string }>();
  return useOrderFormProductQuery({
    variables: { productId: id },
  });
}

export default LoadQueryWrapper(
  useLoadProduct,
  function ProductPage({
    data: {
      convention: { product },
      currentUser,
    },
  }) {
    const { t } = useTranslation();
    const { timezoneName } = useContext(AppRootContext);

    usePageTitle(product.name);

    return (
      <>
        {product.image_url && (
          <div className="float-end d-none d-lg-block ms-4" style={{ maxWidth: '50%' }}>
            <img style={{ maxWidth: '100%' }} src={product.image_url} alt={product.name} />
          </div>
        )}

        <div className="mb-4">
          <h1>{product.name}</h1>
          <div className="lead">{describeUserPricingStructure(product.pricing_structure, timezoneName, t)}</div>
        </div>

        {product.image_url && <img className="d-lg-none w-100" src={product.image_url} alt={product.name} />}

        {product.description_html && (
          <div className="mb-4">{parseCmsContent(product.description_html).bodyComponents}</div>
        )}

        {currentUser ? (
          <ProductOrderForm productId={product.id} />
        ) : (
          <SignInButton caption="Log in to order" className="btn btn-primary" afterSignInPath={window.location.href} />
        )}
      </>
    );
  },
);
