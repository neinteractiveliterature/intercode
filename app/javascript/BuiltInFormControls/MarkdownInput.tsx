import { useApolloClient } from '@apollo/client';
import {
  CodeInput,
  useStandardCodeMirror,
  UseStandardCodeMirrorExtensionsOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  liquid,
  useModal,
} from '@neinteractiveliterature/litform';
import type { CodeInputProps } from '@neinteractiveliterature/litform/dist/types/CodeInput';
import { useTranslation } from 'react-i18next';
import { markdown } from '@codemirror/lang-markdown';
import { useMemo } from 'react';
import { Extension } from '@codemirror/state';

import parsePageContent from '../parsePageContent';
import { PreviewMarkdownQueryData, PreviewMarkdownQueryDocument } from './previewQueries.generated';
import { ActiveStorageAttachment } from '../graphqlTypes.generated';
import AddFileModal from './AddFileModal';
import { Blob } from '@rails/activestorage';
import MenuIcon from '../NavigationBar/MenuIcon';

type AttachImageModalProps = {
  visible: boolean;
  close: () => void;
  fileChosen: (file: ActiveStorageAttachment) => void;
  existingImages: ActiveStorageAttachment[];
  addBlob: (blob: Blob) => unknown;
};

function AttachImageModal({ existingImages, addBlob, visible, close, fileChosen }: AttachImageModalProps) {
  return (
    <AddFileModal
      existingFiles={existingImages}
      addBlob={addBlob}
      visible={visible}
      close={close}
      fileChosen={fileChosen}
    />
  );
}

export type ImageAttachmentConfig = {
  existingImages: ActiveStorageAttachment[];
  addBlob: (blob: Blob) => void;
};

export type MarkdownInputProps = Omit<
  CodeInputProps,
  'getPreviewContent' | 'editorRef' | 'editButtonText' | 'previewButtonText'
> &
  Pick<UseStandardCodeMirrorExtensionsOptions, 'onChange'> & {
    extensions?: Extension[];
    eventId?: string;
    eventProposalId?: string;
    imageAttachmentConfig?: ImageAttachmentConfig;
  };

function MarkdownInput({ eventId, eventProposalId, imageAttachmentConfig, ...props }: MarkdownInputProps): JSX.Element {
  const client = useApolloClient();
  const { t } = useTranslation();
  const languageExtension = useMemo(() => markdown(), []);
  const extensions = useMemo(
    () => [languageExtension, ...(props.extensions ?? [])],
    [props.extensions, languageExtension],
  );
  const [editorRef, editorView] = useStandardCodeMirror({
    extensions,
    value: props.value,
    onChange: props.onChange,
  });
  const attachImageModal = useModal();

  const addFile = (file: ActiveStorageAttachment) => {
    editorView.dispatch(editorView.state.replaceSelection(`![${file.filename}](${file.filename})`));
    editorView.focus();
  };

  return (
    <>
      <CodeInput
        {...props}
        editorRef={editorRef}
        value={props.value}
        editButtonText={t('buttons.edit')}
        previewButtonText={t('buttons.preview')}
        getPreviewContent={async (markdownContent) => {
          const response = await client.query<PreviewMarkdownQueryData>({
            query: PreviewMarkdownQueryDocument,
            variables: { markdown: markdownContent, eventId, eventProposalId },
            fetchPolicy: 'no-cache',
          });

          return parsePageContent(response.data?.cmsParent.previewMarkdown ?? '').bodyComponents;
        }}
        extraNavControls={
          <>
            {imageAttachmentConfig && (
              <li className="nav-item">
                <button type="button" className="btn btn-link nav-link px-2 py-0" onClick={attachImageModal.open}>
                  <>
                    <MenuIcon icon="bi-file-earmark-image" colorClass="" />
                    {t('buttons.attachImage')}
                  </>
                </button>
              </li>
            )}
          </>
        }
      />
      {imageAttachmentConfig && (
        <AttachImageModal
          visible={attachImageModal.visible}
          addBlob={imageAttachmentConfig.addBlob}
          close={attachImageModal.close}
          existingImages={imageAttachmentConfig.existingImages}
          fileChosen={addFile}
        />
      )}
    </>
  );
}

export default MarkdownInput;
