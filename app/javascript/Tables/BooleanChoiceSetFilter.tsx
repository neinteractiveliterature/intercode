import { useTranslation } from 'react-i18next';
import ChoiceSetFilter, { ChoiceSetFilterSingleProps } from './ChoiceSetFilter';

function getBooleanFilterValue(filterValue: unknown) {
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

function BooleanChoiceSetFilter<TData extends Record<string, unknown>, TValue>(
  props: Omit<ChoiceSetFilterSingleProps<TData, TValue>, 'choices' | 'multiple'>,
): React.JSX.Element {
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
        getFilterValue: () => getBooleanFilterValue(props.column.getFilterValue()),
        setFilterValue: (value: string) => {
          props.column.setFilterValue(value === 'any' ? null : value === 'true');
        },
      }}
    />
  );
}

export default BooleanChoiceSetFilter;
