import React from 'react';
import { shallow } from 'enzyme';
import { PureUserConProfileSelect as UserConProfileSelect } from '../../../app/javascript/BuiltInFormControls/UserConProfileSelect';

describe('UserConProfileSelect', () => {
  const defaultQuery = async () => ({
    data: {
      convention: {
        user_con_profiles: {
          edges: [
            { node: { id: 1, name_without_nickname: 'Gabriel Knight' } },
          ],
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
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
    await componentInstance.componentDidMount();

    expect(componentInstance.state.options[0].label).toEqual('Gabriel Knight');
  });

  test('loads paginated options', async () => {
    const query = async ({ variables: { cursor } }) => {
      const hasNextPage = (cursor !== '12345');
      const edges = (
        hasNextPage ?
          [{ node: { id: 1, name_without_nickname: 'Gabriel Knight' } }] :
          [{ node: { id: 2, name_without_nickname: 'Grace Nakamura' } }]
      );

      return {
        data: {
          convention: {
            user_con_profiles: {
              edges,
              pageInfo: {
                endCursor: (hasNextPage ? '12345' : null),
                hasNextPage,
              },
            },
          },
        },
      };
    };

    const component = renderUserConProfileSelect({}, query);
    const componentInstance = component.instance();
    await componentInstance.componentDidMount();

    expect(componentInstance.state.options[0].label).toEqual('Gabriel Knight');
    expect(componentInstance.state.options[1].label).toEqual('Grace Nakamura');
  });
});
