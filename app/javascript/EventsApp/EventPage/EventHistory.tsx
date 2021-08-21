import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import FormResponseChangeHistory from '../../FormPresenter/ItemChangeDisplays/FormResponseChangeHistory';
import RouteActivatedBreadcrumbItem from '../../Breadcrumbs/RouteActivatedBreadcrumbItem';
import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import { useEventHistoryQuery } from './eventHistoryQuery.generated';

const EXCLUDE_FIELDS = new Set([
  'minimum_age',
  'age_restrictions_description',
  'con_mail_destination',
  'email',
  'team_mailing_list_name',
]);

export type EventHistoryProps = {
  eventId: number;
  eventPath: string;
};

function EventHistory({ eventId, eventPath }: EventHistoryProps) {
  const { t } = useTranslation();
  const { data, loading, error } = useEventHistoryQuery({
    variables: { id: eventId },
  });

  const changes = useMemo(
    () =>
      loading || error || !data
        ? []
        : data.event.form_response_changes.filter(
            (change) => !EXCLUDE_FIELDS.has(change.field_identifier),
          ),
    [data, error, loading],
  );

  if (loading) {
    return <LoadingIndicator iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <BreadcrumbItem to={eventPath} active={false}>
            {data!.event.title}
          </BreadcrumbItem>
          <RouteActivatedBreadcrumbItem
            matchProps={{ path: `${eventPath}/history`, exact: true }}
            to={`${eventPath}/history`}
          >
            {t('events.history.title', 'History')}
          </RouteActivatedBreadcrumbItem>
        </ol>
      </nav>

      <FormResponseChangeHistory
        changes={changes}
        convention={data!.convention!}
        basePath={`${eventPath}/history`}
        form={data!.event.event_category.event_form}
      />
    </>
  );
}

export default EventHistory;
