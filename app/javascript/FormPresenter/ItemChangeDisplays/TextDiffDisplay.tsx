import React, { useMemo } from 'react';
import { diffWords, diffSentences } from 'diff';

import PlainTextDisplay from '../../PlainTextDisplay';

type EditDisplayProps = {
  value: string,
  added?: boolean,
  removed?: boolean,
};

function EditDisplay({ value, added, removed }: EditDisplayProps) {
  const renderContent = () => <PlainTextDisplay value={value} />;

  if (removed) {
    return <del className="bg-danger-light">{renderContent()}</del>;
  }

  if (added) {
    return <ins className="bg-success-light text-decoration-none">{renderContent()}</ins>;
  }

  return renderContent();
}

export type TextDiffDisplayProps = {
  before?: string,
  after?: string,
};

function TextDiffDisplay({ before, after }: TextDiffDisplayProps) {
  const diff = useMemo(
    () => {
      const wordDiff = diffWords(before ?? '', after ?? '');
      if (wordDiff.length > 10) {
        return diffSentences(before ?? '', after ?? '');
      }

      return wordDiff;
    },
    [after, before],
  );

  return (
    <>
      {diff.map(({ value, added, removed }, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <EditDisplay value={value} added={added} removed={removed} key={index} />
      ))}
    </>
  );
}

export default TextDiffDisplay;
