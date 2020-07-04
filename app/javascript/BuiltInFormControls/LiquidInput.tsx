import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useApolloClient } from '@apollo/react-hooks';
import Modal from 'react-bootstrap4-modal';
import { Editor } from 'codemirror';

import CodeInput from './CodeInput';
import { PreviewLiquidQuery, PreviewNotifierLiquidQuery } from './previewQueries';
import MenuIcon from '../NavigationBar/MenuIcon';
import useModal from '../ModalDialogs/useModal';
import ErrorDisplay from '../ErrorDisplay';
import FilePreview from '../CmsAdmin/CmsFilesAdmin/FilePreview';
import SelectWithLabel from './SelectWithLabel';
import FileUploadForm from '../CmsAdmin/CmsFilesAdmin/FileUploadForm';
import { useCmsFilesAdminQueryLazyQuery } from '../CmsAdmin/CmsFilesAdmin/queries.generated';
import { PreviewNotifierLiquidQueryQuery, PreviewLiquidQueryQuery } from './previewQueries.generated';
import { CmsFile } from '../graphqlTypes.generated';
import { SyncCodeInputProps } from './SyncCodeInput';

type AddFileModalProps = {
  visible: boolean,
  fileChosen: (file: CmsFile) => void,
  close: () => void,
};

function AddFileModal({ visible, fileChosen, close }: AddFileModalProps) {
  const [loadData, {
    called, data, loading, error,
  }] = useCmsFilesAdminQueryLazyQuery();
  const [file, setFile] = useState<CmsFile | null>(null);

  const uploadedFile = (newFile: CmsFile) => {
    setFile(newFile);
  };

  useEffect(
    () => {
      if (visible && !called) {
        loadData();
      }
    },
    [visible, called, loadData],
  );

  if (!called || loading) {
    return <></>;
  }

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">Add file</div>
      <div className="modal-body">
        {error
          ? <ErrorDisplay graphQLError={error} />
          : (
            <>
              <SelectWithLabel<CmsFile>
                label="Choose existing file"
                options={data?.cmsFiles || []}
                getOptionLabel={(f) => f.filename}
                getOptionValue={(f) => f.filename}
                value={file}
                onChange={(newValue) => { setFile(newValue as CmsFile | null); }}
                formatOptionLabel={(f) => (
                  <div className="d-flex align-items-center">
                    <div className="mr-2">
                      <FilePreview
                        url={f.url}
                        contentType={f.content_type}
                        size="2em"
                      />
                    </div>
                    <div>
                      {f.filename}
                    </div>
                  </div>
                )}
                styles={{
                  menu: (provided) => ({ ...provided, zIndex: 25 }),
                }}
              />
              {data?.currentAbility.can_create_cms_files && (
                <FileUploadForm onUpload={uploadedFile} />
              )}
              {file && (
                <div className="card mt-2">
                  <div className="card-header">Preview</div>
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
        <button className="btn btn-secondary" type="button" onClick={close}>Cancel</button>
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
          Add
        </button>
      </div>
    </Modal>
  );
}

export type LiquidInputProps = Omit<SyncCodeInputProps, 'mode' | 'editorDidMount'> & {
  notifierEventKey?: string,
  disablePreview?: boolean,
};

function LiquidInput(props: LiquidInputProps) {
  const [showingDocs, setShowingDocs] = useState(false);
  const [currentDocTab, setCurrentDocTab] = useState('convention');
  const client = useApolloClient();
  const { notifierEventKey } = props;
  const editorRef = useRef<Editor | null>(null);
  const addFileModal = useModal();

  const docTabClicked = (event: React.MouseEvent, tab: string) => {
    event.preventDefault();
    setCurrentDocTab(tab);
  };

  const getPreviewContent = props.disablePreview ? undefined : async (liquid: string) => {
    if (notifierEventKey) {
      const response = await client.query<PreviewNotifierLiquidQueryQuery>({
        query: PreviewNotifierLiquidQuery,
        variables: { liquid, eventKey: notifierEventKey },
        fetchPolicy: 'no-cache',
      });
      return response.data.previewLiquid;
    }

    const response = await client.query<PreviewLiquidQueryQuery>({
      query: PreviewLiquidQuery,
      variables: { liquid },
      fetchPolicy: 'no-cache',
    });

    return response.data.previewLiquid;
  };

  const addFile = (file: CmsFile) => {
    editorRef.current?.replaceSelection(`{% file_url ${file.filename} %}`, 'start');
    editorRef.current?.focus();
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
              <ul className="nav nav-tabs pl-2 justify-content-center">
                <li className="nav-item">
                  { /* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    href="#"
                    className={classNames('nav-link', { active: currentDocTab === 'convention' })}
                    onClick={(e) => docTabClicked(e, 'convention')}
                  >
                    Convention-specific markup
                  </a>
                </li>
                <li className="nav-item">
                  { /* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    href="#"
                    className={classNames('nav-link', { active: currentDocTab === 'core' })}
                    onClick={(e) => docTabClicked(e, 'core')}
                  >
                    Core Liquid markup
                  </a>
                </li>
              </ul>
            </div>
            <div className="border-bottom border-color-light d-flex align-items-center">
              <button
                type="button"
                className="btn btn-link btn-sm mr-3 text-body"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowingDocs(false)}
              >
                <i className="fa fa-close" title="Close" />
              </button>
            </div>
          </header>
          <iframe
            src={
              currentDocTab === 'convention'
                ? liquidDocsUrl
                : 'https://shopify.github.io/liquid/'
            }
            title="Liquid markup documentation"
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
        mode="liquid-html"
        getPreviewContent={getPreviewContent}
        editorDidMount={(editor) => { editorRef.current = editor; }}
        extraNavControls={(
          <>
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-link nav-link px-2 py-0"
                onClick={addFileModal.open}
              >
                <MenuIcon icon="fa-file-image-o" colorClass="" />
                Add file…
              </button>
            </li>
            <li className="flex-grow-1 d-flex justify-content-end">
              <div className="nav-item">
                <button
                  type="button"
                  className="btn btn-link nav-link py-0 px-2"
                  onClick={(e) => { e.preventDefault(); setShowingDocs(true); }}
                >
                  <i className="fa fa-question-circle" />
                  {' '}
                  Help
                </button>
              </div>
            </li>
          </>
        )}
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
