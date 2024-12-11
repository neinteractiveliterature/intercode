import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import FormResponseChangeHistory from '../../FormPresenter/ItemChangeDisplays/FormResponseChangeHistory';
import RouteActivatedBreadcrumbItem from '../../Breadcrumbs/RouteActivatedBreadcrumbItem';
import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import { EventHistoryQueryDocument } from './eventHistoryQuery.generated';
import buildEventUrl from '../buildEventUrl';
import { Route } from './+types/EventHistory';

const EXCLUDE_FIELDS = new Set([
  'minimum_age',
  'age_restrictions_description',
  'con_mail_destination',
  'email',
  'team_mailing_list_name',
]);

export const loader = async ({ params: { eventId }, context }: Route.LoaderArgs) => {
  const { data } = await context.client.query({
    query: EventHistoryQueryDocument,
    variables: { id: eventId ?? '' },
  });
  return data;
};

function EventHistory({ loaderData: data }: Route.ComponentProps) {
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
}

export default EventHistory;
