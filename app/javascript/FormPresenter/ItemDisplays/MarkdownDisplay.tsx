import { usePreviewMarkdownQuery } from '../../BuiltInFormControls/previewQueries.generated';
import { LoadQueryWithVariablesWrapper } from '../../GraphqlLoadingWrappers';
import { useParseContent } from '../../parsePageContent';
import Spoiler from '../../Spoiler';
import { FormResponse } from '../useFormResponse';

export type MarkdownDisplayProps = {
  renderedMarkdown?: string | null;
};

export default function MarkdownDisplay({ renderedMarkdown }: MarkdownDisplayProps): JSX.Element {
  const parseContent = useParseContent();
  return <>{parseContent(renderedMarkdown ?? '', { Spoiler }).bodyComponents}</>;
}

export type UnrenderedMarkdownDisplayProps = {
  formResponse?: FormResponse;
  markdown?: string | null;
};

export const UnrenderedMarkdownDisplay = LoadQueryWithVariablesWrapper(
  usePreviewMarkdownQuery,
  ({ markdown, formResponse }: UnrenderedMarkdownDisplayProps) => ({
    markdown: markdown ?? '',
    eventId: formResponse?.__typename === 'Event' ? formResponse.id : undefined,
    eventProposalId: formResponse?.__typename === 'EventProposal' ? formResponse.id : undefined,
  }),
  ({ data }) => <MarkdownDisplay renderedMarkdown={data.cmsParent.previewMarkdown} />,
);
