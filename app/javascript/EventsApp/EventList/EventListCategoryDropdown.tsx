import * as React from 'react';
import { pluralize } from 'inflected';

import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';
import { EventListEventsQueryQuery } from './queries.generated';
import { notEmpty, parseIntOrNull } from '../../ValueUtils';
import { DropdownMenu } from '../../UIComponents/DropdownMenu';

type ConventionType = NonNullable<EventListEventsQueryQuery['convention']>;

export type EventListCategoryDropdownProps = {
  eventCategories: ConventionType['event_categories'];
  value: number[];
  onChange: React.Dispatch<number[]>;
};

const EventListCategoryDropdown = ({
  eventCategories,
  value,
  onChange,
}: EventListCategoryDropdownProps) => {
  const currentCategories = eventCategories.filter((category) =>
    (value || []).includes(category.id),
  );

  let categoryDescription = 'All event types';
  if (currentCategories.length === 1) {
    categoryDescription = pluralize(currentCategories[0].name);
  } else if (currentCategories.length > 1 && currentCategories.length < eventCategories.length) {
    categoryDescription = `${currentCategories.length} event types`;
  }

  const sortedCategories = [...eventCategories].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  );
  const choiceSetValue =
    (value || []).length > 0
      ? value.map((id) => id.toString())
      : eventCategories.map((c) => c.id.toString());

  return (
    <DropdownMenu
      buttonContent={categoryDescription}
      buttonClassName="btn btn-link dropdown-toggle"
      dropdownClassName="p-2"
    >
      <ChoiceSet
        choices={sortedCategories.map((category) => ({
          label: category.name,
          value: category.id.toString(),
        }))}
        value={choiceSetValue}
        onChange={(integerArray) => {
          onChange((integerArray ?? []).map(parseIntOrNull).filter(notEmpty));
        }}
        multiple
      />
    </DropdownMenu>
  );
};

export default EventListCategoryDropdown;
