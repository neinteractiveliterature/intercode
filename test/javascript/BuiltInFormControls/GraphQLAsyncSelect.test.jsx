import React from 'react';
import { shallow } from 'enzyme';
import { PureGraphQLAsyncSelect as GraphQLAsyncSelect } from '../../../app/javascript/BuiltInFormControls/GraphQLAsyncSelect';

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
    const fakeClient = {
      query: query || defaultQuery,
    };

    return shallow((
      <GraphQLAsyncSelect
        client={fakeClient}
        query={{}}
        getOptions={data => data.convention.user_con_profiles_paginated.entries}
        getOptionLabel={option => option.name_without_nickname}
        getOptionValue={option => option.id}
        getVariables={input => ({ name: input })}
        {...props}
      />
    ));
  };

  test('loads options', async () => {
    const component = renderUserConProfileSelect();
    const componentInstance = component.instance();
    const options = await componentInstance.loadOptions('gab');
    expect(options).toEqual([{ id: 1, name_without_nickname: 'Gabriel Knight' }]);
  });
});
