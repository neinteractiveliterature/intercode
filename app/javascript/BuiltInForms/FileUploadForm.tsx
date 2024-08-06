import { useCallback, useContext, useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';
import useAsyncFunction from '../useAsyncFunction';
import FileInputWithPreview from '../CmsAdmin/CmsFilesAdmin/FileInputWithPreview';
import { DirectUpload, DirectUploadDelegate, Blob } from '@rails/activestorage';
import RailsDirectUploadsContext from '../RailsDirectUploadsContext';
import classNames from 'classnames';
import AuthenticityTokensContext from '../AuthenticityTokensContext';
import { Helmet } from 'react-helmet-async';
import AuthenticityTokensManager from '../AuthenticityTokensContext';

function uploadFile(file: File, directUploadURL: string, onProgress?: (event: ProgressEvent<XMLHttpRequest>) => void) {
  return new Promise<Blob>((resolve, reject) => {
    const delegate: DirectUploadDelegate = {
      directUploadWillStoreFileWithXHR: (xhr) => {
        if (onProgress) {
          xhr.upload.addEventListener('progress', onProgress);
        }
      },
    };

    const upload = new DirectUpload(file, directUploadURL, delegate);
    upload.create((error, blob) => {
      if (error) {
        reject(error);
      } else {
        resolve(blob);
      }
    });
  });
}

export type FileUploadFormProps = {
  onUpload?: (blob: Blob, file: File) => unknown;
};

function FileUploadForm({ onUpload }: FileUploadFormProps): JSX.Element {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null | undefined>();
  const [uploadAsync, error, uploading] = useAsyncFunction(uploadFile);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressIndeterminate, setProgressIndeterminate] = useState(false);
  const { railsDirectUploadsUrl } = useContext(RailsDirectUploadsContext);
  const { railsDirectUploads: directUploadsAuthenticityToken } = AuthenticityTokensManager.instance.tokens;

  const onProgress = useCallback((event: ProgressEvent<XMLHttpRequest>) => {
    setProgressIndeterminate(!event.lengthComputable);
    if (event.lengthComputable) {
      setProgressPercent((event.loaded / event.total) * 100);
    }
  }, []);

  const uploadFormSubmitted = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!file) {
      return;
    }

    const blob = await uploadAsync(file, railsDirectUploadsUrl, onProgress);

    if (blob && onUpload) {
      await onUpload(blob, file);
    }

    setFile(null);
  };

  return (
    <div className="card">
      <div className="card-header">{t('cms.fileUploadForm.title')}</div>
      <div className="card-body">
        <Helmet>
          {/* ActiveStorage JS requires us to put the csrf token in the head */}
          <meta name="csrf-token" content={directUploadsAuthenticityToken} />
        </Helmet>
        <FileInputWithPreview file={file} onChange={setFile} disabled={uploading} />

        <ErrorDisplay graphQLError={error as ApolloError} />

        {uploading && (
          <div className="progress">
            <div
              className={classNames('progress-bar progress-bar-striped', {
                'progress-bar-animated': progressIndeterminate,
              })}
              role="progressbar"
              aria-valuenow={progressIndeterminate ? progressPercent : 100}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Upload progress"
            />
          </div>
        )}

        <div className="mt-2">
          <button
            type="submit"
            onClick={uploadFormSubmitted}
            className="btn btn-primary me-4"
            disabled={!file || uploading}
          >
            {t('cms.fileUploadForm.uploadFileButton')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileUploadForm;
