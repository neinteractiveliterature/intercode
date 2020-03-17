import React from 'react';
import {
  render, fireEvent, act, waitFor,
} from '../testUtils';
import GraphQLAsyncSelect from '../../../app/javascript/BuiltInFormControls/GraphQLAsyncSelect';

describe('GraphQLAsyncSelect', () => {
  const defaultQuery = async () => ({
    data: {
      convention: {
        user_con_profiles_paginated: {
          entries: [
            { id: 1, name_without_nickname: 'Gabriel Knight' },
          ],
        },
      },
    },
  });

  const renderUserConProfileSelect = (props, query) => {
    const apolloClient = {
      query: query || defaultQuery,
    };

    return render((
      <GraphQLAsyncSelect
        query={{}}
        getOptions={(data) => data.convention.user_con_profiles_paginated.entries}
        getOptionLabel={(option) => option.name_without_nickname}
        getOptionValue={(option) => option.id}
        getVariables={(input) => ({ name: input })}
        {...props}
      />
    ), { apolloClient });
  };

  test('loads options', async () => {
    const { getByRole, queryAllByText } = renderUserConProfileSelect();
    const selectInput = getByRole('textbox');
    await act(async () => {
      fireEvent.change(selectInput, { target: { value: 'gab' } });
      await waitFor(() => queryAllByText('Gabriel Knight'));
    });
    expect(queryAllByText('Gabriel Knight')).toHaveLength(1);
  });
});
