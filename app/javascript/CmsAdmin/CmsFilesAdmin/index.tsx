import bytes from 'bytes';
import {
  ErrorDisplay,
  useConfirm,
  CopyToClipboardButton,
  useCreateMutationWithReferenceArrayUpdater,
  useDeleteMutationWithReferenceArrayUpdater,
  LoadQueryWrapper,
} from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';

import FilePreview from './FilePreview';
import usePageTitle from '../../usePageTitle';
import InPlaceEditor from '../../BuiltInFormControls/InPlaceEditor';
import { useRenameCmsFileMutation, useDeleteCmsFileMutation, useCreateCmsFileMutation } from './mutations.generated';
import { CmsFileFieldsFragmentDoc, useCmsFilesAdminQuery } from './queries.generated';
import { useCallback } from 'react';
import FileUploadForm from '../../BuiltInForms/FileUploadForm';
import { Blob } from '@rails/activestorage';

export default LoadQueryWrapper(useCmsFilesAdminQuery, function CmsFilesAdmin({ data }): JSX.Element {
  const [deleteFile] = useDeleteMutationWithReferenceArrayUpdater(
    useDeleteCmsFileMutation,
    data.cmsParent,
    'cmsFiles',
    (file) => ({ id: file.id }),
  );
  const [renameFileMutate] = useRenameCmsFileMutation();
  const confirm = useConfirm();
  const { t } = useTranslation();

  usePageTitle('CMS Files');

  const renameFile = (id: string, filename: string) =>
    renameFileMutate({
      variables: { id, filename },
    });

  const [createFile] = useCreateMutationWithReferenceArrayUpdater(
    useCreateCmsFileMutation,
    data.cmsParent,
    'cmsFiles',
    (data) => data.createCmsFile.cms_file,
    CmsFileFieldsFragmentDoc,
  );

  const onUpload = useCallback(
    async (blob: Blob) => {
      const result = await createFile({ variables: { signedBlobId: blob.signed_id } });
      const attachment = result.data?.createCmsFile.cms_file.file;
      if (!attachment) {
        throw new Error('Result did not include an ActiveStorage attachment');
      }

      return attachment;
    },
    [createFile],
  );

  return (
    <>
      <div className="cms-file-card-deck mb-4">
        {data?.cmsParent.cmsFiles.map((cmsFile) => (
          <div className="card" key={cmsFile.id}>
            <div className="card-header">
              {cmsFile.current_ability_can_delete && (
                <div className="float-end">
                  <button
                    type="button"
                    className="btn btn-outline-danger px-2 py-1"
                    onClick={() =>
                      confirm({
                        prompt: `Are you sure you want to delete ${cmsFile.file.filename}?`,
                        action: () => deleteFile(cmsFile),
                        renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                      })
                    }
                  >
                    <i className="bi-trash-fill" aria-hidden="true" />
                  </button>
                </div>
              )}
              <small className="text-break fw-bold">
                <InPlaceEditor
                  value={cmsFile.file.filename}
                  onChange={(filename: string) => renameFile(cmsFile.id, filename)}
                />
              </small>
              <CopyToClipboardButton
                className="btn btn-sm btn-outline-primary"
                defaultText={t('cms.files.copyEmbedCode')}
                copiedText={t('copyToClipboard.defaultSuccess')}
                text={`{% file_url ${cmsFile.file.filename} %}`}
                iconSet="bootstrap-icons"
              />
            </div>
            <div className="card-body text-center py-2">
              <a href={cmsFile.file.url}>
                <FilePreview
                  url={cmsFile.file.thumbnailUrl}
                  contentType={cmsFile.file.content_type}
                  filename={cmsFile.file.filename}
                />
              </a>
            </div>
            <div className="card-footer text-end">
              <small>
                {'Size: '}
                {bytes.format(cmsFile.file.byte_size)}
              </small>
            </div>
          </div>
        ))}
      </div>
      {data?.currentAbility.can_create_cms_files && <FileUploadForm onUpload={onUpload} />}
    </>
  );
});
