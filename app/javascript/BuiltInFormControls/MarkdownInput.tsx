import React from 'react';

import { useApolloClient } from '@apollo/client';
import CodeInput from './CodeInput';
import { PreviewMarkdownQuery } from './previewQueries';
import { PreviewMarkdownQueryQuery } from './previewQueries.generated';
import type { SyncCodeInputProps } from './SyncCodeInput';

export type MarkdownInputProps = Omit<SyncCodeInputProps, 'mode' | 'getPreviewContent'>;

const MarkdownInput = (props: MarkdownInputProps) => {
  const client = useApolloClient();

  return (
    <CodeInput
      {...props}
      mode="liquid-markdown"
      getPreviewContent={async (markdown) => {
        const response = await client.query<PreviewMarkdownQueryQuery>({
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
