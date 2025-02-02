import { useContext, useMemo } from 'react';
import { QueryDataContext } from './useReactTableWithTheWorks';
import ChoiceSetFilter from './ChoiceSetFilter';
import { Column } from '@tanstack/react-table';

export default function EventCategoryFilter<TData extends Record<string, unknown>, TValue>({
  column,
}: {
  column: Column<TData, TValue>;
}) {
  const data = useContext(QueryDataContext) as { convention?: { event_categories: { id: string; name: string }[] } };
  const choices = useMemo(
    () =>
      data.convention?.event_categories.map((eventCategory) => ({
        value: eventCategory.id.toString(),
        label: eventCategory.name,
      })) ?? [],
    [data],
  );

  return <ChoiceSetFilter column={column} choices={choices} multiple />;
}
