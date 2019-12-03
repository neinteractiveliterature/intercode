import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { diffWords, diffSentences } from 'diff';
import PlainTextDisplay from '../../PlainTextDisplay';

function EditDisplay({ value, added, removed }) {
  const renderContent = () => <PlainTextDisplay value={value} />;

  if (removed) {
    return <del className="bg-danger-light">{renderContent()}</del>;
  }

  if (added) {
    return <ins className="bg-success-light text-decoration-none">{renderContent()}</ins>;
  }

  return renderContent();
}

EditDisplay.propTypes = {
  editType: PropTypes.number,
  content: PropTypes.string,
};

function TextDiffDisplay({ before, after }) {
  const diff = useMemo(
    () => {
      const wordDiff = diffWords(before || '', after || '');
      if (wordDiff.length > 10) {
        return diffSentences(before || '', after || '');
      }

      return wordDiff;
    },
    [after, before],
  );

  return diff.map(({ value, added, removed }, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <EditDisplay value={value} added={added} removed={removed} key={index} />
  ));
}

TextDiffDisplay.propTypes = {
  before: PropTypes.string,
  after: PropTypes.string,
};

TextDiffDisplay.defaultProps = {
  before: '',
  after: '',
};

export default TextDiffDisplay;
