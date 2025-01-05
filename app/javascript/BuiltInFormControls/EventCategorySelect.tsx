import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { BootstrapFormSelect } from '@neinteractiveliterature/litform';
import { BootstrapFormSelectProps } from '@neinteractiveliterature/litform/dist/types/BootstrapFormSelect';

import { EventCategory } from '../graphqlTypes.generated';
import humanize from '../humanize';

export type EventCategorySelectProps = Omit<BootstrapFormSelectProps, 'label'> & {
  eventCategories: (Pick<EventCategory, 'name'> & { id: string })[];
  label?: ReactNode;
};

function EventCategorySelect({ eventCategories, label, ...props }: EventCategorySelectProps): JSX.Element {
  const { t } = useTranslation();
  const categoryOptions = eventCategories.map((category) => (
    <option value={category.id.toString()} key={category.id}>
      {humanize(category.name)}
    </option>
  ));

  return (
    <BootstrapFormSelect label={label || t('eventCategorySelect.defaultLabel')} {...props}>
      <option aria-label={t('general.placeholderOptionLabel')} />
      {categoryOptions}
    </BootstrapFormSelect>
  );
}

export default EventCategorySelect;
