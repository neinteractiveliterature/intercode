import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { useCmsFilesAdminQueryLazyQuery } from '../CmsAdmin/CmsFilesAdmin/queries.generated';
import FilePreview from '../CmsAdmin/CmsFilesAdmin/FilePreview';
import SelectWithLabel from './SelectWithLabel';
import FileUploadForm from '../BuiltInForms/FileUploadForm';
import { ActiveStorageAttachment } from '../graphqlTypes.generated';
import { Blob } from '@rails/activestorage';

export type AddFileModalProps = {
  visible: boolean;
  existingFiles: ActiveStorageAttachment[];
  addBlob: (blob: Blob) => unknown;
  fileChosen: (file: ActiveStorageAttachment) => void;
  close: () => void;
};

export default function AddFileModal({ visible, existingFiles, addBlob, fileChosen, close }: AddFileModalProps) {
  const { t } = useTranslation();
  const [loadData, { called, data, loading, error }] = useCmsFilesAdminQueryLazyQuery();
  const [file, setFile] = useState<ActiveStorageAttachment | null>(null);

  const uploadedFile = async (blob: Blob, newFile: File) => {
    await addBlob(blob);

    // construct a fake attachment with data URLs just for preview purposes
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setFile({
        __typename: 'ActiveStorageAttachment',
        byte_size: blob.byte_size,
        content_type: blob.content_type,
        filename: blob.filename,
        id: blob.checksum,
        url: reader.result as string,
        resized_url: reader.result as string,
      });
    });
    reader.readAsDataURL(newFile);
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
      <div className="modal-header">{t('cms.addFileModal.title')}</div>
      <div className="modal-body">
        {error ? (
          <ErrorDisplay graphQLError={error} />
        ) : (
          <>
            <SelectWithLabel<ActiveStorageAttachment>
              label={t('cms.addFileModal.chooseExistingFileLabel')}
              options={existingFiles}
              getOptionLabel={(f) => f.filename}
              getOptionValue={(f) => f.filename}
              value={file}
              onChange={(newValue) => {
                setFile(newValue as ActiveStorageAttachment | null);
              }}
              formatOptionLabel={(f) => (
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <FilePreview url={f.resized_url} contentType={f.content_type} size="2em" />
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
                <div className="card-header">{t('cms.addFileModal.filePreview.title')}</div>
                <div className="card-body">
                  <FilePreview url={file.url} contentType={file.content_type} filename={file.filename} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" onClick={close}>
          {t('buttons.cancel')}
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
          {t('buttons.add')}
        </button>
      </div>
    </Modal>
  );
}
