import { useState, useCallback } from 'react';
import { useLocation } from 'react-router';
import { ChoiceSet } from '@neinteractiveliterature/litform';

import { DropdownMenu } from '../../../UIComponents/DropdownMenu';
import { locationsEqualWithSearchParamsTransform } from '../../../URLUtils';
import { useTranslation } from 'react-i18next';
import { CommonConventionDataQueryData } from '../../queries.generated';

type ConventionType = NonNullable<CommonConventionDataQueryData['convention']>;
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
}: EventListCategoryDropdownProps): React.JSX.Element {
  const [interacted, setInteracted] = useState(false);
  const currentCategories = eventCategories.filter((category) => (value || []).includes(category.id));
  const { t } = useTranslation();

  let categoryDescription = t('events.categoryDropdown.allCategoriesLabel');
  if (currentCategories.length === 1) {
    categoryDescription = t('events.categoryDropdown.singleCategoryLabel', {
      categoryName: currentCategories[0].name,
    });
  } else if (currentCategories.length > 1 && currentCategories.length < eventCategories.length) {
    categoryDescription = t('events.categoryDropdown.multipleCategoriesLabel', {
      count: currentCategories.length,
    });
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
          {t('buttons.selectAll')}
        </button>
        <button className="btn btn-link btn-sm" type="button" onClick={() => onChange([])}>
          {t('buttons.selectNone')}
        </button>
      </div>
    </DropdownMenu>
  );
}

export default EventListCategoryDropdown;
