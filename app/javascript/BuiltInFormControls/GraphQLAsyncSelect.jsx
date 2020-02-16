import React from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';
import { useApolloClient } from '@apollo/react-hooks';

function GraphQLAsyncSelect({
  query, getOptions, getVariables, ...otherProps
}) {
  const client = useApolloClient();
  const loadOptions = async (inputValue) => {
    const results = await client.query({
      query,
      variables: getVariables(inputValue),
    });

    return getOptions(results.data);
  };

  return (
    <AsyncSelect
      handleInputChange={(input) => input.toLowerCase().trim()}
      loadOptions={loadOptions}
      {...otherProps}
    />
  );
}

GraphQLAsyncSelect.propTypes = {
  query: PropTypes.shape({}).isRequired,
  getOptions: PropTypes.func.isRequired,
  getVariables: PropTypes.func.isRequired,
};

export default GraphQLAsyncSelect;
