import { useContext, useMemo } from 'react';
import { GetEventCategoryStylesOptions, getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import { QueryDataContext } from './useReactTableWithTheWorks';
import { type RowData } from '@tanstack/react-table';
import { type AppCellContext } from './tableFeatures';
import { EventCategory } from 'graphqlTypes.generated';

export default function EventCategoryCell<TData extends RowData, TValue extends Pick<EventCategory, 'id'>>({
  getValue,
}: AppCellContext<TData, TValue>) {
  const data = useContext(QueryDataContext) as {
    convention: { event_categories: (GetEventCategoryStylesOptions['eventCategory'] & { id: string; name: string })[] };
  };
  const value = getValue();
  const eventCategory = useMemo(
    () => data.convention.event_categories.find((eventCategory) => eventCategory.id === value.id),
    [data, value.id],
  );

  if (!eventCategory) {
    return <></>;
  }

  return (
    <span className="p-1 small rounded" style={getEventCategoryStyles({ eventCategory, variant: 'default' })}>
      {eventCategory.name}
    </span>
  );
}
