import React from 'react';
import gql from 'graphql-tag'; // eslint-disable-line no-restricted-imports

import {
  render, fireEvent, act, waitFor,
} from '../testUtils';
import GraphQLAsyncSelect from '../../../app/javascript/BuiltInFormControls/GraphQLAsyncSelect';

const FakeQuery = gql`
query FakeQuery($name: String) {
  convention {
    id
    user_con_profiles_paginated(filters: { name: $name }) {
      entries {
        id
        name_without_nickname
      }
    }
  }
}
`;

describe('GraphQLAsyncSelect', () => {
  const defaultMocks = [
    {
      request: {
        query: FakeQuery,
        variables: {
          name: 'gab',
        },
      },
      result: {
        data: {
          convention: {
            __typename: 'Convention',
            id: 1,
            user_con_profiles_paginated: {
              __typename: 'UserConProfilesPagination',
              entries: [
                {
                  __typename: 'UserConProfile',
                  id: 1,
                  name_without_nickname: 'Gabriel Knight',
                },
              ],
            },
          },
        },
      },
    },
  ];

  const renderUserConProfileSelect = (props, mocks) => render((
    <GraphQLAsyncSelect
      query={FakeQuery}
      getOptions={(data) => data.convention.user_con_profiles_paginated.entries}
      getOptionLabel={(option) => option.name_without_nickname}
      getOptionValue={(option) => option.id}
      getVariables={(input) => ({ name: input })}
      {...props}
    />
  ), { apolloMocks: mocks ?? defaultMocks });

  test('loads options', async () => {
    const { getByRole, queryAllByText } = renderUserConProfileSelect();
    const selectInput = getByRole('textbox');
    await act(async () => {
      fireEvent.change(selectInput, { target: { value: 'gab' } });
      await waitFor(() => expect(queryAllByText('Gabriel Knight')).toHaveLength(1));
    });
  });
});
