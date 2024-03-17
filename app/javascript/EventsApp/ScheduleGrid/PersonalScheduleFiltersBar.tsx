import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Filters } from 'react-table';
import { parseIntOrNull } from '@neinteractiveliterature/litform';

import ChoiceSetFilter from '../../Tables/ChoiceSetFilter';
import { buildFieldFilterCodecs, FilterCodecs } from '../../Tables/FilterUtils';
import useReactRouterReactTable from '../../Tables/useReactRouterReactTable';
import { RATING_OPTIONS } from '../EventCatalog/EventList/EventListMyRatingSelector';

const filterCodecs = buildFieldFilterCodecs({
  my_rating: FilterCodecs.integerArray,
  hide_conflicts: FilterCodecs.boolean,
});

const DEFAULT_PERSONAL_FILTERS = [
  { id: 'my_rating', value: [1, 0] },
  { id: 'hide_conflicts', value: false },
] as const;

type PersonalScheduleFilter = {
  my_rating: number[];
  hide_conflicts: boolean;
};

const STORAGE_KEY = 'schedule:personalFilters';

function loadPersonalFilters() {
  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  if (storedValue) {
    try {
      return JSON.parse(storedValue);
    } catch (e) {
      return DEFAULT_PERSONAL_FILTERS;
    }
  }

  return DEFAULT_PERSONAL_FILTERS;
}

function parseFilters(filters: Filters<PersonalScheduleFilter>) {
  const ratingFilter: number[] | undefined = (filters.find((f) => f.id === 'my_rating') || {}).value;
  const hideConflicts: boolean | undefined = (filters.find((f) => f.id === 'hide_conflicts') || {}).value;

  const choiceSetValue: string[] = [
    ...(ratingFilter || []).map((integer: number) => integer.toString()),
    ...(hideConflicts ? [] : ['conflicts']),
  ];
  return { choiceSetValue, ratingFilter, hideConflicts };
}

export type UsePersonalScheduleFiltersOptions = {
  showPersonalFilters: boolean;
  signedIn: boolean;
};

export type UsePersonalScheduleFiltersResult = {
  choiceSetValue: string[];
  choiceSetChanged: React.Dispatch<string[]>;
  ratingFilter: number[];
  hideConflicts: boolean;
};

export function usePersonalScheduleFilters({
  showPersonalFilters,
  signedIn,
}: UsePersonalScheduleFiltersOptions): UsePersonalScheduleFiltersResult {
  const { filters, updateSearch } = useReactRouterReactTable<PersonalScheduleFilter>({
    ...filterCodecs,
  });
  const otherFilters = useMemo(
    () => filters.filter(({ id }) => id !== 'my_rating' && id !== 'hide_conflicts'),
    [filters],
  );
  const location = useLocation();

  useEffect(() => {
    if (showPersonalFilters && signedIn && !location.search) {
      updateSearch({ filters: loadPersonalFilters() });
    }
  }, [showPersonalFilters, location, signedIn, updateSearch]);

  return useMemo(() => {
    const { choiceSetValue, ratingFilter, hideConflicts } = parseFilters(
      showPersonalFilters ? filters : [...DEFAULT_PERSONAL_FILTERS],
    );

    const choiceSetChanged = (newValue: string[]) => {
      const integerArray = newValue.filter((choice) => choice !== 'conflicts').map(parseIntOrNull);

      const newFilters =
        newValue.length === 0
          ? [...DEFAULT_PERSONAL_FILTERS]
          : [
              { id: 'my_rating', value: integerArray },
              { id: 'hide_conflicts', value: !newValue.includes('conflicts') },
            ];

      updateSearch({ filters: [...otherFilters, ...newFilters] });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters));
    };

    return {
      choiceSetValue,
      choiceSetChanged,
      ratingFilter: ratingFilter ?? [...DEFAULT_PERSONAL_FILTERS[0].value],
      hideConflicts: hideConflicts ?? DEFAULT_PERSONAL_FILTERS[1].value,
    };
  }, [filters, showPersonalFilters, updateSearch, otherFilters]);
}

const filterOptions = [...RATING_OPTIONS, { label: 'Conflicts', value: 'conflicts' }];

function renderFilterHeaderCaption(value: string[]): string {
  if (value.length === filterOptions.length) {
    return 'Show all events';
  }
  if (value.length === 0) {
    return renderFilterHeaderCaption(parseFilters([...DEFAULT_PERSONAL_FILTERS]).choiceSetValue);
  }

  const visibleOptions = filterOptions.filter((option) =>
    value.find((selectedOption) => option.value === selectedOption),
  );
  if (visibleOptions.length === filterOptions.length - 1 && !value.includes('-1')) {
    return 'Show my selections';
  }
  return `Show only ${visibleOptions.map((option) => option.label).join(', ')}`;
}

type PersonalScheduleFiltersBarProps = {
  choiceSetValue: string[];
  choiceSetChanged: React.Dispatch<string[]>;
};

function PersonalScheduleFiltersBar({
  choiceSetValue,
  choiceSetChanged,
}: PersonalScheduleFiltersBarProps): JSX.Element {
  return (
    <ChoiceSetFilter
      choices={filterOptions}
      column={{
        filterValue: choiceSetValue,
        setFilter: choiceSetChanged,
      }}
      renderHeaderCaption={renderFilterHeaderCaption}
      multiple
      hideSelectNone
    />
  );
}

export default PersonalScheduleFiltersBar;
