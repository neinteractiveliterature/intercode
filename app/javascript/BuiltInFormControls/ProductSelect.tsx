import Select, { Props as SelectProps } from 'react-select';
// eslint-disable-next-line no-restricted-imports
import { DocumentNode, useQuery } from '@apollo/client';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import { AdminProductsQuery } from '../Store/queries';
import { AdminProductsQueryData } from '../Store/queries.generated';

export type ProductSelectProps<QueryType extends AdminProductsQueryData> = SelectProps<
  Pick<QueryType['convention']['products'][0], '__typename' | 'id' | 'name'>
> & {
  productsQuery?: DocumentNode;
};

function ProductSelect<QueryType extends AdminProductsQueryData>({
  productsQuery,
  ...otherProps
}: ProductSelectProps<QueryType>) {
  const { data, loading, error } = useQuery<QueryType>(productsQuery ?? AdminProductsQuery);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <Select
      options={data!.convention.products}
      getOptionValue={(option) => `${option.id}`}
      getOptionLabel={(option) => option.name}
      {...otherProps}
    />
  );
}

export default ProductSelect;
