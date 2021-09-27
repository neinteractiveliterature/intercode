import ChoiceSetFilter, { ChoiceSetFilterSingleProps } from './ChoiceSetFilter';

function getBooleanFilterValue(filterValue: boolean | null | undefined) {
  if (filterValue == null) {
    return 'any';
  }

  if (filterValue) {
    return 'true';
  }

  return 'false';
}

function BooleanChoiceSetFilter<RowType extends Record<string, unknown>>(
  props: ChoiceSetFilterSingleProps<RowType>,
): JSX.Element {
  return (
    <ChoiceSetFilter
      {...props}
      choices={[
        { label: 'any', value: 'any' },
        { label: 'yes', value: 'true' },
        { label: 'no', value: 'false' },
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
