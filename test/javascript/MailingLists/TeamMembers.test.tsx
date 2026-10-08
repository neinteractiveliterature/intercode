import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import { Component as TeamMembers, loader } from '../../../app/javascript/MailingLists/TeamMembers';
import {
  TeamMembersMailingListQueryData,
  TeamMembersMailingListQueryDocument,
  TeamMembersMailingListQueryVariables,
} from '../../../app/javascript/MailingLists/queries.generated';

function buildContactEmail(email: string, name: string, event: string) {
  return {
    __typename: 'ContactEmail' as const,
    email,
    formatted_address: `${name} <${email}>`,
    name,
    metadata_json: JSON.stringify({ event }),
  };
}

function buildData(emails: ReturnType<typeof buildContactEmail>[]): TeamMembersMailingListQueryData {
  return {
    __typename: 'Query',
    convention: {
      __typename: 'Convention',
      id: '1',
      name: 'Test Con',
      event_categories: [
        { __typename: 'EventCategory', id: '10', name: 'Tabletop RPG' },
        { __typename: 'EventCategory', id: '11', name: 'Board Game' },
      ],
      mailing_lists: {
        __typename: 'MailingLists',
        team_members: { __typename: 'MailingListsResult', emails, metadata_fields: ['event'] },
      },
    },
  };
}

const rpgGm = buildContactEmail('rpg-gm@example.com', 'Rita RPG', 'Dungeon Night');
const boardGm = buildContactEmail('board-gm@example.com', 'Bob Board', 'Catan Showdown');

const allTeamMembersMock: MockLink.MockedResponse<
  TeamMembersMailingListQueryData,
  TeamMembersMailingListQueryVariables
> = {
  request: { query: TeamMembersMailingListQueryDocument, variables: {} },
  result: { data: buildData([rpgGm, boardGm]) },
};

const rpgOnlyMock: MockLink.MockedResponse<TeamMembersMailingListQueryData, TeamMembersMailingListQueryVariables> = {
  request: { query: TeamMembersMailingListQueryDocument, variables: { eventCategoryIds: ['10'] } },
  result: { data: buildData([rpgGm]) },
};

// The same person on an event in each category: they're listed once per event, so their address repeats
const rpgGmOnBoardGame = buildContactEmail('rpg-gm@example.com', 'Rita RPG', 'Catan Showdown');

const duplicateAddressesMock: MockLink.MockedResponse<
  TeamMembersMailingListQueryData,
  TeamMembersMailingListQueryVariables
> = {
  request: { query: TeamMembersMailingListQueryDocument, variables: {} },
  result: { data: buildData([rpgGm, boardGm, rpgGmOnBoardGame]) },
};

describe('TeamMembers mailing list', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
  });

  const renderPage = (apolloMocks: MockLink.MockedResponse[], url = '/mailing_lists/team_members') =>
    renderRoute([{ path: '/mailing_lists/team_members', loader, Component: TeamMembers }], {
      apolloMocks,
      initialEntries: [url],
    });

  it('lists every event team member when no category is selected', async () => {
    const { findByRole, getByRole } = await renderPage([allTeamMembersMock]);

    expect(await findByRole('link', { name: 'rpg-gm@example.com' })).toBeTruthy();
    expect(getByRole('link', { name: 'board-gm@example.com' })).toBeTruthy();
  });

  it('updates the table when an event category is picked', async () => {
    const { findByRole, getByLabelText, getByRole, queryByRole } = await renderPage([allTeamMembersMock, rpgOnlyMock]);
    expect(await findByRole('link', { name: 'board-gm@example.com' })).toBeTruthy();

    await user.click(getByLabelText('Limit to events in these categories'));
    await user.click(await findByRole('option', { name: 'Tabletop RPG' }));

    await waitFor(() => expect(queryByRole('link', { name: 'board-gm@example.com' })).toBeNull());
    expect(getByRole('link', { name: 'rpg-gm@example.com' })).toBeTruthy();
    expect(within(getByRole('table')).getAllByRole('row')).toHaveLength(2);
  });

  it('updates the table when the full list has the same address on more than one row', async () => {
    // duplicate React keys can leave stale or duplicated rows behind when the list changes
    const consoleError = vi.spyOn(console, 'error');
    const { findByRole, getByLabelText, getByRole, getAllByRole } = await renderPage([
      duplicateAddressesMock,
      rpgOnlyMock,
    ]);
    await findByRole('link', { name: 'board-gm@example.com' });
    expect(getAllByRole('link', { name: 'rpg-gm@example.com' })).toHaveLength(2);

    await user.click(getByLabelText('Limit to events in these categories'));
    await user.click(await findByRole('option', { name: 'Tabletop RPG' }));

    await waitFor(() => expect(within(getByRole('table')).getAllByRole('row')).toHaveLength(2));
    expect(getAllByRole('link', { name: 'rpg-gm@example.com' })).toHaveLength(1);
    expect(consoleError.mock.calls.map((args) => String(args[0]))).not.toContainEqual(
      expect.stringContaining('two children with the same key'),
    );
    consoleError.mockRestore();
  });

  it('goes back to the full list when the category is cleared, and filters again when re-picked', async () => {
    const { findByRole, getByLabelText, getByRole, queryByRole } = await renderPage([
      allTeamMembersMock,
      rpgOnlyMock,
      allTeamMembersMock,
      rpgOnlyMock,
    ]);
    expect(await findByRole('link', { name: 'board-gm@example.com' })).toBeTruthy();

    await user.click(getByLabelText('Limit to events in these categories'));
    await user.click(await findByRole('option', { name: 'Tabletop RPG' }));
    await waitFor(() => expect(queryByRole('link', { name: 'board-gm@example.com' })).toBeNull());

    await user.click(getByRole('button', { name: 'Remove Tabletop RPG' }));
    expect(await findByRole('link', { name: 'board-gm@example.com' })).toBeTruthy();
    expect(getByRole('link', { name: 'rpg-gm@example.com' })).toBeTruthy();

    await user.click(getByLabelText('Limit to events in these categories'));
    await user.click(await findByRole('option', { name: 'Tabletop RPG' }));
    await waitFor(() => expect(queryByRole('link', { name: 'board-gm@example.com' })).toBeNull());
  });

  it('starts out filtered when the URL names a category', async () => {
    const { findByRole, queryByRole } = await renderPage(
      [rpgOnlyMock],
      '/mailing_lists/team_members?event_category=10',
    );

    expect(await findByRole('link', { name: 'rpg-gm@example.com' })).toBeTruthy();
    expect(queryByRole('link', { name: 'board-gm@example.com' })).toBeNull();
  });
});
