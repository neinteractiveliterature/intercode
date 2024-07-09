import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import FormResponseChangeHistory from '../../FormPresenter/ItemChangeDisplays/FormResponseChangeHistory';
import RouteActivatedBreadcrumbItem from '../../Breadcrumbs/RouteActivatedBreadcrumbItem';
import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import { useEventHistoryQuery } from './eventHistoryQuery.generated';
import { useParams } from 'react-router';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform/dist';
import buildEventUrl from '../buildEventUrl';

const EXCLUDE_FIELDS = new Set([
  'minimum_age',
  'age_restrictions_description',
  'con_mail_destination',
  'email',
  'team_mailing_list_name',
]);

function useEventHistoryQueryFromParams() {
  const { eventId } = useParams<{ eventId: string }>();
  return useEventHistoryQuery({ variables: { id: eventId ?? '' } });
}

export default LoadQueryWrapper(useEventHistoryQueryFromParams, function EventHistory({ data }) {
  const { t } = useTranslation();

  const changes = useMemo(
    () => data.convention.event.form_response_changes.filter((change) => !EXCLUDE_FIELDS.has(change.field_identifier)),
    [data],
  );

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <BreadcrumbItem to=".." active={false}>
            {data.convention.event.title}
          </BreadcrumbItem>
          <RouteActivatedBreadcrumbItem to="">{t('events.history.title')}</RouteActivatedBreadcrumbItem>
        </ol>
      </nav>
      <FormResponseChangeHistory
        changes={changes}
        convention={data.convention}
        form={data.convention.event.event_category.event_form}
        basePath={`${buildEventUrl(data.convention.event)}/history`}
      />
    </>
  );
});
