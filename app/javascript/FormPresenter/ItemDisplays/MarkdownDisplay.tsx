import { usePreviewMarkdownQuery } from '../../BuiltInFormControls/previewQueries.generated';
import { LoadQueryWithVariablesWrapper } from '../../GraphqlLoadingWrappers';
import parsePageContent from '../../parsePageContent';
import Spoiler from '../../Spoiler';

export type MarkdownDisplayProps = {
  renderedMarkdown?: string | null;
};

export default function MarkdownDisplay({ renderedMarkdown }: MarkdownDisplayProps): JSX.Element {
  return <>{parsePageContent(renderedMarkdown ?? '', { Spoiler }).bodyComponents}</>;
}

export type UnrenderedMarkdownDisplayProps = {
  markdown?: string | null;
};

export const UnrenderedMarkdownDisplay = LoadQueryWithVariablesWrapper(
  usePreviewMarkdownQuery,
  ({ markdown }: UnrenderedMarkdownDisplayProps) => ({ markdown }),
  ({ data }) => <MarkdownDisplay renderedMarkdown={data.cmsParent.previewMarkdown} />,
);
