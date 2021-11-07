import { useApolloClient } from '@apollo/client';
import {
  CodeInput,
  useStandardCodeMirror,
  UseStandardCodeMirrorExtensionsOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  liquid,
} from '@neinteractiveliterature/litform';
import type { CodeInputProps } from '@neinteractiveliterature/litform/lib/CodeInput';
import { useTranslation } from 'react-i18next';
import { markdown } from '@codemirror/lang-markdown';
import { useMemo } from 'react';
import { Extension } from '@codemirror/state';

import parsePageContent from '../parsePageContent';
import { PreviewMarkdownQueryData, PreviewMarkdownQueryDocument } from './previewQueries.generated';

export type MarkdownInputProps = Omit<
  CodeInputProps,
  'getPreviewContent' | 'editorRef' | 'editButtonText' | 'previewButtonText'
> &
  Pick<UseStandardCodeMirrorExtensionsOptions, 'onChange'> & {
    extensions?: Extension[];
  };

function MarkdownInput(props: MarkdownInputProps): JSX.Element {
  const client = useApolloClient();
  const { t } = useTranslation();
  const languageExtension = useMemo(
    // TODO: once parseMixed is more stable, use the Liquid mode
    // () => liquid({ baseLanguage: markdown().language }),
    () => markdown(),
    [],
  );
  const extensions = useMemo(
    () => [languageExtension, ...(props.extensions ?? [])],
    [props.extensions, languageExtension],
  );
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
          query: PreviewMarkdownQueryDocument,
          variables: { markdown: markdownContent },
          fetchPolicy: 'no-cache',
        });

        return parsePageContent(response.data?.cmsParent.previewMarkdown ?? '').bodyComponents;
      }}
    />
  );
}

export default MarkdownInput;
