import { useContext, useMemo } from 'react';
import { FilterProps } from '@tanstack/react-table';
import { QueryDataContext } from './useReactTableWithTheWorks';
import ChoiceSetFilter from './ChoiceSetFilter';

export default function EventCategoryFilter<
  T extends object,
  QueryData extends { convention: { event_categories: { id: string; name: string }[] } },
>(props: FilterProps<T>) {
  const data = useContext(QueryDataContext) as QueryData;
  const choices = useMemo(
    () =>
      data
        ? data.convention.event_categories.map((eventCategory) => ({
            value: eventCategory.id.toString(),
            label: eventCategory.name,
          }))
        : [],
    [data],
  );

  return <ChoiceSetFilter {...props} choices={choices} multiple />;
}
