import { useApolloClient } from '@apollo/client';
import {
  CodeInput,
  useStandardCodeMirror,
  UseStandardCodeMirrorExtensionsOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  liquid,
  LoadQueryWrapper,
} from '@neinteractiveliterature/litform';
import type { CodeInputProps } from '@neinteractiveliterature/litform/lib/CodeInput';
import { useTranslation } from 'react-i18next';
import { markdown } from '@codemirror/lang-markdown';
import { useMemo } from 'react';
import { Extension } from '@codemirror/state';

import parsePageContent from '../parsePageContent';
import { PreviewMarkdownQueryData, PreviewMarkdownQueryDocument } from './previewQueries.generated';
import { ActiveStorageAttachment } from '../graphqlTypes.generated';
import AddFileModal from './AddFileModal';

type AttachImageModalProps = {
  visible: boolean;
  close: () => void;
  fileChosen: (file: ActiveStorageAttachment) => void;
  existingImages: ActiveStorageAttachment[];
};

function AttachImageModal({ existingImages, addImage, removeImage, visible, close, fileChosen }: AttachImageModalProps) {
  const [createCmsFile] = useCreateCmsFileMutation();
  const uploadFile = useCallback(
    async (file: File) => {
      const result = await createCmsFile({ variables: { file } });
      const attachment = result.data?.createCmsFile.cms_file.file;
      if (!attachment) {
        throw new Error('Result did not include an ActiveStorage attachment');
      }

      return attachment;
    },
    [createCmsFile],
  );

  return (
    <AddFileModal
      existingFiles={existingImages}
      uploadFile={uploadFile}
      visible={visible}
      close={close}
      fileChosen={fileChosen}
    />
  );
}

export type MarkdownInputProps = Omit<
  CodeInputProps,
  'getPreviewContent' | 'editorRef' | 'editButtonText' | 'previewButtonText'
> &
  Pick<UseStandardCodeMirrorExtensionsOptions, 'onChange'> & {
    extensions?: Extension[];
    eventId?: string;
    eventProposalId?: string;
  };

function MarkdownInput({ eventId, eventProposalId, ...props }: MarkdownInputProps): JSX.Element {
  const client = useApolloClient();
  const { t } = useTranslation();
  const languageExtension = useMemo(() => markdown(), []);
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
          variables: { markdown: markdownContent, eventId, eventProposalId },
          fetchPolicy: 'no-cache',
        });

        return parsePageContent(response.data?.cmsParent.previewMarkdown ?? '').bodyComponents;
      }}
    />
  );
}

export default MarkdownInput;
