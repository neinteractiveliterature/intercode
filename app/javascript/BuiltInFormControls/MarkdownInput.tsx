import { useApolloClient } from '@apollo/client';
import { CodeInput } from '@neinteractiveliterature/litform';
import type { CodeInputProps } from '@neinteractiveliterature/litform/lib/CodeInput';
import { useTranslation } from 'react-i18next';
import { markdown } from '@codemirror/lang-markdown';
import { useMemo } from 'react';
import parsePageContent from '../parsePageContent';

import { PreviewMarkdownQuery } from './previewQueries';
import { PreviewMarkdownQueryData } from './previewQueries.generated';
import intercodeTheme from './IntercodeCodemirrorTheme';

export type MarkdownInputProps = Omit<CodeInputProps, 'getPreviewContent'>;

const MarkdownInput = (props: MarkdownInputProps) => {
  const client = useApolloClient();
  const { t } = useTranslation();
  const extensions = useMemo(
    () => [markdown(), intercodeTheme, ...(props.extensions ?? [])],
    [props.extensions],
  );

  return (
    <CodeInput
      {...props}
      extensions={extensions}
      editButtonText={t('buttons.edit', 'Edit')}
      previewButtonText={t('buttons.preview', 'Preview')}
      getPreviewContent={async (markdownContent) => {
        const response = await client.query<PreviewMarkdownQueryData>({
          query: PreviewMarkdownQuery,
          variables: { markdown: markdownContent },
          fetchPolicy: 'no-cache',
        });

        return parsePageContent(response.data?.previewMarkdown ?? '').bodyComponents;
      }}
    />
  );
};

export default MarkdownInput;
