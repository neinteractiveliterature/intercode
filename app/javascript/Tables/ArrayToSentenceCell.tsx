import arrayToSentence from 'array-to-sentence';

export type ArrayToSentenceCellProps = {
  value?: string[];
};

const ArrayToSentenceCell = ({ value }: ArrayToSentenceCellProps) => {
  const sentence: string = arrayToSentence(value ?? []);
  return <>{sentence}</>;
};

export default ArrayToSentenceCell;
