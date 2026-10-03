import { CellContext, ColumnHelper } from '@tanstack/react-table';
import { QueryDataContext } from './useReactTableWithTheWorks';
import { useContext } from 'react';
import FormItemDisplay, { ConventionForFormItemDisplay } from 'FormPresenter/ItemDisplays/FormItemDisplay';
import { FormItemDisplayMode } from 'FormPresenter/ItemDisplays/FormItemDisplayMode';
import { TypedFormItem } from 'FormAdmin/FormItemUtils';
import { notEmpty } from '@neinteractiveliterature/litform';
import humanize from 'humanize';

export type FormItemColumnOptions<RowType> = {
  /** Returns the form response (a map of identifier to value) for a row. */
  getFormData: (row: RowType) => Record<string, unknown>;
  /** Defaults to the convention in the table's query data (see QueryDataContext) */
  convention?: ConventionForFormItemDisplay;
  displayMode?: FormItemDisplayMode;
  getHeader?: (formItem: TypedFormItem & { identifier: string }) => string;
  /** Form items with these identifiers are skipped, e.g. because the table already has a column for them */
  excludeIdentifiers?: Set<string | undefined>;
};

/**
 * Builds a function that extracts a form response from a row's JSON string.  The parsed result is cached per row, so
 * that tables with many form item columns don't parse the same JSON once per column.
 */
export function jsonFormDataGetter<RowType extends object>(
  getJson: (row: RowType) => string | null | undefined,
): (row: RowType) => Record<string, unknown> {
  const cache = new WeakMap<RowType, Record<string, unknown>>();

  return (row) => {
    const cached = cache.get(row);
    if (cached) {
      return cached;
    }

    const parsed = JSON.parse(getJson(row) ?? '{}') as Record<string, unknown>;
    cache.set(row, parsed);
    return parsed;
  };
}

function defaultGetHeader(formItem: TypedFormItem & { identifier: string }) {
  return formItem.public_description ?? formItem.identifier;
}

export function formItemColumn<RowType>(
  formItem: TypedFormItem & { identifier: string },
  columnHelper: ColumnHelper<RowType>,
  { getFormData, convention, displayMode = 'public', getHeader = defaultGetHeader }: FormItemColumnOptions<RowType>,
) {
  function FormItemCell<TData, TValue>({ getValue }: CellContext<TData, TValue>) {
    const data = useContext(QueryDataContext) as { convention: ConventionForFormItemDisplay };
    return (
      <FormItemDisplay
        convention={convention ?? data.convention}
        formItem={formItem}
        displayMode={displayMode}
        value={getValue()}
      />
    );
  }

  return columnHelper.accessor((row: RowType) => getFormData(row)[formItem.identifier], {
    header: getHeader(formItem),
    id: `form_items.${formItem.identifier}`,
    cell: FormItemCell,
  });
}

export function formItemColumns<RowType>(
  formItems: TypedFormItem[],
  columnHelper: ColumnHelper<RowType>,
  options: FormItemColumnOptions<RowType>,
) {
  return formItems
    .map((formItem) => {
      if (
        formItem.item_type === 'static_text' ||
        !formItem.identifier ||
        options.excludeIdentifiers?.has(formItem.identifier)
      ) {
        return undefined;
      }

      return formItemColumn({ ...formItem, identifier: formItem.identifier }, columnHelper, options);
    })
    .filter(notEmpty);
}

export function adminFormItemHeader(formItem: TypedFormItem & { identifier: string }) {
  return formItem.admin_description || humanize(formItem.identifier);
}
