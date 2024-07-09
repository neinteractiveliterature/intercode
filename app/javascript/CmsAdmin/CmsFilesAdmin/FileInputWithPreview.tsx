import { useState, useCallback, useEffect, useId } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import FilePreview from './FilePreview';

export type FileInputWithPreviewProps = {
  existingFileUrl?: string | null;
  file?: File | null;
  onChange: React.Dispatch<File | null | undefined>;
  disabled?: boolean;
};

export default function FileInputWithPreview({ existingFileUrl, file, onChange, disabled }: FileInputWithPreviewProps) {
  const fileInputId = useId();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { t } = useTranslation();

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

      onChange(newFile);
    },
    [onChange],
  );

  useEffect(() => {
    if (file == null) {
      setImageUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageUrl(reader.result as string);
    });
    reader.readAsDataURL(file);
  }, [file]);

  const clearFile = useCallback(() => {
    onChange(null);
  }, [onChange]);

  return (
    <>
      {file ? (
        <div className="d-flex align-items-start">
          <FilePreview filename={file?.name} contentType={file?.type} url={imageUrl ?? undefined} />
          <button className="btn btn-secondary ms-4" type="button" onClick={clearFile}>
            {t('cms.fileUploadForm.clearFileButton')}
          </button>
        </div>
      ) : existingFileUrl && typeof file === 'undefined' ? (
        <div className="d-flex align-items-start">
          <FilePreview contentType="image/unknown" url={existingFileUrl} />
          <button className="btn btn-secondary ms-4" type="button" onClick={clearFile}>
            {t('cms.fileUploadForm.clearFileButton')}
          </button>
        </div>
      ) : (
        <div className="mb-3">
          <label className="form-label" htmlFor={fileInputId} aria-hidden>
            {t('cms.fileUploadForm.fileInputLabel')}
          </label>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <input
            className="form-control"
            type="file"
            onChange={uploadFileChanged}
            id={fileInputId}
            disabled={disabled}
          />
        </div>
      )}
    </>
  );
}
