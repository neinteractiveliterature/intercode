import { useCallback, useMemo } from 'react';
import * as React from 'react';
import { Modal } from 'react-bootstrap4-modal';
import {
  useConfirm,
  ErrorDisplay,
  useCreateMutationWithReferenceArrayUpdater,
  useDeleteMutationWithReferenceArrayUpdater,
} from '@neinteractiveliterature/litform';

import RunFormFields from '../BuiltInForms/RunFormFields';
import { useCreateRunMutation, useDeleteRunMutation, useUpdateRunMutation } from './mutations.generated';
import { EventFieldsFragment, RunFieldsFragment, RunFieldsFragmentDoc } from './queries.generated';

export type EditingRun = Omit<RunFieldsFragment, 'starts_at'> & {
  starts_at?: RunFieldsFragment['starts_at'];
};

export type EditRunModalProps = {
  run: EditingRun;
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
}: EditRunModalProps): JSX.Element {
  const [createRun] = useCreateMutationWithReferenceArrayUpdater(
    useCreateRunMutation,
    event,
    'runs',
    (data) => data.createRun.run,
    RunFieldsFragmentDoc,
    'RunFields',
  );
  const [updateRun] = useUpdateRunMutation();
  const [deleteMutate] = useDeleteMutationWithReferenceArrayUpdater(useDeleteRunMutation, event, 'runs', (run) => ({
    input: { id: run.id },
  }));
  const confirm = useConfirm();

  const initiateSaveMutation = useCallback(() => {
    const commonProps = {
      run: {
        starts_at: run.starts_at,
        title_suffix: run.title_suffix,
        schedule_note: run.schedule_note,
        roomIds: run.rooms.map((room) => room.id),
      },
    };

    if (run.id) {
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
          eventId: event.id,
          ...commonProps,
        },
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
    await deleteMutate({ ...run, starts_at: 'does not matter for this mutation' });
    onDelete();
  }, [onDelete, deleteMutate, run]);

  const title = useMemo(() => {
    if (!run) {
      return null;
    }

    if (run.id) {
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
            <div className="col text-end pe-0">
              <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
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
