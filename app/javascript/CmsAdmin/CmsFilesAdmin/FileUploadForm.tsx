import { useState, useCallback } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';
import {
  ErrorDisplay,
  useCreateMutationWithReferenceArrayUpdater,
  useUniqueId,
} from '@neinteractiveliterature/litform';

import FilePreview from './FilePreview';
import { CmsFileFieldsFragmentDoc, CmsFilesAdminQueryData } from './queries.generated';
import { CreateCmsFileMutationData, useCreateCmsFileMutation } from './mutations.generated';

export type FileUploadFormProps = {
  cmsParent: CmsFilesAdminQueryData['cmsParent'];
  onUpload?: (cmsFile: CreateCmsFileMutationData['createCmsFile']['cms_file']) => void;
};

function FileUploadForm({ cmsParent, onUpload }: FileUploadFormProps): JSX.Element {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputId = useUniqueId('file-');
  const [createMutate, { error: createError, loading: createInProgress }] = useCreateMutationWithReferenceArrayUpdater(
    useCreateCmsFileMutation,
    cmsParent,
    'cmsFiles',
    (data) => data.createCmsFile.cms_file,
    CmsFileFieldsFragmentDoc,
  );

  const uploadFileChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files == null) {
      return;
    }

    const newFile = files[0];
    if (!newFile) {
      return;
    }

    setFile(newFile);

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageUrl(reader.result as string);
    });
    reader.readAsDataURL(newFile);
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setImageUrl(null);
  }, []);

  const uploadFormSubmitted = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!file) {
      return;
    }

    const response = await createMutate({ variables: { file } });
    if (response?.data?.createCmsFile && onUpload) {
      onUpload(response.data.createCmsFile.cms_file);
    }
    clearFile();
  };

  return (
    <div className="card">
      <div className="card-header">{t('cms.fileUploadForm.title', 'Upload a file')}</div>
      <div className="card-body">
        {file ? (
          <div className="d-flex align-items-start">
            <FilePreview filename={(file || {}).name} contentType={(file || {}).type} url={imageUrl ?? undefined} />
            <button className="btn btn-secondary ms-4" type="button" onClick={clearFile}>
              {t('cms.fileUploadForm.clearFileButton', 'Clear')}
            </button>
          </div>
        ) : (
          <div className="mb-3">
            <label className="form-label" htmlFor={fileInputId} aria-hidden>
              {t('cms.fileUploadForm.fileInputLabel', 'File to upload')}
            </label>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <input
              className="form-control"
              type="file"
              onChange={uploadFileChanged}
              id={fileInputId}
              disabled={createInProgress}
            />
          </div>
        )}

        <ErrorDisplay graphQLError={createError as ApolloError} />

        <div className="mt-2">
          <button
            type="submit"
            onClick={uploadFormSubmitted}
            className="btn btn-primary me-4"
            disabled={!file || createInProgress}
          >
            {t('cms.fileUploadForm.uploadFileButton', 'Upload')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileUploadForm;
