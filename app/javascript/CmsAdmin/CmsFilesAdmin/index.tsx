import bytes from 'bytes';
import {
  ErrorDisplay,
  useConfirm,
  PageLoadingIndicator,
  CopyToClipboardButton,
} from '@neinteractiveliterature/litform';

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

function CmsFilesAdmin() {
  const { data, loading, error, refetch } = useCmsFilesAdminQuery();
  const deleteFileMutate = useDeleteMutation<
    DeleteCmsFileMutationVariables,
    DeleteCmsFileMutationData
  >(DeleteCmsFile, {
    query: CmsFilesAdminQuery,
    arrayPath: ['cmsFiles'],
    idVariablePath: ['id'],
  });
  const [renameFileMutate] = useRenameCmsFileMutation();
  const confirm = useConfirm();

  usePageTitle('CMS Files');

  const deleteFile = (id: number) => deleteFileMutate({ variables: { id } });
  const renameFile = (id: number, filename: string) =>
    renameFileMutate({
      variables: { id, filename },
    });

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <div className="cms-file-card-deck mb-4">
        {data?.cmsFiles.map((cmsFile) => (
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
                    <i className="fa fa-trash" aria-hidden="true" />
                  </button>
                </div>
              )}
              <small className="text-break fw-bold">
                <InPlaceEditor
                  value={cmsFile.filename}
                  onChange={(filename) => renameFile(cmsFile.id, filename)}
                />
              </small>
              <CopyToClipboardButton
                className="btn btn-sm btn-outline-primary"
                defaultText="Copy CMS embed code"
                text={`{% file_url ${cmsFile.filename} %}`}
              />
            </div>
            <div className="card-body text-center py-2">
              <a href={cmsFile.url}>
                <FilePreview
                  url={cmsFile.url}
                  contentType={cmsFile.content_type}
                  filename={cmsFile.filename}
                />
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
