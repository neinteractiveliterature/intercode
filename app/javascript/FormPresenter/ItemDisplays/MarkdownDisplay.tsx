import { usePreviewMarkdownQuery } from '../../BuiltInFormControls/previewQueries.generated';
import { LoadQueryWithVariablesWrapper } from '../../GraphqlLoadingWrappers';

export type MarkdownDisplayProps = {
  markdown?: string | null;
};

export default LoadQueryWithVariablesWrapper(
  usePreviewMarkdownQuery,
  ({ markdown }: MarkdownDisplayProps) => ({ markdown: markdown ?? '' }),
  function MarkdownDisplay({ data }): JSX.Element {
    // eslint-disable-next-line react/no-danger
    return <span dangerouslySetInnerHTML={{ __html: data?.cmsParent.previewMarkdown ?? '' }} />;
  },
);
