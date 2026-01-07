import { useTranslation } from 'react-i18next';

import FormResponseChangeHistory from '~/FormPresenter/ItemChangeDisplays/FormResponseChangeHistory';
import RouteActivatedBreadcrumbItem from '~/Breadcrumbs/RouteActivatedBreadcrumbItem';
import BreadcrumbItem from '~/Breadcrumbs/BreadcrumbItem';
import buildEventUrl from '~/EventsApp/buildEventUrl';
import { useEventHistoryLoaderData } from './route';
import { Route } from './+types/:changeGroupId';

function EventHistory({ params }: Route.ComponentProps) {
  const { data, changeGroups } = useEventHistoryLoaderData();
  const { t } = useTranslation();

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
        changeGroups={changeGroups}
        changeGroupId={params.changeGroupId}
        convention={data.convention}
        basePath={`${buildEventUrl(data.convention.event)}/history`}
      />
    </>
  );
}

export default EventHistory;
