import { useState, useMemo, useCallback } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import { useApolloClient } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { html } from '@codemirror/lang-html';
import {
  useModal,
  CodeInput,
  useStandardCodeMirror,
  UseStandardCodeMirrorExtensionsOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  liquid,
  LoadQueryWrapper,
} from '@neinteractiveliterature/litform';
import { CodeInputProps } from '@neinteractiveliterature/litform/lib/CodeInput';
import { Extension } from '@codemirror/state';

import MenuIcon from '../NavigationBar/MenuIcon';
import {
  PreviewNotifierLiquidQueryData,
  PreviewLiquidQueryData,
  PreviewNotifierLiquidQueryDocument,
  PreviewLiquidQueryDocument,
} from './previewQueries.generated';
import parseCmsContent from '../parseCmsContent';
import parsePageContent from '../parsePageContent';
import AddFileModal from './AddFileModal';
import { ActiveStorageAttachment } from '../graphqlTypes.generated';
import {
  CmsFilesAdminQueryData,
  CmsFilesAdminQueryVariables,
  useCmsFilesAdminQuery,
} from '../CmsAdmin/CmsFilesAdmin/queries.generated';
import { useCreateCmsFileMutation } from '../CmsAdmin/CmsFilesAdmin/mutations.generated';
import { Blob } from '@rails/activestorage';

type CreateCmsFileModalProps = {
  visible: boolean;
  close: () => void;
  fileChosen: (file: ActiveStorageAttachment) => void;
};

const CreateCmsFileModal = LoadQueryWrapper<
  CmsFilesAdminQueryData,
  CmsFilesAdminQueryVariables,
  CreateCmsFileModalProps
>(useCmsFilesAdminQuery, function CreateCmsFileModal({ data, visible, close, fileChosen }) {
  const attachments = useMemo(
    () => data.cmsParent.cmsFiles.map((cmsFile) => ({ ...cmsFile.file, resized_url: cmsFile.file.thumbnailUrl })),
    [data.cmsParent.cmsFiles],
  );
  const [createCmsFile] = useCreateCmsFileMutation();
  const addBlob = useCallback(
    (blob: Blob) => createCmsFile({ variables: { signedBlobId: blob.signed_id } }),
    [createCmsFile],
  );

  return (
    <AddFileModal
      existingFiles={attachments}
      addBlob={addBlob}
      visible={visible}
      close={close}
      fileChosen={fileChosen}
      attachmentName="file"
    />
  );
});

export type LiquidInputProps = Omit<
  CodeInputProps,
  'editorDidMount' | 'editorRef' | 'getPreviewContent' | 'previewButtonText' | 'editButtonText' | 'extraNavControls'
> &
  Pick<UseStandardCodeMirrorExtensionsOptions, 'onChange'> & {
    notifierEventKey?: string;
    disablePreview?: boolean;
    extensions?: Extension[];
  };

function LiquidInput(props: LiquidInputProps): JSX.Element {
  const { t } = useTranslation();
  const [showingDocs, setShowingDocs] = useState(false);
  const [currentDocTab, setCurrentDocTab] = useState('convention');
  const client = useApolloClient();
  const { notifierEventKey } = props;
  const addFileModal = useModal();

  const languageExtension = useMemo(() => liquid({ baseLanguage: html({ matchClosingTags: false }).language }), []);

  const extensions = useMemo(
    () => [languageExtension, ...(props.extensions ?? [])],
    [languageExtension, props.extensions],
  );

  const [editorRef, editorView] = useStandardCodeMirror({
    extensions,
    value: props.value,
    onChange: props.onChange,
  });

  const docTabClicked = (event: React.MouseEvent, tab: string) => {
    event.preventDefault();
    setCurrentDocTab(tab);
  };

  const getPreviewContent = props.disablePreview
    ? undefined
    : async (liquidContent: string) => {
        if (notifierEventKey) {
          const response = await client.query<PreviewNotifierLiquidQueryData>({
            query: PreviewNotifierLiquidQueryDocument,
            variables: { liquid: liquidContent, eventKey: notifierEventKey },
            fetchPolicy: 'no-cache',
          });

          return parsePageContent(response.data?.convention.previewLiquid ?? '', {}).bodyComponents;
        }

        const response = await client.query<PreviewLiquidQueryData>({
          query: PreviewLiquidQueryDocument,
          variables: { liquid: liquidContent },
          fetchPolicy: 'no-cache',
        });

        return parseCmsContent(response.data?.cmsParent.previewLiquid ?? '').bodyComponents;
      };

  const addFile = (file: ActiveStorageAttachment) => {
    editorView.dispatch(editorView.state.replaceSelection(`{% file_url ${file.filename} %}`));
    editorView.focus();
  };

  const renderDocs = () => {
    if (!showingDocs) {
      return null;
    }

    const liquidDocsUrl = notifierEventKey ? `/liquid_docs?notifier_event_key=${notifierEventKey}` : '/liquid_docs';

    return (
      <>
        <div className="liquid-docs-browser d-flex flex-column align-items-stretch">
          <header className="bg-light border-top border-color-light d-flex align-items-stretch">
            <div className="flex-grow-1 pt-1">
              <ul className="nav nav-tabs ps-2 justify-content-center">
                <li className="nav-item">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    href="#"
                    className={classNames('nav-link', { active: currentDocTab === 'convention' })}
                    onClick={(e) => docTabClicked(e, 'convention')}
                  >
                    {t('cms.liquidInput.help.conventionSpecificMarkup', 'Convention-specific markup')}
                  </a>
                </li>
                <li className="nav-item">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    href="#"
                    className={classNames('nav-link', { active: currentDocTab === 'core' })}
                    onClick={(e) => docTabClicked(e, 'core')}
                  >
                    {t('cms.liquidInput.help.coreLiquidMarkup', 'Core Liquid markup')}
                  </a>
                </li>
              </ul>
            </div>
            <div className="border-bottom border-color-light d-flex align-items-center">
              <button
                type="button"
                className="btn btn-link btn-sm me-3 text-body"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowingDocs(false)}
              >
                <i className="bi-x" title={t('buttons.close', 'Close')} />
              </button>
            </div>
          </header>
          <iframe
            src={currentDocTab === 'convention' ? liquidDocsUrl : 'https://shopify.github.io/liquid/'}
            title={t('cms.liquidInput.help.iframeTitle', 'Documentation')}
            className="flex-grow-1 border-0"
          />
        </div>
        <div className="liquid-docs-spacer" />
      </>
    );
  };

  return (
    <>
      <CodeInput
        {...props}
        editorRef={editorRef}
        getPreviewContent={getPreviewContent}
        editButtonText={t('buttons.edit', 'Edit')}
        previewButtonText={t('buttons.preview', 'Preview')}
        extraNavControls={
          <>
            <li className="nav-item">
              <button type="button" className="btn btn-link nav-link px-2 py-0" onClick={addFileModal.open}>
                <MenuIcon icon="bi-file-earmark-image" colorClass="" />
                {t('cms.liquidInput.addFileButton', 'Add file…')}
              </button>
            </li>
            <li className="flex-grow-1 d-flex justify-content-end">
              <div className="nav-item">
                <button
                  type="button"
                  className="btn btn-link nav-link py-0 px-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowingDocs(true);
                  }}
                >
                  <i className="bi-question-circle-fill" /> {t('buttons.help', 'Help')}
                </button>
              </div>
            </li>
          </>
        }
      >
        {renderDocs()}
      </CodeInput>
      <CreateCmsFileModal visible={addFileModal.visible} close={addFileModal.close} fileChosen={addFile} />
    </>
  );
}

export default LiquidInput;
