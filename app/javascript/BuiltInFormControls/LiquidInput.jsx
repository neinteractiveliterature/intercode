import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import Modal from 'react-bootstrap4-modal';

import { CmsFilesAdminQuery } from '../CmsAdmin/CmsFilesAdmin/queries.gql';
import CodeInput from './CodeInput';
import { PreviewLiquidQuery, PreviewNotifierLiquidQuery } from './previewQueries.gql';
import MenuIcon from '../NavigationBar/MenuIcon';
import useModal from '../ModalDialogs/useModal';
import ErrorDisplay from '../ErrorDisplay';
import FilePreview from '../CmsAdmin/CmsFilesAdmin/FilePreview';
import SelectWithLabel from './SelectWithLabel';
import FileUploadForm from '../CmsAdmin/CmsFilesAdmin/FileUploadForm';

function AddFileModal({ visible, fileChosen, close }) {
  const { data, loading, error } = useQuery(CmsFilesAdminQuery);
  const [file, setFile] = useState(null);

  const uploadedFile = (newFile) => {
    setFile(newFile);
  };

  if (loading) {
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
              <SelectWithLabel
                label="Choose existing file"
                options={data.cmsFiles}
                getOptionLabel={(f) => f.filename}
                getOptionValue={(f) => f.filename}
                value={file}
                onChange={setFile}
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
              />
              {data.currentAbility.can_create_cms_files && (
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

AddFileModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  fileChosen: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

function LiquidInput(props) {
  const [showingDocs, setShowingDocs] = useState(false);
  const [currentDocTab, setCurrentDocTab] = useState('convention');
  const client = useApolloClient();
  const { notifierEventKey } = props;
  const editorRef = useRef(null);
  const addFileModal = useModal();

  const docTabClicked = (event, tab) => {
    event.preventDefault();
    setCurrentDocTab(tab);
  };

  const getPreviewContent = props.disablePreview ? null : async (liquid) => {
    const response = await client.query({
      query: notifierEventKey ? PreviewNotifierLiquidQuery : PreviewLiquidQuery,
      variables: { liquid, ...(notifierEventKey ? { eventKey: notifierEventKey } : {}) },
      fetchPolicy: 'no-cache',
    });

    return response.data.previewLiquid;
  };

  const addFile = (file) => {
    editorRef.current.replaceSelection(`{% file_url ${file.filename} %}`, 'start');
    editorRef.current.focus();
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

LiquidInput.propTypes = {
  disablePreview: PropTypes.bool,
  notifierEventKey: PropTypes.string,
};

LiquidInput.defaultProps = {
  disablePreview: false,
  notifierEventKey: null,
};

export default LiquidInput;
