import { useState, useRef } from 'react';
import { ApolloError, FetchResult } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import PlainTextDisplay from '../PlainTextDisplay';
import useAsyncFunction from '../useAsyncFunction';

export type AdminNotesProps = {
  mutate: (value: string) => Promise<FetchResult<any>>;
  value?: string;
};

function AdminNotes({ mutate, value }: AdminNotesProps) {
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const [save, saveError, saveInProgress] = useAsyncFunction(mutate);
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
    await save(editingValue ?? '');
    setEditingValue(null);
  };

  if (editingValue == null) {
    return (
      <div
        className="input-group bg-warning-light border-warning border-1 w-100"
        style={{ maxWidth: '40em' }}
      >
        <div className="flex-grow-1 p-1">
          {value ? (
            <PlainTextDisplay value={value} />
          ) : (
            <small className="text-muted">Admin notes</small>
          )}
        </div>
        <button className="btn btn-secondary btn-sm" type="button" onClick={startEditing}>
          Edit
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
        <ErrorDisplay graphQLError={saveError as ApolloError} />
      </div>
      <div className="card-footer text-end">
        <button
          className="btn btn-secondary btn-sm"
          type="button"
          onClick={cancelEditing}
          disabled={saveInProgress}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary btn-sm ms-2"
          type="button"
          onClick={saveClicked}
          disabled={saveInProgress}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default AdminNotes;
