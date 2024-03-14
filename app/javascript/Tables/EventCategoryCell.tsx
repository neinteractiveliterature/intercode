import { useContext, useMemo } from "react";
import { GetEventCategoryStylesOptions, getEventCategoryStyles } from "../EventsApp/ScheduleGrid/StylingUtils";
import { QueryDataContext } from "./useReactTableWithTheWorks";

export default function EventCategoryCell<QueryData extends { convention: { event_categories: (GetEventCategoryStylesOptions['eventCategory'] & { id: string, name: string })[] } }>(
  { value }: { value: { id: string } }
) {
  const data = useContext(QueryDataContext) as QueryData;
  const eventCategory = useMemo(
    () =>
      data.convention.event_categories.find((eventCategory) => eventCategory.id === value.id),
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
