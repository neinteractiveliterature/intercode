import { CellContext } from '@tanstack/react-table';

export default function HtmlCell<TData, TValue extends string | undefined | null>({
  getValue,
}: CellContext<TData, TValue>) {
  return <div dangerouslySetInnerHTML={{ __html: getValue() ?? '' }} />;
}
