import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import Modal from 'react-bootstrap4-modal';
import { useMutation } from 'react-apollo-hooks';

import {
  EventAdminEventsQuery, RunFields, EventFields, ConventionFields,
} from './queries.gql';
import { CreateRun, UpdateRun, DeleteRun } from './mutations.gql';
import RunFormFields from '../BuiltInForms/RunFormFields';
import { useConfirm } from '../ModalDialogs/Confirm';
import ErrorDisplay from '../ErrorDisplay';

function EditRunModal({
  run, event, convention, editingRunChanged,
  onCancel, onSaveFailed, onSaveSucceeded, onSaveStart, onDelete,
}) {
  const [createRun] = useMutation(CreateRun);
  const [updateRun] = useMutation(UpdateRun);
  const [deleteMutate] = useMutation(DeleteRun);
  const confirm = useConfirm();

  const initiateSaveMutation = useCallback(
    () => {
      const commonProps = {
        run: {
          starts_at: run.starts_at,
          title_suffix: run.title_suffix,
          schedule_note: run.schedule_note,
          room_ids: run.rooms.map((room) => room.id),
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
            event_id: event.id,
            ...commonProps,
          },
        },
        update: (store, { data: { createRun: { run: newRun } } }) => {
          const eventsData = store.readQuery({ query: EventAdminEventsQuery });
          const eventData = eventsData.events.find((e) => e.id === event.id);
          eventData.runs.push(newRun);
          store.writeQuery({ query: EventAdminEventsQuery, data: eventsData });
        },
      });
    },
    [createRun, event, run, updateRun],
  );

  const saveRun = useCallback(
    async () => {
      onSaveStart();

      try {
        const data = await initiateSaveMutation();
        onSaveSucceeded(data.run);
      } catch (error) {
        onSaveFailed(error);
      }
    },
    [onSaveSucceeded, onSaveFailed, onSaveStart, initiateSaveMutation],
  );

  const deleteRun = useCallback(
    async () => {
      const data = await deleteMutate({
        variables: {
          input: {
            id: run.id,
          },
        },
        update: (store) => {
          const eventsData = store.readQuery({ query: EventAdminEventsQuery });
          const eventData = eventsData.events.find((e) => e.id === event.id);
          const runIndex = eventData.runs.findIndex((r) => r.id === run.id);
          eventData.runs.splice(runIndex, 1);
          store.writeQuery({ query: EventAdminEventsQuery, data: eventsData });
        },
      });
      onDelete(data);
    },
    [onDelete, deleteMutate, event, run],
  );

  const title = useMemo(
    () => {
      if (!run) {
        return null;
      }

      if (run.id != null) {
        return `Edit run of ${event.title} `;
      }

      return `Add run of ${event.title}`;
    },
    [event, run],
  );

  return (
    <div>
      <Modal visible={run != null && !confirm.visible} dialogClassName="modal-xl">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
        </div>
        {run && (
          <div className="modal-body">
            <RunFormFields
              run={run}
              event={event}
              convention={convention}
              onChange={editingRunChanged}
            />
          </div>
        )}
        <div className="modal-footer">
          <div className="d-flex w-100">
            <div>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => confirm({
                  prompt: `Are you sure you want to delete this run of ${event && event.title}?`,
                  action: deleteRun,
                  renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                })}
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

EditRunModal.propTypes = {
  run: propType(RunFields),
  event: propType(EventFields),
  convention: propType(ConventionFields).isRequired,
  editingRunChanged: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSaveStart: PropTypes.func.isRequired,
  onSaveSucceeded: PropTypes.func.isRequired,
  onSaveFailed: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

EditRunModal.defaultProps = {
  run: null,
  event: null,
};

export default EditRunModal;
