import { gql } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';

import { render, fireEvent, act, waitFor } from '../testUtils';
import GraphQLAsyncSelect, {
  GraphQLAsyncSelectProps,
} from '../../../app/javascript/BuiltInFormControls/GraphQLAsyncSelect';
import { UserConProfile } from '../../../app/javascript/graphqlTypes.generated';

const FakeQuery = gql`
  query FakeQuery($name: String) {
    convention: conventionByRequestHost {
      id: transitionalId
      user_con_profiles_paginated(filters: { name: $name }) {
        entries {
          id: transitionalId
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

  const renderUserConProfileSelect = <
    DataType extends typeof defaultMocks[0]['result']['data'],
    OptionType extends DataType['convention']['user_con_profiles_paginated']['entries'][number],
  >(
    props?: Partial<GraphQLAsyncSelectProps<DataType, OptionType, false>>,
    mocks?: MockedResponse[],
  ) =>
    render(
      <GraphQLAsyncSelect
        query={FakeQuery}
        getOptions={(data) => data.convention.user_con_profiles_paginated.entries}
        getOptionLabel={(option: UserConProfile) => option.name_without_nickname}
        getOptionValue={(option: UserConProfile) => option.id}
        getVariables={(input) => ({ name: input })}
        {...props}
      />,
      { apolloMocks: mocks ?? defaultMocks },
    );

  test('loads options', async () => {
    const { getByRole, queryAllByText } = await renderUserConProfileSelect();
    const selectInput = getByRole('textbox');
    await act(async () => {
      fireEvent.change(selectInput, { target: { value: 'gab' } });
      await waitFor(() => expect(queryAllByText('Gabriel Knight')).toHaveLength(1));
    });
  });
});
