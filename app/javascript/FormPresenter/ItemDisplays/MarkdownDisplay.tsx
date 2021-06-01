import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';
import { usePreviewMarkdownQuery } from '../../BuiltInFormControls/previewQueries.generated';

export type MarkdownDisplayProps = {
  markdown?: string | null;
};

function MarkdownDisplay({ markdown }: MarkdownDisplayProps) {
  const { data, loading, error } = usePreviewMarkdownQuery({
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
