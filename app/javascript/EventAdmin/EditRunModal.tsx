import React, { useCallback, useMemo } from 'react';
import Modal from 'react-bootstrap4-modal';

import { EventAdminEventsQuery } from './queries';
import RunFormFields from '../BuiltInForms/RunFormFields';
import { useConfirm } from '../ModalDialogs/Confirm';
import ErrorDisplay from '../ErrorDisplay';
import {
  useCreateRunMutation,
  useDeleteRunMutation,
  useUpdateRunMutation,
} from './mutations.generated';
import {
  EventAdminEventsQueryQuery,
  EventFieldsFragment,
  RunFieldsFragment,
} from './queries.generated';

export type EditRunModalProps = {
  run: RunFieldsFragment;
  event: EventFieldsFragment;
  editingRunChanged: React.Dispatch<RunFieldsFragment>;
  onCancel: () => void;
  onSaveFailed: (error: Error) => void;
  onSaveSucceeded: () => void;
  onSaveStart: () => void;
  onDelete: () => void;
};

function EditRunModal({
  run,
  event,
  editingRunChanged,
  onCancel,
  onSaveFailed,
  onSaveSucceeded,
  onSaveStart,
  onDelete,
}: EditRunModalProps) {
  const [createRun] = useCreateRunMutation();
  const [updateRun] = useUpdateRunMutation();
  const [deleteMutate] = useDeleteRunMutation();
  const confirm = useConfirm();

  const initiateSaveMutation = useCallback(() => {
    const commonProps = {
      run: {
        starts_at: run.starts_at,
        title_suffix: run.title_suffix,
        schedule_note: run.schedule_note,
        room_ids: run.rooms.map((room) => room.id),
      },
    };

    if (run.id > 0) {
      return updateRun({
        variables: {
          input: {
            id: run.id,
            ...commonProps,
          },
        },
      });
    }

    return createRun({
      variables: {
        input: {
          event_id: event.id,
          ...commonProps,
        },
      },
      update: (store, { data }) => {
        const eventsData = store.readQuery<EventAdminEventsQueryQuery>({
          query: EventAdminEventsQuery,
        });
        const newRun = data?.createRun?.run;
        if (!eventsData || !newRun) {
          return;
        }
        store.writeQuery({
          query: EventAdminEventsQuery,
          data: {
            ...eventsData,
            events: eventsData.events.map((e) => {
              if (e.id === event.id) {
                return { ...e, runs: [...e.runs, newRun] };
              }

              return e;
            }),
          },
        });
      },
    });
  }, [createRun, event, run, updateRun]);

  const saveRun = useCallback(async () => {
    onSaveStart();

    try {
      await initiateSaveMutation();
      onSaveSucceeded();
    } catch (error) {
      onSaveFailed(error);
    }
  }, [onSaveSucceeded, onSaveFailed, onSaveStart, initiateSaveMutation]);

  const deleteRun = useCallback(async () => {
    await deleteMutate({
      variables: {
        input: {
          id: run.id,
        },
      },
      update: (store) => {
        const eventsData = store.readQuery<EventAdminEventsQueryQuery>({
          query: EventAdminEventsQuery,
        });
        if (!eventsData) {
          return;
        }
        store.writeQuery({
          query: EventAdminEventsQuery,
          data: {
            ...eventsData,
            events: eventsData.events.map((e) => {
              if (e.id === event.id) {
                return {
                  ...e,
                  runs: e.runs.filter((r) => r.id !== run.id),
                };
              }

              return e;
            }),
          },
        });
      },
    });
    onDelete();
  }, [onDelete, deleteMutate, event, run]);

  const title = useMemo(() => {
    if (!run) {
      return null;
    }

    if (run.id > 0) {
      return `Edit run of ${event.title} `;
    }

    return `Add run of ${event.title}`;
  }, [event, run]);

  return (
    <div>
      <Modal visible={run != null && !confirm.visible} dialogClassName="modal-xl">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
        </div>
        {run && (
          <div className="modal-body">
            <RunFormFields run={run} event={event} onChange={editingRunChanged} />
          </div>
        )}
        <div className="modal-footer">
          <div className="d-flex w-100">
            <div>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() =>
                  confirm({
                    prompt: `Are you sure you want to delete this run of ${event && event.title}?`,
                    action: deleteRun,
                    renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                  })
                }
              >
                Delete
              </button>
            </div>
            <div className="col text-right pr-0">
              <button type="button" className="btn btn-secondary mr-2" onClick={onCancel}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveRun}
                disabled={!run || run.starts_at == null}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EditRunModal;
