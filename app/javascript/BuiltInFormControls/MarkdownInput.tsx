import { useApolloClient } from '@apollo/client';
import { CodeInput } from '@neinteractiveliterature/litform';
import type { CodeInputProps } from '@neinteractiveliterature/litform/lib/CodeInput';

import { PreviewMarkdownQuery } from './previewQueries';
import { PreviewMarkdownQueryData } from './previewQueries.generated';

export type MarkdownInputProps = Omit<CodeInputProps, 'mode' | 'getPreviewContent'>;

const MarkdownInput = (props: MarkdownInputProps) => {
  const client = useApolloClient();

  return (
    <CodeInput
      {...props}
      mode="liquid-markdown"
      getPreviewContent={async (markdown) => {
        const response = await client.query<PreviewMarkdownQueryData>({
          query: PreviewMarkdownQuery,
          variables: { markdown },
          fetchPolicy: 'no-cache',
        });

        return response.data?.previewMarkdown ?? '';
      }}
    />
  );
};

export default MarkdownInput;
