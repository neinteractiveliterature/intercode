import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay, useConfirm } from '@neinteractiveliterature/litform';

import { Event } from '../graphqlTypes.generated';

export type EditEventHeaderProps = {
  event: Pick<Event, 'status' | 'title'> & { id: string };
  showDropButton: boolean;
  dropEvent: () => void;
};

function EditEventHeader({ event, showDropButton, dropEvent }: EditEventHeaderProps): JSX.Element {
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
            prompt: t('events.edit.dropPrompt', { eventTitle: event.title }),
            action: dropEvent,
            renderError: (error) => <ErrorDisplay graphQLError={error} />,
          })
        }
      >
        {t('events.edit.dropButton')}
      </button>
    );
  }

  return (
    <header>
      {dropButton}
      <h3 className="mb-4">{event.id ? t('events.edit.editHeader') : t('events.edit.newHeader')}</h3>
    </header>
  );
}

export default EditEventHeader;
