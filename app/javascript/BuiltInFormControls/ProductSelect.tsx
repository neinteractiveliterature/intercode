import Select, { Props as SelectProps } from 'react-select';
// eslint-disable-next-line no-restricted-imports
import { DocumentNode, useQuery } from '@apollo/client';

import { AdminProductsQuery } from '../Store/queries';
import LoadingIndicator from '../LoadingIndicator';
import ErrorDisplay from '../ErrorDisplay';
import { AdminProductsQueryQuery } from '../Store/queries.generated';

export type ProductSelectProps<QueryType extends AdminProductsQueryQuery> = SelectProps<
  Pick<QueryType['convention']['products'][0], '__typename' | 'id' | 'name'>
> & {
  productsQuery?: DocumentNode;
};

function ProductSelect<QueryType extends AdminProductsQueryQuery>({
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
