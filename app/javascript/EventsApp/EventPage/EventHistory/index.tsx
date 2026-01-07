import { Navigate } from 'react-router';
import { useEventHistoryLoaderData } from './route';
import { useTranslation } from 'react-i18next';

export default function EventHistoryIndex() {
  const { t } = useTranslation();
  const { changeGroups } = useEventHistoryLoaderData();

  if (changeGroups.length === 0) {
    return <>{t('forms.history.noChanges')}</>;
  }

  return <Navigate to={`./${changeGroups[0].id}`} replace />;
}
