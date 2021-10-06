import bytes from 'bytes';
import {
  ErrorDisplay,
  useConfirm,
  PageLoadingIndicator,
  CopyToClipboardButton,
} from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';

import { CmsFilesAdminQuery } from './queries';
import { DeleteCmsFile } from './mutations';
import FilePreview from './FilePreview';
import FileUploadForm from './FileUploadForm';
import { useDeleteMutation } from '../../MutationUtils';
import usePageTitle from '../../usePageTitle';
import InPlaceEditor from '../../BuiltInFormControls/InPlaceEditor';
import {
  DeleteCmsFileMutationVariables,
  DeleteCmsFileMutationData,
  useRenameCmsFileMutation,
} from './mutations.generated';
import { useCmsFilesAdminQuery } from './queries.generated';

function CmsFilesAdmin(): JSX.Element {
  const { data, loading, error, refetch } = useCmsFilesAdminQuery();
  const deleteFileMutate = useDeleteMutation<DeleteCmsFileMutationVariables, DeleteCmsFileMutationData>(DeleteCmsFile, {
    query: CmsFilesAdminQuery,
    arrayPath: ['cmsFiles'],
    idVariablePath: ['id'],
  });
  const [renameFileMutate] = useRenameCmsFileMutation();
  const confirm = useConfirm();
  const { t } = useTranslation();

  usePageTitle('CMS Files');

  const deleteFile = (id: string) => deleteFileMutate({ variables: { id } });
  const renameFile = (id: string, filename: string) =>
    renameFileMutate({
      variables: { id, filename },
    });

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

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
                        prompt: `Are you sure you want to delete ${cmsFile.filename}?`,
                        action: () => deleteFile(cmsFile.id),
                        renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                      })
                    }
                  >
                    <i className="bi-trash-fill" aria-hidden="true" />
                  </button>
                </div>
              )}
              <small className="text-break fw-bold">
                <InPlaceEditor value={cmsFile.filename} onChange={(filename) => renameFile(cmsFile.id, filename)} />
              </small>
              <CopyToClipboardButton
                className="btn btn-sm btn-outline-primary"
                defaultText={t('cms.files.copyEmbedCode', 'Copy CMS embed code')}
                copiedText={t('copyToClipboard.defaultSuccess', 'Copied!')}
                text={`{% file_url ${cmsFile.filename} %}`}
                iconSet="bootstrap-icons"
              />
            </div>
            <div className="card-body text-center py-2">
              <a href={cmsFile.url}>
                <FilePreview url={cmsFile.url} contentType={cmsFile.content_type} filename={cmsFile.filename} />
              </a>
            </div>
            <div className="card-footer text-end">
              <small>
                {'Size: '}
                {bytes.format(cmsFile.size)}
              </small>
            </div>
          </div>
        ))}
      </div>

      {data?.currentAbility.can_create_cms_files && <FileUploadForm onUpload={() => refetch()} />}
    </>
  );
}

export default CmsFilesAdmin;
