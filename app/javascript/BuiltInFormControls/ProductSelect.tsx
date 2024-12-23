import Select, { Props as SelectProps } from 'react-select';

import { DocumentNode, useQuery } from '@apollo/client';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import FourOhFourPage from '../FourOhFourPage';
import { AdminProductsQueryData, AdminProductsQueryDocument } from 'Store/ProductAdmin/queries.generated';

export type ProductSelectProps<
  QueryType extends AdminProductsQueryData,
  IsMulti extends boolean = boolean,
> = SelectProps<Pick<QueryType['convention']['products'][0], '__typename' | 'id' | 'name'>, IsMulti> & {
  productsQuery?: DocumentNode;
};

function ProductSelect<QueryType extends AdminProductsQueryData, IsMulti extends boolean = boolean>({
  productsQuery,
  ...otherProps
}: ProductSelectProps<QueryType, IsMulti>): JSX.Element {
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
