import React from 'react';

import LoadingIndicator from '../../LoadingIndicator';
import ErrorDisplay from '../../ErrorDisplay';
import { usePreviewMarkdownQueryQuery } from '../../BuiltInFormControls/previewQueries.generated';

export type MarkdownDisplayProps = {
  markdown?: string | null,
};

function MarkdownDisplay({ markdown }: MarkdownDisplayProps) {
  const { data, loading, error } = usePreviewMarkdownQueryQuery({
    variables: { markdown: markdown ?? '' },
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  // eslint-disable-next-line react/no-danger
  return <span dangerouslySetInnerHTML={{ __html: data?.previewMarkdown ?? '' }} />;
}

export default MarkdownDisplay;
