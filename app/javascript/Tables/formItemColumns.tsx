import { CellContext, ColumnHelper } from '@tanstack/react-table';
import { QueryDataContext } from './useReactTableWithTheWorks';
import { useContext } from 'react';
import FormItemDisplay, { FormItemDisplayProps } from 'FormPresenter/ItemDisplays/FormItemDisplay';
import { TypedFormItem } from 'FormAdmin/FormItemUtils';
import { notEmpty } from '@neinteractiveliterature/litform';

export function formItemColumn<RowType>(
  formItem: TypedFormItem & { identifier: string },
  columnHelper: ColumnHelper<RowType>,
  getFormData: (row: RowType) => Record<string, unknown>,
) {
  function FormItemCell<TData, TValue>({ getValue }: CellContext<TData, TValue>) {
    const data = useContext(QueryDataContext) as { convention: FormItemDisplayProps['convention'] };
    return <FormItemDisplay convention={data.convention} formItem={formItem} displayMode="public" value={getValue()} />;
  }

  return columnHelper.accessor((row: RowType) => getFormData(row)[formItem.identifier], {
    header: formItem.public_description ?? formItem.identifier,
    id: `form_items.${formItem.identifier}`,
    cell: FormItemCell,
  });
}

export function formItemColumns<RowType>(
  formItems: TypedFormItem[],
  columnHelper: ColumnHelper<RowType>,
  getFormData: (row: RowType) => Record<string, unknown>,
) {
  return formItems
    .map((formItem) => {
      if (formItem.item_type === 'static_text') {
        return undefined;
      }

      return formItemColumn(formItem, columnHelper, getFormData);
    })
    .filter(notEmpty);
}
