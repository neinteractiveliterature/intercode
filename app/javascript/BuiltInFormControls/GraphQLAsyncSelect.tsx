import React from 'react';
import AsyncSelect, { Props } from 'react-select/async';
import { useApolloClient } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import type { OptionTypeBase } from 'react-select';

export type GraphQLAsyncSelectProps<DataType, OptionType extends OptionTypeBase> = (
  Omit<Props<OptionType>, 'loadOptions'> & {
    query: DocumentNode,
    getVariables: (inputValue: string) => any,
    getOptions: (results: DataType) => OptionType[],
  }
);

function GraphQLAsyncSelect<DataType, OptionType extends OptionTypeBase>({
  query, getOptions, getVariables, ...otherProps
}: GraphQLAsyncSelectProps<DataType, OptionType>) {
  const client = useApolloClient();
  const loadOptions = async (inputValue: string) => {
    const results = await client.query<DataType>({
      query,
      variables: getVariables(inputValue),
    });

    return getOptions(results.data);
  };

  return (
    <AsyncSelect
      loadOptions={loadOptions}
      {...otherProps}
    />
  );
}

export default GraphQLAsyncSelect;
