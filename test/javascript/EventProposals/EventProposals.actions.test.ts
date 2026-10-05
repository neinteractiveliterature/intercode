import { MockLink } from '@apollo/client/testing';

import runAction from '../runAction';
import { action as createAction } from '../../../app/javascript/EventProposals/route';
import { action as transitionAction } from '../../../app/javascript/EventProposals/$id/transition';
import { action as deleteAction } from '../../../app/javascript/EventProposals/$id/route';
import { action as adminNotesAction } from '../../../app/javascript/EventProposals/$id/admin_notes';
import {
  CreateEventProposalDocument,
  DeleteEventProposalDocument,
  TransitionEventProposalDocument,
  UpdateEventProposalAdminNotesDocument,
} from '../../../app/javascript/EventProposals/mutations.generated';
import { buildEventProposalFields } from '../fixtures/eventProposals';

const recordingMock = (
  query: MockLink.MockedResponse['request']['query'],
  data: Record<string, unknown>,
  record: (variables: unknown) => void,
): MockLink.MockedResponse => ({
  request: {
    query,
    variables: (variables: unknown) => {
      record(variables);
      return true;
    },
  },
  result: { data },
});

describe('the event proposal actions', () => {
  const sent = vi.fn();

  beforeEach(() => sent.mockReset());

  describe('creating a proposal', () => {
    const mutationMock = () =>
      recordingMock(
        CreateEventProposalDocument,
        {
          createEventProposal: {
            __typename: 'CreateEventProposalPayload',
            event_proposal: { __typename: 'EventProposal', id: '77' },
          },
        },
        sent,
      );

    it('creates a proposal in the chosen category and redirects to its edit page', async () => {
      const { result, client } = await runAction(createAction, {
        method: 'POST',
        form: { event_category_id: '5' },
        apolloMocks: [mutationMock()],
      });
      const clearStore = vi.spyOn(client, 'clearStore');

      expect(sent).toHaveBeenCalledWith({ eventCategoryId: '5', cloneEventProposalId: undefined });
      expect((result as Response).status).toBe(302);
      expect((result as Response).headers.get('Location')).toBe('/event_proposals/77/edit');
      expect(clearStore).not.toHaveBeenCalled();
    });

    it('can clone an earlier proposal', async () => {
      await runAction(createAction, {
        method: 'POST',
        form: { event_category_id: '5', clone_event_proposal_id: '12' },
        apolloMocks: [mutationMock()],
      });

      expect(sent).toHaveBeenCalledWith({ eventCategoryId: '5', cloneEventProposalId: '12' });
    });

    it('returns the error if the mutation fails', async () => {
      const { result } = await runAction(createAction, {
        method: 'POST',
        form: { event_category_id: '5' },
        apolloMocks: [
          {
            request: { query: CreateEventProposalDocument, variables: { eventCategoryId: '5' } },
            error: new Error('nope'),
          },
        ],
      });

      expect(result).toBeInstanceOf(Error);
    });

    it('responds 404 to other methods', async () => {
      const { result } = await runAction(createAction, { method: 'GET' });

      expect((result as Response).status).toBe(404);
    });
  });

  describe('transitioning a proposal', () => {
    const transitionMock = () =>
      recordingMock(
        TransitionEventProposalDocument,
        {
          transitionEventProposal: {
            __typename: 'TransitionEventProposalPayload',
            event_proposal: buildEventProposalFields({ status: 'accepted' }),
          },
        },
        sent,
      );

    it('sends the new status and resets the store', async () => {
      const { result, resetStore } = await runAction(transitionAction, {
        method: 'PATCH',
        params: { id: '20' },
        form: { status: 'accepted' },
        apolloMocks: [transitionMock()],
      });

      expect(sent).toHaveBeenCalledWith({ eventProposalId: '20', status: 'accepted', dropEvent: false });
      expect(resetStore).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });

    it('can ask for the event to be dropped', async () => {
      await runAction(transitionAction, {
        method: 'PATCH',
        params: { id: '20' },
        form: { status: 'rejected', drop_event: 'true' },
        apolloMocks: [
          recordingMock(
            TransitionEventProposalDocument,
            {
              transitionEventProposal: {
                __typename: 'TransitionEventProposalPayload',
                event_proposal: buildEventProposalFields({ status: 'rejected' }),
              },
            },
            sent,
          ),
        ],
      });

      expect(sent).toHaveBeenCalledWith({ eventProposalId: '20', status: 'rejected', dropEvent: true });
    });

    it('returns the error when there is no status', async () => {
      const { result } = await runAction(transitionAction, { method: 'PATCH', params: { id: '20' }, form: {} });

      expect(result).toBeInstanceOf(Error);
    });

    it('returns the error if the mutation fails, without resetting the store', async () => {
      const { result, resetStore } = await runAction(transitionAction, {
        method: 'PATCH',
        params: { id: '20' },
        form: { status: 'accepted' },
        apolloMocks: [
          {
            request: {
              query: TransitionEventProposalDocument,
              variables: { eventProposalId: '20', status: 'accepted', dropEvent: false },
            },
            error: new Error('Cannot accept'),
          },
        ],
      });

      expect(result).toBeInstanceOf(Error);
      expect(resetStore).not.toHaveBeenCalled();
    });
  });

  describe('deleting a proposal', () => {
    it('deletes it, resets the store and goes back to the new-proposal page', async () => {
      const { result, resetStore } = await runAction(deleteAction, {
        method: 'DELETE',
        params: { id: '20' },
        apolloMocks: [
          recordingMock(
            DeleteEventProposalDocument,
            { deleteEventProposal: { __typename: 'DeleteEventProposalPayload', clientMutationId: null } },
            sent,
          ),
        ],
      });

      expect(sent).toHaveBeenCalledWith({ id: '20' });
      expect(resetStore).toHaveBeenCalled();
      expect((result as Response).headers.get('Location')).toBe('/pages/new-proposal');
    });

    it('responds 404 to other methods', async () => {
      const { result } = await runAction(deleteAction, { method: 'PATCH', params: { id: '20' } });

      expect((result as Response).status).toBe(404);
    });
  });

  describe('updating admin notes', () => {
    it('sends the notes', async () => {
      await runAction(adminNotesAction, {
        method: 'PATCH',
        params: { id: '20' },
        form: { admin_notes: 'Looks good' },
        apolloMocks: [
          recordingMock(
            UpdateEventProposalAdminNotesDocument,
            {
              updateEventProposalAdminNotes: {
                __typename: 'UpdateEventProposalAdminNotesPayload',
                event_proposal: buildEventProposalFields(),
              },
            },
            sent,
          ),
        ],
      });

      expect(sent).toHaveBeenCalledWith({ eventProposalId: '20', adminNotes: 'Looks good' });
    });

    it('responds 404 to other methods', async () => {
      const { result } = await runAction(adminNotesAction, { method: 'POST', params: { id: '20' } });

      expect((result as Response).status).toBe(404);
    });
  });
});
