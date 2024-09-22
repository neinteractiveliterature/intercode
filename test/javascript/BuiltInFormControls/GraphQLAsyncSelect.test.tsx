import { TypedDocumentNode } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';

import { render, fireEvent, waitFor } from '../testUtils';
import GraphQLAsyncSelect, {
  GraphQLAsyncSelectProps,
} from '../../../app/javascript/BuiltInFormControls/GraphQLAsyncSelect';
import { ResultOf } from '@graphql-typed-document-node/core';
import { FakeQueryData, FakeQueryDocument, FakeQueryVariables } from './graphQLAsyncSelect.queries.generated';

const defaultQueryMock: MockedResponse<FakeQueryData, FakeQueryVariables> = {
  request: {
    query: FakeQueryDocument,
    variables: {
      name: 'gab',
    },
  },
  result: {
    data: {
      __typename: 'Query',
      convention: {
        __typename: 'Convention',
        id: '1',
        user_con_profiles_paginated: {
          __typename: 'UserConProfilesPagination',
          entries: [
            {
              __typename: 'UserConProfile',
              id: '1',
              name_without_nickname: 'Gabriel Knight',
            },
          ],
        },
      },
    },
  },
};

describe('GraphQLAsyncSelect', () => {
  const defaultMocks = [defaultQueryMock];

  const renderUserConProfileSelect = <
    QueryType extends TypedDocumentNode<FakeQueryData, FakeQueryVariables>,
    OptionType extends ResultOf<QueryType>['convention']['user_con_profiles_paginated']['entries'][number],
  >(
    props?: Partial<GraphQLAsyncSelectProps<QueryType, OptionType, false>>,
    mocks?: MockedResponse[],
  ) =>
    render(
      <GraphQLAsyncSelect
        query={FakeQueryDocument}
        getOptions={(data) => data.convention.user_con_profiles_paginated.entries as OptionType[]}
        getOptionLabel={(option) => option.name_without_nickname}
        getOptionValue={(option) => option.id}
        getVariables={(input) => ({ name: input })}
        {...props}
      />,
      { apolloMocks: mocks ?? defaultMocks },
    );

  test.skip('loads options', async () => {
    const { getByRole, queryAllByText } = await renderUserConProfileSelect();
    const selectInput = getByRole('combobox');
    fireEvent.change(selectInput, { target: { value: 'gab' } });
    await waitFor(() => expect(queryAllByText('Gabriel Knight')).toHaveLength(1));
  });
});
