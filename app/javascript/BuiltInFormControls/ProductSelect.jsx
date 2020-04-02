import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useQuery } from '@apollo/react-hooks';

import { AdminProductsQuery } from '../Store/queries.gql';
import LoadingIndicator from '../LoadingIndicator';
import ErrorDisplay from '../ErrorDisplay';

function ProductSelect({ productsQuery, ...otherProps }) {
  const { data, loading, error } = useQuery(AdminProductsQuery);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <Select
      options={data.convention.products}
      getOptionValue={(option) => option.id}
      getOptionLabel={(option) => option.name}
      {...otherProps}
    />
  );
}

ProductSelect.propTypes = {
  productsQuery: PropTypes.shape({
    kind: PropTypes.string.isRequired,
    definitions: PropTypes.array.isRequired,
  }),
};

ProductSelect.defaultProps = {
  productsQuery: null,
};

export default ProductSelect;
