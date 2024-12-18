import { useMemo } from 'react';
import * as React from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import RunFormFields from '../BuiltInForms/RunFormFields';
import { EditRunQueryData, EventFieldsFragment, NewRunQueryData, RunFieldsFragment } from './queries.generated';
import { useTranslation } from 'react-i18next';
import { Form, FormProps, useParams, useSubmit } from 'react-router';

export type EditingRun = Omit<RunFieldsFragment, 'starts_at'> & {
  starts_at?: RunFieldsFragment['starts_at'];
};

export type EditRunModalProps = {
  formProps: FormProps;
  convention: NewRunQueryData['convention'] | EditRunQueryData['convention'];
  run: EditingRun;
  event: EventFieldsFragment;
  editingRunChanged: React.Dispatch<EditingRun>;
  onCancel: () => void;
};

function EditRunModal({
  convention,
  run,
  event,
  editingRunChanged,
  onCancel,
  formProps,
}: EditRunModalProps): JSX.Element {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const submit = useSubmit();
  const { eventCategoryId } = useParams();

  const deleteRun = () => {
    submit({}, { action: `/admin_events/${eventCategoryId}/events/${event.id}/runs/${run.id}`, method: 'DELETE' });
  };

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
    <Modal visible={run != null && !confirm.visible} dialogClassName="modal-xl">
      <Form {...formProps}>
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
        </div>
        {run && (
          <div className="modal-body">
            <RunFormFields convention={convention} run={run} event={event} onChange={editingRunChanged} />
          </div>
        )}
        <div className="modal-footer">
          <div className="d-flex w-100">
            <div>
              {run.id && (
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
                  {t('buttons.delete')}
                </button>
              )}
            </div>
            <div className="col text-end pe-0">
              <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
                {t('buttons.cancel')}
              </button>
              <button type="submit" className="btn btn-primary" disabled={!run || run.starts_at == null}>
                {t('buttons.save')}
              </button>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default EditRunModal;
