import { CellContext } from '@tanstack/react-table';
import arrayToSentence from 'array-to-sentence';

function ArrayToSentenceCell<TData, TValue extends string[] | null | undefined>({
  getValue,
}: CellContext<TData, TValue>): React.JSX.Element {
  const sentence: string = arrayToSentence(getValue() ?? []);
  return <>{sentence}</>;
}

export default ArrayToSentenceCell;
