import { useCallback, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import useAsyncFunction from '../useAsyncFunction';
import EditEventHeader from './EditEventHeader';
import { Event } from '../graphqlTypes.generated';

export type EditEventProps = {
  children?: ReactNode;
  cancelPath?: string;
  event: Pick<Event, 'status' | 'title'> & { id: string };
  validateForm: () => boolean;
  updateEvent: () => unknown;
  onSave?: () => void;
  showDropButton?: boolean;
  dropEvent?: () => unknown;
  onDrop?: () => void;
};

export default function EditEvent({
  children,
  cancelPath,
  showDropButton,
  event,
  dropEvent,
  validateForm,
  updateEvent,
  onSave,
  onDrop,
}: EditEventProps): JSX.Element {
  const [updateEventCallback, updateError, updateInProgress] = useAsyncFunction(
    useCallback(async () => {
      if (!validateForm()) {
        return;
      }

      await updateEvent();
      if (onSave != null) {
        onSave();
      }
    }, [updateEvent, onSave, validateForm]),
    { suppressError: true },
  );

  const [dropEventCallback, , dropInProgress] = useAsyncFunction(
    useCallback(async () => {
      if (dropEvent != null) {
        await dropEvent();
        if (onDrop != null) {
          onDrop();
        }
      }
    }, [dropEvent, onDrop]),
  );

  const saveCaption = event.id ? 'Save event' : 'Create event';

  return (
    <form className="my-4">
      <EditEventHeader event={event} showDropButton={showDropButton ?? false} dropEvent={dropEventCallback} />

      {children}

      <ErrorDisplay graphQLError={updateError as ApolloError} />

      <div className="d-flex align-items-center mt-4">
        <button
          type="button"
          className="btn btn-primary"
          disabled={updateInProgress || dropInProgress}
          onClick={updateEventCallback}
        >
          {saveCaption}
        </button>

        {cancelPath && (
          <Link to={cancelPath} className="btn btn-link">
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
