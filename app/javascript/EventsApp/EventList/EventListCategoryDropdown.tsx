import { useState, useCallback } from 'react';
import { pluralize } from 'inflected';
import { useLocation } from 'react-router-dom';
import { ChoiceSet } from '@neinteractiveliterature/litform';

import { EventListEventsQueryData } from './queries.generated';
import { DropdownMenu } from '../../UIComponents/DropdownMenu';
import { locationsEqualWithSearchParamsTransform } from '../../URLUtils';

type ConventionType = NonNullable<EventListEventsQueryData['convention']>;
type LocationType = ReturnType<typeof useLocation>;

function shouldAutoCloseOnNavigate(prevLocation: LocationType, location: LocationType) {
  return !locationsEqualWithSearchParamsTransform(prevLocation, location, (params) => {
    params.delete('filters.category');
    return params;
  });
}

export type EventListCategoryDropdownProps = {
  eventCategories: ConventionType['event_categories'];
  value: string[];
  onChange: React.Dispatch<string[]>;
};

function EventListCategoryDropdown({
  eventCategories,
  value,
  onChange: onChangeProp,
}: EventListCategoryDropdownProps): JSX.Element {
  const [interacted, setInteracted] = useState(false);
  const currentCategories = eventCategories.filter((category) => (value || []).includes(category.id));

  let categoryDescription = 'All event types';
  if (currentCategories.length === 1) {
    categoryDescription = pluralize(currentCategories[0].name);
  } else if (currentCategories.length > 1 && currentCategories.length < eventCategories.length) {
    categoryDescription = `${currentCategories.length} event types`;
  }

  const onChange = useCallback(
    (...args: Parameters<typeof onChangeProp>) => {
      setInteracted(true);
      onChangeProp(...args);
    },
    [onChangeProp],
  );

  const sortedCategories = [...eventCategories].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  );
  const choiceSetValue =
    (value ?? []).length === 0 && !interacted
      ? eventCategories.map((c) => c.id.toString())
      : (value ?? []).map((id) => id.toString());

  return (
    <DropdownMenu
      buttonContent={categoryDescription}
      buttonClassName="btn btn-link dropdown-toggle"
      dropdownClassName="p-0"
      shouldAutoCloseOnNavigate={shouldAutoCloseOnNavigate}
    >
      <div className="p-2">
        <ChoiceSet
          choices={sortedCategories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
          value={choiceSetValue}
          onChange={(categoryIds) => onChange(categoryIds ?? [])}
          multiple
        />
      </div>
      <div className="bg-light">
        <button
          className="btn btn-link btn-sm"
          type="button"
          onClick={() => onChange(sortedCategories.map((c) => c.id))}
        >
          Select all
        </button>
        <button className="btn btn-link btn-sm" type="button" onClick={() => onChange([])}>
          Select none
        </button>
      </div>
    </DropdownMenu>
  );
}

export default EventListCategoryDropdown;
