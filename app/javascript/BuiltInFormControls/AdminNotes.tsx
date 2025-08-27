import { useState, useRef } from 'react';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import PlainTextDisplay from '../PlainTextDisplay';
import { useTranslation } from 'react-i18next';

export type AdminNotesProps = {
  mutate: (value: string) => void;
  inProgress: boolean;
  error: ApolloError | undefined | null;
  value?: string;
};

function AdminNotes({ mutate, inProgress, error, value }: AdminNotesProps): React.JSX.Element {
  const { t } = useTranslation();
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const textareaElement = useRef<HTMLTextAreaElement | null>(null);

  const startEditing = () => {
    setEditingValue(value || '');
    if (textareaElement.current) {
      textareaElement.current.focus();
    }
  };

  const cancelEditing = () => {
    setEditingValue(null);
  };

  const saveClicked = async () => {
    await mutate(editingValue ?? '');
    setEditingValue(null);
  };

  if (editingValue == null) {
    return (
      <div className="input-group bg-warning-light border-warning border-1 w-100" style={{ maxWidth: '40em' }}>
        <div className="flex-grow-1 p-1">
          {value ? <PlainTextDisplay value={value} /> : <small className="text-muted">Admin notes</small>}
        </div>
        <button className="btn btn-secondary btn-sm" type="button" onClick={startEditing}>
          {t('buttons.edit')}
        </button>
      </div>
    );
  }

  return (
    <div className="card bg-warning-light w-100" style={{ maxWidth: '40em' }}>
      <div className="card-body">
        <h5 className="card-title">Admin notes</h5>
        <textarea
          className="form-control"
          value={editingValue}
          onChange={(event) => {
            setEditingValue(event.target.value);
          }}
          ref={textareaElement}
          aria-label="Admin notes"
        />
        <ErrorDisplay graphQLError={error} />
      </div>
      <div className="card-footer text-end">
        <button className="btn btn-secondary btn-sm" type="button" onClick={cancelEditing} disabled={inProgress}>
          {t('buttons.cancel')}
        </button>
        <button className="btn btn-primary btn-sm ms-2" type="button" onClick={saveClicked} disabled={inProgress}>
          {t('buttons.save')}
        </button>
      </div>
    </div>
  );
}

export default AdminNotes;
