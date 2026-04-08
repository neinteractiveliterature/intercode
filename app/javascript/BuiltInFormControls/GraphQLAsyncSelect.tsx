import AsyncSelect, { AsyncProps } from 'react-select/async';
import { TypedDocumentNode, ResultOf, VariablesOf } from '@graphql-typed-document-node/core';
import { GroupBase } from 'react-select';
import { useApolloClient } from '@apollo/client/react';

// This will be a lot more useful once https://github.com/microsoft/TypeScript/issues/36981
// is fixed
// TypedDocumentNode<any, any> is needed because TypeScript 6 now correctly checks variance
// of phantom type parameters in TypedDocumentNode, and only `any` bypasses this constraint.
/* eslint-disable @typescript-eslint/no-explicit-any */
export type GraphQLAsyncSelectProps<
  QueryType extends TypedDocumentNode<any, any>,
  OptionType,
  IsMulti extends boolean,
> = Omit<AsyncProps<OptionType, IsMulti, GroupBase<OptionType>>, 'loadOptions'> & {
  query: QueryType;
  getVariables: (inputValue: string) => VariablesOf<QueryType>;
  getOptions: (results: ResultOf<QueryType>) => OptionType[];
};

function GraphQLAsyncSelect<
  QueryType extends TypedDocumentNode<any, any>,
  OptionType,
  IsMulti extends boolean = false,
>({
  query,
  getOptions,
  getVariables,
  ...otherProps
}: GraphQLAsyncSelectProps<QueryType, OptionType, IsMulti>): React.JSX.Element {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const client = useApolloClient();
  const loadOptions = async (inputValue: string) => {
    try {
      const { data } = await client.query({ query, variables: getVariables(inputValue) });
      return getOptions(data as ResultOf<QueryType>);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return <AsyncSelect loadOptions={loadOptions} {...otherProps} />;
}

export default GraphQLAsyncSelect;
