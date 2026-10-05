import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute } from '../../testUtils';
import { Component as MySignupQueue, loader } from '../../../../app/javascript/EventsApp/MySignupQueue';
import {
  MySignupQueueQueryData,
  MySignupQueueQueryDocument,
} from '../../../../app/javascript/EventsApp/MySignupQueue/queries.generated';
import { buildMySignupQueueData, buildQueueRankedChoice } from '../../fixtures/signupQueue';

// The signups card and the CMS partial fetch their own data and have their own tests; here they're stand-ins.
vi.mock('../../../../app/javascript/EventsApp/SignupAdmin/UserConProfileSignupsCard', () => ({
  default: ({ userConProfileId }: { userConProfileId: string }) => <aside>Signups card for {userConProfileId}</aside>,
}));
vi.mock('../../../../app/javascript/UIComponents/BlockPartial', () => ({
  default: ({
    blockPartial,
    currentAbilityCanCreate,
  }: {
    blockPartial: { content: string | null } | null;
    currentAbilityCanCreate: boolean;
  }) => (
    <div>
      Partial: {blockPartial?.content ?? 'none'} {currentAbilityCanCreate ? '(can edit)' : ''}
    </div>
  ),
}));

describe('the My Signup Queue page', () => {
  const renderPage = (data: MySignupQueueQueryData) => {
    const mock: MockLink.MockedResponse<MySignupQueueQueryData> = {
      request: { query: MySignupQueueQueryDocument },
      result: { data },
    };

    return renderRoute([{ path: '/my_signup_queue', loader, Component: MySignupQueue }], {
      apolloMocks: [mock],
      initialEntries: ['/my_signup_queue'],
      appRootContextValue: {
        timezoneName: 'America/New_York',
        currentUser: { __typename: 'User', id: '1', name: 'Alice' },
        myProfile: {
          __typename: 'UserConProfile',
          id: '7',
          name: 'Alice Attendee',
          email: 'alice@example.com',
          mobile_phone: null,
          accepted_clickwrap_agreement: true,
          needs_update: false,
          name_without_nickname: 'Alice Attendee',
          first_name: 'Alice',
          last_name: 'Attendee',
          gravatar_enabled: false,
          gravatar_url: '',
          ticket: null,
          current_pending_order: null,
        },
      },
    });
  };

  it('is titled, shows the CMS text for the page, and has the settings and the signups card', async () => {
    const { findByRole, getByText } = await renderPage(buildMySignupQueueData());

    expect(await findByRole('heading', { name: 'My signup queue' })).toBeTruthy();
    expect(getByText(/Partial: none/)).toBeTruthy();
    expect(getByText('Signups card for 7')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });

  it('passes the CMS partial and whether the user can edit it along', async () => {
    const data = buildMySignupQueueData(
      {},
      {
        blockPartial: {
          __typename: 'CmsPartial',
          id: '1',
          content: 'Welcome to the queue',
          content_html: '<p>Welcome to the queue</p>',
          current_ability_can_update: true,
          current_ability_can_delete: true,
        },
      },
    );
    data.currentAbility.can_create_cms_partials = true;

    const { findByText } = await renderPage(data);

    expect(await findByText(/Partial: Welcome to the queue \(can edit\)/)).toBeTruthy();
  });

  describe('with nothing in the queue', () => {
    it('suggests how to add events, with links to the catalog and schedule', async () => {
      const { findByText, getByRole, queryByText } = await renderPage(buildMySignupQueueData());

      expect(await findByText(/You currently have no events in your signup queue/)).toBeTruthy();
      expect(getByRole('link', { name: 'the event catalog' })).toHaveAttribute('href', '/events');
      expect(getByRole('link', { name: 'the event schedule' })).toHaveAttribute('href', '/events/schedule');
      expect(queryByText(/To add more events to your queue/)).toBeNull();
    });

    it('still shows the person’s settings', async () => {
      const { findByText } = await renderPage(buildMySignupQueueData());

      expect(await findByText('Limits')).toBeTruthy();
    });
  });

  describe('with choices in the queue', () => {
    const withChoices = () =>
      buildMySignupQueueData({
        signup_ranked_choices: [buildQueueRankedChoice({ id: '1', priority: 1 })],
      });

    it('shows the queue, and how to add more', async () => {
      const { findByText, getByRole, queryByText } = await renderPage(withChoices());

      expect(await findByText('Murder Mystery')).toBeTruthy();
      expect(getByRole('link', { name: 'the event catalog' })).toBeTruthy();
      expect(queryByText(/You currently have no events in your signup queue/)).toBeNull();
    });
  });

  it('announces the next signup round', async () => {
    const data = buildMySignupQueueData(
      {},
      {
        signup_rounds: [
          { __typename: 'SignupRound', id: '1', start: '2099-06-05T14:00:00Z', maximum_event_signups: '2' },
        ],
      },
    );

    const { findByText } = await renderPage(data);

    expect(await findByText(/The next signup round starts at/)).toBeTruthy();
  });
});
