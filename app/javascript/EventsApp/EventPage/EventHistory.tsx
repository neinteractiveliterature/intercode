import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import FormResponseChangeHistory from '../../FormPresenter/ItemChangeDisplays/FormResponseChangeHistory';
import RouteActivatedBreadcrumbItem from '../../Breadcrumbs/RouteActivatedBreadcrumbItem';
import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import { useEventHistoryQuery } from './eventHistoryQuery.generated';
import { LoadQueryWithVariablesWrapper } from '../../GraphqlLoadingWrappers';

const EXCLUDE_FIELDS = new Set([
  'minimum_age',
  'age_restrictions_description',
  'con_mail_destination',
  'email',
  'team_mailing_list_name',
]);

export type EventHistoryProps = {
  eventId: string;
  eventPath: string;
};

export default LoadQueryWithVariablesWrapper(
  useEventHistoryQuery,
  ({ eventId }: EventHistoryProps) => ({ id: eventId }),
  function EventHistory({ data, eventPath }) {
    const { t } = useTranslation();

    const changes = useMemo(
      () =>
        data.convention.event.form_response_changes.filter((change) => !EXCLUDE_FIELDS.has(change.field_identifier)),
      [data],
    );

    return (
      <>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <BreadcrumbItem to={eventPath} active={false}>
              {data.convention.event.title}
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
          convention={data.convention}
          basePath={`${eventPath}/history`}
          form={data.convention.event.event_category.event_form}
        />
      </>
    );
  },
);
