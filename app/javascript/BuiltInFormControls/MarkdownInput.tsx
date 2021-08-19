import { useApolloClient } from '@apollo/client';
import { CodeInput } from '@neinteractiveliterature/litform';
import type { CodeInputProps } from '@neinteractiveliterature/litform/lib/CodeInput';
import { useTranslation } from 'react-i18next';
import parsePageContent from '../parsePageContent';

import { PreviewMarkdownQuery } from './previewQueries';
import { PreviewMarkdownQueryData } from './previewQueries.generated';

export type MarkdownInputProps = Omit<CodeInputProps, 'mode' | 'getPreviewContent'>;

const MarkdownInput = (props: MarkdownInputProps) => {
  const client = useApolloClient();
  const { t } = useTranslation();

  return (
    <CodeInput
      {...props}
      mode="liquid-markdown"
      editButtonText={t('buttons.edit', 'Edit')}
      previewButtonText={t('buttons.preview', 'Preview')}
      getPreviewContent={async (markdown) => {
        const response = await client.query<PreviewMarkdownQueryData>({
          query: PreviewMarkdownQuery,
          variables: { markdown },
          fetchPolicy: 'no-cache',
        });

        return parsePageContent(response.data?.previewMarkdown ?? '').bodyComponents;
      }}
    />
  );
};

export default MarkdownInput;
