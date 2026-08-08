import { MockLink } from '@apollo/client/testing';

import { renderRoute, waitFor } from '../../testUtils';
import { Component as RunEmailList, loader } from '../../../../app/javascript/EventsApp/SignupAdmin/RunEmailList';
import {
  RunSignupsTableSignupsQueryData,
  RunSignupsTableSignupsQueryDocument,
} from '../../../../app/javascript/EventsApp/SignupAdmin/queries.generated';
import { SignupState } from '../../../../app/javascript/graphqlTypes.generated';

describe('RunEmailList', () => {
  type Entry = RunSignupsTableSignupsQueryData['convention']['event']['run']['signups_paginated']['entries'][number];

  const buildSignup = (overrides: Partial<Entry>): Entry => ({
    __typename: 'Signup',
    id: '1',
    state: SignupState.Confirmed,
    counted: true,
    age_restrictions_check: 'OK',
    bucket: null,
    requested_bucket: null,
    run: { __typename: 'Run', id: '1', starts_at: '2025-01-01T19:00:00Z' },
    user_con_profile: {
      __typename: 'UserConProfile',
      id: '1',
      name_inverted: 'One, Player',
      name_without_nickname: 'Player One',
      gravatar_enabled: false,
      gravatar_url: '',
      email: 'player-one@example.com',
      birth_date: null,
    },
    ...overrides,
  });

  const buildQueryData = (entries: Entry[]): RunSignupsTableSignupsQueryData => ({
    __typename: 'Query',
    convention: {
      __typename: 'Convention',
      id: '1',
      name: 'Test Convention',
      event: {
        __typename: 'Event',
        id: '1',
        title: 'Test Event',
        event_category: { __typename: 'EventCategory', id: '1', team_member_name: 'GM', teamMemberNamePlural: 'GMs' },
        team_members: [],
        registration_policy: {
          __typename: 'RegistrationPolicy',
          buckets: [{ __typename: 'RegistrationPolicyBucket', id: '1', key: 'player', name: 'Player' }],
        },
        run: {
          __typename: 'Run',
          id: '1',
          signups_paginated: {
            __typename: 'SignupsPagination',
            total_entries: entries.length,
            total_pages: 1,
            current_page: 1,
            per_page: 100,
            entries,
          },
        },
      },
    },
  });

  const renderRunEmailList = async (entries: Entry[]) => {
    const mocks: MockLink.MockedResponse<RunSignupsTableSignupsQueryData>[] = [
      {
        request: {
          query: RunSignupsTableSignupsQueryDocument,
          variables: {
            eventId: '1',
            runId: '1',
            filters: { state: ['confirmed', 'waitlisted'] },
            sort: [{ field: 'id', desc: false }],
            perPage: 100,
          },
        },
        result: { data: buildQueryData(entries) },
      },
    ];

    const result = await renderRoute(
      [
        {
          path: '/events/:eventId/runs/:runId/emails/:separator',
          loader,
          Component: RunEmailList,
        },
      ],
      { apolloMocks: mocks, initialEntries: ['/events/1/runs/1/emails/comma'] },
    );

    await waitFor(() => expect(result.getByLabelText('Email addresses')).toBeTruthy());
    return result;
  };

  it('includes a confirmed signup whose bucket id matches a bucket in the registration policy', async () => {
    const { getByLabelText } = await renderRunEmailList([
      buildSignup({ bucket: { __typename: 'RegistrationPolicyBucket', id: '1' } }),
    ]);

    expect((getByLabelText('Email addresses') as HTMLTextAreaElement).value).toContain('player-one@example.com');
  });

  it('excludes a confirmed signup whose bucket id does not match any known bucket', async () => {
    const { getByLabelText } = await renderRunEmailList([
      buildSignup({ bucket: { __typename: 'RegistrationPolicyBucket', id: 'unknown-bucket' } }),
    ]);

    expect((getByLabelText('Email addresses') as HTMLTextAreaElement).value).not.toContain('player-one@example.com');
  });

  it('excludes a non-team-member waitlisted signup by default', async () => {
    const { getByLabelText } = await renderRunEmailList([buildSignup({ state: SignupState.Waitlisted, bucket: null })]);

    expect((getByLabelText('Email addresses') as HTMLTextAreaElement).value).not.toContain('player-one@example.com');
  });

  it('includes a team member regardless of bucket', async () => {
    const data = buildQueryData([
      buildSignup({ bucket: { __typename: 'RegistrationPolicyBucket', id: 'unknown-bucket' } }),
    ]);
    data.convention.event.team_members = [
      { __typename: 'TeamMember', id: '1', user_con_profile: { __typename: 'UserConProfile', id: '1' } },
    ];

    const mocks: MockLink.MockedResponse<RunSignupsTableSignupsQueryData>[] = [
      {
        request: {
          query: RunSignupsTableSignupsQueryDocument,
          variables: {
            eventId: '1',
            runId: '1',
            filters: { state: ['confirmed', 'waitlisted'] },
            sort: [{ field: 'id', desc: false }],
            perPage: 100,
          },
        },
        result: { data },
      },
    ];

    const result = await renderRoute(
      [{ path: '/events/:eventId/runs/:runId/emails/:separator', loader, Component: RunEmailList }],
      { apolloMocks: mocks, initialEntries: ['/events/1/runs/1/emails/comma'] },
    );
    await waitFor(() => expect(result.getByLabelText('Email addresses')).toBeTruthy());

    expect((result.getByLabelText('Email addresses') as HTMLTextAreaElement).value).toContain('player-one@example.com');
  });
});
