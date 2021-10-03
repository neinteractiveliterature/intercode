import AsyncSelect, { Props } from 'react-select/async';
import { useApolloClient } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import type { OptionTypeBase } from 'react-select';

// This will be a lot more useful once https://github.com/microsoft/TypeScript/issues/36981
// is fixed
export type GraphQLAsyncSelectProps<
  DataType,
  OptionType extends OptionTypeBase,
  IsMulti extends boolean,
> = Omit<Props<OptionType, IsMulti>, 'loadOptions'> & {
  query: DocumentNode;
  getVariables: (inputValue: string) => Record<string, unknown> | undefined;
  getOptions: (results: DataType) => OptionType[];
};

function GraphQLAsyncSelect<
  DataType,
  OptionType extends OptionTypeBase,
  IsMulti extends boolean = false,
>({
  query,
  getOptions,
  getVariables,
  ...otherProps
}: GraphQLAsyncSelectProps<DataType, OptionType, IsMulti>): JSX.Element {
  const client = useApolloClient();
  const loadOptions = async (inputValue: string) => {
    const results = await client.query<DataType>({
      query,
      variables: getVariables(inputValue),
    });

    if (!results.data) {
      return [];
    }

    return getOptions(results.data);
  };

  return <AsyncSelect loadOptions={loadOptions} {...otherProps} />;
}

export default GraphQLAsyncSelect;
