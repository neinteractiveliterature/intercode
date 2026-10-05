import { MockLink } from '@apollo/client/testing';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import ProposeEventButton from '../../../app/javascript/EventProposals/ProposeEventButton';
import {
  ProposeEventButtonQueryData,
  ProposeEventButtonQueryDocument,
} from '../../../app/javascript/EventProposals/queries.generated';

type Category = ProposeEventButtonQueryData['convention']['event_categories'][number];
type PastProposal = NonNullable<
  NonNullable<ProposeEventButtonQueryData['convention']['my_profile']>['user']
>['event_proposals'][number];

const category = (id: string, name: string, overrides: Partial<Category> = {}): Category => ({
  __typename: 'EventCategory',
  id,
  name,
  proposable: true,
  proposal_description: null,
  department: null,
  ...overrides,
});

const pastProposal = (id: string, title: string, categoryName: string, status = 'accepted'): PastProposal => ({
  __typename: 'EventProposal',
  id,
  title,
  status,
  created_at: '2025-01-01T00:00:00Z',
  event_category: { __typename: 'EventCategory', id: categoryName === 'Panel' ? '6' : '5', name: categoryName },
  convention: { __typename: 'Convention', id: '9', name: 'Last Year Con' },
});

const buildData = ({
  eventCategories = [category('5', 'Tabletop RPG'), category('6', 'Panel')],
  departments = [] as ProposeEventButtonQueryData['convention']['departments'],
  proposals = [] as PastProposal[],
  loggedIn = true,
}: {
  eventCategories?: Category[];
  departments?: ProposeEventButtonQueryData['convention']['departments'];
  proposals?: PastProposal[];
  loggedIn?: boolean;
} = {}): ProposeEventButtonQueryData => ({
  __typename: 'Query',
  convention: {
    __typename: 'Convention',
    id: '1',
    my_profile: loggedIn
      ? {
          __typename: 'UserConProfile',
          id: '2',
          user: { __typename: 'User', id: '3', event_proposals: proposals },
        }
      : null,
    departments,
    event_categories: eventCategories,
  },
});

describe('ProposeEventButton and its dialog', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let submissions: { method: string; path: string; search: string; body: Record<string, string> }[];
  let actionResult: () => unknown;

  beforeEach(() => {
    user = userEvent.setup();
    submissions = [];
    actionResult = () => null;
  });

  const renderButton = (data: ProposeEventButtonQueryData) => {
    const apolloMocks: MockLink.MockedResponse[] = [
      { request: { query: ProposeEventButtonQueryDocument }, result: { data } },
    ];
    return renderRoute(
      [
        { path: '/', Component: () => <ProposeEventButton caption="Propose an event" /> },
        {
          path: '/event_proposals',
          action: async ({ request }) => {
            const url = new URL(request.url);
            const formData = await request.formData();
            submissions.push({
              method: request.method,
              path: url.pathname,
              search: url.search,
              body: Object.fromEntries(Array.from(formData.entries()).map(([k, v]) => [k, String(v)])),
            });
            return actionResult();
          },
        },
      ],
      { apolloMocks, initialEntries: ['/'] },
    );
  };

  type Rendered = Awaited<ReturnType<typeof renderButton>>;

  const openDialog = async (r: Rendered) => {
    await user.click(await r.findByRole('button', { name: 'Propose an event' }));
    return r.findByText('New event proposal');
  };

  // react-select: open the menu by clicking the input, then pick the option
  const choose = async (r: Rendered, label: string | RegExp, option: string) => {
    await user.click(r.getByLabelText(label));
    await user.click(await r.findByRole('option', { name: option, hidden: true }));
  };

  const createButton = (r: Rendered) => r.getByRole('button', { name: 'Create proposal', hidden: true });

  it('asks a signed-out visitor to log in instead', async () => {
    const { findByRole, queryByRole } = await renderButton(buildData({ loggedIn: false }));

    expect(await findByRole('button', { name: 'Log in to propose an event' })).toBeTruthy();
    expect(queryByRole('button', { name: 'Propose an event' })).toBeNull();
  });

  describe('choosing a category', () => {
    it('cannot create a proposal until a category is chosen', async () => {
      const r = await renderButton(buildData());
      await openDialog(r);

      expect(createButton(r)).toBeDisabled();
    });

    it('offers only proposable categories', async () => {
      const r = await renderButton(
        buildData({
          eventCategories: [category('5', 'Tabletop RPG'), category('6', 'Staff only', { proposable: false })],
        }),
      );
      await openDialog(r);

      // (with one proposable category, it's the only choice)
      await user.click(r.getByLabelText(/What category of event/));
      expect(await r.findByRole('option', { name: 'Tabletop RPG', hidden: true })).toBeTruthy();
      expect(r.queryByRole('option', { name: 'Staff only', hidden: true })).toBeNull();
    });

    it('shows the category’s proposal description', async () => {
      const r = await renderButton(
        buildData({
          eventCategories: [
            category('5', 'Tabletop RPG', { proposal_description: 'Run a game at the table' }),
            category('6', 'Panel'),
          ],
        }),
      );
      await openDialog(r);

      await choose(r, /What category of event/, 'Tabletop RPG');

      expect(r.getByText('Run a game at the table')).toBeTruthy();
      expect(createButton(r)).toBeEnabled();
    });

    it('submits the chosen category to create the proposal', async () => {
      const r = await renderButton(buildData());
      await openDialog(r);

      await choose(r, /What category of event/, 'Panel');
      await user.click(createButton(r));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(submissions[0]).toMatchObject({
        method: 'POST',
        path: '/event_proposals',
        search: '?index',
        body: { event_category_id: '6' },
      });
    });

    it('closes the dialog without submitting when cancelled', async () => {
      const r = await renderButton(buildData());
      await openDialog(r);

      const footer = createButton(r).closest('.modal-footer') as HTMLElement;
      await user.click(within(footer).getByRole('button', { name: 'Cancel', hidden: true }));

      await waitFor(() => expect(createButton(r).closest('.modal')?.getAttribute('aria-hidden')).toBe('true'));
      expect(submissions).toEqual([]);
    });

    it('shows the error if creating fails', async () => {
      actionResult = () => new Error('Category is not accepting proposals');
      const r = await renderButton(buildData());
      await openDialog(r);

      await choose(r, /What category of event/, 'Panel');
      await user.click(createButton(r));

      expect(await r.findByText(/Category is not accepting proposals/)).toBeTruthy();
    });
  });

  describe('with departments', () => {
    const departments = [
      {
        __typename: 'Department' as const,
        id: '8',
        name: 'Larps',
        proposal_description: 'All kinds of larp',
        event_categories: [{ __typename: 'EventCategory' as const, id: '10' }],
      },
    ];
    const withDepartment = () =>
      buildData({
        eventCategories: [
          category('10', 'Boffer Larp', { department: { __typename: 'Department', id: '8' } }),
          category('11', 'Parlor Larp', { department: { __typename: 'Department', id: '8' } }),
          category('6', 'Panel'),
        ],
        departments,
      });

    it('asks for a subcategory after choosing a department, and shows its description', async () => {
      const r = await renderButton(withDepartment());
      await openDialog(r);

      await choose(r, /What category of event/, 'Larps');

      expect(r.getByText('All kinds of larp')).toBeTruthy();
      expect(createButton(r)).toBeDisabled();
      await choose(r, /What subcategory of Larps/, 'Parlor Larp');
      await user.click(createButton(r));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(submissions[0].body.event_category_id).toBe('11');
    });

    it('does not list categories that belong to a department at the top level', async () => {
      const r = await renderButton(withDepartment());
      await openDialog(r);

      await user.click(r.getByLabelText(/What category of event/));

      expect(await r.findByRole('option', { name: 'Panel', hidden: true })).toBeTruthy();
      expect(r.getByRole('option', { name: 'Larps', hidden: true })).toBeTruthy();
      expect(r.queryByRole('option', { name: 'Boffer Larp', hidden: true })).toBeNull();
    });

    it('lets a different top-level choice replace the department', async () => {
      const r = await renderButton(withDepartment());
      await openDialog(r);
      await choose(r, /What category of event/, 'Larps');

      await choose(r, /What category of event/, 'Panel');

      expect(r.queryByLabelText(/What subcategory/)).toBeNull();
      expect(createButton(r)).toBeEnabled();
    });
  });

  describe('cloning an earlier proposal', () => {
    const proposals = [
      pastProposal('50', 'Old Game', 'Tabletop RPG'),
      pastProposal('51', 'Old Panel', 'Panel'),
      pastProposal('52', 'Unfinished', 'Tabletop RPG', 'draft'),
    ];

    it('offers non-draft proposals from the chosen category', async () => {
      const r = await renderButton(buildData({ proposals }));
      await openDialog(r);
      await choose(r, /What category of event/, 'Tabletop RPG');

      await user.click(r.getByLabelText(/If you'd like to propose an event you've proposed/));

      expect(await r.findByRole('option', { name: /Old Game/, hidden: true })).toBeTruthy();
      expect(r.queryByRole('option', { name: /Old Panel/, hidden: true })).toBeNull();
      expect(r.queryByRole('option', { name: /Unfinished/, hidden: true })).toBeNull();
    });

    it('sends the proposal to clone along with the category', async () => {
      const r = await renderButton(buildData({ proposals }));
      await openDialog(r);
      await choose(r, /What category of event/, 'Tabletop RPG');
      await choose(r, /If you'd like to propose an event you've proposed/, 'Old Game (Tabletop RPG, Last Year Con)');

      await user.click(createButton(r));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(submissions[0].body).toEqual({ clone_event_proposal_id: '50', event_category_id: '5' });
    });

    it('warns if the category is changed to one that differs from the proposal being cloned', async () => {
      const r = await renderButton(buildData({ proposals }));
      await openDialog(r);
      await choose(r, /What category of event/, 'Tabletop RPG');
      await choose(r, /If you'd like to propose an event you've proposed/, 'Old Game (Tabletop RPG, Last Year Con)');

      await choose(r, /What category of event/, 'Panel');

      expect(r.getByText(/You are proposing a Panel, but copying information from Old Game/)).toBeTruthy();
    });
  });
});
