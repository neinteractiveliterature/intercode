import arrayToSentence from 'array-to-sentence';

export type ArrayToSentenceCellProps = {
  value?: string[];
};

function ArrayToSentenceCell({ value }: ArrayToSentenceCellProps): JSX.Element {
  const sentence: string = arrayToSentence(value ?? []);
  return <>{sentence}</>;
}

export default ArrayToSentenceCell;
