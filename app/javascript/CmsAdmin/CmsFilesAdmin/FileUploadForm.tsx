import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ApolloError } from 'apollo-client';

import { CmsFilesAdminQuery } from './queries';
import { CreateCmsFile } from './mutations';
import FilePreview from './FilePreview';
import useUniqueId from '../../useUniqueId';
import { useCreateMutation } from '../../MutationUtils';
import useAsyncFunction from '../../useAsyncFunction';
import ErrorDisplay from '../../ErrorDisplay';
import { CmsFile } from '../../graphqlTypes.generated';
import { CmsFilesAdminQueryQuery } from './queries.generated';
import { CreateCmsFileMutationVariables, CreateCmsFileMutation } from './mutations.generated';

export type FileUploadFormProps = {
  onUpload?: (cmsFile: CmsFile) => void,
};

function FileUploadForm({ onUpload }: FileUploadFormProps) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputId = useUniqueId('file-');
  const [createMutate, createError, createInProgress] = useAsyncFunction(
    useCreateMutation<
    CmsFilesAdminQueryQuery,
    CreateCmsFileMutationVariables,
    CreateCmsFileMutation
    >(CreateCmsFile, {
      query: CmsFilesAdminQuery,
      arrayPath: ['cmsFiles'],
      newObjectPath: ['createCmsFile', 'cms_file'],
    }),
  );

  const uploadFileChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [],
  );

  const clearFile = useCallback(
    () => {
      setFile(null);
      setImageUrl(null);
    },
    [],
  );

  const uploadFormSubmitted = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const response = await createMutate({ variables: { file } });
    if (response?.data?.createCmsFile && onUpload) {
      onUpload(response.data.createCmsFile.cms_file);
    }
    clearFile();
  };

  return (
    <div className="card">
      <div className="card-header">
        {t('cms.fileUploadForm.title', 'Upload a file')}
      </div>
      <div className="card-body">
        <form onSubmit={uploadFormSubmitted}>
          {
            file
              ? (
                <div className="d-flex align-items-start">
                  <FilePreview
                    filename={(file || {}).name}
                    contentType={(file || {}).type}
                    url={imageUrl ?? undefined}
                  />
                  <button className="btn btn-secondary ml-4" type="button" onClick={clearFile}>
                    {t('cms.fileUploadForm.clearFileButton', 'Clear')}
                  </button>
                </div>
              )
              : (
                <div className="form-group">
                  <div className="custom-file">
                    { /* eslint-disable-next-line jsx-a11y/control-has-associated-label */ }
                    <input
                      className="custom-file-input"
                      type="file"
                      onChange={uploadFileChanged}
                      id={fileInputId}
                      disabled={createInProgress}
                    />
                    <label className="custom-file-label" htmlFor={fileInputId} aria-hidden>
                      {t('cms.fileUploadForm.fileInputLabel', 'Choose a file...')}
                    </label>
                  </div>
                </div>
              )
          }

          <ErrorDisplay graphQLError={createError as ApolloError} />

          <div className="mt-2">
            <input
              type="submit"
              className="btn btn-primary mr-4"
              disabled={!file || createInProgress}
              value={t<string>('cms.fileUploadForm.uploadFileButton', 'Upload')}
              aria-label={t('cms.fileUploadForm.uploadFileButton', 'Upload')}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default FileUploadForm;
