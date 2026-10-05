import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import runAction from '../runAction';
import { action as createAction } from '../../../app/javascript/EventAdmin/create';
import { action as updateAction } from '../../../app/javascript/EventAdmin/$id';
import { action as dropAction } from '../../../app/javascript/EventAdmin/drop';
import { action as restoreAction } from '../../../app/javascript/EventAdmin/RestoreEventRoute';
import { action as deleteRunAction } from '../../../app/javascript/EventAdmin/SingleRunRoute';
import { action as createMultipleRunsAction } from '../../../app/javascript/EventAdmin/CreateMultipleRunsRoute';
import { action as adminNotesAction } from '../../../app/javascript/EventAdmin/AdminNotesRoute';
import {
  CreateEventDocument,
  CreateFillerEventDocument,
  CreateMultipleRunsDocument,
  CreateOrUpdateRunForEventDocument,
  DeleteRunDocument,
  DropEventDocument,
  RestoreDroppedEventDocument,
  UpdateEventAdminNotesDocument,
  UpdateEventDocument,
} from '../../../app/javascript/EventAdmin/mutations.generated';
import { EventAdminEventsQueryDocument } from '../../../app/javascript/EventAdmin/queries.generated';
import { SchedulingUi } from '../../../app/javascript/graphqlTypes.generated';

// The results here carry only what the actions look at; Apollo notes the fields they leave out, which is fine
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

const location = (result: unknown) => (result as Response).headers.get('Location');

describe('the event admin actions', () => {
  const sent = vi.fn();

  beforeEach(() => {
    sent.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const eventPayload = (type: string, field: string) => ({
    [field]: {
      __typename: type,
      event: { __typename: 'Event', id: '9', convention: { __typename: 'Convention', id: '1' } },
    },
  });

  const eventInput = {
    event_category: { id: '4' },
    form_response_attrs: { title: 'Big Game', total_slots: 12, length_seconds: 3600 },
  };

  describe('creating an event', () => {
    it('creates a regular event, leaving out total_slots, and goes back to the category', async () => {
      const { result } = await runAction(createAction, {
        method: 'POST',
        json: {
          event: eventInput,
          eventCategory: { id: '4', scheduling_ui: SchedulingUi.Regular },
          signedImageBlobIds: ['blob1'],
        },
        apolloMocks: [recordingMock(CreateEventDocument, eventPayload('CreateEventPayload', 'createEvent'), sent)],
      });

      expect(sent).toHaveBeenCalledWith({
        input: {
          event: {
            eventCategoryId: '4',
            form_response_attrs_json: JSON.stringify({ title: 'Big Game', length_seconds: 3600 }),
          },
          signedImageBlobIds: ['blob1'],
        },
      });
      expect(location(result)).toBe('/admin_events/4');
    });

    it('creates a single-run (filler) event with its run and the staff defaults', async () => {
      await runAction(createAction, {
        method: 'POST',
        json: {
          event: eventInput,
          eventCategory: { id: '4', scheduling_ui: SchedulingUi.SingleRun },
          run: { starts_at: '2026-06-05T18:00:00Z', rooms: [{ id: '2' }], schedule_note: 'Bring a snack' },
        },
        apolloMocks: [
          recordingMock(CreateFillerEventDocument, eventPayload('CreateFillerEventPayload', 'createFillerEvent'), sent),
        ],
      });

      const input = sent.mock.calls[0][0].input;
      expect(JSON.parse(input.event.form_response_attrs_json)).toEqual({
        can_play_concurrently: false,
        con_mail_destination: 'event_email',
        author: '{{ convention.name }} Staff',
        title: 'Big Game',
        length_seconds: 3600,
      });
      expect(input.run).toMatchObject({
        starts_at: '2026-06-05T18:00:00Z',
        schedule_note: 'Bring a snack',
        roomIds: ['2'],
      });
    });

    it('lets what the form says override the single-run defaults', async () => {
      await runAction(createAction, {
        method: 'POST',
        json: {
          event: { ...eventInput, form_response_attrs: { author: 'Someone Else', length_seconds: 60 } },
          eventCategory: { id: '4', scheduling_ui: SchedulingUi.SingleRun },
          run: { starts_at: '2026-06-05T18:00:00Z' },
        },
        apolloMocks: [
          recordingMock(CreateFillerEventDocument, eventPayload('CreateFillerEventPayload', 'createFillerEvent'), sent),
        ],
      });

      expect(JSON.parse(sent.mock.calls[0][0].input.event.form_response_attrs_json).author).toBe('Someone Else');
    });

    it('returns an error for a single-run event without a run', async () => {
      const { result } = await runAction(createAction, {
        method: 'POST',
        json: { event: eventInput, eventCategory: { id: '4', scheduling_ui: SchedulingUi.SingleRun } },
      });

      expect(result).toBeInstanceOf(Error);
      expect((result as Error).message).toMatch(/run must be provided/);
    });

    it('returns the error when the mutation fails', async () => {
      const { result } = await runAction(createAction, {
        method: 'POST',
        json: { event: eventInput, eventCategory: { id: '4', scheduling_ui: SchedulingUi.Regular } },
        apolloMocks: [
          {
            request: { query: CreateEventDocument, variables: () => true },
            error: new Error('Title has already been taken'),
          },
        ],
      });

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('updating an event', () => {
    const updatePayload = {
      updateEvent: { __typename: 'UpdateEventPayload', event: { __typename: 'Event', id: '9' } },
    };

    it('updates a regular event and goes back to the category', async () => {
      const { result } = await runAction(updateAction, {
        method: 'PATCH',
        json: {
          event: { ...eventInput, id: '9' },
          eventCategory: { id: '4', scheduling_ui: SchedulingUi.Regular },
        },
        apolloMocks: [recordingMock(UpdateEventDocument, updatePayload, sent)],
      });

      expect(sent).toHaveBeenCalledWith({
        input: {
          event: {
            eventCategoryId: '4',
            form_response_attrs_json: JSON.stringify({ title: 'Big Game', length_seconds: 3600 }),
          },
          id: '9',
        },
      });
      expect(location(result)).toBe('/admin_events/4');
    });

    it('passes bucket key mappings along', async () => {
      await runAction(updateAction, {
        method: 'PATCH',
        json: {
          event: { ...eventInput, id: '9', bucket_key_mappings: [{ previous_key: 'a', new_key: 'b' }] },
          eventCategory: { id: '4', scheduling_ui: SchedulingUi.Regular },
        },
        apolloMocks: [recordingMock(UpdateEventDocument, updatePayload, sent)],
      });

      expect(sent.mock.calls[0][0].input.event.bucket_key_mappings).toEqual([{ previous_key: 'a', new_key: 'b' }]);
    });

    it('updates a single-run event and then its run', async () => {
      const runSent = vi.fn();
      await runAction(updateAction, {
        method: 'PATCH',
        json: {
          event: { ...eventInput, id: '9' },
          eventCategory: { id: '4', scheduling_ui: SchedulingUi.SingleRun },
          run: { id: '33', starts_at: '2026-06-05T18:00:00Z', rooms: [{ id: '2' }, { id: '3' }] },
        },
        apolloMocks: [
          recordingMock(UpdateEventDocument, updatePayload, sent),
          recordingMock(
            CreateOrUpdateRunForEventDocument,
            {
              createOrUpdateRunForEvent: {
                __typename: 'CreateOrUpdateRunForEventPayload',
                run: { __typename: 'Run', id: '33' },
              },
            },
            runSent,
          ),
        ],
      });

      expect(sent).toHaveBeenCalledTimes(1);
      expect(runSent).toHaveBeenCalledWith({
        input: {
          run: expect.objectContaining({ starts_at: '2026-06-05T18:00:00Z', roomIds: ['2', '3'] }),
          eventId: '9',
        },
      });
    });

    it('skips the run when it has no start time', async () => {
      const runSent = vi.fn();
      await runAction(updateAction, {
        method: 'PATCH',
        json: {
          event: { ...eventInput, id: '9' },
          eventCategory: { id: '4', scheduling_ui: SchedulingUi.SingleRun },
          run: { starts_at: null },
        },
        apolloMocks: [
          recordingMock(UpdateEventDocument, updatePayload, sent),
          recordingMock(CreateOrUpdateRunForEventDocument, {}, runSent),
        ],
      });

      expect(runSent).not.toHaveBeenCalled();
    });

    it('returns an error for a single-run event without a run', async () => {
      const { result } = await runAction(updateAction, {
        method: 'PATCH',
        json: { event: { ...eventInput, id: '9' }, eventCategory: { id: '4', scheduling_ui: SchedulingUi.SingleRun } },
      });

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('dropping an event', () => {
    it('drops it and goes back two levels', async () => {
      const { result } = await runAction(dropAction, {
        method: 'PATCH',
        params: { eventId: '9' },
        apolloMocks: [
          recordingMock(
            DropEventDocument,
            {
              dropEvent: { __typename: 'DropEventPayload', event: { __typename: 'Event', id: '9', status: 'dropped' } },
            },
            sent,
          ),
        ],
      });

      expect(sent).toHaveBeenCalledWith({ input: { id: '9' } });
      expect(location(result)).toBe('../..');
    });

    it('responds 404 to other methods', async () => {
      const { result } = await runAction(dropAction, { method: 'POST', params: { eventId: '9' } });

      expect((result as Response).status).toBe(404);
    });
  });

  describe('restoring a dropped event', () => {
    it('restores it, refetching the events, and goes to the dropped events list', async () => {
      const refetched = vi.fn();
      const { result } = await runAction(restoreAction, {
        method: 'PATCH',
        params: { eventId: '9' },
        apolloMocks: [
          recordingMock(
            RestoreDroppedEventDocument,
            {
              restoreDroppedEvent: {
                __typename: 'RestoreDroppedEventPayload',
                event: { __typename: 'Event', id: '9', status: 'active' },
              },
            },
            sent,
          ),
          {
            request: { query: EventAdminEventsQueryDocument },
            result: () => {
              refetched();
              return { data: { __typename: 'Query' } };
            },
          },
        ],
      });

      expect(sent).toHaveBeenCalledWith({ input: { id: '9' } });
      expect(refetched).toHaveBeenCalled();
      expect(location(result)).toBe('/admin_events/dropped_events');
    });
  });

  describe('deleting a run', () => {
    it('deletes it and goes back to the category', async () => {
      const { result } = await runAction(deleteRunAction, {
        method: 'DELETE',
        params: { eventCategoryId: '4', eventId: '9', runId: '33' },
        apolloMocks: [
          recordingMock(
            DeleteRunDocument,
            { deleteRun: { __typename: 'DeleteRunPayload', run: { __typename: 'Run', id: '33' } } },
            sent,
          ),
        ],
      });

      expect(sent).toHaveBeenCalledWith({ input: { id: '33' } });
      expect(location(result)).toBe('/admin_events/4');
    });

    it('responds 404 to other methods', async () => {
      const { result } = await runAction(deleteRunAction, { method: 'PATCH', params: { runId: '33' } });

      expect((result as Response).status).toBe(404);
    });
  });

  describe('creating multiple runs', () => {
    it('makes a run for each start time, all in the chosen rooms, and resets the store', async () => {
      const { resetStore } = await runAction(createMultipleRunsAction, {
        method: 'POST',
        params: { eventId: '9' },
        json: { starts_at: ['2026-06-05T18:00:00Z', '2026-06-06T18:00:00Z'], room_id: ['2', '3'] },
        apolloMocks: [
          recordingMock(
            CreateMultipleRunsDocument,
            { createMultipleRuns: { __typename: 'CreateMultipleRunsPayload', runs: [] } },
            sent,
          ),
        ],
      });

      expect(sent).toHaveBeenCalledWith({
        input: {
          eventId: '9',
          runs: [
            { starts_at: '2026-06-05T18:00:00Z', roomIds: ['2', '3'] },
            { starts_at: '2026-06-06T18:00:00Z', roomIds: ['2', '3'] },
          ],
        },
      });
      expect(resetStore).toHaveBeenCalled();
    });

    it('returns the error when the body is not what it expects', async () => {
      const { result } = await runAction(createMultipleRunsAction, {
        method: 'POST',
        params: { eventId: '9' },
        json: { room_id: ['2'] },
      });

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('updating admin notes', () => {
    it('sends the notes and goes back two levels', async () => {
      const { result } = await runAction(adminNotesAction, {
        method: 'PATCH',
        params: { eventId: '9' },
        form: { admin_notes: 'Needs a table' },
        apolloMocks: [
          recordingMock(
            UpdateEventAdminNotesDocument,
            {
              updateEventAdminNotes: {
                __typename: 'UpdateEventAdminNotesPayload',
                event: { __typename: 'Event', id: '9' },
              },
            },
            sent,
          ),
          { request: { query: EventAdminEventsQueryDocument }, result: { data: { __typename: 'Query' } } },
        ],
      });

      expect(sent).toHaveBeenCalledWith({ eventId: '9', adminNotes: 'Needs a table' });
      expect(location(result)).toBe('../..');
    });
  });
});
