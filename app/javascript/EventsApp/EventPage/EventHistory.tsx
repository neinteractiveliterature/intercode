import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import FormResponseChangeHistory from '../../FormPresenter/ItemChangeDisplays/FormResponseChangeHistory';
import RouteActivatedBreadcrumbItem from '../../Breadcrumbs/RouteActivatedBreadcrumbItem';
import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import {
  EventHistoryQueryData,
  EventHistoryQueryDocument,
  EventHistoryQueryVariables,
} from './eventHistoryQuery.generated';
import { LoaderFunction, useLoaderData } from 'react-router';
import buildEventUrl from '../buildEventUrl';
import { client } from '../../useIntercodeApolloClient';

const EXCLUDE_FIELDS = new Set([
  'minimum_age',
  'age_restrictions_description',
  'con_mail_destination',
  'email',
  'team_mailing_list_name',
]);

export const loader: LoaderFunction = async ({ params: { eventId } }) => {
  const { data } = await client.query<EventHistoryQueryData, EventHistoryQueryVariables>({
    query: EventHistoryQueryDocument,
    variables: { id: eventId ?? '' },
  });
  return data;
};

function EventHistory() {
  const data = useLoaderData() as EventHistoryQueryData;
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

export const Component = EventHistory;
