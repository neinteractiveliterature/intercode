import { type RowData } from '@tanstack/react-table';
import { type AppCellContext } from './tableFeatures';
import arrayToSentence from 'array-to-sentence';

function ArrayToSentenceCell<TData extends RowData, TValue extends string[] | null | undefined>({
  getValue,
}: AppCellContext<TData, TValue>): React.JSX.Element {
  const sentence: string = arrayToSentence(getValue() ?? []);
  return <>{sentence}</>;
}

export default ArrayToSentenceCell;
