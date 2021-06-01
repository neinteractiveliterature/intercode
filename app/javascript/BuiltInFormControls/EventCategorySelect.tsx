import { ReactNode } from 'react';
import { humanize } from 'inflected';
import { useTranslation } from 'react-i18next';
import { BootstrapFormSelect } from '@neinteractiveliterature/litform';
import { BootstrapFormSelectProps } from '@neinteractiveliterature/litform/lib/BootstrapFormSelect';

import { EventCategory } from '../graphqlTypes.generated';

export type EventCategorySelectProps = Omit<BootstrapFormSelectProps, 'label'> & {
  eventCategories: Pick<EventCategory, 'id' | 'name'>[];
  label?: ReactNode;
};

function EventCategorySelect({ eventCategories, label, ...props }: EventCategorySelectProps) {
  const { t } = useTranslation();
  const categoryOptions = eventCategories.map((category) => (
    <option value={category.id.toString()} key={category.id}>
      {humanize(category.name)}
    </option>
  ));

  return (
    <BootstrapFormSelect
      label={label || t('eventCategorySelect.defaultLabel', 'Event Category')}
      {...props}
    >
      <option aria-label={t('general.placeholderOptionLabel', 'Blank placeholder option')} />
      {categoryOptions}
    </BootstrapFormSelect>
  );
}

export default EventCategorySelect;
