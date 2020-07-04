import React, { useState, useCallback } from 'react';

import { CmsFilesAdminQuery } from './queries';
import { CreateCmsFile } from './mutations';
import FilePreview from './FilePreview';
import useUniqueId from '../../useUniqueId';
import { useCreateMutation } from '../../MutationUtils';
import useAsyncFunction from '../../useAsyncFunction';
import ErrorDisplay from '../../ErrorDisplay';
import { CmsFilesAdminQueryQuery } from './queries.generated';
import { CreateCmsFileMutation, CreateCmsFileMutationVariables } from './mutations.generated';
import { CmsFile } from '../../graphqlTypes.generated';

export type FileUploadFormProps = {
  onUpload: (cmsFile: CmsFile) => void,
};

function FileUploadForm({ onUpload }: FileUploadFormProps) {
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
      <div className="card-header">Upload a file</div>
      <div className="card-body">
        <form onSubmit={uploadFormSubmitted}>
          {
            file
              ? (
                <div className="d-flex align-items-start">
                  <FilePreview
                    filename={(file || {}).name}
                    contentType={(file || {}).type}
                    url={imageUrl}
                  />
                  <button className="btn btn-secondary ml-4" type="button" onClick={clearFile}>
                    Clear
                  </button>
                </div>
              )
              : (
                <div className="form-group">
                  <div className="custom-file">
                    <input
                      className="custom-file-input"
                      type="file"
                      onChange={uploadFileChanged}
                      id={fileInputId}
                      disabled={createInProgress}
                      aria-label="Choose a file..."
                    />
                    <label className="custom-file-label" htmlFor={fileInputId} aria-hidden>
                      Choose a file...
                    </label>
                  </div>
                </div>
              )
          }

          <ErrorDisplay graphQLError={createError} />

          <div className="mt-2">
            <input
              type="submit"
              className="btn btn-primary mr-4"
              disabled={!file || createInProgress}
              value="Upload"
              aria-label="Upload"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default FileUploadForm;
