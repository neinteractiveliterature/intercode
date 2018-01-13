import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import { addTypenameToDocument } from 'apollo-utilities';
import UserConProfileSelect from '../../../app/javascript/BuiltInFormControls/UserConProfileSelect';
import TeamMemberForm, { teamMemberQuery, userConProfilesQuery } from '../../../app/javascript/BuiltInForms/TeamMemberForm';

describe('TeamMemberForm', () => {
  const renderTeamMemberForm = ({
    componentProps,
    eventProps,
    conventionProps,
    userConProfiles,
  } = {}) => mount((
    <MockedProvider
      mocks={[
        {
          request: {
            query: addTypenameToDocument(teamMemberQuery),
            variables: { eventId: 123 },
          },
          result: {
            data: {
              convention: {
                __typename: 'Convention',
                name: 'TestCon',
                ticket_types: [
                  {
                    __typename: 'TicketType',
                    id: 1,
                    name: 'regular',
                    description: 'Regular ticket',
                    maximum_event_provided_tickets: 0,
                  },
                  {
                    __typename: 'TicketType',
                    id: 2,
                    name: 'gm',
                    description: 'GM comp',
                    maximum_event_provided_tickets: 2,
                  },
                ],
                ...conventionProps,
              },
              event: {
                __typename: 'Event',
                title: 'Some game',
                team_member_name: 'GM',
                can_provide_tickets: true,
                team_members: [],
                provided_tickets: [],
                ...eventProps,
              },
            },
          },
        },
        {
          request: {
            query: addTypenameToDocument(userConProfilesQuery),
            variables: { cursor: null },
          },
          result: {
            data: {
              convention: {
                __typename: 'Convention',
                user_con_profiles: {
                  __typename: 'UserConProfileConnection',
                  pageInfo: {
                    __typename: 'PageInfo',
                    endCursor: 'end',
                    hasNextPage: false,
                  },
                  edges: (userConProfiles || []).map(userConProfile => ({
                    __typename: 'UserConProfileEdge',
                    node: {
                      __typename: 'UserConProfile',
                      ...userConProfile,
                    },
                  })),
                },
              },
            },
          },
        },
      ]}
    >
      <TeamMemberForm
        baseUrl="/"
        eventId={123}
        {...componentProps}
      />
    </MockedProvider>
  ));

  test('it lets you pick a user con profile', (done) => {
    const mrBob = {
      id: 1,
      name_without_nickname: 'Mr. Bob',
      ticket: null,
    };
    const component = renderTeamMemberForm({
      userConProfiles: [mrBob],
    });
    // this sucks, but we have to wait for a re-render
    setTimeout(() => {
      component.update();
      component.find(UserConProfileSelect).prop('onChange')({ data: mrBob });
      component.update();
      expect(component.find(UserConProfileSelect).prop('value')).toEqual(1);
      done();
    }, 0);
  });
});
