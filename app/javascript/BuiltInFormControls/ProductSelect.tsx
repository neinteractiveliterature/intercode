import Select, { Props as SelectProps } from 'react-select';
// eslint-disable-next-line no-restricted-imports
import { DocumentNode, useQuery } from '@apollo/client';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import { AdminProductsQueryData, AdminProductsQueryDocument } from '../Store/queries.generated';
import FourOhFourPage from '../FourOhFourPage';

export type ProductSelectProps<QueryType extends AdminProductsQueryData> = SelectProps<
  Pick<QueryType['convention']['products'][0], '__typename' | 'id' | 'name'>
> & {
  productsQuery?: DocumentNode;
};

function ProductSelect<QueryType extends AdminProductsQueryData>({
  productsQuery,
  ...otherProps
}: ProductSelectProps<QueryType>): JSX.Element {
  const { data, loading, error } = useQuery<QueryType>(productsQuery ?? AdminProductsQueryDocument);

  if (loading) {
    return <LoadingIndicator iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data) {
    return <FourOhFourPage />;
  }

  return (
    <Select
      options={data.convention.products}
      getOptionValue={(option) => `${option.id}`}
      getOptionLabel={(option) => option.name}
      {...otherProps}
    />
  );
}

export default ProductSelect;
