import { useState, useEffect, useMemo } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import { useApolloClient } from '@apollo/client';
import { Modal } from 'react-bootstrap4-modal';
import { useTranslation } from 'react-i18next';
import { html } from '@codemirror/lang-html';
import {
  useModal,
  CodeInput,
  ErrorDisplay,
  useStandardCodeMirror,
  UseStandardCodeMirrorExtensionsOptions,
} from '@neinteractiveliterature/litform';
import { CodeInputProps } from '@neinteractiveliterature/litform/lib/CodeInput';
import { Extension } from '@codemirror/state';

import { useCmsFilesAdminQueryLazyQuery } from '../CmsAdmin/CmsFilesAdmin/queries.generated';
import { PreviewLiquidQuery, PreviewNotifierLiquidQuery } from './previewQueries';
import MenuIcon from '../NavigationBar/MenuIcon';
import FilePreview from '../CmsAdmin/CmsFilesAdmin/FilePreview';
import SelectWithLabel from './SelectWithLabel';
import FileUploadForm from '../CmsAdmin/CmsFilesAdmin/FileUploadForm';
import { PreviewNotifierLiquidQueryData, PreviewLiquidQueryData } from './previewQueries.generated';
import { CmsFile } from '../graphqlTypes.generated';
import parseCmsContent from '../parseCmsContent';

type AddFileModalProps = {
  visible: boolean;
  fileChosen: (file: CmsFile) => void;
  close: () => void;
};

function AddFileModal({ visible, fileChosen, close }: AddFileModalProps) {
  const { t } = useTranslation();
  const [loadData, { called, data, loading, error }] = useCmsFilesAdminQueryLazyQuery();
  const [file, setFile] = useState<CmsFile | null>(null);

  const uploadedFile = (newFile: CmsFile) => {
    setFile(newFile);
  };

  useEffect(() => {
    if (visible && !called) {
      loadData();
    }
  }, [visible, called, loadData]);

  if (!called || loading) {
    return <></>;
  }

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">{t('cms.addFileModal.title', 'Add file')}</div>
      <div className="modal-body">
        {error ? (
          <ErrorDisplay graphQLError={error} />
        ) : (
          <>
            <SelectWithLabel<CmsFile>
              label={t('cms.addFileModal.chooseExistingFileLabel', 'Choose existing file')}
              options={data?.cmsFiles || []}
              getOptionLabel={(f) => f.filename}
              getOptionValue={(f) => f.filename}
              value={file}
              onChange={(newValue) => {
                setFile(newValue as CmsFile | null);
              }}
              formatOptionLabel={(f) => (
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <FilePreview url={f.url} contentType={f.content_type} size="2em" />
                  </div>
                  <div>{f.filename}</div>
                </div>
              )}
              styles={{
                menu: (provided) => ({ ...provided, zIndex: 25 }),
              }}
            />
            {data?.currentAbility.can_create_cms_files && (
              <div className="card mt-2">
                <FileUploadForm onUpload={uploadedFile} />
              </div>
            )}
            {file && (
              <div className="card mt-2">
                <div className="card-header">
                  {t('cms.addFileModal.filePreview.title', 'Preview')}
                </div>
                <div className="card-body">
                  <FilePreview
                    url={file.url}
                    contentType={file.content_type}
                    filename={file.filename}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" onClick={close}>
          {t('buttons.cancel', 'Cancel')}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={file == null}
          onClick={() => {
            if (file == null) {
              return;
            }

            fileChosen(file);
            close();
          }}
        >
          {t('buttons.add', 'Add')}
        </button>
      </div>
    </Modal>
  );
}

export type LiquidInputProps = Omit<
  CodeInputProps,
  | 'editorDidMount'
  | 'editorRef'
  | 'getPreviewContent'
  | 'previewButtonText'
  | 'editButtonText'
  | 'extraNavControls'
> &
  Pick<UseStandardCodeMirrorExtensionsOptions, 'onChange'> & {
    notifierEventKey?: string;
    disablePreview?: boolean;
    extensions?: Extension[];
  };

function LiquidInput(props: LiquidInputProps) {
  const { t } = useTranslation();
  const [showingDocs, setShowingDocs] = useState(false);
  const [currentDocTab, setCurrentDocTab] = useState('convention');
  const client = useApolloClient();
  const { notifierEventKey } = props;
  const addFileModal = useModal();

  const extensions = useMemo(() => [html(), ...(props.extensions ?? [])], [props.extensions]);

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
    : async (liquid: string) => {
        if (notifierEventKey) {
          const response = await client.query<PreviewNotifierLiquidQueryData>({
            query: PreviewNotifierLiquidQuery,
            variables: { liquid, eventKey: notifierEventKey },
            fetchPolicy: 'no-cache',
          });
          return response.data?.previewLiquid ?? '';
        }

        const response = await client.query<PreviewLiquidQueryData>({
          query: PreviewLiquidQuery,
          variables: { liquid },
          fetchPolicy: 'no-cache',
        });

        return parseCmsContent(response.data?.previewLiquid ?? '').bodyComponents;
      };

  const addFile = (file: CmsFile) => {
    editorView.dispatch(editorView.state.replaceSelection(`{% file_url ${file.filename} %}`));
    editorView.focus();
  };

  const renderDocs = () => {
    if (!showingDocs) {
      return null;
    }

    const liquidDocsUrl = notifierEventKey
      ? `/liquid_docs?notifier_event_key=${notifierEventKey}`
      : '/liquid_docs';

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
                    {t(
                      'cms.liquidInput.help.conventionSpecificMarkup',
                      'Convention-specific markup',
                    )}
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
            src={
              currentDocTab === 'convention' ? liquidDocsUrl : 'https://shopify.github.io/liquid/'
            }
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
              <button
                type="button"
                className="btn btn-link nav-link px-2 py-0"
                onClick={addFileModal.open}
              >
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
      <AddFileModal
        visible={addFileModal.visible}
        close={addFileModal.close}
        fileChosen={addFile}
      />
    </>
  );
}

export default LiquidInput;
