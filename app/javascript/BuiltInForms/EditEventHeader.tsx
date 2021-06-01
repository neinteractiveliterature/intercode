import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay, useConfirm } from '@neinteractiveliterature/litform';

import { Event } from '../graphqlTypes.generated';

export type EditEventHeaderProps = {
  event: Pick<Event, 'id' | 'status' | 'title'>;
  showDropButton: boolean;
  dropEvent: () => void;
};

function EditEventHeader({ event, showDropButton, dropEvent }: EditEventHeaderProps) {
  const { t } = useTranslation();
  const confirm = useConfirm();

  let dropButton: ReactNode;
  if (showDropButton && event.id && event.status !== 'dropped') {
    dropButton = (
      <button
        type="button"
        className="btn btn-outline-danger float-end"
        onClick={() =>
          confirm({
            prompt: t(
              'events.edit.dropPrompt',
              'Are you sure you want to drop {{ eventTitle }}?  Doing so will also delete any runs of this event and remove any participants signed up for those runs.',
              { eventTitle: event.title },
            ),
            action: dropEvent,
            renderError: (error) => <ErrorDisplay graphQLError={error} />,
          })
        }
      >
        {t('events.edit.dropButton', 'Drop event')}
      </button>
    );
  }

  return (
    <header>
      {dropButton}

      <h3 className="mb-4">
        {event.id
          ? t('events.edit.editHeader', 'Edit event')
          : t('events.edit.newHeader', 'New event')}
      </h3>
    </header>
  );
}

export default EditEventHeader;
