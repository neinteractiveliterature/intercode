import { useTranslation } from 'react-i18next';
import ChoiceSetFilter, { ChoiceSetFilterSingleProps } from './ChoiceSetFilter';

function getBooleanFilterValue(filterValue: boolean | null | undefined) {
  if (filterValue == null) {
    // eslint-disable-next-line i18next/no-literal-string
    return 'any';
  }

  if (filterValue) {
    // eslint-disable-next-line i18next/no-literal-string
    return 'true';
  }

  // eslint-disable-next-line i18next/no-literal-string
  return 'false';
}

function BooleanChoiceSetFilter<RowType extends Record<string, unknown>>(
  props: Omit<ChoiceSetFilterSingleProps<RowType>, 'choices' | 'multiple'>,
): JSX.Element {
  const { t } = useTranslation();
  return (
    <ChoiceSetFilter
      {...props}
      choices={[
        { label: t('general.booleans.any'), value: 'any' },
        { label: t('general.booleans.yes'), value: 'true' },
        { label: t('general.booleans.no'), value: 'false' },
      ]}
      multiple={false}
      column={{
        ...props.column,
        filterValue: getBooleanFilterValue(props.column.filterValue),
        setFilter: (value) => {
          props.column.setFilter(value === 'any' ? null : value === 'true');
        },
      }}
    />
  );
}

export default BooleanChoiceSetFilter;
