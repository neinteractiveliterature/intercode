import { useSuspenseQuery } from '@apollo/client';
import parsePageContent from '../../parsePageContent';
import Spoiler from '../../Spoiler';
import { FormResponse } from '../useFormResponse';
import { PreviewMarkdownQueryDocument } from '../../BuiltInFormControls/previewQueries.generated';

export type MarkdownDisplayProps = {
  renderedMarkdown?: string | null;
};

export default function MarkdownDisplay({ renderedMarkdown }: MarkdownDisplayProps): React.JSX.Element {
  return <>{parsePageContent(renderedMarkdown ?? '', { Spoiler }).bodyComponents}</>;
}

export type UnrenderedMarkdownDisplayProps = {
  formResponse?: FormResponse;
  markdown?: string | null;
};

export function UnrenderedMarkdownDisplay({ markdown, formResponse }: UnrenderedMarkdownDisplayProps) {
  const { data } = useSuspenseQuery(PreviewMarkdownQueryDocument, {
    variables: {
      markdown: markdown ?? '',
      eventId: formResponse?.__typename === 'Event' ? formResponse.id : undefined,
      eventProposalId: formResponse?.__typename === 'EventProposal' ? formResponse.id : undefined,
    },
  });

  return <MarkdownDisplay renderedMarkdown={data.cmsParent.previewMarkdown} />;
}
