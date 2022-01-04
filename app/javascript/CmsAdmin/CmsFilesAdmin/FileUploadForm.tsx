import { useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay, useCreateMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform';

import { CmsFileFieldsFragmentDoc, CmsFilesAdminQueryData } from './queries.generated';
import { CreateCmsFileMutationData, useCreateCmsFileMutation } from './mutations.generated';
import FileInputWithPreview from './FileInputWithPreview';

export type FileUploadFormProps = {
  cmsParent: CmsFilesAdminQueryData['cmsParent'];
  onUpload?: (cmsFile: CreateCmsFileMutationData['createCmsFile']['cms_file']) => void;
};

function FileUploadForm({ cmsParent, onUpload }: FileUploadFormProps): JSX.Element {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null | undefined>();
  const [createMutate, { error: createError, loading: createInProgress }] = useCreateMutationWithReferenceArrayUpdater(
    useCreateCmsFileMutation,
    cmsParent,
    'cmsFiles',
    (data) => data.createCmsFile.cms_file,
    CmsFileFieldsFragmentDoc,
  );

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
    setFile(null);
  };

  return (
    <div className="card">
      <div className="card-header">{t('cms.fileUploadForm.title', 'Upload a file')}</div>
      <div className="card-body">
        <FileInputWithPreview file={file} onChange={setFile} disabled={createInProgress} />

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
