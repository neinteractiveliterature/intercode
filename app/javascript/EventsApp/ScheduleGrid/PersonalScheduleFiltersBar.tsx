import React, { useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';
import { buildFieldFilterCodecs, FilterCodecs } from '../../Tables/FilterUtils';
import useReactRouterReactTable from '../../Tables/useReactRouterReactTable';
import { parseIntOrNull } from '../../ValueUtils';
import { RATING_OPTIONS } from '../EventList/EventListMyRatingSelector';

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

type UsePersonalScheduleFiltersOptions = {
  storageKey: string;
  showPersonalFilters: boolean;
  signedIn: boolean;
};

export function usePersonalScheduleFilters({
  storageKey,
  showPersonalFilters,
  signedIn,
}: UsePersonalScheduleFiltersOptions) {
  const { filters, updateSearch } = useReactRouterReactTable<PersonalScheduleFilter>({
    ...filterCodecs,
  });
  const location = useLocation();

  const loadPersonalFilters = useCallback(() => {
    const storedValue = window.localStorage.getItem(storageKey);
    if (storedValue) {
      try {
        return JSON.parse(storedValue);
      } catch (e) {
        return DEFAULT_PERSONAL_FILTERS;
      }
    }

    return DEFAULT_PERSONAL_FILTERS;
  }, [storageKey]);

  useEffect(() => {
    if (showPersonalFilters && signedIn && !location.search) {
      updateSearch({ filters: loadPersonalFilters() });
    }
  }, [showPersonalFilters, loadPersonalFilters, location, signedIn, updateSearch]);

  return useMemo(() => {
    const ratingFilter: number[] | undefined = (filters.find((f) => f.id === 'my_rating') || {})
      .value;
    const hideConflicts: boolean | undefined = (
      filters.find((f) => f.id === 'hide_conflicts') || {}
    ).value;

    const choiceSetValue: string[] = [
      ...(ratingFilter || []).map((integer: number) => integer.toString()),
      ...(hideConflicts ? [] : ['conflicts']),
    ];

    const choiceSetChanged = (newValue: string[]) => {
      const integerArray = newValue.filter((choice) => choice !== 'conflicts').map(parseIntOrNull);

      const newFilters = [
        { id: 'my_rating', value: integerArray },
        { id: 'hide_conflicts', value: !newValue.includes('conflicts') },
      ];

      updateSearch({ filters: newFilters });
      window.localStorage.setItem(storageKey, JSON.stringify(newFilters));
    };

    return {
      choiceSetValue,
      choiceSetChanged,
      ratingFilter: ratingFilter ?? [...DEFAULT_PERSONAL_FILTERS[0].value],
      hideConflicts: hideConflicts ?? DEFAULT_PERSONAL_FILTERS[1].value,
    };
  }, [filters, storageKey, updateSearch]);
}

type PersonalScheduleFiltersBarProps = {
  choiceSetValue: string[];
  choiceSetChanged: React.Dispatch<string[]>;
};

function PersonalScheduleFiltersBar({
  choiceSetValue,
  choiceSetChanged,
}: PersonalScheduleFiltersBarProps) {
  return (
    <div className="d-flex flex-column flex-md-row bg-light">
      <div className="d-flex btn">
        <span className="mr-2">Show:</span>
        <ChoiceSet
          choices={[...RATING_OPTIONS, { label: 'Conflicts', value: 'conflicts' }]}
          choiceClassName="form-check-inline mr-md-4"
          containerClassName="d-flex flex-wrap"
          value={choiceSetValue}
          onChange={choiceSetChanged}
          multiple
        />
      </div>
    </div>
  );
}

export default PersonalScheduleFiltersBar;
