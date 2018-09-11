import React from 'react';
import { shallow } from 'enzyme';
import { PureUserConProfileSelect as UserConProfileSelect } from '../../../app/javascript/BuiltInFormControls/UserConProfileSelect';

describe('UserConProfileSelect', () => {
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
      <UserConProfileSelect
        client={fakeClient}
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
