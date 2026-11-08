import { type RowData } from '@tanstack/react-table';
import { type AppCellContext } from './tableFeatures';

export default function HtmlCell<TData extends RowData, TValue extends string | undefined | null>({
  getValue,
}: AppCellContext<TData, TValue>) {
  return <div dangerouslySetInnerHTML={{ __html: getValue() ?? '' }} />;
}
