import AsyncSelect, { AsyncProps } from 'react-select/async';
import { TypedDocumentNode, ResultOf, VariablesOf } from '@graphql-typed-document-node/core';
import { GroupBase } from 'react-select';
import { client } from '../useIntercodeApolloClient';

// This will be a lot more useful once https://github.com/microsoft/TypeScript/issues/36981
// is fixed
export type GraphQLAsyncSelectProps<QueryType extends TypedDocumentNode, OptionType, IsMulti extends boolean> = Omit<
  AsyncProps<OptionType, IsMulti, GroupBase<OptionType>>,
  'loadOptions'
> & {
  query: QueryType;
  getVariables: (inputValue: string) => VariablesOf<QueryType>;
  getOptions: (results: ResultOf<QueryType>) => OptionType[];
};

function GraphQLAsyncSelect<QueryType extends TypedDocumentNode, OptionType, IsMulti extends boolean = false>({
  query,
  getOptions,
  getVariables,
  ...otherProps
}: GraphQLAsyncSelectProps<QueryType, OptionType, IsMulti>): JSX.Element {
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
