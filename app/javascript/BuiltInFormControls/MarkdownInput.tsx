import { useApolloClient } from '@apollo/client';
import {
  CodeInput,
  useStandardCodeMirror,
  UseStandardCodeMirrorExtensionsOptions,
} from '@neinteractiveliterature/litform';
import type { CodeInputProps } from '@neinteractiveliterature/litform/lib/CodeInput';
import { useTranslation } from 'react-i18next';
import { markdown } from '@codemirror/lang-markdown';
import { useMemo } from 'react';
import { Extension } from '@codemirror/state';

import parsePageContent from '../parsePageContent';
import { PreviewMarkdownQuery } from './previewQueries';
import { PreviewMarkdownQueryData } from './previewQueries.generated';

export type MarkdownInputProps = Omit<
  CodeInputProps,
  'getPreviewContent' | 'editorRef' | 'editButtonText' | 'previewButtonText'
> &
  Pick<UseStandardCodeMirrorExtensionsOptions, 'onChange'> & {
    extensions?: Extension[];
  };

const MarkdownInput = (props: MarkdownInputProps) => {
  const client = useApolloClient();
  const { t } = useTranslation();
  const extensions = useMemo(() => [markdown(), ...(props.extensions ?? [])], [props.extensions]);
  const [editorRef] = useStandardCodeMirror({
    extensions,
    value: props.value,
    onChange: props.onChange,
  });

  return (
    <CodeInput
      {...props}
      editorRef={editorRef}
      value={props.value}
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
